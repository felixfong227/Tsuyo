import Discord, { Message } from 'discord.js';
import { colors } from '@lib/colors';
import DiscordClient from '@class/DiscordClient';
import logger from '@modules/logger';

module.exports = (client: DiscordClient, message: Discord.Message) => {
	if (message.author.bot) return
	if (message.guild === null) return

	const settings = client.getSettings(message.guild.id)
	if (settings.logMessageUpdates == 'true') {
		if (settings.modLogChannel && message.guild.channels.cache.find(c => c.name == settings.modLogChannel)) {
			const modLogChannel = message.guild.channels.cache.find(c => c.name == settings.modLogChannel)

			// If mod log channel is unavailable, just skip this mod logging thing
			if (!modLogChannel) return

			const UserReference = message.guild.me;

			if (!UserReference) {
				return logger.error('Unable to find and locate an user object');
			}

			if (!modLogChannel?.permissionsFor(UserReference)?.has('VIEW_CHANNEL')) return
			if (!modLogChannel?.permissionsFor(UserReference)?.has('SEND_MESSAGES')) return

			const embed = new Discord.MessageEmbed()
				.setAuthor('🗑️ Message deleted')
				.setColor(colors.default)
				.setDescription(`Message deleted by <@${message.author.id}> in ${message.channel}`)
				.addField('Message:', `${message}`)
				.setTimestamp();

			// Check if the mod log channel is a text channel
			if (modLogChannel instanceof Discord.TextChannel) {
				modLogChannel.send(embed);
			}

		}
	}
}
