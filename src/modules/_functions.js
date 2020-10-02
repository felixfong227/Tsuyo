const Discord = require("discord.js");
import logger from '@modules/logger';

module.exports = (client) => {
  // Returns the author's permission level

  Object.defineProperty(String.prototype, "toProperCase", {
    value: function () {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });

  Object.defineProperty(Array.prototype, "average", {
    value: function () {
      return this.reduce((a, b) => a + b, 0) / this.length;
    }
  });

  Object.defineProperty(Array.prototype, "random", {
    value: function () {
      return this[Math.floor(Math.random() * this.length + 1) - 1];
    }
  });


  process.on("uncaughtException", (err) => {
    logger.error(err.stack);
    client.destroy();
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    logger.error(err);
    console.log(err.stack);
  });

  process.on("exit", () => {
    client.destroy();
    client = null;
  });
};
