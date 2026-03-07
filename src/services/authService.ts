import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth, firebaseConfigError } from "./firebaseConfig";

const requireAuth = () => {
  if (!auth) {
    throw new Error(firebaseConfigError || "Firebase Auth is not configured.");
  }
  return auth;
};

export const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(requireAuth(), email, password);
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(requireAuth(), email, password);
};

export const logout = () => {
  return signOut(requireAuth());
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(requireAuth(), callback);
};
