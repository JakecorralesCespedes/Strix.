import {
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
} from "firebase/auth";
import { getAuthInstance } from "./firebase.service";

export async function authenticateUser(
  email: string,
  password: string,
): Promise<UserCredential | null> {
  const auth = getAuthInstance();

  return signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem("uuid", userCredential.user.uid);
      localStorage.setItem("token", idToken);
      return userCredential;
    })
    .catch((error) => {
      return null;
    });
}

export async function logoutUser(): Promise<void> {
  const auth = getAuthInstance();
  localStorage.removeItem("token");
  localStorage.removeItem("uuid");
  localStorage.removeItem("refresh");

  return auth.signOut();
}
