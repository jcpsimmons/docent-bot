import { IScheduledJob } from "../types/IScheduledJob.js";

/**
 * Example scheduled job that runs every minute
 * This is a template/example - you can remove or modify it
 */
export const exampleJob: IScheduledJob = {
  name: "example-job",
  // Cron expression: "* * * * *" means every minute
  // Format: minute hour day-of-month month day-of-week
  // Examples:
  //   "*/5 * * * *"  - every 5 minutes
  //   "0 * * * *"    - every hour at minute 0
  //   "0 0 * * *"    - every day at midnight
  //   "0 0 * * 0"    - every Sunday at midnight
  //   "0 9 * * 1-5"  - every weekday at 9am
  schedule: "* * * * *",
  description: "Example job that logs a message every minute",
  
  async execute() {
    console.log(`Example job executed at ${new Date().toISOString()}`);
    // Add your scheduled task logic here
    // This can be any function - send messages, update data, call APIs, etc.
  },
};
