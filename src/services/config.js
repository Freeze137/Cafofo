import { hasFirebaseConfig } from '../firebase/firebase'

// ─────────────────────────────────────────────────────────────────────────
// Estratégia de persistência
//
// O sistema possui DUAS implementações de backend, intercambiáveis:
//   • 'local'    → localStorage (padrão, roda sem nenhuma configuração)
//   • 'firebase' → Firestore (ativa automaticamente se houver .env válido)
//
// A camada de serviços (src/services/*) consome esta flag para decidir
// qual driver usar, mantendo os componentes 100% agnósticos ao backend.
// ─────────────────────────────────────────────────────────────────────────
export const USE_FIREBASE = hasFirebaseConfig

// Prefixo das chaves no localStorage.
export const STORAGE_PREFIX = 'cafofopeludos'
