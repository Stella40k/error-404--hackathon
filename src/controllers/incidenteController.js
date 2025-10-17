import Incidente from "../models/incidente.model.js";
import AlertaAcoso from "../models/alertaAcoso.model.js";
import User from "../models/user.model.js";

// Matriz de Gravedad Fija - UrbiVox (Simplificada para Mapa)
const MATRIZ_GRAVEDAD = {
  "Robo con Violencia": 5,                    // Máxima Prioridad
  "Situación de Violencia de Género": 5,      // Máxima Prioridad
  "Hurto": 4,                                 // Alta Prioridad
  "Acoso / Hostigamiento": 4,                 // Alta Prioridad
  "Accidente Vial": 4,                        // Alta Prioridad
  "Pelea o Agresión": 3,                      // Moderada
  "Conducción Peligrosa": 3,                  // Moderada
  "Vandalismo y Daño": 2,                     // Baja
  "Vía Pública en Mal Estado": 2,             // Baja
  "Obstrucción / Peligro Vial": 1,            // Mínima
  "Mala Iluminación": 1                       // Mínima
};

// Mapeo de gravedad a prioridad
const GRAVEDAD_A_PRIORIDAD = {
  1: "mínima",
  2: "baja", 
  3: "moderada",
  4: "alta",
  5: "máxima"
};

// Función para obtener gravedad objetiva basada en subcategoría
const obtenerGravedadObjetiva = (subcategoria) => {
  const gravedad = MATRIZ_GRAVEDAD[subcategoria];
  if (!gravedad) {
    throw new Error(`Subcategoría no válida: ${subcategoria}`);
  }
  return gravedad;
};

// Función para obtener prioridad basada en gravedad
const obtenerPrioridad = (gravedad) => {
  return GRAVEDAD_A_PRIORIDAD[gravedad] || "moderada";
};

// Anti-Spam: Simulación de limitación por IP (en producción usar Redis)
const reportesPorIP = new Map();
const LIMITE_REPORTES_POR_HORA = 5;
const VENTANA_TIEMPO = 60 * 60 * 1000; // 1 hora en ms

const verificarAntiSpam = (ip) => {
  const ahora = Date.now();
  const reportes = reportesPorIP.get(ip) || [];
  
  // Filtrar reportes dentro de la ventana de tiempo
  const reportesRecientes = reportes.filter(timestamp => ahora - timestamp < VENTANA_TIEMPO);
  
  if (reportesRecientes.length >= LIMITE_REPORTES_POR_HORA) {
    throw new Error("Límite de reportes excedido. Intente nuevamente en una hora.");
  }
  
  // Agregar el nuevo reporte
  reportesRecientes.push(ahora);
  reportesPorIP.set(ip, reportesRecientes);
};

// Crear nuevo incidente
export const createIncidente = async (req, res) => {
  try {
    const { 
      categoria_principal, 
      subcategoria, 
      descripcion, 
      location,
      anonimo = false
    } = req.body;
    
    // Validaciones básicas
    if (!categoria_principal || !subcategoria || !descripcion || !location) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios: categoria_principal, subcategoria, descripcion, location" 
      });
    }
    
    // Verificar anti-spam
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    verificarAntiSpam(clientIP);
    
    // Obtener gravedad objetiva automáticamente
    const gravedad_objetiva = obtenerGravedadObjetiva(subcategoria);
    const prioridad = obtenerPrioridad(gravedad_objetiva);
    
    // Aceptar tanto GeoJSON { type, coordinates } como { lat, lng }
    let geoLocation;
    if (Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      geoLocation = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
    } else if (
      Object.prototype.hasOwnProperty.call(location, "lat") &&
      Object.prototype.hasOwnProperty.call(location, "lng")
    ) {
      geoLocation = {
        type: "Point",
        coordinates: [Number(location.lng), Number(location.lat)],
      };
    } else {
      return res.status(400).json({
        message: "Formato de location inválido. Use { lat, lng } o GeoJSON { type, coordinates }",
      });
    }
    
    // Crear el incidente
    const nuevoIncidente = new Incidente({
      categoria_principal,
      subcategoria,
      descripcion,
      location: geoLocation,
      gravedad_objetiva,
      prioridad,
      anonimo,
      usuario: anonimo ? null : req.user?.id, // Solo si no es anónimo y hay usuario autenticado
    });
    
    await nuevoIncidente.save();
    
    // Poblar datos del usuario si no es anónimo
    if (!anonimo && nuevoIncidente.usuario) {
      await nuevoIncidente.populate('usuario', 'person.name person.lastname username');
    }
    
    res.status(201).json({
      message: "Incidente reportado exitosamente",
      incidente: nuevoIncidente
    });
  } catch (error) {
    if (error.message.includes("Límite de reportes excedido")) {
      return res.status(429).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Error al crear incidente", 
      error: error.message 
    });
  }
};

// Obtener todos los incidentes con filtros
export const getAllIncidentes = async (req, res) => {
  try {
    const { 
      // Filtros básicos
      categoria_principal, 
      subcategoria,
      gravedad_min,
      gravedad_max,
      estado,
      prioridad,
      anonimo,
      // Filtros de fecha
      fechaDesde,
      fechaHasta,
      // Filtros de ubicación
      lat,
      lng,
      radio, // en kilómetros
      // Paginación y ordenamiento
      limit,
      page,
      sortBy,
      sortOrder,
      // Usuario
      usuario
    } = req.query;

    // Construir filtros
    const filter = {};
    
    // Filtros básicos
    if (categoria_principal) filter.categoria_principal = categoria_principal;
    if (subcategoria) filter.subcategoria = subcategoria;
    if (estado) filter.estado = estado;
    if (prioridad) filter.prioridad = prioridad;
    if (usuario) filter.usuario = usuario;
    if (anonimo !== undefined) filter.anonimo = anonimo === 'true';
    
    // Filtros de gravedad
    if (gravedad_min || gravedad_max) {
      filter.gravedad_objetiva = {};
      if (gravedad_min) filter.gravedad_objetiva.$gte = Number(gravedad_min);
      if (gravedad_max) filter.gravedad_objetiva.$lte = Number(gravedad_max);
    }
    
    // Filtros de fecha
    if (fechaDesde || fechaHasta) {
      filter.fechaReporte = {};
      if (fechaDesde) filter.fechaReporte.$gte = new Date(fechaDesde);
      if (fechaHasta) filter.fechaReporte.$lte = new Date(fechaHasta);
    }
    
    // Filtros de ubicación (búsqueda por proximidad)
    let locationFilter = {};
    if (lat && lng && radio) {
      locationFilter = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)]
            },
            $maxDistance: Number(radio) * 1000 // convertir km a metros
          }
        }
      };
    }
    
    // Combinar filtros
    const finalFilter = { ...filter, ...locationFilter };
    
    // Configurar consulta
    let query = Incidente.find(finalFilter);
    
    // Poblar usuario solo si no es anónimo
    query = query.populate({
      path: 'usuario',
      select: 'person.name person.lastname username',
      match: { usuario: { $ne: null } }
    });
    
    // Ordenamiento
    const sortField = sortBy || 'fechaReporte';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    query = query.sort({ [sortField]: sortDirection });
    
    // Paginación
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    const skip = (pageNumber - 1) * limitNumber;
    
    query = query.skip(skip).limit(limitNumber);
    
    // Ejecutar consulta
    const incidentes = await query.exec();
    
    // Contar total para paginación
    const total = await Incidente.countDocuments(finalFilter);
    
    res.json({
      incidentes,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener incidentes", 
      error: error.message 
    });
  }
};

// Obtener un incidente por ID
export const getIncidenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const incidente = await Incidente.findById(id)
      .populate({
        path: 'usuario',
        select: 'person.name person.lastname username',
        match: { usuario: { $ne: null } }
      });
    
    if (!incidente) {
      return res.status(404).json({ message: "Incidente no encontrado" });
    }
    
    res.json(incidente);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener incidente", 
      error: error.message 
    });
  }
};

// Actualizar estado de incidente (solo para administradores o el usuario que lo creó)
export const updateIncidente = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, descripcion } = req.body;
    
    const incidente = await Incidente.findById(id);
    if (!incidente) {
      return res.status(404).json({ message: "Incidente no encontrado" });
    }
    
    // Verificar permisos (solo el usuario que lo creó o admin)
    if (incidente.usuario && incidente.usuario.toString() !== req.user?.id) {
      return res.status(403).json({ 
        message: "No tienes permisos para actualizar este incidente" 
      });
    }
    
    const incidenteActualizado = await Incidente.findByIdAndUpdate(
      id,
      {
        ...(estado && { estado }),
        ...(descripcion && { descripcion }),
      },
      { new: true, runValidators: true }
    ).populate({
      path: 'usuario',
      select: 'person.name person.lastname username',
      match: { usuario: { $ne: null } }
    });
    
    res.json(incidenteActualizado);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar incidente", 
      error: error.message 
    });
  }
};

// Obtener estadísticas de incidentes
export const getIncidenteStats = async (req, res) => {
  try {
    const stats = await Incidente.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          porCategoria: {
            $push: "$categoria_principal"
          },
          porGravedad: {
            $push: "$gravedad_objetiva"
          },
          porEstado: {
            $push: "$estado"
          },
          promedioGravedad: { $avg: "$gravedad_objetiva" }
        }
      },
      {
        $project: {
          total: 1,
          promedioGravedad: { $round: ["$promedioGravedad", 2] },
          categorias: {
            "Delito / Robo": {
              $size: {
                $filter: {
                  input: "$porCategoria",
                  cond: { $eq: ["$$this", "Delito / Robo"] }
                }
              }
            },
            "Violencia / Acoso": {
              $size: {
                $filter: {
                  input: "$porCategoria",
                  cond: { $eq: ["$$this", "Violencia / Acoso"] }
                }
              }
            },
            "Tránsito / Vía Pública": {
              $size: {
                $filter: {
                  input: "$porCategoria",
                  cond: { $eq: ["$$this", "Tránsito / Vía Pública"] }
                }
              }
            },
            "Infraestructura de Riesgo": {
              $size: {
                $filter: {
                  input: "$porCategoria",
                  cond: { $eq: ["$$this", "Infraestructura de Riesgo"] }
                }
              }
            }
          },
          gravedades: {
            "1": {
              $size: {
                $filter: {
                  input: "$porGravedad",
                  cond: { $eq: ["$$this", 1] }
                }
              }
            },
            "2": {
              $size: {
                $filter: {
                  input: "$porGravedad",
                  cond: { $eq: ["$$this", 2] }
                }
              }
            },
            "3": {
              $size: {
                $filter: {
                  input: "$porGravedad",
                  cond: { $eq: ["$$this", 3] }
                }
              }
            },
            "4": {
              $size: {
                $filter: {
                  input: "$porGravedad",
                  cond: { $eq: ["$$this", 4] }
                }
              }
            },
            "5": {
              $size: {
                $filter: {
                  input: "$porGravedad",
                  cond: { $eq: ["$$this", 5] }
                }
              }
            }
          },
          estados: {
            pendiente: {
              $size: {
                $filter: {
                  input: "$porEstado",
                  cond: { $eq: ["$$this", "pendiente"] }
                }
              }
            },
            en_proceso: {
              $size: {
                $filter: {
                  input: "$porEstado",
                  cond: { $eq: ["$$this", "en_proceso"] }
                }
              }
            },
            resuelto: {
              $size: {
                $filter: {
                  input: "$porEstado",
                  cond: { $eq: ["$$this", "resuelto"] }
                }
              }
            },
            cancelado: {
              $size: {
                $filter: {
                  input: "$porEstado",
                  cond: { $eq: ["$$this", "cancelado"] }
                }
              }
            }
          }
        }
      }
    ]);
    
    res.json(stats[0] || {
      total: 0,
      promedioGravedad: 0,
      categorias: { "Delito / Robo": 0, "Violencia / Acoso": 0, "Tránsito / Vía Pública": 0, "Infraestructura de Riesgo": 0 },
      gravedades: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      estados: { pendiente: 0, en_proceso: 0, resuelto: 0, cancelado: 0 }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener estadísticas", 
      error: error.message 
    });
  }
};

// Obtener matriz de gravedad (para frontend)
export const getMatrizGravedad = async (req, res) => {
  try {
    res.json({
      matriz: MATRIZ_GRAVEDAD,
      mapeo_prioridad: GRAVEDAD_A_PRIORIDAD
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener matriz de gravedad", 
      error: error.message 
    });
  }
};

// Alerta Rápida de Acoso
export const createAlertaAcoso = async (req, res) => {
  try {
    const { location } = req.body;
    
    // Validaciones básicas
    if (!location) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios: location" 
      });
    }
    
    // Verificar anti-spam para alertas
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    verificarAntiSpam(clientIP);
    
    // Aceptar tanto GeoJSON { type, coordinates } como { lat, lng }
    let geoLocation;
    if (Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      geoLocation = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
    } else if (
      Object.prototype.hasOwnProperty.call(location, "lat") &&
      Object.prototype.hasOwnProperty.call(location, "lng")
    ) {
      geoLocation = {
        type: "Point",
        coordinates: [Number(location.lng), Number(location.lat)],
      };
    } else {
      return res.status(400).json({
        message: "Formato de location inválido. Use { lat, lng } o GeoJSON { type, coordinates }",
      });
    }
    
    // Crear la alerta
    const nuevaAlerta = new AlertaAcoso({
      location: geoLocation,
      tipo: "acoso"
    });
    
    await nuevaAlerta.save();
    
    res.status(201).json({
      message: "Alerta de acoso registrada exitosamente",
      alerta: nuevaAlerta
    });
  } catch (error) {
    if (error.message.includes("Límite de reportes excedido")) {
      return res.status(429).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Error al crear alerta de acoso", 
      error: error.message 
    });
  }
};

// Obtener alertas de acoso
export const getAlertasAcoso = async (req, res) => {
  try {
    const { 
      lat,
      lng,
      radio, // en kilómetros
      limit,
      activa = true
    } = req.query;

    // Construir filtros
    const filter = { activa: activa === 'true' };
    
    // Filtros de ubicación (búsqueda por proximidad)
    let locationFilter = {};
    if (lat && lng && radio) {
      locationFilter = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)]
            },
            $maxDistance: Number(radio) * 1000 // convertir km a metros
          }
        }
      };
    }
    
    // Combinar filtros
    const finalFilter = { ...filter, ...locationFilter };
    
    // Configurar consulta
    let query = AlertaAcoso.find(finalFilter).sort({ fechaAlerta: -1 });
    
    // Límite de resultados
    if (limit) {
      query = query.limit(Number(limit));
    }
    
    // Ejecutar consulta
    const alertas = await query.exec();
    
    res.json({
      alertas,
      total: alertas.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener alertas de acoso", 
      error: error.message 
    });
  }
};
