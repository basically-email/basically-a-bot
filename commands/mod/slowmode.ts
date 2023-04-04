import { ApplicationCommandOptionType, ChannelType, TextBasedChannel } from 'discord.js';
import { Command } from '../../classes';

export default {
	name: 'slowmode',
	description: 'Toggle slow-mode off / on in any channel',

	options: [
		{
			name: 'channel',
			type: ApplicationCommandOptionType.Channel,
			description: 'The channel to toggle on / off slowmode'
		},
		{
			name: 'duration',
			type: ApplicationCommandOptionType.Number,
			description: 'The number of seconds of the slow-mode'
		}
	],

	category: 'MOD',
	permissions: ['MANAGE_CHANNELS'],

	callback: async ({ interaction, channel }) => {
		let chnl = interaction.options.getChannel(
			'channel'
		) as TextBasedChannel;

		if (!chnl) {
			chnl = channel;
		}

		const duration = interaction.options.getNumber('duration');

		if (chnl.type === ChannelType.DM || chnl.type === ChannelType.GuildAnnouncement) return;

		if (!duration) {
			await chnl.setRateLimitPerUser(0);
			await interaction.reply({
				content: `Set SlowMode to 0 seconds.`
			});
			return;
		}

		await chnl.setRateLimitPerUser(duration);

		await interaction.reply({
			content: `Set SlowMode to ${duration} seconds!`
		});
	}
} as Command;
