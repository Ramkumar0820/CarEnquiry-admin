module.exports = {
  apps: [
    {
      name: "Caresale-admin",
      namespace: "Caresale-admin",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 4002,
      },
      cwd: "./", // Replace with your app's root directory if different
      max_memory_restart: "450M", // Restarts if memory usage exceeds 2GB
      instances: 1, // Single instance
      exec_mode: "cluster", // Run in cluster mode
      out_file: "./logs/dynamic365/app-out.log",
      error_file: "./logs/dynamic365/app-error.log",
      log_file: "./logs/dynamic365/app-log.log",
    },
  ],
};
