import "dotenv/config";
import { generarDiagnostico } from "../lib/diagnostico-engine";
import type { IntakeData } from "../types/diagnostico";

// Caso A: Evidencia RICA
const casoA: IntakeData = {
  perfil: "negocio",
  sector: "manufactura",
  alcance: "planta de producción norte, 120 operarios",
  dolor_declarado: [
    "Los tiempos de ciclo en la línea de ensamble han aumentado 35% en 6 meses, generando cuellos de botella que retrasan entregas al cliente.",
  ],
  to_be_objetivo:
    "Reducir el tiempo de ciclo al nivel histórico de 2023, eliminar cuellos de botella en estaciones 3 y 7, y recuperar el OTD al 95%.",
  to_be_nivel: 3,
  tecnologia_visible: ["SAP PP", "sensores IoT en línea piloto", "Excel para trazabilidad manual"],
  metrica_declarada: "OTD actual 72%, objetivo 95%; tiempo de ciclo actual 18 min, objetivo 13 min",
  respuestas_capacidad: {
    painDetail:
      "El problema empezó tras el cambio de proveedor de componentes en enero. Los lotes defectuosos obligan a reprocesar en la estación 3, lo que bloquea toda la línea aguas abajo.",
    capacityQ1: "Tenemos datos de producción en SAP y reportes diarios de calidad en Excel.",
    capacityQ2: "El equipo de mejora tiene disponibilidad 2 días por semana; contamos con un black belt interno.",
    capacityQ3: "Presupuesto aprobado de $80,000 USD para este proyecto en Q3.",
  },
};

// Caso B: Evidencia POBRE
const casoB: IntakeData = {
  perfil: "emprendedor",
  sector: "servicios",
  alcance: "toda la empresa",
  dolor_declarado: ["No crecemos."],
  to_be_objetivo: "Crecer más.",
  to_be_nivel: null,
  tecnologia_visible: null,
  metrica_declarada: null,
  respuestas_capacidad: {
    painDetail: null,
    capacityQ1: null,
    capacityQ2: null,
    capacityQ3: null,
  },
};

// Caso C: Evidencia INTERMEDIA
const casoC: IntakeData = {
  perfil: "lider_area",
  sector: "retail",
  alcance: "área de logística y distribución, 3 centros de distribución",
  dolor_declarado: [
    "Los pedidos llegan tarde a las tiendas y tenemos exceso de inventario en algunos SKUs mientras hay quiebre en otros.",
  ],
  to_be_objetivo: "Mejorar la disponibilidad de producto en tienda al 98% y reducir el inventario total en 20%.",
  to_be_nivel: 2,
  tecnologia_visible: ["WMS propio", "algo de Excel"],
  metrica_declarada: null,
  respuestas_capacidad: {
    painDetail: "El problema es más serio en temporada alta; en diciembre colapsamos.",
    capacityQ1: null,
    capacityQ2: "Tenemos un equipo de 4 personas que puede dedicar tiempo parcial.",
    capacityQ3: null,
  },
};

async function run() {
  const casos = [
    { nombre: "CASO A — Evidencia RICA", data: casoA },
    { nombre: "CASO B — Evidencia POBRE", data: casoB },
    { nombre: "CASO C — Evidencia INTERMEDIA", data: casoC },
  ];

  for (const { nombre, data } of casos) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`${nombre}`);
    console.log("=".repeat(60));
    try {
      const result = await generarDiagnostico(data);
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(`ERROR en ${nombre}:`, err);
    }
  }
}

run();
