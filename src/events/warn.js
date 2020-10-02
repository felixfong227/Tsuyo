import logger from '@modules/logger';
module.exports = async (client, warn) => {
  if (JSON.stringify(warn).toLowerCase().includes("discordapierror")) return;
  logger.log(warn, "warn");
};
