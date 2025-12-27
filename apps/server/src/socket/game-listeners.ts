// Track listeners to avoid duplicates
export const gameListeners = new Map<string, () => void>();

export function addGameListener(gameId: string, unsubscribe: () => void) {
  gameListeners.set(gameId, unsubscribe);
}

export function hasGameListener(gameId: string): boolean {
  return gameListeners.has(gameId);
}

export function cleanupEmptyRoomListeners(getRoomSize: (gameId: string) => number) {
  gameListeners.forEach((unsubscribe, gameId) => {
    const roomSize = getRoomSize(gameId);

    if (roomSize === 0) {
      unsubscribe();
      gameListeners.delete(gameId);
    }
  });
}

export function cleanupAllListeners() {
  console.log(`Cleaning up ${gameListeners.size} Firestore listeners`);
  gameListeners.forEach((unsubscribe) => {
    unsubscribe();
  });
  gameListeners.clear();
}
