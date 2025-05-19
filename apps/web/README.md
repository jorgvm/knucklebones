# Web app

This app is the interface the user will see, built in Vue.

# Local setup

To run this app locally:

- copy .env.example to .env, enter variables
- run `pnpm dev`

# Vercel

You can easily run this project on Vercel.

First, create a Vercel project and add your .env variables.

Update your project settings:

- build command: `pnpm build`
- output directory: `.output/server/`
- install command: `pnpm install`
- root directory: `apps/web`
