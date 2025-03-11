// jobStore.js
const { Redis } = require("ioredis");

const redis = new Redis({ host: "redis" });

class JobStore {
  async createJob(data) {
    const id = await redis.incr("job:id:counter");
    await redis.hmset(`job:${id}`, {
      id,
      status: "pending",
      data: JSON.stringify(data),
      errors: JSON.stringify([]),
      results: JSON.stringify([]),
    });
    return { id, ...data };
  }

  // jobStore.js
  async getJob(id) {
    const jobData = await redis.hgetall(`job:${id}`);
    if (Object.keys(jobData).length === 0) return null; // Handle empty Redis responses
    return {
      ...jobData,
      data: JSON.parse(jobData.data),
      errors: JSON.parse(jobData.errors),
      results: JSON.parse(jobData.results),
    };
  }

  async updateJobStatus(id, status, errors = []) {
    await redis.hmset(`job:${id}`, {
      status,
      errors: JSON.stringify(errors),
    });
  }

  async addResult(id, storeId, imageUrl, perimeter) {
    const job = await this.getJob(id);
    job.results.push({ store_id: storeId, image_url: imageUrl, perimeter });
    await redis.hmset(`job:${id}`, {
      results: JSON.stringify(job.results),
    });
  }
}

module.exports = new JobStore();
