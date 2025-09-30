import { scheduler } from "../../services/scheduler.js";
import { IScheduledJob } from "../../types/IScheduledJob.js";

describe("Scheduler", () => {
  beforeEach(() => {
    // Clean up any registered jobs before each test
    scheduler.stopAll();
  });

  afterEach(() => {
    // Clean up after each test
    scheduler.stopAll();
  });

  describe("register", () => {
    it("should register a valid job", () => {
      const job: IScheduledJob = {
        name: "test-job",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      const result = scheduler.register(job);

      expect(result).toBe(true);
      expect(scheduler.getJobNames()).toContain("test-job");
    });

    it("should not register a job with duplicate name", () => {
      const job1: IScheduledJob = {
        name: "test-job",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      const job2: IScheduledJob = {
        name: "test-job",
        schedule: "*/5 * * * *",
        execute: jest.fn(),
      };

      scheduler.register(job1);
      const result = scheduler.register(job2);

      expect(result).toBe(false);
      expect(scheduler.getJobNames()).toHaveLength(1);
    });

    it("should not register a job with invalid cron expression", () => {
      const job: IScheduledJob = {
        name: "test-job",
        schedule: "invalid cron",
        execute: jest.fn(),
      };

      const result = scheduler.register(job);

      expect(result).toBe(false);
      expect(scheduler.getJobNames()).not.toContain("test-job");
    });

    it("should register a job with description", () => {
      const job: IScheduledJob = {
        name: "test-job",
        schedule: "* * * * *",
        execute: jest.fn(),
        description: "Test description",
      };

      const result = scheduler.register(job);

      expect(result).toBe(true);
      expect(scheduler.getJobNames()).toContain("test-job");
    });
  });

  describe("unregister", () => {
    it("should unregister an existing job", () => {
      const job: IScheduledJob = {
        name: "test-job",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      scheduler.register(job);
      const result = scheduler.unregister("test-job");

      expect(result).toBe(true);
      expect(scheduler.getJobNames()).not.toContain("test-job");
    });

    it("should return false when unregistering non-existent job", () => {
      const result = scheduler.unregister("non-existent-job");

      expect(result).toBe(false);
    });
  });

  describe("getJobNames", () => {
    it("should return empty array when no jobs registered", () => {
      expect(scheduler.getJobNames()).toEqual([]);
    });

    it("should return all registered job names", () => {
      const job1: IScheduledJob = {
        name: "job1",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      const job2: IScheduledJob = {
        name: "job2",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      scheduler.register(job1);
      scheduler.register(job2);

      const jobNames = scheduler.getJobNames();
      expect(jobNames).toHaveLength(2);
      expect(jobNames).toContain("job1");
      expect(jobNames).toContain("job2");
    });
  });

  describe("stopAll", () => {
    it("should stop and clear all jobs", () => {
      const job1: IScheduledJob = {
        name: "job1",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      const job2: IScheduledJob = {
        name: "job2",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      scheduler.register(job1);
      scheduler.register(job2);

      scheduler.stopAll();

      expect(scheduler.getJobNames()).toEqual([]);
    });
  });

  describe("start", () => {
    it("should start an existing job", () => {
      const job: IScheduledJob = {
        name: "test-job",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      scheduler.register(job);
      scheduler.stop("test-job");
      const result = scheduler.start("test-job");

      expect(result).toBe(true);
    });

    it("should return false when starting non-existent job", () => {
      const result = scheduler.start("non-existent-job");

      expect(result).toBe(false);
    });
  });

  describe("stop", () => {
    it("should stop an existing job", () => {
      const job: IScheduledJob = {
        name: "test-job",
        schedule: "* * * * *",
        execute: jest.fn(),
      };

      scheduler.register(job);
      const result = scheduler.stop("test-job");

      expect(result).toBe(true);
    });

    it("should return false when stopping non-existent job", () => {
      const result = scheduler.stop("non-existent-job");

      expect(result).toBe(false);
    });
  });
});
