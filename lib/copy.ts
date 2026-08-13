import type { ProfileType } from "@/types/intake";

export const SECTORS = [
  "Manufactura e industria",
  "Comercio y retail",
  "Servicios profesionales",
  "Salud y ciencias de la vida",
  "Educación",
  "Construcción e inmobiliaria",
  "Logística y transporte",
  "Tecnología y software",
  "Agropecuario",
  "Financiero y seguros",
  "Ong's y fundaciones",
  "Otro",
] as const;

export const PAIN_OPTIONS = [
  { value: "no_data", label: "Tomamos decisiones a ojo, sin datos" },
  { value: "data_unused", label: "Tenemos datos pero no los usamos bien" },
  { value: "disconnected", label: "Nuestros sistemas no se hablan entre sí" },
  { value: "no_process", label: "No tenemos procesos claros documentados" },
  { value: "no_ai_start", label: "No sé por dónde empezar con la IA" },
  { value: "Failure_IA_implementation", label: "Invertimos o implementamos proyectos de despliegue IA, sin obtener resultados" },
  {
    value: "manual_work",
    label: "Perdemos tiempo en tareas repetitivas que podrían automatizarse",
  },
] as const;

export const TECH_OPTIONS = [
  "Excel / Google Sheets",
  "ERP (SAP, Siesa, World Office u otro)",
  "CRM (HubSpot, Salesforce u otro)",
  "Power BI, Tableau u otra herramienta de BI",
  "Herramientas de IA (ChatGPT, Copilot u otra)",
  "Sin herramientas formales",
  "No tenemos claridad de qué usamos",
] as const;

export const MATURITY_LEVELS = [
  {
    level: 1 as const,
    name: "Descriptivo",
    question: "¿Qué pasó?",
    description: "Datos históricos básicos",
  },
  {
    level: 2 as const,
    name: "Diagnóstico",
    question: "¿Por qué pasó?",
    description: "Análisis de causas",
  },
  {
    level: 3 as const,
    name: "Predictivo",
    question: "¿Qué va a pasar?",
    description: "Modelos de proyección",
  },
  {
    level: 4 as const,
    name: "Prescriptivo",
    question: "¿Qué debo hacer?",
    description: "Recomendaciones automatizadas",
  },
  {
    level: 5 as const,
    name: "Cognitivo",
    question: "¿Cómo aprendo solo?",
    description: "Sistemas que aprenden y actúan",
  },
] as const;

export const PROFILE_LABELS: Record<ProfileType, string> = {
  business: "Tengo un negocio o empresa",
  leader: "Soy líder de un área o proceso dentro de una empresa",
  entrepreneur: "Estoy emprendiendo o quiero evaluar algo personal",
};

type ProfileCopy = {
  step2Title: string;
  scopeLabel: string;
  scopePlaceholder: string;
  painLabel: string;
};

export const PROFILE_COPY: Record<ProfileType, ProfileCopy> = {
  business: {
    step2Title: "Cuéntanos sobre tu negocio",
    scopeLabel: "¿Qué parte del negocio vamos a diagnosticar?",
    scopePlaceholder:
      "Ej: el proceso de ventas, la operación logística, el área de servicio al cliente…",
    painLabel: "¿Cuál es el dolor principal del negocio hoy?",
  },
  leader: {
    step2Title: "Cuéntanos sobre tu área",
    scopeLabel: "¿Qué proceso o área vas a diagnosticar?",
    scopePlaceholder:
      "Ej: el flujo de aprobación de pedidos, el proceso de incorporación de empleados…",
    painLabel: "¿Cuál es el mayor problema que enfrenta tu área hoy?",
  },
  entrepreneur: {
    step2Title: "Cuéntanos qué quieres evaluar",
    scopeLabel: "¿Qué idea, proceso o situación quieres evaluar?",
    scopePlaceholder:
      "Ej: un modelo de negocio, un proceso que quiero optimizar, una decisión que necesito fundamentar…",
    painLabel: "¿Qué es lo que más te preocupa o no te deja avanzar hoy?",
  },
};
