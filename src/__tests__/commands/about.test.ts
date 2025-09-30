import { aboutCommand } from '../../commands/about.js';
import { createMockInteraction } from '../utils/mockInteraction.js';

describe('about command', () => {
  it('should have correct command data', () => {
    expect(aboutCommand.data.name).toBe('about');
    expect(aboutCommand.data.description).toBe('What this bot does.');
  });

  it('should reply with bot information when executed', async () => {
    const mockInteraction = createMockInteraction();
    
    await aboutCommand.execute(mockInteraction);
    
    expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
    expect(mockInteraction.reply).toHaveBeenCalledWith(
      "I'm a minimal TS bot running on Fly.io. Try /ping."
    );
  });

  it('should have execute function that returns a Promise', () => {
    const mockInteraction = createMockInteraction();
    const result = aboutCommand.execute(mockInteraction);
    
    expect(result).toBeInstanceOf(Promise);
  });
});