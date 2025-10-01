/**
 * Interface for a scheduled job that can be registered with the scheduler
 */
export interface IScheduledJob {
  /** Unique identifier for the job */
  name: string;
  
  /** Cron expression (e.g., "* /5 * * * *" for every 5 minutes) */
  schedule: string;
  
  /** The function to execute when the schedule triggers */
  execute: () => void | Promise<void>;
  
  /** Optional description of what the job does */
  description?: string;
}
