import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/ISlashCommand.js";

interface HackerNewsStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
}

async function fetchTopStories(): Promise<HackerNewsStory[]> {
  try {
    // Fetch top story IDs
    const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!topStoriesResponse.ok) {
      throw new Error(`Failed to fetch top stories: ${topStoriesResponse.status}`);
    }
    
    const topStoryIds = await topStoriesResponse.json() as number[];
    const top3Ids = topStoryIds.slice(0, 3);
    
    // Fetch details for top 3 stories
    const storyPromises = top3Ids.map(async (id) => {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      if (!storyResponse.ok) {
        throw new Error(`Failed to fetch story ${id}: ${storyResponse.status}`);
      }
      return storyResponse.json() as Promise<HackerNewsStory>;
    });
    
    return await Promise.all(storyPromises);
  } catch (error) {
    console.error('Error fetching Hacker News stories:', error);
    throw error;
  }
}

function formatStoryResponse(stories: HackerNewsStory[]): string {
  if (stories.length === 0) {
    return "No stories found from Hacker News.";
  }
  
  const formattedStories = stories.map((story, index) => {
    const title = story.title || "No title";
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    const score = story.score || 0;
    const author = story.by || "Unknown";
    
    return `**${index + 1}.** ${title}\n🔗 ${url}\n⬆️ ${score} points by ${author}\n`;
  });
  
  return `📰 **Top 3 Hacker News Headlines Today**\n\n${formattedStories.join('\n')}`;
}

export const technewsCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("technews")
    .setDescription("Get the top 3 headlines from Hacker News"),

  async execute(interaction) {
    try {
      // Defer the reply since API calls might take a moment
      await interaction.deferReply();
      
      const stories = await fetchTopStories();
      const response = formatStoryResponse(stories);
      
      await interaction.editReply(response);
    } catch (error) {
      console.error('Error in technews command:', error);
      
      const errorMessage = "Sorry, I couldn't fetch the latest tech news right now. Please try again later.";
      
      if (interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
};