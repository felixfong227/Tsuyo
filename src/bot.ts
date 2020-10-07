// Copyright 2020 Cytrus-RE Developers
// You may use the code, but please do credit us.
// import 'module-alias/register';

import DiscordClientClass from '@class/DiscordClient';
import BotConfig from '@bot_config';

require('module-alias/register')
const fs = require("fs");
const path = require("path");

// Check if the Node version is 14+
if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Tsuyo requires Node 12 or higher. Re-run the bot with Node 12 or higher.");
if (process.env.PREBOOT) eval(process.env.PREBOOT); // Execute anything in the preboot variable

// Checks if a .env file exits
const ENV_FILE_PATH = path.join(`${__dirname}/../../.env`);

fs.existsSync(ENV_FILE_PATH)
	? require("dotenv").config()
	: null;

// Define NPM modules
import Discord from 'discord.js';
const Enmap = require("enmap");

// Define client
const client = new DiscordClientClass();

require("./modules/commands")(client); // Import command module
require("./modules/events")(client); // Import events module
require("./modules/_functions")(client); // Import functions

// Cache the permissions
for (let i = 0; i < BotConfig.permLevels.length; i++) {
	let currentlevel = BotConfig.permLevels[i];
	client.levelCache[currentlevel.name] = currentlevel.level;
}

if (!process.env.BOT_TOKEN) {
	throw new Error('A BOT_TOKEN environment variable is required');
}

client.login(process.env.BOT_TOKEN);

console.log("Logged into Discord API!");
// Set status to Loading
//client.user.setStatus("idle");
//client.user.setActivity("Loading...");

module.exports = client;
