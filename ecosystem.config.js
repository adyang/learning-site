module.exports = {
  apps : [{
    name      : 'learning-site',
    script    : 'npm',
    args      : 'start',
    env: {
      NODE_ENV: 'production'
    }
  }],
};
