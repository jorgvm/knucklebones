# Server app

This is the server app, creating a websocket connection between client and Firebase database.

## Firebase

To play the game on your (local) environment, you need your own Firebase database.

- Create an account on Firebase [firebase.google.com](https://firebase.google.com/)
- Duplicate .env.example to .env
- Create a new project and app, place the received tokens in the .env file
- Create a "Firestore Database" in development mode.
- Create a collection, put the id in FIREBASE_COLLECTION_ID
- Now fire up the game. The game will create the data structure on Firebase

## Local setup

To run this app locally:

- copy .env.example to .env, enter variables
- run `pnpm dev`

## Render.com setup

You can run a free web service on render.com.

Create a project and add your .env variables.

Update your project settings:

- root directory: `apps/server`
- build command: `pnpm install --frozen-lockfile`
- start command: `pnpm start`
