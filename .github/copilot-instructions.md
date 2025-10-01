# GitHub Copilot Instructions for Docent Bot

This file provides context and guidelines for GitHub Copilot when working on the Docent Bot project.

## Project Overview

Docent Bot is a TypeScript Discord bot designed for deployment to Fly.io. It features:
- Modular slash command system
- Health monitoring endpoint
- Automated deployment via GitHub Actions
- Comprehensive unit testing with Jest

## Architecture

- **Runtime**: Node.js with TypeScript (ES Modules)
- **Main files**:
  - `src/index.ts` - Bot runtime and HTTP health server
  - `src/registerCommands.ts` - Command registration with Discord API
  - `src/commands/index.ts` - Central command registry
- **Discord.js version**: 14.x
- **Module system**: ES Modules (use `.js` extensions in imports)

## Code Conventions

### TypeScript Style
- Use strict TypeScript settings
- Target ES2022
- Always use `.js` extensions in import statements (TypeScript ESM requirement)
- Prefer `async/await` over promises
- Use proper error handling with try/catch blocks

### Naming Conventions
- Files: kebab-case (`my-command.ts`)
- Variables/functions: camelCase
- Interfaces: PascalCase with `I` prefix (`ISlashCommand`)
- Constants: UPPER_SNAKE_CASE for environment variables
- Slash command names: lowercase, use hyphens for multi-word commands

### Import Style
```typescript
// Always use .js extensions for local imports
import { ISlashCommand } from "../types/ISlashCommand.js";
import { myFunction } from "./utils.js";
```

## Adding New Slash Commands

### Quick Workflow
1. Copy `src/commands/_template.ts` to `src/commands/your-command.ts`
2. Implement the `ISlashCommand` interface
3. Add command to `src/commands/index.ts` exports array
4. Run `npm run validate` to check for issues
5. Run `npm run register` to deploy to Discord
6. Write tests in `src/__tests__/commands/your-command.test.ts`

### Command Structure
Every command must implement:
```typescript
export interface ISlashCommand {
  data: SlashCommandBuilder;  // Command definition
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
```

### Command Naming Best Practices
- Keep names short and descriptive
- Use lowercase only
- Use hyphens for multi-word commands (`user-info`, not `userInfo`)
- Avoid special characters

### Error Handling
Always include proper error handling in commands:
```typescript
async execute(interaction) {
  try {
    await interaction.deferReply();
    // Command logic here
    await interaction.editReply('Success!');
  } catch (error) {
    console.error('Error in command:', error);
    await interaction.editReply('An error occurred.');
  }
}
```

## Testing Guidelines

### Test Framework
- Jest with TypeScript support
- Mock Discord.js interactions using utilities in `src/__tests__/utils/mockInteraction.ts`
- Aim for >90% code coverage

### Test Structure
```typescript
import { myCommand } from "../../commands/my-command.js";
import { createMockInteraction } from "../utils/mockInteraction.js";

describe("My Command", () => {
  it("should respond correctly", async () => {
    const mockInteraction = createMockInteraction();
    await myCommand.execute(mockInteraction);
    expect(mockInteraction.reply).toHaveBeenCalledWith(/* expected */);
  });
});
```

### Running Tests
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode for development
- `npm run test:coverage` - Generate coverage report

## File Structure

```
src/
├── commands/
│   ├── _template.ts      # Template for new commands
│   ├── index.ts          # Command registry (⚠️ merge conflict risk)
│   ├── about.ts          # Example: Basic info command
│   ├── ping.ts           # Example: Simple command
│   ├── roll.ts           # Example: Command with options
│   ├── coffee.ts         # Example: Complex interaction
│   └── technews.ts       # Example: API integration
├── types/
│   └── ISlashCommand.ts  # Command interface
├── __tests__/
│   ├── commands/         # Command tests
│   └── utils/            # Test utilities
├── index.ts              # Main bot runtime
├── registerCommands.ts   # Command registration
└── validateCommands.ts   # Command validation utility
```

## Merge Conflict Prevention

### High-Risk Files
- `src/commands/index.ts` - Multiple developers modify this file
  - Add new commands in alphabetical order
  - Use descriptive commit messages
  - Coordinate with team when adding commands

### Low-Risk Files (Safe for Parallel Work)
- Individual command files (`src/commands/your-command.ts`)
- New type definitions
- Documentation files
- Test files

## Environment Variables

Required for development:
```bash
DISCORD_TOKEN   # Bot token from Discord Developer Portal
CLIENT_ID       # Application ID (not bot user ID)
GUILD_ID        # Development server ID for instant command updates
PORT            # HTTP server port (default: 8080)
```

## Development Workflow

1. **Setup**: `npm install` and create `.env` from `.env.example`
2. **Development**: `npm run dev` (hot reload enabled)
3. **Validation**: `npm run validate` (check commands for issues)
4. **Testing**: `npm test` or `npm run test:watch`
5. **Registration**: `npm run register` (deploy to Discord)
6. **Build**: `npm run build` (compile TypeScript)
7. **Production**: `npm start` (run compiled code)

## Deployment

### Development vs Production Commands
- **Guild commands** (dev): Instant registration, use during development
- **Global commands** (prod): Up to 1 hour propagation delay
- Toggle in `registerCommands.ts`

### Fly.io Deployment
- Automated via GitHub Actions on push to `master`
- Manual: `fly deploy --remote-only`
- Health check endpoint: HTTP server on `/` must return 200 OK
- Bot maintains persistent WebSocket connection to Discord

### GitHub Actions
- `.github/workflows/test.yaml` - Runs tests on PRs
- `.github/workflows/deploy.yaml` - Deploys to Fly.io on master branch
- Deployment only proceeds if tests pass

## Common Patterns

### Deferred Replies
For commands that take time to process:
```typescript
await interaction.deferReply({ ephemeral: true });
// Long-running operation
await interaction.editReply('Result');
```

### Command Options
```typescript
.addStringOption(option =>
  option.setName('name')
    .setDescription('Description')
    .setRequired(true))
```

### Fetching External APIs
```typescript
const response = await fetch('https://api.example.com/data');
if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}
const data = await response.json();
```

## References

- Full command development guide: `SLASH_COMMANDS.md`
- Main documentation: `README.md`
- Discord.js documentation: https://discord.js.org/
- Template command: `src/commands/_template.ts`
- Example commands: `src/commands/ping.ts`, `src/commands/about.ts`, `src/commands/roll.ts`

## Troubleshooting

### TypeScript Errors
- Verify `.js` extensions in all local imports
- Check `execute` function signature matches interface
- Ensure proper async/await usage

### Command Not Appearing
- Run `npm run register` after making changes
- Verify `GUILD_ID` in `.env` for development
- Check command name doesn't conflict with existing commands

### Test Failures
- Use mock utilities from `src/__tests__/utils/mockInteraction.ts`
- Ensure async operations are properly awaited
- Check that mocks are properly configured for your test case
