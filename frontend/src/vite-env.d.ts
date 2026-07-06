/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAB_PLATFORM_API_BASE_URL?: string;
  readonly VITE_LAB_PLATFORM_PATIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
