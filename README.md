# Discord Bot - Docent Bot

A minimal TypeScript Discord bot designed for deployment to Fly.io. Features instant slash commands, health monitoring, and automated deployment via GitHub Actions.

## Features

- **Slash Commands**: `/ping` → "pong", `/about` → bot information, `/technews` → top Hacker News headlines
- **Health Endpoint**: HTTP server on `/` for Fly health checks
- **Environment-Based Commands**: Guild commands for dev (instant), global commands for prod
- **Zero Frameworks**: Built with only discord.js + native HTTP server
- **Auto-Deploy**: GitHub Actions workflow for seamless Fly.io deployment

## Project Structure

```
discord-bot/
├── src/
│   ├── index.ts              # Bot runtime + health HTTP server
│   └── registerCommands.ts   # Registers slash commands
├── .github/workflows/
│   └── deploy.yaml           # GitHub Actions deployment workflow
├── fly.toml                  # Fly.io app configuration
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
PORT=8080          # Fly provides this in production (fallback to 8080)
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

### Prerequisites (one-time setup)

1. **Install Fly tooling**
   - `curl -L https://fly.io/install.sh | sh`
   - `fly auth signup` (or `fly auth login` if you already have an account)

2. **Create the Fly app**
   - From the project root run `fly launch --no-deploy --copy-config --name <your-fly-app-name>`
   - Update the `app` value in `fly.toml` so it matches `<your-fly-app-name>`

3. **Configure secrets on Fly**
   ```bash
   fly secrets set DISCORD_TOKEN=... CLIENT_ID=... GUILD_ID=...
   ```

### GitHub secrets

Add these to your repository settings:

- `FLY_API_TOKEN`: output of `fly auth token`
- `FLY_APP_NAME`: the Fly app name you created above
- `DISCORD_TOKEN`: your Discord bot token
- `CLIENT_ID`: your Discord application client ID
- `GUILD_ID`: your development Discord guild/server ID

### Manual deployment

```bash
fly deploy --remote-only --config fly.toml --app <your-fly-app-name>
```

### Automated deployment

Push to the `master` branch to trigger the GitHub Actions workflow. It will:

1. Install `flyctl`
2. Build and deploy the Docker image using the remote Fly builder

## Fly configuration notes

- **Always-on instance**: `auto_stop_machines=false` and `min_machines_running=1` in `fly.toml` keep a machine warm for the Discord WebSocket.
- **Health checks**: Fly hits `/` for health; keep the HTTP server responding with 200 OK.
- **Scaling**: Adjust CPU/RAM or machine count with `fly scale` if your usage changes.
- **Command types**:
  - Guild commands (dev): Instant registration, use during development
  - Global commands (prod): Up to 1 hour propagation, uncomment in `registerCommands.ts` for production

## Commands

- `/ping` - Simple health check, responds with "pong"
- `/about` - Information about the bot
- `/technews` - Get the top 3 headlines from Hacker News

### Adding New Commands

This bot uses a modular command system that allows multiple developers to work on different commands simultaneously without conflicts. See [SLASH_COMMANDS.md](./SLASH_COMMANDS.md) for the complete development guide.

**Quick Start:**
1. Copy `src/commands/_template.ts` to `src/commands/your-command.ts`
2. Implement your command following the `ISlashCommand` interface
3. Add your command to `src/commands/index.ts`
4. Run `npm run register` to deploy to Discord

**File Structure:**
```
src/
├── commands/
│   ├── _template.ts      # Template for new commands
│   ├── index.ts          # Central registry (only potential conflict point)
│   ├── ping.ts           # Example command
│   └── your-command.ts   # Your new commands
└── types/
    └── ISlashCommand.ts  # Command interface
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run validate` - Validate all slash commands for common issues
- `npm run register` - Register slash commands to development guild
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run register:dist` - Register commands using compiled JavaScript

## Architecture

The bot maintains a persistent WebSocket connection to Discord while running a minimal HTTP server for Fly's health checks. The dual-server approach keeps the Discord session alive while satisfying Fly's load balancer probes.
