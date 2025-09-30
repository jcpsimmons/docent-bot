import { IScheduledJob } from "../types/IScheduledJob.js";

/**
 * Example: Daily reminder job
 * This job would send a message to a Discord channel every day at 9am
 * 
 * To use this job:
 * 1. Uncomment the code in the execute function
 * 2. Replace CHANNEL_ID with your actual channel ID
 * 3. Add this job to the jobs array in src/jobs/index.ts
 */
export const dailyReminderJob: IScheduledJob = {
  name: "daily-reminder",
  schedule: "0 9 * * *", // Every day at 9am
  description: "Sends a daily reminder to a specific channel",
  
  async execute() {
    // NOTE: To use this, you'll need to import the Discord client from index.ts
    // or pass it as a parameter. For now, this is just a template.
    
    console.log("Daily reminder job triggered at", new Date().toISOString());
    
    // Example implementation (uncomment and modify to use):
    /*
    try {
      const client = // ... get your Discord client instance
      const channel = await client.channels.fetch("YOUR_CHANNEL_ID_HERE");
      
      if (channel?.isTextBased()) {
        await channel.send("📅 Good morning! Here's your daily reminder!");
      }
    } catch (error) {
      console.error("Error sending daily reminder:", error);
    }
    */
  },
};
