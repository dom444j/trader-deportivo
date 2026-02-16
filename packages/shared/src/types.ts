// Tipos compartidos entre aplicaciones
export interface SharedConfig {
  appName: string;
  version: string;
}

export type Environment = 'development' | 'staging' | 'production';