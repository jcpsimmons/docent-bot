import { IScheduledJob } from "../types/IScheduledJob.js";

/**
 * Example: Periodic health check job
 * This job runs every 5 minutes to log the bot's uptime
 * 
 * To use this job:
 * 1. Uncomment it in src/jobs/index.ts
 */
export const healthCheckJob: IScheduledJob = {
  name: "health-check",
  schedule: "*/5 * * * *", // Every 5 minutes
  description: "Logs bot health metrics every 5 minutes",
  
  async execute() {
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    const memoryUsage = process.memoryUsage();
    const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    console.log(`🔍 Health Check - Uptime: ${uptimeHours}h ${uptimeMinutes}m | Memory: ${memoryMB}MB`);
  },
};
