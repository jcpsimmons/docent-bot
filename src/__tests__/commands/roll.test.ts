import { rollCommand } from '../../commands/roll.js';
import { createMockInteraction } from '../utils/mockInteraction.js';

describe('roll command', () => {
  // Mock Math.random to make tests deterministic
  const originalRandom = Math.random;
  
  beforeEach(() => {
    Math.random = jest.fn();
  });
  
  afterEach(() => {
    Math.random = originalRandom;
  });

  describe('command data', () => {
    it('should have correct name and description', () => {
      expect(rollCommand.data.name).toBe('roll');
      expect(rollCommand.data.description).toBe('Roll a dice');
    });

    it('should have sides and count options', () => {
      const commandJSON = rollCommand.data.toJSON();
      const options = commandJSON.options || [];
      
      const sidesOption = options.find(opt => opt.name === 'sides');
      const countOption = options.find(opt => opt.name === 'count');
      
      expect(sidesOption).toBeDefined();
      expect(sidesOption?.description).toBe('Number of sides on the dice (default: 6)');
      expect(sidesOption?.required).toBe(false);
      
      expect(countOption).toBeDefined();
      expect(countOption?.description).toBe('Number of dice to roll (default: 1)');
      expect(countOption?.required).toBe(false);
    });
  });

  describe('execute function', () => {
    it('should roll a single 6-sided die by default', async () => {
      (Math.random as jest.Mock).mockReturnValue(0.5); // Should roll a 4 (0.5 * 6 = 3, + 1 = 4)
      
      const mockInteraction = createMockInteraction({
        getIntegerOption: () => null, // No options provided
      });
      
      await rollCommand.execute(mockInteraction);
      
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.reply).toHaveBeenCalledWith('🎲 You rolled a **4** on a 6-sided die!');
    });

    it('should roll with custom sides', async () => {
      (Math.random as jest.Mock).mockReturnValue(0.9); // Should roll a 19 (0.9 * 20 = 18, floor(18) + 1 = 19)
      
      const mockInteraction = createMockInteraction({
        getIntegerOption: (name: string) => name === 'sides' ? 20 : null,
      });
      
      await rollCommand.execute(mockInteraction);
      
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.reply).toHaveBeenCalledWith('🎲 You rolled a **19** on a 20-sided die!');
    });

    it('should roll multiple dice', async () => {
      const mockRolls = [0.0, 0.5, 0.9]; // Should roll 1, 4, 6 respectively
      (Math.random as jest.Mock)
        .mockReturnValueOnce(mockRolls[0])
        .mockReturnValueOnce(mockRolls[1])
        .mockReturnValueOnce(mockRolls[2]);
      
      const mockInteraction = createMockInteraction({
        getIntegerOption: (name: string) => name === 'count' ? 3 : null,
      });
      
      await rollCommand.execute(mockInteraction);
      
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.reply).toHaveBeenCalledWith(
        '🎲 You rolled 3 6-sided dice: 1, 4, 6\nTotal: **11**'
      );
    });

    it('should roll multiple custom-sided dice', async () => {
      const mockRolls = [0.4, 0.8]; // Should roll 5, 9 on 10-sided dice
      (Math.random as jest.Mock)
        .mockReturnValueOnce(mockRolls[0])
        .mockReturnValueOnce(mockRolls[1]);
      
      const mockInteraction = createMockInteraction({
        getIntegerOption: (name: string) => {
          if (name === 'sides') return 10;
          if (name === 'count') return 2;
          return null;
        },
      });
      
      await rollCommand.execute(mockInteraction);
      
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.reply).toHaveBeenCalledWith(
        '🎲 You rolled 2 10-sided dice: 5, 9\nTotal: **14**'
      );
    });

    it('should handle edge case of rolling 1 on minimum sides', async () => {
      (Math.random as jest.Mock).mockReturnValue(0.0); // Should roll a 1
      
      const mockInteraction = createMockInteraction({
        getIntegerOption: (name: string) => name === 'sides' ? 2 : null,
      });
      
      await rollCommand.execute(mockInteraction);
      
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.reply).toHaveBeenCalledWith('🎲 You rolled a **1** on a 2-sided die!');
    });

    it('should handle edge case of rolling maximum on maximum sides', async () => {
      (Math.random as jest.Mock).mockReturnValue(0.99); // Should roll close to max
      
      const mockInteraction = createMockInteraction({
        getIntegerOption: (name: string) => name === 'sides' ? 100 : null,
      });
      
      await rollCommand.execute(mockInteraction);
      
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.reply).toHaveBeenCalledWith('🎲 You rolled a **100** on a 100-sided die!');
    });

    it('should have execute function that returns a Promise', () => {
      const mockInteraction = createMockInteraction();
      const result = rollCommand.execute(mockInteraction);
      
      expect(result).toBeInstanceOf(Promise);
    });
  });
});