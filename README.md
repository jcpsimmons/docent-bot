# Discord Bot - Event Horizon Bot

A minimal TypeScript Discord bot designed for deployment to Google Cloud Run. Features instant slash commands, health monitoring, and automated deployment via GitHub Actions.

## Features

- **Slash Commands**: `/ping` → "pong", `/about` → bot information
- **Health Endpoint**: HTTP server on `/` for Cloud Run health checks
- **Environment-Based Commands**: Guild commands for dev (instant), global commands for prod
- **Zero Frameworks**: Built with only discord.js + native HTTP server
- **Auto-Deploy**: GitHub Actions workflow for seamless Cloud Run deployment

## Project Structure

```
discord-bot/
├── src/
│   ├── index.ts              # Bot runtime + health HTTP server
│   └── registerCommands.ts   # Registers slash commands
├── .github/workflows/
│   └── deploy.yaml           # GitHub Actions deployment workflow
├── package.json
├── tsconfig.json
├── .env.example
├── Dockerfile
├── .dockerignore
└── README.md
```

## Environment Variables

```bash
DISCORD_TOKEN=...   # Your Discord bot token
CLIENT_ID=...       # Discord Application (not bot) ID
GUILD_ID=...        # Dev guild for instant command registration
PORT=8080          # Cloud Run provides this (fallback to 8080)
```

## Local Development

1. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Discord bot credentials
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Register Commands** (one-time setup):
   ```bash
   npm run register
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The bot will run with hot reload on port 8080 with a health endpoint at `http://localhost:8080`.

## Production Deployment

### Prerequisites (One-time Setup)

1. **Google Cloud Project**:
   - Create a GCP project
   - Enable: Cloud Run, Artifact Registry, Secret Manager APIs

2. **Service Account**:
   - Create service account with roles:
     - `roles/run.admin`
     - `roles/artifactregistry.admin` (or writer)
     - `roles/iam.serviceAccountUser`

3. **Artifact Registry**:
   ```bash
   gcloud artifacts repositories create discord \
     --repository-format=docker \
     --location=us-central1
   ```

### GitHub Secrets

Configure the following secrets in your GitHub repository:

- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_WIF_PROVIDER`: Workload Identity Federation provider resource name
- `GCP_SERVICE_ACCOUNT`: Service account email (e.g., `gh-deployer@PROJECT_ID.iam.gserviceaccount.com`)
- `DISCORD_TOKEN`: Your Discord bot token
- `CLIENT_ID`: Your Discord application client ID
- `GUILD_ID`: Your development Discord guild/server ID

### Manual Deployment

1. **Build and Push Image**:
   ```bash
   gcloud builds submit --tag us-central1-docker.pkg.dev/$PROJECT_ID/discord/discord-bot:$(git rev-parse --short HEAD)
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy discord-bot \
     --image us-central1-docker.pkg.dev/$PROJECT_ID/discord/discord-bot:$(git rev-parse --short HEAD) \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated \
     --min-instances=1 \
     --cpu=1 --memory=512Mi \
     --cpu-boost \
     --execution-environment gen2
   ```

3. **Set Environment Variables**:
   ```bash
   gcloud run services update discord-bot \
     --region us-central1 \
     --set-env-vars DISCORD_TOKEN=...,CLIENT_ID=...,GUILD_ID=...
   ```

4. **Register Commands** (after deployment):
   ```bash
   gcloud run jobs create register-commands \
     --image us-central1-docker.pkg.dev/$PROJECT_ID/discord/discord-bot:$(git rev-parse --short HEAD) \
     --region us-central1 \
     --set-env-vars DISCORD_TOKEN=...,CLIENT_ID=...,GUILD_ID=... \
     --command "node" --args "dist/registerCommands.js"

   gcloud run jobs run register-commands --region us-central1
   ```

### Automated Deployment

Push to the `main` branch to trigger automatic deployment via GitHub Actions. The workflow will:

1. Build the Docker image
2. Push to Artifact Registry
3. Deploy to Cloud Run
4. Update environment variables

## Important Configuration Notes

- **CPU Always Allocated**: In the Cloud Run console, ensure "CPU is always allocated" is enabled to keep the Discord WebSocket connection alive
- **Minimum Instances**: Keep `min-instances=1` to maintain persistent connection
- **Command Types**: 
  - Guild commands (dev): Instant registration, use during development
  - Global commands (prod): Up to 1 hour propagation, uncomment in registerCommands.ts for production

## Commands

- `/ping` - Simple health check, responds with "pong"
- `/about` - Information about the bot

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run register` - Register slash commands to development guild
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run register:dist` - Register commands using compiled JavaScript

## Architecture

The bot maintains a persistent WebSocket connection to Discord while running a minimal HTTP server for Cloud Run health checks. The dual-server approach ensures both Discord connectivity and Cloud Run instance persistence.
