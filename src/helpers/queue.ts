import {
  Queue,
  QueueEvents,
  QueueOptions,
  QueueScheduler,
  Worker,
} from 'bullmq';

const connection = {
  host: 'containers-us-west-27.railway.app',
  port: 6442,
  password: 'gZ6GfCYgUaj4MPj7VadF',
  username: 'default',
};

const queueOptions: QueueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
};

export const notifyScheduler = new QueueScheduler('Notify', queueOptions);

export const notifyQueue = new Queue('Notify', { connection });

export const notifyWorker = new Worker(
  'Notify',
  async (job) => {
    if (job.name === 'push-notify') {
      console.log('queue data', job.data);
    }
  },
  { connection },
);

const notifyEvents = new QueueEvents('notify', { connection });

notifyEvents.on('waiting', (job) => {
  console.log('waiting: ', job);
});

notifyEvents.on('drained', (job) => {
  console.log('drained: ', job);
});

notifyEvents.on('completed', (job) => {
  console.log('completed: ', job);
});

notifyEvents.on('failed', (job) => {
  console.log('failed: ', job);
});
