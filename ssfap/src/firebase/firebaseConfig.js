/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * Service: Firebase Configuration
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 * 
 * PURPOSE:
 * Initializes Firebase connection using credentials from .env.local.
 * Exports Firebase app instance, Firestore database, and Auth service
 * for use throughout the application.
 * 
 * SECURITY NOTE:
 * Credentials are loaded from environment variables (VITE_FIREBASE_*) which
 * are stored in .env.local (gitignored). Never hardcode credentials here.
 * 
 * BUSINESS CONTEXT:
 * This is the single source of Firebase connection. All other services
 * import from here to ensure consistent configuration.
 * 
 * ============================================================================
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ============================================================================
// FIREBASE CONFIGURATION (from environment variables)
// ============================================================================

/**
 * Firebase configuration object.
 * 
 * WHY ENVIRONMENT VARIABLES:
 * - Keeps credentials out of source code
 * - Different configs for dev/staging/production
 * - .env.local is gitignored (never committed)
 * 
 * VITE NAMING CONVENTION:
 * - Must start with VITE_ to be accessible in browser
 * - import.meta.env is Vite's way to access env vars
 * - process.env doesn't work in Vite (that's Node.js)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ============================================================================
// VALIDATE CONFIGURATION
// ============================================================================

/**
 * Ensure all required Firebase credentials are present.
 * 
 * WHY THIS CHECK:
 * If .env.local is missing or incomplete, Firebase will fail with cryptic
 * errors. This gives a clear error message immediately.
 * 
 * WHEN THIS FAILS:
 * - .env.local doesn't exist
 * - .env.local has typos in variable names
 * - Running `npm run dev` without restarting after adding .env.local
 */
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingVars.join(', ')}\n\n` +
    'Make sure .env.local exists in the ssfap/ directory and contains all VITE_FIREBASE_* variables.\n' +
    'If you just created .env.local, restart the dev server (npm run dev).'
  );
}

// ============================================================================
// INITIALIZE FIREBASE
// ============================================================================

/**
 * Initialize Firebase app with configuration.
 * 
 * This creates the connection to Firebase services. Only initialize once
 * (hence why this is in a separate file that gets imported everywhere).
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication service.
 * 
 * Used for:
 * - User login/logout
 * - Getting current user ID
 * - Managing auth state
 */
export const auth = getAuth(app);

/**
 * Firestore Database service.
 * 
 * Used for:
 * - Reading/writing financial data
 * - Queries (get all bookings, filter by month, etc.)
 * - Real-time listeners (dashboard updates automatically)
 */
export const db = getFirestore(app);

/**
 * Firebase app instance.
 * 
 * Rarely needed directly, but exported in case other Firebase services
 * need to be initialized (Storage, Analytics, etc.)
 */
export default app;

/**
 * ============================================================================
 * USAGE EXAMPLES (for other files)
 * ============================================================================
 * 
 * // Import in other services:
 * import { db, auth } from './services/firebase/firebaseConfig';
 * 
 * // Use Firestore:
 * import { collection, getDocs } from 'firebase/firestore';
 * const bookingsRef = collection(db, 'users', userId, 'bookings');
 * const snapshot = await getDocs(bookingsRef);
 * 
 * // Use Auth:
 * const currentUser = auth.currentUser;
 * if (currentUser) {
 *   console.log('User ID:', currentUser.uid);
 * }
 * 
 * ============================================================================
 */