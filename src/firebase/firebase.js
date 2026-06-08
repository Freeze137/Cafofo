// ─────────────────────────────────────────────────────────────────────────
// Configuração do Firebase (Passo 2 da entrega)
//
// Este arquivo centraliza a inicialização do Firebase (Authentication,
// Firestore e Storage). As credenciais são lidas de variáveis de ambiente
// (Vite → import.meta.env) para nunca ficarem hardcoded no código.
//
// ⚠️ IMPORTANTE: O app está configurado para FUNCIONAR SEM Firebase por
// padrão (usando um backend local em localStorage — ver src/services/).
// Assim ele roda imediatamente após `npm install && npm run dev`, sem
// exigir nenhuma credencial. Para ativar o backend real do Firebase:
//   1. Crie um projeto em https://console.firebase.google.com
//   2. Copie .env.example para .env e preencha as chaves VITE_FIREBASE_*
//   3. Troque a flag USE_FIREBASE em src/services/config.js para true
// ─────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Credenciais do projeto (preencha em .env a partir de .env.example).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Indica se há credenciais válidas configuradas.
export const hasFirebaseConfig = Boolean(firebaseConfig.apiKey)

// Inicializa o Firebase apenas se houver configuração — evita quebrar o app
// quando rodando no modo local (sem credenciais).
let app = null
let auth = null
let db = null
let storage = null
let googleProvider = null

if (hasFirebaseConfig) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  googleProvider = new GoogleAuthProvider()
}

export { app, auth, db, storage, googleProvider }
