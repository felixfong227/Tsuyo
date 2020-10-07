const fs = require('fs');
import Discord from 'discord.js';
import { join } from 'path';
import logger from '@modules/logger';

import DiscordClient from '@class/DiscordClient';

interface TextRemovealOperaction {
  // The reason why that text message violated this community's guideline
  reason: string,
}

async function removeMessage(message: Discord.Message, option: TextRemovealOperaction) {
  try {

    const { reason } = option;

    // Delete the censored word
    message.delete({
      reason,
    });

    // Give the user a warning
    message.channel.send('owo')

  } catch (err) {
    throw new Error(err);
  }
}

module.exports = (client: DiscordClient, message: Discord.Message) => {
  if (message.guild === null) return

  const swearListPath = join(__dirname, '../../../data/swearwords.txt');

  // 0 for off
  const swearList = fs.readFileSync(swearListPath, "utf-8");
  const words = swearList.split("\n")

  if (client.getSettings(message.guild.id).censor === "1") { // Only swear
    if (words.includes(message.content.toLowerCase())) {
      removeMessage(message, {
        reason: 'A bad word has detected, thus violated this community\'s guideline'
      });
    }
  }

  if (client.getSettings(message.guild.id).censor === "2") { // Invite links
    if (message.content.toLowerCase().includes("discord.gg") || message.content.toLowerCase().includes("discordapp.com/invite")) {
      removeMessage(message, {
        reason: 'A Discord invite link has sent, thus violated this community\'s guideline'
      });
    }
  }

  if (client.getSettings(message.guild.id).censor === "3") { // Swear and invite links
    if (message.content.toLowerCase().includes("discord.gg") || message.content.toLowerCase().includes("discordapp.com/invite") || words.includes(message.content.toLowerCase() + "\r")) {
      removeMessage(message, {
        reason: 'A Discord invite link has sent or a bad word has detected, thus violated this community\'s guideline'
      });
    }
  }
}
