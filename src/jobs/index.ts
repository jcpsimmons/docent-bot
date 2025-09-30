import { IScheduledJob } from "../types/IScheduledJob.js";

/**
 * Central registry of all scheduled jobs
 * 
 * To add a new scheduled job:
 * 1. Create a new file in this directory (e.g., myJob.ts)
 * 2. Implement the IScheduledJob interface
 * 3. Import it below and add it to the jobs array
 */

// Import individual jobs here
// import { exampleJob } from "./example.js";

/**
 * Array of all scheduled jobs to be registered
 */
export const jobs: IScheduledJob[] = [
  // Add jobs here
  // exampleJob,
];
