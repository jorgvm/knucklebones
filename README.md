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

# Game rules

- The game consists of two 3x3 boards, each belonging to their respective player.
- The players take turns. On a player's turn, they roll a single 6-sided die, and must place it in a column on their board. A filled column does not accept any more dice.
- Each player has a score, which is the sum of all the dice values on their board. - The score awarded by each column is also displayed.
- If a player places multiple dice of the same value in the same column, the score awarded for each of those dice is multiplied by the number of dice of the same value in that column. e.g. if a column contains 4-1-4, then the score for that column is 4x2 + 1x1 + 4x2 = 17. Below is a multiplication table for reference and comparison:
- When a player places a die, all dice of the same value in the corresponding column of the opponent's board gets destroyed. Players can use this mechanic to destroy their opponent's high-scoring combos.
- The game ends when either player completely fills up their 3x3 board. The player with the higher score wins.

# Naming

A gameboard has two player sections.
Each player has three racks.
Each rack can have 0 to 3 dice.
1 item is called a 'die'
