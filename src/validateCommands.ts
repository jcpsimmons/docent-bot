import { commands } from "./commands/index.js";

/**
 * Validates all commands and reports any issues
 * Run with: npx tsx src/validateCommands.ts
 */
async function validateCommands() {
  console.log("🔍 Validating commands...\n");

  if (commands.length === 0) {
    console.log("❌ No commands found!");
    process.exit(1);
  }

  const commandNames = new Set<string>();
  let hasErrors = false;

  for (const command of commands) {
    const name = command.data.name;
    console.log(`Checking command: ${name}`);

    // Check for duplicate names
    if (commandNames.has(name)) {
      console.log(`  ❌ Duplicate command name: ${name}`);
      hasErrors = true;
    } else {
      commandNames.add(name);
      console.log(`  ✅ Name: ${name}`);
    }

    // Check description
    if (!command.data.description || command.data.description.length === 0) {
      console.log(`  ❌ Missing description`);
      hasErrors = true;
    } else if (command.data.description.length > 100) {
      console.log(`  ❌ Description too long (${command.data.description.length}/100 chars)`);
      hasErrors = true;
    } else {
      console.log(`  ✅ Description: ${command.data.description}`);
    }

    // Check execute function
    if (typeof command.execute !== 'function') {
      console.log(`  ❌ Missing or invalid execute function`);
      hasErrors = true;
    } else {
      console.log(`  ✅ Execute function present`);
    }

    console.log();
  }

  console.log(`📊 Summary: ${commands.length} commands found`);
  
  if (hasErrors) {
    console.log("❌ Validation failed! Please fix the errors above.");
    process.exit(1);
  } else {
    console.log("✅ All commands validated successfully!");
  }
}

validateCommands().catch(console.error);