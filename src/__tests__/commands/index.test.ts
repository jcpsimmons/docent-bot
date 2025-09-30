import { aboutCommand } from "../../commands/about.js";
import { coffeeCommand } from "../../commands/coffee.js";
import { commandData, commands, getCommand } from "../../commands/index.js";
import { pingCommand } from "../../commands/ping.js";
import { rollCommand } from "../../commands/roll.js";

describe("commands index", () => {
  describe("commands array", () => {
    it("should export all available commands", () => {
      expect(commands).toHaveLength(4);
      expect(commands).toContain(aboutCommand);
      expect(commands).toContain(pingCommand);
      expect(commands).toContain(rollCommand);
      expect(commands).toContain(coffeeCommand);
    });

    it("should have unique command names", () => {
      const commandNames = commands.map((cmd) => cmd.data.name);
      const uniqueNames = new Set(commandNames);
      expect(uniqueNames.size).toBe(commandNames.length);
    });

    it("should have all commands implement ISlashCommand interface", () => {
      commands.forEach((command) => {
        expect(command).toHaveProperty("data");
        expect(command).toHaveProperty("execute");
        expect(typeof command.execute).toBe("function");
        expect(command.data.name).toBeDefined();
        expect(command.data.description).toBeDefined();
      });
    });
  });

  describe("commandData", () => {
    it("should export JSON data for all commands", () => {
      expect(commandData).toHaveLength(commands.length);

      commandData.forEach((data) => {
        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("description");
        expect(typeof data.name).toBe("string");
        expect(typeof data.description).toBe("string");
      });
    });

    it("should match the command names from commands array", () => {
      const commandNames = commands.map((cmd) => cmd.data.name).sort();
      const dataNames = commandData.map((data) => data.name).sort();
      expect(dataNames).toEqual(commandNames);
    });
  });

  describe("getCommand function", () => {
    it("should return correct command for valid name", () => {
      expect(getCommand("ping")).toBe(pingCommand);
      expect(getCommand("about")).toBe(aboutCommand);
      expect(getCommand("roll")).toBe(rollCommand);
      expect(getCommand("coffee")).toBe(coffeeCommand);
    });

    it("should return undefined for invalid command name", () => {
      expect(getCommand("nonexistent")).toBeUndefined();
      expect(getCommand("")).toBeUndefined();
      expect(getCommand("PING")).toBeUndefined(); // Case sensitive
    });

    it("should handle null/undefined input gracefully", () => {
      expect(getCommand(null as any)).toBeUndefined();
      expect(getCommand(undefined as any)).toBeUndefined();
    });
  });
});
