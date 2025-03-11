const express = require("express");
const { Queue } = require("bullmq");
const JobStore = require("./jobStore");

const app = express();
app.use(express.json());

const jobQueue = new Queue("imageProcessingQueue", {
  connection: { host: "redis", port: 6379 },
});

// Remove in-memory job creation
app.post("/api/submit", async (req, res) => {
  const { count, visits } = req.body;
  if (!count || !visits || count !== visits.length) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const job = await JobStore.createJob({ count, visits }); // Now async
  await jobQueue.add("processImages", { jobId: job.id, visits });
  res.status(201).json({ job_id: job.id });
});

// server.js
app.get("/api/status", async (req, res) => {
  const { jobid } = req.query;
  const job = await JobStore.getJob(jobid);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  // Include results in the response
  res.json({
    status: job.status,
    job_id: job.jobId,
    results: job.results || [], // Ensure results are included
    errors: job.errors || [],
  });
});
app.listen(3000, () => console.log("Server running on port 3000"));
