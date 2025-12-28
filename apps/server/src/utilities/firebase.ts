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
import { config } from "~/config/config.js";

// Firebase setup
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
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
const firebaseCollectionId = config.firebase.collectionId as string;

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
  const docRef = getDocRef(gameId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as GameData;
  } else {
    return gameNotFound;
  }
};

/**
 * Retrieves a Firestore document reference for a specific game.
 */
export const getDocRef = (
  gameId: GameId
): DocumentReference<DocumentData, DocumentData> => {
  return doc(db, firebaseCollectionId, gameId);
};

const gameNotFound: GameData = {
  active_player: "",
  created: "",
  latest_actions: [],
  new_die: 1,
  players: [],
  rematch_id: null,
  secrets: [],
  status: "not-found",
  type: "multiplayer",
  version: 1,
  winner: [],
};
