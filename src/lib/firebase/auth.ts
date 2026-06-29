import { auth } from "@/src/lib/firebase/config";
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from "firebase/auth";

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export async function signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function logOut() {
    return signOut(auth);
}

export async function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
}
