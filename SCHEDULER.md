# Scheduler Documentation

The bot includes a built-in scheduler that allows you to run any function at specified intervals using cron syntax.

## Quick Start

1. Create a new job file in `src/jobs/` (e.g., `src/jobs/myJob.ts`)
2. Implement the `IScheduledJob` interface
3. Import and add your job to the `jobs` array in `src/jobs/index.ts`
4. Restart the bot - jobs are automatically registered on startup

## Creating a Scheduled Job

Create a new file in `src/jobs/`:

```typescript
// src/jobs/dailyReport.ts
import { IScheduledJob } from "../types/IScheduledJob.js";

export const dailyReport: IScheduledJob = {
  name: "daily-report",
  schedule: "0 9 * * *", // Every day at 9am
  description: "Sends a daily report",
  
  async execute() {
    console.log("Generating daily report...");
    // Your scheduled task logic here
  },
};
```

Then register it in `src/jobs/index.ts`:

```typescript
import { dailyReport } from "./dailyReport.js";

export const jobs: IScheduledJob[] = [
  dailyReport,
  // Add more jobs here
];
```

## Cron Syntax

Cron expressions consist of 5 fields:

```
* * * * *
│ │ │ │ │
│ │ │ │ └── Day of week (0-7, where 0 and 7 are Sunday)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)
```

### Common Examples

| Schedule | Description |
|----------|-------------|
| `* * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour at minute 0 |
| `0 0 * * *` | Every day at midnight |
| `0 9 * * *` | Every day at 9am |
| `0 9 * * 1-5` | Every weekday at 9am |
| `0 0 * * 0` | Every Sunday at midnight |
| `0 0 1 * *` | First day of every month at midnight |
| `0 */6 * * *` | Every 6 hours |

### Special Characters

- `*` - Any value
- `,` - Value list separator (e.g., `1,3,5`)
- `-` - Range of values (e.g., `1-5`)
- `/` - Step values (e.g., `*/5`)

## IScheduledJob Interface

```typescript
export interface IScheduledJob {
  /** Unique identifier for the job */
  name: string;
  
  /** Cron expression (e.g., "0 * * * *" for every hour) */
  schedule: string;
  
  /** The function to execute when the schedule triggers */
  execute: () => void | Promise<void>;
  
  /** Optional description of what the job does */
  description?: string;
}
```

## Programmatic Control

You can also control jobs programmatically by importing the scheduler:

```typescript
import { scheduler } from "./services/scheduler.js";

// Register a job dynamically
scheduler.register({
  name: "dynamic-job",
  schedule: "*/10 * * * *",
  execute: async () => {
    console.log("Dynamic job running");
  },
});

// Stop a job (without unregistering)
scheduler.stop("dynamic-job");

// Start a stopped job
scheduler.start("dynamic-job");

// Unregister a job completely
scheduler.unregister("dynamic-job");

// Get all registered job names
const jobNames = scheduler.getJobNames();

// Stop all jobs
scheduler.stopAll();
```

## Use Cases

Common use cases for scheduled jobs:

- **Periodic reminders**: Send daily/weekly reminders to Discord channels
- **Data cleanup**: Clean up old data or temporary files
- **Health checks**: Monitor external services or APIs
- **Automated reports**: Generate and send periodic reports
- **Data synchronization**: Sync data with external systems
- **Maintenance tasks**: Database cleanup, log rotation, etc.

## Example: Discord Channel Reminder

```typescript
import { IScheduledJob } from "../types/IScheduledJob.js";
import { client } from "../index.js"; // Import your Discord client

export const weeklyReminder: IScheduledJob = {
  name: "weekly-reminder",
  schedule: "0 9 * * 1", // Every Monday at 9am
  description: "Sends a weekly reminder to the general channel",
  
  async execute() {
    try {
      const channel = await client.channels.fetch("CHANNEL_ID");
      if (channel?.isTextBased()) {
        await channel.send("📅 It's Monday! Time for our weekly meeting.");
      }
    } catch (error) {
      console.error("Error sending weekly reminder:", error);
    }
  },
};
```

## Best Practices

1. **Error Handling**: Always wrap your job logic in try-catch blocks
2. **Unique Names**: Use descriptive, unique names for each job
3. **Logging**: Log important actions and errors for debugging
4. **Testing**: Test cron expressions using online cron validators
5. **Resource Management**: Be mindful of rate limits and API quotas
6. **Idempotency**: Make jobs idempotent when possible (safe to run multiple times)

## Testing

Jobs are automatically validated when registered. Invalid cron expressions or duplicate job names will be rejected with an error logged to the console.

To test a job without waiting for the schedule:
- Call the `execute()` function directly in your tests
- Use a shorter interval during development (e.g., `* * * * *` for every minute)
- Check the logs to confirm the job is registered correctly

## Troubleshooting

### Job not running

- Verify the cron expression is valid
- Check bot logs for registration errors
- Ensure the job is added to the `jobs` array in `src/jobs/index.ts`
- Confirm the bot has restarted since adding the job

### Invalid cron expression

- Use an online cron validator to test your expression
- Remember: the format is `minute hour day month day-of-week`
- Check for typos and ensure all 5 fields are present

### Duplicate job names

- Each job must have a unique name
- Check that no other job uses the same name
- Job names are case-sensitive
