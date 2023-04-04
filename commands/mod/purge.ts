import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { Command } from '../../classes';

export default {
	name: 'purge',
	description: 'Clears the amount of messages mentioned. (Defaults to 1)',
	category: 'MODERATION',

	permissions: ['MANAGE_MESSAGES'],

	options: [
		{
			name: 'messages_to_delete',
			description: 'The number of messages you want to be deleted.',
			type: ApplicationCommandOptionType.Number,
			required: false
		}
	],

	callback: async ({ interaction, channel }) => {
		let number = interaction.options.getNumber('messages_to_delete');

		if (!number) number = 1;

		await channel.messages
			.fetch({
				limit: number
			})
			.then((messages) => {
				if (channel.type === ChannelType.DM) {
					return;
				}

				channel.bulkDelete(messages).then(async () => {
					await interaction.reply({
						content: `Deleted ${number} messages successfully!`,
						ephemeral: true
					});
				});
			})
			.catch(async () => {
				await interaction.reply({
					content:
						"I don't have enough permissions to delete the messages in this channel.",
					ephemeral: true
				});
				return;
			});
	}
} as Command;
