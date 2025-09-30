# Slash Commands Development Guide

This guide explains how to add new slash commands to the Docent Bot using our modular command system.

## 🎯 Quick Start

1. **Copy the template**: Copy `src/commands/_template.ts` to a new file (e.g., `src/commands/hello.ts`)
2. **Implement your command**: Follow the `ISlashCommand` interface
3. **Validate your command**: Run `npm run validate` to check for issues
4. **Register the command**: Add it to `src/commands/index.ts`
5. **Deploy**: Run `npm run register` to register with Discord

## 📁 File Structure

```
src/
├── commands/
│   ├── _template.ts      # Template for new commands
│   ├── index.ts          # Central command registry (⚠️ potential conflicts)
│   ├── ping.ts           # Example: Simple command
│   ├── about.ts          # Example: Basic info command
│   └── [your-command].ts # Your new commands go here
├── types/
│   └── ISlashCommand.ts  # Command interface definition
└── ...
```

## 🔧 Creating a New Command

### Step 1: Create the Command File

Create a new file in `src/commands/` following this pattern:

```typescript
// src/commands/hello.ts
import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/ISlashCommand.js";

export const helloCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Says hello to the user")
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Your name')
        .setRequired(false)),

  async execute(interaction) {
    const name = interaction.options.getString('name') ?? 'World';
    await interaction.reply(`Hello, ${name}!`);
  },
};
```

### Step 2: Register the Command

Add your command to `src/commands/index.ts`:

```typescript
// Import your command
import { helloCommand } from "./hello.js";

// Add it to the commands array
export const commands: ISlashCommand[] = [
  pingCommand,
  aboutCommand,
  helloCommand, // Add this line
  // Add new commands here
];
```

### Step 3: Deploy the Command

```bash
npm run register
```

## 📋 Command Interface Reference

Every command must implement the `ISlashCommand` interface:

```typescript
export interface ISlashCommand {
  /** The command definition (name, description, options, etc.) */
  data: SlashCommandBuilder;
  
  /** The function that executes when the command is used */
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
```

## 🔀 Avoiding Merge Conflicts

### Low Conflict Files (Safe to work on simultaneously)
- Individual command files (`src/commands/your-command.ts`)
- New type definitions
- Documentation

### High Conflict File (Coordinate changes)
- `src/commands/index.ts` - This is the only file multiple developers might need to modify

### Best Practices for Team Development

1. **Communicate**: Let the team know which command names you're working on
2. **Descriptive commits**: Use clear commit messages like "Add /weather command"
3. **Small PRs**: Keep pull requests focused on single commands when possible
4. **Alphabetical ordering**: Add new commands in alphabetical order in `index.ts` to reduce conflicts

## 🛠️ Advanced Command Examples

### Command with Options

```typescript
export const weatherCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get weather information")
    .addStringOption(option =>
      option.setName('city')
        .setDescription('City name')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('detailed')
        .setDescription('Show detailed forecast')
        .setRequired(false)),

  async execute(interaction) {
    const city = interaction.options.getString('city', true);
    const detailed = interaction.options.getBoolean('detailed') ?? false;
    
    // Your weather API logic here
    await interaction.reply(`Weather for ${city}${detailed ? ' (detailed)' : ''}`);
  },
};
```

### Command with Subcommands

```typescript
export const adminCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Admin commands")
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option => 
          option.setName('user').setDescription('User to ban').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption(option => 
          option.setName('user').setDescription('User to kick').setRequired(true))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case 'ban':
        // Handle ban logic
        break;
      case 'kick':
        // Handle kick logic
        break;
    }
  },
};
```

## 🚀 Development Workflow

1. **Development**: Use `npm run dev` for hot reloading during development
2. **Validation**: Use `npm run validate` to check commands for common issues
3. **Testing**: Test commands in a development Discord server first
4. **Registration**: Use `npm run register` to register commands
5. **Production**: Use `npm run build && npm start` for production

## 📝 Command Naming Conventions

- Use lowercase letters only
- Use hyphens for multi-word commands (`user-info`, not `userInfo`)
- Keep names short but descriptive
- Avoid special characters

## ❓ Troubleshooting

### Command not appearing in Discord
- Make sure you ran `npm run register`
- Check that your command name doesn't conflict with existing commands
- Verify your `GUILD_ID` is set correctly for development

### TypeScript errors
- Ensure you're implementing the `ISlashCommand` interface correctly
- Check that all imports use `.js` extensions (TypeScript requirement for ES modules)
- Make sure your `execute` function is async and returns `Promise<void>`

### Command execution errors
- Check the bot logs for detailed error messages
- Ensure proper error handling in your execute function
- Test with required and optional parameters

## 🔍 Examples to Study

Look at these existing commands for reference:
- `src/commands/ping.ts` - Simple command with no options
- `src/commands/about.ts` - Basic informational command
- `src/commands/roll.ts` - Command with multiple optional parameters
- `src/commands/coffee.ts` - Complex command with guild member interaction and DMs
- `src/commands/_template.ts` - Template with comments and examples