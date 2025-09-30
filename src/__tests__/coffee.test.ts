import { coffeeCommand } from '../commands/coffee.js';
import { ChatInputCommandInteraction, Guild, GuildMemberManager, Collection, GuildMember, User } from 'discord.js';

// Mock Discord.js objects
const mockUser = {
  id: 'user1',
  displayName: 'TestUser',
  createDM: jest.fn()
} as any;

const mockSelectedUser = {
  id: 'user2',
  displayName: 'SelectedUser',
  bot: false,
  user: {
    id: 'user2',
    createDM: jest.fn()
  }
} as any;

const mockGuildMembers = new Collection([
  ['user1', { id: 'user1', user: { bot: false, id: 'user1' } }],
  ['user2', mockSelectedUser],
  ['bot1', { id: 'bot1', user: { bot: true, id: 'bot1' } }]
]);

const mockGuild = {
  members: {
    fetch: jest.fn().mockResolvedValue(mockGuildMembers),
    cache: {
      filter: jest.fn().mockReturnValue({
        size: 1,
        random: jest.fn().mockReturnValue(mockSelectedUser)
      })
    }
  }
} as any;

const mockInteraction = {
  guild: mockGuild,
  user: mockUser,
  deferReply: jest.fn(),
  editReply: jest.fn(),
  reply: jest.fn(),
  followUp: jest.fn()
} as any;

describe('Coffee Command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have correct command data', () => {
    expect(coffeeCommand.data.name).toBe('coffee');
    expect(coffeeCommand.data.description).toBe('Start a coffee chat with a random server member');
  });

  it('should reject if not used in a guild', async () => {
    const noGuildInteraction = { ...mockInteraction, guild: null };
    
    await coffeeCommand.execute(noGuildInteraction);
    
    expect(noGuildInteraction.reply).toHaveBeenCalledWith({
      content: "This command can only be used in a server!",
      ephemeral: true
    });
  });

  it('should defer reply when starting', async () => {
    mockGuild.members.cache.filter.mockReturnValue({
      size: 1,
      random: jest.fn().mockReturnValue(mockSelectedUser)
    });

    await coffeeCommand.execute(mockInteraction);
    
    expect(mockInteraction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(mockGuild.members.fetch).toHaveBeenCalled();
  });

  it('should handle case with no eligible members', async () => {
    mockGuild.members.cache.filter.mockReturnValue({
      size: 0,
      random: jest.fn()
    });

    await coffeeCommand.execute(mockInteraction);
    
    expect(mockInteraction.editReply).toHaveBeenCalledWith({
      content: "There are no other members available for a coffee chat!"
    });
  });

  it('should successfully pair users and attempt DMs', async () => {
    const mockDMChannel = { send: jest.fn() };
    mockUser.createDM.mockResolvedValue(mockDMChannel);
    mockSelectedUser.user.createDM.mockResolvedValue(mockDMChannel);

    mockGuild.members.cache.filter.mockReturnValue({
      size: 1,
      random: jest.fn().mockReturnValue(mockSelectedUser)
    });

    await coffeeCommand.execute(mockInteraction);
    
    expect(mockInteraction.editReply).toHaveBeenCalledWith({
      content: `☕ Setting up a coffee chat with ${mockSelectedUser.displayName}...`
    });
    
    expect(mockUser.createDM).toHaveBeenCalled();
    expect(mockSelectedUser.user.createDM).toHaveBeenCalled();
    expect(mockDMChannel.send).toHaveBeenCalledTimes(2);
  });

  it('should handle DM creation errors gracefully', async () => {
    mockUser.createDM.mockRejectedValue(new Error('DM failed'));
    
    mockGuild.members.cache.filter.mockReturnValue({
      size: 1,
      random: jest.fn().mockReturnValue(mockSelectedUser)
    });

    await coffeeCommand.execute(mockInteraction);
    
    // Should fall back to editing reply with public message
    expect(mockInteraction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('Coffee Chat Time!')
      })
    );
  });
});