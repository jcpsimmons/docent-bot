import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';

/**
 * Creates a mock ChatInputCommandInteraction for testing
 */
export function createMockInteraction(options: {
  commandName?: string;
  getStringOption?: (name: string) => string | null;
  getIntegerOption?: (name: string) => number | null;
  reply?: jest.Mock;
  followUp?: jest.Mock;
  deferReply?: jest.Mock;
  editReply?: jest.Mock;
  replied?: boolean;
  deferred?: boolean;
} = {}): jest.Mocked<ChatInputCommandInteraction> {
  const mockReply = options.reply || jest.fn().mockResolvedValue({} as InteractionResponse);
  const mockFollowUp = options.followUp || jest.fn().mockResolvedValue({} as InteractionResponse);
  const mockDeferReply = options.deferReply || jest.fn().mockResolvedValue({} as InteractionResponse);
  const mockEditReply = options.editReply || jest.fn().mockResolvedValue({} as InteractionResponse);
  
  const mockOptions = {
    getString: jest.fn((name: string) => options.getStringOption?.(name) || null),
    getInteger: jest.fn((name: string) => options.getIntegerOption?.(name) || null),
  };

  return {
    commandName: options.commandName || 'test',
    options: mockOptions,
    reply: mockReply,
    followUp: mockFollowUp,
    deferReply: mockDeferReply,
    editReply: mockEditReply,
    replied: options.replied || false,
    deferred: options.deferred || false,
    isChatInputCommand: jest.fn().mockReturnValue(true),
    // Add other properties that might be needed
    user: { id: 'test-user-id', username: 'testuser' },
    guild: { id: 'test-guild-id' },
    channel: { id: 'test-channel-id' },
    id: 'test-interaction-id',
  } as unknown as jest.Mocked<ChatInputCommandInteraction>;
}