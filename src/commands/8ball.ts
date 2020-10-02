import Discord from 'discord.js';
import { colors } from '@lib/colors';
import DiscordClient from '@class/DiscordClient';
exports.run = async (client: DiscordClient, message: Discord.Message, args: any, level: any) => {
  const prefix = message.guild === null ? ';;' : client.getSettings(message.guild.id).prefix;
  const results = ['Yes.', 'No.', 'Maybe.']
  const result = results[Math.floor(Math.random() * results.length)]
  const input = args.join(' ')

  if (!input) {
    const embed = new Discord.MessageEmbed()
      .setColor(colors.red)
      .setTitle('Invalid Syntax')
      .setDescription(`\`${prefix}8ball [message]\`\n\nIf question contains "who" or "whose", a random member from the guild will be chosen.`)

    message.channel.send(embed)
  } else {
    if (message.content.includes('who') || message.content.includes('Who')) {
      if (message.channel.type === 'dm') {
        const member = ['You.', 'Me.']
        const result = member[Math.floor(Math.random() * member.length)]
        message.channel.send(`${result}`)
      }
      // @ts-ignore
      var member = message.guild.members.random().displayName
      message.channel.send(`${member}.`)
    } else {
      message.channel.send(result)
    }
  }
}

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: false,
  permLevel: 'User'
}

exports.help = {
  name: '8ball',
  category: 'Utility',
  description: 'Ask the mighty 8ball a question.',
  usage: '8ball <question>'
}
