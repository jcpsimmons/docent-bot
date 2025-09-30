import { technewsCommand } from '../../commands/technews.js';
import { createMockInteraction } from '../utils/mockInteraction.js';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('technews command', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('command data', () => {
    it('should have correct name and description', () => {
      expect(technewsCommand.data.name).toBe('technews');
      expect(technewsCommand.data.description).toBe('Get the top 3 headlines from Hacker News');
    });

    it('should have no options', () => {
      const commandJSON = technewsCommand.data.toJSON();
      expect(commandJSON.options || []).toHaveLength(0);
    });
  });

  describe('execute function', () => {
    const mockStories = [
      {
        id: 1,
        title: 'First Test Story',
        url: 'https://example.com/1',
        score: 100,
        by: 'testuser1',
        time: 1234567890
      },
      {
        id: 2,
        title: 'Second Test Story',
        url: 'https://example.com/2',
        score: 75,
        by: 'testuser2',
        time: 1234567891
      },
      {
        id: 3,
        title: 'Third Test Story',
        url: 'https://example.com/3',
        score: 50,
        by: 'testuser3',
        time: 1234567892
      }
    ];

    it('should successfully fetch and format top 3 stories', async () => {
      // Mock the API responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([1, 2, 3, 4, 5]) // Top story IDs
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockStories[0])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockStories[1])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockStories[2])
        });

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      expect(mockInteraction.deferReply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.editReply).toHaveBeenCalledTimes(1);
      
      const response = mockInteraction.editReply.mock.calls[0][0];
      expect(response).toContain('📰 **Top 3 Hacker News Headlines Today**');
      expect(response).toContain('**1.** First Test Story');
      expect(response).toContain('**2.** Second Test Story');
      expect(response).toContain('**3.** Third Test Story');
      expect(response).toContain('https://example.com/1');
      expect(response).toContain('⬆️ 100 points by testuser1');
    });

    it('should handle stories without URLs by using HN links', async () => {
      const storyWithoutUrl = {
        id: 1,
        title: 'Ask HN: How do you test?',
        score: 25,
        by: 'asker',
        time: 1234567890
        // No URL property - this is common for Ask HN posts
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([1])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(storyWithoutUrl)
        });

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      const response = mockInteraction.editReply.mock.calls[0][0];
      expect(response).toContain('🔗 https://news.ycombinator.com/item?id=1');
    });

    it('should handle stories with missing properties gracefully', async () => {
      const incompleteStory = {
        id: 1,
        time: 1234567890
        // Missing title, url, score, by
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([1])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(incompleteStory)
        });

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      const response = mockInteraction.editReply.mock.calls[0][0];
      expect(response).toContain('**1.** No title');
      expect(response).toContain('⬆️ 0 points by Unknown');
      expect(response).toContain('https://news.ycombinator.com/item?id=1');
    });

    it('should handle API failure for top stories', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      expect(mockInteraction.deferReply).toHaveBeenCalledTimes(1);
      expect(mockInteraction.editReply).toHaveBeenCalledWith(
        "Sorry, I couldn't fetch the latest tech news right now. Please try again later."
      );
    });

    it('should handle API failure for individual stories', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([1, 2, 3])
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        });

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      expect(mockInteraction.editReply).toHaveBeenCalledWith(
        "Sorry, I couldn't fetch the latest tech news right now. Please try again later."
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      expect(mockInteraction.editReply).toHaveBeenCalledWith(
        "Sorry, I couldn't fetch the latest tech news right now. Please try again later."
      );
    });

    it('should handle empty stories list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]) // Empty array
      });

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      const response = mockInteraction.editReply.mock.calls[0][0];
      expect(response).toContain('No stories found from Hacker News.');
    });

    it('should handle interaction that fails to defer', async () => {
      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockRejectedValue(new Error('Defer failed'));
      mockInteraction.reply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Sorry, I couldn't fetch the latest tech news right now. Please try again later.",
        ephemeral: true
      });
    });

    it('should fetch exactly 3 stories from the top stories list', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // 10 stories
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockStories[0])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockStories[1])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockStories[2])
        });

      const mockInteraction = createMockInteraction({ deferred: false });
      mockInteraction.deferReply = jest.fn().mockImplementation(() => {
        mockInteraction.deferred = true;
        return Promise.resolve({});
      });
      mockInteraction.editReply = jest.fn().mockResolvedValue({});

      await technewsCommand.execute(mockInteraction);

      // Should call fetch 4 times: 1 for top stories + 3 for individual stories
      expect(mockFetch).toHaveBeenCalledTimes(4);
      
      // Verify the URLs called
      expect(mockFetch).toHaveBeenNthCalledWith(1, 'https://hacker-news.firebaseio.com/v0/topstories.json');
      expect(mockFetch).toHaveBeenNthCalledWith(2, 'https://hacker-news.firebaseio.com/v0/item/1.json');
      expect(mockFetch).toHaveBeenNthCalledWith(3, 'https://hacker-news.firebaseio.com/v0/item/2.json');
      expect(mockFetch).toHaveBeenNthCalledWith(4, 'https://hacker-news.firebaseio.com/v0/item/3.json');
    });

    it('should have execute function that returns a Promise', () => {
      const mockInteraction = createMockInteraction();
      const result = technewsCommand.execute(mockInteraction);
      
      expect(result).toBeInstanceOf(Promise);
    });
  });
});