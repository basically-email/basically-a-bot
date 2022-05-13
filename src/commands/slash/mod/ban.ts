import { MessageEmbed } from 'discord.js';
import { Command } from '../../../classes';

export default {
	name: 'ban',
	category: 'MODERATION',
	description: 'Bans the mentioned user.',
	permissions: ['BAN_MEMBERS'],
	options: [
		{
			name: 'user',
			description: 'The user that gets banned.',
			type: 'USER',
			required: true
		},
		{
			name: 'delete_messages',
			description: 'How much of the recent message history to delete.',
			type: 'STRING',
			required: true,
			choices: [
				{
					name: "Don't Delete Any",
					value: '0'
				},
				{
					name: 'Previous 24 Hours',
					value: '1'
				},
				{
					name: 'Previous 7 Days',
					value: '7'
				}
			]
		},
		{
			name: 'reason',
			description: "The reason you're banning this person.",
			type: 'STRING'
		}
	],

	callback: async ({ interaction, client }) => {
		const user = interaction.options.getUser('user')!;
		const serverMember = interaction.guild?.members.cache.get(user.id)!;

		let reason: string | undefined;
		let days: any;

		reason = interaction.options.getString('reason') as string | undefined;
		days = interaction.options.getString('delete_messages');

		if (!reason) reason = 'No reason provided';

		if (serverMember.user.id === client.user?.id) {
			await interaction.reply({
				content: `I cannot ban myself, sire.`,
				ephemeral: true
			});
			return;
		}

		if (!serverMember.bannable) {
			await interaction.reply({
				content: `I'm not able to ban ${serverMember.displayName}`,
				ephemeral: true
			});
			return;
		}

		const interactionReply = new MessageEmbed()
			.setTitle('SUCCESS')
			.setColor('GREEN')
			.setDescription(
				`${user.username} has been banned from the server.\nReason: ${reason}`
			);

		if (serverMember.user.bot) {
			serverMember.ban({
				reason: reason,
				days: days as number
			});
			await interaction.reply({
				embeds: [interactionReply]
			});
			return;
		}

		const embed = new MessageEmbed()
			.setTitle(`Banned from ${interaction.guild?.name}`)
			.setDescription(
				`You were banned from ${interaction.guild?.name}\nReason: ${reason}`
			)
			.setColor('BLUE');

		serverMember
			.createDM()
			.then((channel) =>
				channel.send({
					embeds: [embed]
				})
			)
			.then((message) => {
				serverMember
					.ban({
						reason: reason,
						days: days as number
					})
					.then((member) => {
						interaction.reply({
							embeds: [interactionReply]
						});
					});
			})
			.catch(console.error);
	}
} as Command;
