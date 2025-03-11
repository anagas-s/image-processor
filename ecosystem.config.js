module.exports = {
  apps: [
    { script: "server.js", name: "api" },
    { script: "jobProcessor.js", name: "worker" },
  ],
};
