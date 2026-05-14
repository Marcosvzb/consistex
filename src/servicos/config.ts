export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

export type FirebaseEnvConfig = typeof FIREBASE_CONFIG;

export function validarConfigFirebase(config: FirebaseEnvConfig) {
  const chavesObrigatorias = Object.keys(config) as Array<keyof FirebaseEnvConfig>;
  const chavesFaltantes = chavesObrigatorias.filter((chave) => !config[chave]);

  if (chavesFaltantes.length > 0) {
    const erro = `Configuração do Firebase incompleta. Variáveis ausentes: ${chavesFaltantes.join(', ')}`;
    
    // Em produção, não queremos crashar o servidor Next.js durante o build se possível,
    // mas precisamos avisar claramente.
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ [Firebase Validation Error]:', erro);
    } else {
      throw new Error(erro);
    }
    return false;
  }

  // Validação básica de formato para API Key
  if (config.apiKey && !config.apiKey.startsWith('AIza')) {
    console.warn('⚠️ [Firebase Validation Warning]: A API Key fornecida não parece ser uma chave válida do Google/Firebase.');
  }

  return true;
}
