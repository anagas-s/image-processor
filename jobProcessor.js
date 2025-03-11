// jobProcessor.js
const { Worker } = require("bullmq");
const https = require("https");
const axios = require("axios");
const sizeOf = require("image-size").default || require("image-size"); // Ensure this line exists
const { promisify } = require("util");
const sleep = promisify(setTimeout);
const JobStore = require("./jobStore");
const storeValidator = require("./utils/storeValidator");

const processImages = async (job) => {
  const { jobId, visits } = job.data;
  const errors = [];

  await JobStore.updateJobStatus(jobId, "ongoing");

  for (const visit of visits) {
    if (!storeValidator.isValidStore(visit.store_id)) {
      errors.push({ store_id: visit.store_id, error: "Invalid store_id" });
      continue;
    }

    for (const url of visit.image_url) {
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer", // Returns ArrayBuffer
          maxRedirects: 5,
          validateStatus: (status) => status >= 200 && status < 303,
          timeout: 10000,
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        });

        // Convert ArrayBuffer to Buffer
        const buffer = Buffer.from(response.data);

        const { width, height } = sizeOf(buffer); // Pass Buffer instead
        const perimeter = 2 * (width + height);
        console.log(`Calculated perimeter: ${perimeter} for image: ${url}`); // Log perimeter
        await sleep(Math.random() * 300 + 100);
        JobStore.addResult(jobId, visit.store_id, url, perimeter);
      } catch (err) {
        console.error("Download error details:", err.message, err.code);
        errors.push({
          store_id: visit.store_id,
          error: `Download failed: ${url} (${err.message || "Unknown error"})`,
        });
      }
    }
  }

  await JobStore.updateJobStatus(
    jobId,
    errors.length ? "failed" : "completed",
    errors
  );
};

new Worker("imageProcessingQueue", processImages, {
  connection: { host: "redis", port: 6379 },
});
