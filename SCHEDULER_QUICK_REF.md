# Scheduler Quick Reference

## What is the Scheduler?

The scheduler is a service that allows you to run any function at specified time intervals using cron syntax. It's automatically initialized when the bot starts.

## Key Files

- **`src/services/scheduler.ts`** - The scheduler service (singleton)
- **`src/types/IScheduledJob.ts`** - Job interface definition
- **`src/jobs/index.ts`** - Registry of all scheduled jobs
- **`src/jobs/_example.ts`** - Template for creating new jobs
- **`SCHEDULER.md`** - Complete documentation

## Quick Start

### 1. Create a Job

```typescript
// src/jobs/myJob.ts
import { IScheduledJob } from "../types/IScheduledJob.js";

export const myJob: IScheduledJob = {
  name: "my-job",
  schedule: "0 9 * * *", // Every day at 9am
  description: "Description of what this job does",
  
  async execute() {
    console.log("Job running!");
    // Your code here
  },
};
```

### 2. Register the Job

```typescript
// src/jobs/index.ts
import { myJob } from "./myJob.js";

export const jobs: IScheduledJob[] = [
  myJob,
  // Add more jobs here
];
```

### 3. Restart the Bot

Jobs are automatically registered when the bot starts.

## Common Cron Patterns

| Pattern | Description |
|---------|-------------|
| `* * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour |
| `0 9 * * *` | Every day at 9am |
| `0 9 * * 1-5` | Weekdays at 9am |
| `0 0 * * 0` | Sundays at midnight |

## Example Use Cases

1. **Daily reminders** - Send scheduled messages to channels
2. **Data cleanup** - Remove old data periodically
3. **Health monitoring** - Log system metrics
4. **Automated reports** - Generate periodic summaries
5. **Scheduled announcements** - Post updates at specific times

## API Methods

```typescript
import { scheduler } from "./services/scheduler.js";

// Register a job
scheduler.register(job);

// Stop a job (without removing it)
scheduler.stop("job-name");

// Start a stopped job
scheduler.start("job-name");

// Remove a job completely
scheduler.unregister("job-name");

// Get all registered job names
scheduler.getJobNames();

// Stop all jobs
scheduler.stopAll();
```

## Testing

Jobs are tested in `src/__tests__/services/scheduler.test.ts`. The test suite validates:
- Job registration
- Duplicate prevention
- Invalid cron expressions
- Start/stop functionality
- Job listing

Run tests with: `npm test`
