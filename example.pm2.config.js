module.exports = {
  apps: [
    {
      name: 'e-personal',
      exec_mode: 'cluster',
      instances: '1', // Or a number of instances
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      watch: true,
      ignore_watch: ['node_modules', '\\.git', '*.log'],
      env: {
        // environment variables for all environments
      },
    },
  ],
};
