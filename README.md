# Knucklesbones

A small game to play around with Vue and Nuxt.

To run:

```bash
pnpm dev
```

# Firebase

To play the game on your (local) environment, you need your own Firebase database.

- Create an account on Firebase [firebase.google.com](https://firebase.google.com/)
- Duplicate .env to .env.local
- Create a new project and app, place the received tokens in the .env.local file
- Create a "Firestore Database" in development mode.
- Create a collection, put the id in FIREBASE_COLLECTION_ID
- Now fire up the game. The game will create the data structure on Firebase
