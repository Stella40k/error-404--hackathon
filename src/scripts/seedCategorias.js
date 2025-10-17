import mongoose from "mongoose";
import Categoria from "../models/categoria.model.js";
import { connectDB } from "../config/database.js";

const categoriasEjemplo = [
  {
    nombre: "Infraestructura Vial",
    descripcion: "Problemas relacionados con calles, avenidas y caminos",
    icono: "🛣️",
    color: "#FF6B6B"
  },
  {
    nombre: "Iluminación Pública",
    descripcion: "Problemas con alumbrado público y farolas",
    icono: "💡",
    color: "#FFD93D"
  },
  {
    nombre: "Tránsito",
    descripcion: "Problemas de tráfico, semáforos y señalización vial",
    icono: "🚦",
    color: "#4ECDC4"
  },
  {
    nombre: "Alcantarillado",
    descripcion: "Problemas con alcantarillas, desagües y drenaje",
    icono: "🚰",
    color: "#6BCF7F"
  }
];

const seedCategorias = async () => {
  try {
    await connectDB();
    
    // Limpiar categorías existentes
    await Categoria.deleteMany({});
    console.log("✅ Categorías existentes eliminadas");
    
    // Insertar categorías de ejemplo
    const categoriasCreadas = await Categoria.insertMany(categoriasEjemplo);
    console.log(`✅ ${categoriasCreadas.length} categorías creadas exitosamente`);
    
    // Mostrar las categorías creadas
    categoriasCreadas.forEach(cat => {
      console.log(`- ${cat.icono} ${cat.nombre} (${cat.color})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar categorías:", error);
    process.exit(1);
  }
};

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategorias();
}

export default seedCategorias;
