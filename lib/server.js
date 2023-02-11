const getBuildId = () =>
  process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'development';

module.exports = {
  getBuildId,
};
