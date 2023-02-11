const getBuildId = () => process.env.GITHUB_SHA || 'development';

module.exports = {
  getBuildId,
};
