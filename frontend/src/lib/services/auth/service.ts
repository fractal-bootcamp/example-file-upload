import axios from "axios";
import { UserInputDto } from "./types";
import { auth } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

const baseUrl: string = "/api/auth";

const signup = async (credentials: UserInputDto) => {
  try {
    // try to create a firebase user
    const firebaseUser = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    if (!firebaseUser) {
      throw new Error("Failed to create firebase user");
    }

    // get authToken
    const authToken = await firebaseUser.user.getIdToken();

    // if firebaseuser, post to backend with authtoken to add user to db
    const res = await axios.post(
      `${baseUrl}/signup`,
      { email: firebaseUser.user.email, firebaseId: firebaseUser.user.uid },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    console.log("hello signup res", res);

    // return the newly created user from db
    return res.data;
  } catch (e) {
    alert("Signup failed, reload and try again");
    console.error(e);
  }
};

const login = async (credentials: UserInputDto) => {
  try {
    // try to log in the user
    const firebaseUser = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    if (!firebaseUser) {
      throw new Error("User doesn't exist in firebase");
    }

    // get authToken
    const authToken = await firebaseUser.user.getIdToken();

    // if firebaseUser, post to backend to get db user
    const res = await axios.post(
      `${baseUrl}/login`,
      { email: firebaseUser.user.email, firebaseId: firebaseUser.user.uid },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    console.log("hello login res", res);

    // return found db user
    return res.data;
  } catch (e) {
    alert("Login failed, reload and try again");
    console.error(e);
  }
};

const hydrate = async (currentUser: User) => {
  console.log(auth.currentUser);
  const authToken = await currentUser.getIdToken();
  if (!authToken) {
    return console.log("no current user");
  }

  const res = await axios.get(`${baseUrl}/hydrate`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  return res.data;
};

const logout = async () => {
  await signOut(auth);
};

export default { login, logout, signup, hydrate };
