export type ProfileType = "business" | "leader" | "entrepreneur";

export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export interface IntakeFormData {
  // Paso 1
  profile: ProfileType | null;

  // Paso 2
  sector: string;
  scope: string;
  email: string;
  painType: string;
  painDetail: string;

  // Paso 3
  files: UploadedFile[];

  // Paso 4
  toBe: string;
  maturityTarget: MaturityLevel | null;

  // Paso 5 (opcional)
  technology: string;
  metric: string;
  capacityQ1: string;
  capacityQ2: string;
  capacityQ3: string;
}

export type UpdateFn = <K extends keyof IntakeFormData>(
  field: K,
  value: IntakeFormData[K]
) => void;

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;
export type StepDirection = "forward" | "backward";
