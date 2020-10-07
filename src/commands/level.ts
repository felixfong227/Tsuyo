import BotConfig from '@bot_config';
import DiscordClient from '@class/DiscordClient';
import Discord from 'discord.js';

exports.run = async (client: DiscordClient, message: Discord.Message, args: any, level: any) => {
  try {
    const friendly = BotConfig.permLevels.find((l: any) => l.level === level).name
    message.reply(`your permission level is ${level} (${friendly}).`)
  } catch (err) {
    message.channel.send('There was an error!\n' + err).catch()
  }
}

exports.conf = {
  enabled: true,
  aliases: ['perms'],
  guildOnly: false,
  permLevel: 'User'
}

exports.help = {
  name: 'level',
  category: 'Utility',
  description: 'Returns your permission level.',
  usage: 'level'
}
