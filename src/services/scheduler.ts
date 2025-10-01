import * as cron from "node-cron";
import { IScheduledJob } from "../types/IScheduledJob.js";

/**
 * Scheduler service for managing cron jobs
 * Allows scheduling any function to run at specified intervals using cron syntax
 */
class Scheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Register a new scheduled job
   * @param job - The job configuration
   * @returns True if the job was registered successfully, false if a job with the same name already exists
   */
  register(job: IScheduledJob): boolean {
    if (this.jobs.has(job.name)) {
      console.error(`Job with name "${job.name}" is already registered`);
      return false;
    }

    // Validate cron expression
    if (!cron.validate(job.schedule)) {
      console.error(`Invalid cron expression "${job.schedule}" for job "${job.name}"`);
      return false;
    }

    // Create and start the scheduled task
    const task = cron.schedule(job.schedule, async () => {
      try {
        console.log(`Running scheduled job: ${job.name}`);
        await job.execute();
      } catch (error) {
        console.error(`Error executing scheduled job "${job.name}":`, error);
      }
    });

    this.jobs.set(job.name, task);
    console.log(`Registered scheduled job: ${job.name} (${job.schedule})${job.description ? ` - ${job.description}` : ''}`);
    return true;
  }

  /**
   * Unregister a scheduled job
   * @param name - The name of the job to unregister
   * @returns True if the job was unregistered, false if it wasn't found
   */
  unregister(name: string): boolean {
    const task = this.jobs.get(name);
    if (!task) {
      console.error(`Job with name "${name}" not found`);
      return false;
    }

    task.stop();
    this.jobs.delete(name);
    console.log(`Unregistered scheduled job: ${name}`);
    return true;
  }

  /**
   * Get all registered job names
   */
  getJobNames(): string[] {
    return Array.from(this.jobs.keys());
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll(): void {
    for (const [name, task] of this.jobs.entries()) {
      task.stop();
      console.log(`Stopped scheduled job: ${name}`);
    }
    this.jobs.clear();
  }

  /**
   * Start a previously stopped job
   * @param name - The name of the job to start
   * @returns True if the job was started, false if it wasn't found
   */
  start(name: string): boolean {
    const task = this.jobs.get(name);
    if (!task) {
      console.error(`Job with name "${name}" not found`);
      return false;
    }

    task.start();
    console.log(`Started scheduled job: ${name}`);
    return true;
  }

  /**
   * Stop a running job (without unregistering it)
   * @param name - The name of the job to stop
   * @returns True if the job was stopped, false if it wasn't found
   */
  stop(name: string): boolean {
    const task = this.jobs.get(name);
    if (!task) {
      console.error(`Job with name "${name}" not found`);
      return false;
    }

    task.stop();
    console.log(`Stopped scheduled job: ${name}`);
    return true;
  }
}

// Export a singleton instance
export const scheduler = new Scheduler();
