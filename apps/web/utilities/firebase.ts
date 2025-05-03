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
import type { GameData } from "@shared/types";

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

// Create firebase app
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Firestore compatible typing
type FirestoreCompatible<T> = {
  [K in keyof T]?: T[K] | FieldValue;
};

/**
 * Update existing game in Firebase
 *
 * Version is updated with every update
 */
export const updateGameInDatabase = async (
  gameId: string,
  data: FirestoreCompatible<GameData>,
): Promise<void> =>
  await updateDoc(doc(db, firebaseCollectionId, gameId), {
    ...data,
    version: increment(1),
  });

/**
 * Create new game in Firebase
 *
 * @returns Promise with game id
 */
export const createGameInDatabase = async (
  data: Partial<GameData>,
): Promise<string> => {
  return await addDoc(collection(db, firebaseCollectionId), data).then(
    (docRef) => docRef.id,
  );
};

/**
 * Retrieve GameData
 */
export const getGameFromDatabase = async (gameId: string) => {
  const docRef = doc(db, firebaseCollectionId, gameId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as GameData;
  } else {
    throw new Error("Game not found");
  }
};
