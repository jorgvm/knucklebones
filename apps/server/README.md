# Server app

This is the server app, creating a websocket connection between client and Supabase database.

## Supabase

## To restore database

To play the game on your (local) environment, you need your own Supabase project.

- Create an account on [supabase.com](https://supabase.com/)
- Create a new project
- Duplicate `.env.example` to `.env` and fill in your Supabase URL and key
- Restore the database schema

```bash
pnpm supabase login
pnpm supabase link --project-ref <your-project-ref>
pnpm supabase db push
```

## Fly.io setup

You can deploy this app on [fly.io](https://fly.io/).

- Install flyctl: `brew install flyctl`
- Login: `fly auth login`
- Set env variables: `fly secrets set KEY=value`
- Deploy: `fly deploy`
