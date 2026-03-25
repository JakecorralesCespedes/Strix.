import { writable } from "svelte/store";
import { authenticateUser, logoutUser } from "../lib/services/auth.service";
import {
  type UserCredential,
  type User as FirebaseUser,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getAuthInstance } from "../lib/services";
import type { User } from "../lib/types";

export type UserStoreState = {
  firebaseUser?: FirebaseUser | null;
  dbUser?: User | null;
};

const initialUser: UserStoreState = { firebaseUser: null, dbUser: null };
const userStore = writable<UserStoreState>(initialUser);
const authReady = writable<boolean>(false);

onAuthStateChanged(getAuthInstance(), async (firebaseUser) => {
  userStore.update((current) => ({ ...current, firebaseUser }));
  setPersistence(getAuthInstance(), browserSessionPersistence);

  if (firebaseUser) {
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem("token", idToken);
    localStorage.setItem("uuid", firebaseUser.uid);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("uuid");
  }

  authReady.set(true);
});

async function authenticate(email: string, password: string): Promise<boolean> {
  try {
    const userCredential: UserCredential | null = await authenticateUser(
      email,
      password,
    );
    if (!userCredential) {
      return false;
    }

    userStore.update((current) => ({
      ...current,
      firebaseUser: userCredential.user,
    }));

    return true;
  } catch (error) {
    return false;
  }
}

async function logOut() {
  userStore.set(initialUser);
  await logoutUser();
}

export { userStore, authReady, authenticate, logOut };
