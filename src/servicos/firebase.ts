import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { 
  getFirestore, 
  Firestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { FIREBASE_CONFIG, validarConfigFirebase } from "./config";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

const isConfigValida = validarConfigFirebase(FIREBASE_CONFIG);

if (isConfigValida) {
  // Singleton Pattern: Evita múltiplas inicializações
  const apps = getApps();
  
  if (apps.length === 0) {
    app = initializeApp(FIREBASE_CONFIG);
    // Inicialização moderna do Firestore (v12+)
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
    console.log('[Firestore] Inicializado com cache persistente');
  } else {
    app = getApp();
    db = getFirestore(app);
  }

  auth = getAuth(app);

  // Inicialização segura do Analytics (apenas Client Side)
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('[Analytics] Inicializado');
      }
    });
  }
}

export { auth, db, app, analytics };
