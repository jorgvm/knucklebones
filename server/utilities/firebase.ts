import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc,
  getDoc,
  increment,
  type FieldValue,
} from "firebase/firestore";
import type { GameData } from "../../utilities/types";

// Firebase setup
const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  firebaseCollectionId,
} = useRuntimeConfig();

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Update existing game in Firebase
 * Update version with every update
 *
 * @param gameId id of existing game
 * @param data (partial) game data
 * @returns Promise with gamedata
 */

type FirestoreCompatible<T> = {
  [K in keyof T]?: T[K] | FieldValue;
};

export const updateGameInDatabase = async (
  gameId: string,
  data: FirestoreCompatible<GameData>,
) =>
  await updateDoc(doc(db, firebaseCollectionId, gameId), {
    ...data,
    version: increment(1),
  });

/**
 * Create new game in Firebase
 *
 * @param data (partial) game data
 * @returns Promise with generated id
 */
export const createGameInDatabase = async (data: Partial<GameData>) => {
  return await addDoc(collection(db, firebaseCollectionId), data).then(
    (docRef) => docRef.id,
  );
};

// Function to get a document once
export const getGameFromDatabase = async (gameId: string) => {
  const docRef = doc(db, firebaseCollectionId, gameId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as GameData;
  } else {
    throw new Error("Game not found");
  }
};
