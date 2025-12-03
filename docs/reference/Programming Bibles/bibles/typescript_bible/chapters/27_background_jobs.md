<!-- SSM:CHUNK_BOUNDARY id="ch27-start" -->
📘 CHAPTER 27 — BACKGROUND JOBS 🔴 Advanced

### 27.1 Worker Types

Type-safe worker communication:

Example:

```typescript
type WorkerMessage =
  | { type: "process"; data: ProcessData }
  | { type: "complete"; result: ProcessResult };

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type === "process") {
    // Handle process
  }
};
```

### 27.2 Job Queues

**Type-Safe Job Queue with Bull/BullMQ:**

```typescript
import Queue from "bull";

interface JobData {
  userId: string;
  email: string;
  template: "welcome" | "reset-password";
}

interface JobResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const emailQueue = new Queue<JobData>("email", {
  redis: { host: "localhost", port: 6379 },
});

// Producer
async function sendEmail(data: JobData): Promise<void> {
  await emailQueue.add("send-email", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
}

// Consumer
emailQueue.process("send-email", async (job): Promise<JobResult> => {
  const { userId, email, template } = job.data;
  
  try {
    const messageId = await sendEmailTemplate(email, template);
    return { success: true, messageId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
});
```

### 27.3 Scheduling Patterns

**Cron Jobs with TypeScript:**

```typescript
import cron from "node-cron";

interface ScheduledTask {
  name: string;
  schedule: string;
  handler: () => Promise<void>;
}

const tasks: ScheduledTask[] = [
  {
    name: "daily-report",
    schedule: "0 0 * * *", // Every day at midnight
    handler: async () => {
      await generateDailyReport();
    },
  },
  {
    name: "cleanup",
    schedule: "0 2 * * *", // Every day at 2 AM
    handler: async () => {
      await cleanupOldData();
    },
  },
];

function startScheduledTasks(): void {
  for (const task of tasks) {
    cron.schedule(task.schedule, async () => {
      try {
        await task.handler();
      } catch (error) {
        console.error(`Task ${task.name} failed:`, error);
      }
    });
  }
}
```

### 27.4 Error Handling in Workers

**Robust Worker Error Handling:**

```typescript
type WorkerTask<TInput, TOutput> = {
  input: TInput;
  onSuccess: (output: TOutput) => void;
  onError: (error: Error) => void;
  retries: number;
  maxRetries: number;
};

async function executeWorkerTask<TInput, TOutput>(
  task: WorkerTask<TInput, TOutput>,
  processor: (input: TInput) => Promise<TOutput>
): Promise<void> {
  try {
    const output = await processor(task.input);
    task.onSuccess(output);
  } catch (error) {
    if (task.retries < task.maxRetries) {
      // Retry with exponential backoff
      const delay = Math.pow(2, task.retries) * 1000;
      setTimeout(() => {
        executeWorkerTask(
          { ...task, retries: task.retries + 1 },
          processor
        );
      }, delay);
    } else {
      task.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch27-end" -->
