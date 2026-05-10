const gameListeners = new Map<string, () => void>();

export function getListenerCount(): number {
  return gameListeners.size;
}

export function hasGameListener(gameId: string): boolean {
  return gameListeners.has(gameId);
}

export function cleanupEmptyRoomListeners(
  getRoomSize: (gameId: string) => number,
): void {
  gameListeners.forEach((unsubscribe, gameId) => {
    const roomSize = getRoomSize(gameId);

    if (roomSize === 0) {
      unsubscribe();
      gameListeners.delete(gameId);
    }
  });
}

export function cleanupAllListeners(): void {
  console.log(`Cleaning up ${gameListeners.size} listeners`);
  gameListeners.forEach((unsubscribe) => {
    unsubscribe();
  });
  gameListeners.clear();
}
