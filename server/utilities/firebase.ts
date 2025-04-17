import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc,
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
 *
 * @param gameId id of existing game
 * @param data (partial) game data
 * @returns Promise with gamedata
 */
export const updateGameInDatabase = async (
  gameId: string,
  data: Partial<GameData>,
) => await updateDoc(doc(db, firebaseCollectionId, gameId), data);

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
