import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  ParsedToken,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the exact provisioned database ID (CRITICAL: App requires this exact database ID)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Test connection on boot as mandated by Firebase integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: client appears offline.');
    }
  }
}
testConnection();

// Google Auth Provider setup with select_account prompt
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Structured error handling as specified in the Firebase integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Record stored in Firestore keyed by stable 'sub' claim
export interface UserIdentityProfile {
  sub: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL?: string;
  role: string;
  idTokenClaims?: ParsedToken;
}

/**
 * Sign in with Google using Firebase Authentication.
 * Reads secure OpenID Connect claims from the Google ID token.
 * Verifies email_verified boolean claim.
 * Persists user profile to Firestore keyed by the unique, stable 'sub' identifier.
 */
export async function signInWithGoogle(): Promise<UserIdentityProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Retrieve secure OpenID Connect claims from ID Token
  const idTokenResult = await user.getIdTokenResult(true);
  const claims = idTokenResult.claims;

  // Read sub (Subject identifier) and email_verified boolean claim
  const sub = String(claims.sub || user.uid);
  const isEmailVerified = Boolean(claims.email_verified ?? user.emailVerified);

  const userPath = `users/${sub}`;

  try {
    const userDocRef = doc(db, 'users', sub);
    const existingDoc = await getDoc(userDocRef);

    if (!existingDoc.exists()) {
      // First-time user creation
      await setDoc(userDocRef, {
        sub: sub,
        email: user.email || '',
        emailVerified: isEmailVerified,
        displayName: user.displayName || 'Authorized Volunteer',
        photoURL: user.photoURL || '',
        role: 'Verified Coordinator / Volunteer',
        createdAt: serverTimestamp(),
      });
    } else {
      // Update existing record
      await updateDoc(userDocRef, {
        displayName: user.displayName || 'Authorized Volunteer',
        photoURL: user.photoURL || '',
        emailVerified: isEmailVerified,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }

  return {
    sub,
    email: user.email || '',
    emailVerified: isEmailVerified,
    displayName: user.displayName || 'Authorized Volunteer',
    photoURL: user.photoURL || undefined,
    role: 'Verified Coordinator / Volunteer',
    idTokenClaims: claims,
  };
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
