
---

> [!WARNING]
> This version is now obsolete. Please see [Konsion](https://www.github.com/JamsterJava/Konsion) for the new project. It's being built from the ground up for better performance and reliability.

---

<h1 align="center">CMD Forum</h1>

![CMD Forum](/public/main_bgcmd.png)

<!--[GitHub Created At](https://img.shields.io/github/created-at/CMD-Forum/cmd-forum?style=flat-square&logo=github&color=blue)-->
![GitHub package.json version](https://img.shields.io/github/package-json/v/cmd-forum/CMD-Forum?style=flat-square)
![Vercel](https://vercelbadge.vercel.app/api/CMD-Forum/cmd-forum?style=flat-square&logo=vercel)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/CMD-Forum/cmd-forum?style=flat-square&logo=github)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/CMD-Forum/cmd-forum?style=flat-square&logo=github)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/CMD-Forum/cmd-forum/total?style=flat-square&logo=github)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/CMD-Forum/cmd-forum?style=flat-square&logo=github)

<h3 align="center">Forum site built in React</h3>

---

## Getting Started w/ Local Installation

### Prerequisites

- Node.js >=19 (Crypto needs to be available)
- NPM

### Create a GitHub OAuth App

> [!WARNING]
> This step is required for authentication with GitHub to work.

1. Go to your GitHub settings.
2. Scroll down and go to `Developer Settings > OAuth Apps`.
3. Click the button to create a new OAuth app.
4. Fill in most fields to your liking, but make sure to put `https://{your_url}/api/auth/callback/github` for `Authorization Callback URL`, wth `{your_url}` being the domain you're hosting CMD/> on.
5. Proceed to setting up your `.env` file, where we'll use the `Client ID` & `Client Secret`.

### Setup the `.env` file

To setup your .env file, you'll need to change a few things.

| Variable             | Change To                                                                | Notes                                                         |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| DATABASE_URL         | Your database connection string                                          | N/A                                                           |
| GITHUB_CLIENT_ID     | Your GitHub Client ID (For Local Development)                            | See your GitHub developer settings for this.                         |
| GITHUB_CLIENT_SECRET | Your GitHub Client Secret (For Local Development)                        | You should have this stored, as GitHub only shows it once.    |
| GITHUB_CLIENT_ID_PROD     | Your GitHub Client ID (When deploying to production)                | See your GitHub developer settings for this.                         |
| GITHUB_CLIENT_SECRET_PROD | Your GitHub Client Secret (When deploying to production)            | You should have this stored, as GitHub only shows it once.    |
| NEXT_PUBLIC_METADATA_BASE_URL_DEV | Your local development URL (most likely <https://localhost:3000>) | Used for the metadata. |
| NEXT_PUBLIC_METADATA_BASE_URL_PROD | Your production URL (where you'll deploy CMD/> to) | N/A |

### Setup your database

> [!IMPORTANT]
> You should have a database already setup, however if you don't then do that before proceeding. You will need your database connection string (see `DATABASE_URL`), which
> should include all required information, such as the URL, username and password.

To fully setup your database, run the following commands in order:

- `npx prisma db push`
- `npx prisma generate` (stop the NextJS server before running this if already started)

If all goes well, your database should have all required tables and fields. Prisma should give an error if something goes wrong, however it shouldn't.

> [!NOTE]
> To check that the database is working properly, try making an account and creating a community and a post. Check them to make sure they appear and all information is there.
> You can also run the seed file to fill the database with placeholder information.

### Run the development server

```bash
npm run dev
```

This will start a HTTPS development server. HTTPS is required for authentication to work on Chromium browsers, however Firefox will work regardless.

> [!NOTE]
> `npm run dev` runs `next dev --experimental-https --turbo`.  
> If you don't want Turbopack and prefer Webpack, remove `--turbo` from the command.  
> If you don't want HTTPS, remove `--experimental-https` from the command.

> [!NOTE]
> CMD/> uses Vercel Speed Insights, if you don't want this you'll have to remove `<SpeedInsights />` from under the HTML tag in `layout.tsx`.

## Getting Started w/ Docker

### Create a GitHub OAuth App

> [!WARNING]
> This step is required for authentication with GitHub to work.

1. Go to your GitHub settings.
2. Scroll down and go to `Developer Settings > OAuth Apps`.
3. Click the button to create a new OAuth app.
4. Fill in most fields to your liking, but make sure to put `https://{your_url}/api/auth/callback/github` for `Authorization Callback URL`, wth `{your_url}` being the domain you're hosting CMD/> on.
5. Proceed to setting up your `.env` file, where we'll use the `Client ID` & `Client Secret`.

### Setup the `.env` file

To setup your .env file, you'll need to change a few things.

| Variable             | Change To                                                                | Notes                                                         |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| DATABASE_URL         | Your database connection string                                          | N/A                                                           |
| GITHUB_CLIENT_ID_PROD     | Your GitHub Client ID (see your developer settings)                      | See your developer settings for this.                         |
| GITHUB_CLIENT_SECRET_PROD | Your GitHub Client Secret                                                | You should have this stored, as GitHub only shows it once.    |
| NEXT_PUBLIC_METADATA_BASE_URL_DEV | Your local development URL (most likely <https://localhost:3000>) | Used for the metadata. |
| NEXT_PUBLIC_METADATA_BASE_URL_PROD | Your production URL (where you'll deploy CMD/> to) | N/A |

> [!IMPORTANT]
> You should have a database already setup, however if you don't then do that before proceeding. You will need your database connection string (see `DATABASE_URL`), which
> should include all required information, such as the URL, username and password.

### Optional: Build the Docker Image

If you would prefer the build the Docker Image locally, then go the the project root directory and run `npm run setup`. Select `Build a Docker Image` and wait for it to complete. After it's done, you should have a Docker Image (`cmd-forum-docker`) available to you. You can confirm this by running `docker image ls` and seeing if `cmd-forum-docker` appears.

### Setup the Docker Container

There are two ways to setup a Docker Container, either by a command or by Docker Compose.

#### Command Line

The command below will start a Docker Container using a `.env` file in the same directory. Make sure this file is present, or the container will fail to start. If you want to change the port it is accessible on, change the first `3000` after `-p` to your desired port.

```bash
docker create --env-file .env -p 3000:3000 ghcr.io/cmd-forum/cmd-forum:master # Just 'cmd-forum' if you have a local image.
```

Next, execute the following commands in order in the container:

```bash
npx prisma migrate dev
npx prisma db seed
```

#### Docker Compose

First, make a folder and create a file named `docker-compose.yml` inside. Make sure you have file extensions enabled, and it isn't saved as `docker-compose.yml.txt`.

Here is an example of what you should put in it:

```yaml
name: "cmd-forum"
services:
  cmd_forum:
    container_name: cmd-forum
    image: ghcr.io/cmd-forum/cmd-forum:master # Just 'cmd-forum' if you have a local image.
    env_file:
      - .env # Load .env, change if required. 
             # Do not specify DATABASE_URL in here if using the container db, instead specify it below.
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres?schema=public # Change to fit your login details
      # Optionally, put all of the `.env` here and skip using the file. Make sure to remove the `env_file` section if doing so.
    ports:
      - 3000:3000 # Change the first 3000 if you want a different port.
    links:
      - "db:database"
  db: # Optional, but here as an example of how to setup a database.
    container_name: db
    image: postgres
    environment: # If using this database, change to desired values.
      POSTGRES_USERNAME: postgres # Definitely change this
      POSTGRES_PASSWORD: postgres # and this
      TZ: Continent/City # Change to your Timezone (Format is Continent/City).
    ports:
      - 5432:5432 # Change the first 5432 if you want a different port.
    volumes:
      - ./db:/var/lib/postgresql/data 
    restart: unless-stopped
```

When you're finished with the file, make sure you have your `.env` file in the same directory. Open a terminal in the same directory and run `docker compose up -d`. This will start a database and CMD. Next, execute the following commands in order in the container:

```bash
npx prisma migrate dev
npx prisma db seed
```

>[!NOTE]
> If you'd prefer to watch what your container is doing in the terminal you started it in, remove the `-d`.

## Credits

### Inspiration

- [Reddit](https://old.reddit.com) for giving me a goal to achieve (to have the features of Reddit)
- Lemmy
  - [Photon](https://github.com/Xyphyn/photon) for a ton of inspiration with the UI. (whoever made that is good at UI design)
- [Discuit](https://www.discuit.net) for giving me the idea to do this in the first place.

### Packages

Here is a list of all packages used:

- @floating-ui/react
- @heroicons/react
- @hookform/resolvers
- @lucia-auth/adapter-prisma
- @next/bundle-analyzer
- @next/eslint-plugin-next
- @node-rs/argon2
- @prisma/client
- arctic
- conventional-changelog-cli
- dayjs
- dotenv-cli
- framer-motion
- lucia
- next
- next-dev-https
- nextjs-toploader
- oslo
- prisma-docs-generator
- prompts
- react
- react-dom
- react-hook-form
- react-icons
- react-markdown
- rehype-sanitize
- remark-gfm
- sass
- use-debounce
- xss
- zod

- @types/node
- @types/react
- @types/react-dom
- @typescript-eslint/parser
- autoprefixer
- eslint
- eslint-config-next
- eslint-plugin-deprecation
- eslint-plugin-simple-import-sort
- postcss
- prisma
- tailwindcss
- tailwindcss-themer
- ts-node
- typescript
- webpack
