import { GameData, GameId } from "@knucklebones/shared/types.js";
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
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import * as dotenv from "dotenv";
dotenv.config();

// Firebase setup
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_COLLECTION_ID,
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
const firebaseCollectionId = process.env.FIREBASE_COLLECTION_ID as string;

export const updateGameInDatabase = async (
  gameId: string,
  data: FirestoreCompatible<GameData>
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
  data: Partial<GameData>
): Promise<string> => {
  return await addDoc(collection(db, firebaseCollectionId), data).then(
    (docRef) => docRef.id
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
    throw new Error("Game not found in firebase");
  }
};

export const getDocRef = (
  gameId: GameId
): DocumentReference<DocumentData, DocumentData> => {
  return doc(db, firebaseCollectionId, gameId);
};
