import { pingCommand } from '../../commands/ping.js';
import { createMockInteraction } from '../utils/mockInteraction.js';

describe('ping command', () => {
  it('should have correct command data', () => {
    expect(pingCommand.data.name).toBe('ping');
    expect(pingCommand.data.description).toBe('Replies with pong.');
  });

  it('should reply with "pong" when executed', async () => {
    const mockInteraction = createMockInteraction();
    
    await pingCommand.execute(mockInteraction);
    
    expect(mockInteraction.reply).toHaveBeenCalledTimes(1);
    expect(mockInteraction.reply).toHaveBeenCalledWith('pong');
  });

  it('should have execute function that returns a Promise', () => {
    const mockInteraction = createMockInteraction();
    const result = pingCommand.execute(mockInteraction);
    
    expect(result).toBeInstanceOf(Promise);
  });
});