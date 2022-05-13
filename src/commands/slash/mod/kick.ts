import { MessageEmbed } from 'discord.js';
import { Command } from '../../../classes';

export default {
	name: 'kick',
	category: 'MODERATION',
	description: 'Kicks the mentioned user.',

	permissions: ['KICK_MEMBERS'],

	options: [
		{
			name: 'user',
			description: 'The user that gets kicked.',
			type: 'USER',
			required: true
		},
		{
			name: 'reason',
			description: "The reason you're kicking this person.",
			type: 'STRING'
		}
	],

	callback: async ({ interaction, client }) => {
		const user = interaction.options.getUser('user')!;
		const serverMember = interaction.guild?.members.cache.get(user.id)!;

		let reason: string;

		reason = interaction.options.getString('reason') as string;

		if (!reason) reason = 'No reason provided';

		if (serverMember.user.id === client.user?.id) {
			await interaction.reply({
				content: `I cannot kick myself, sire.`,
				ephemeral: true
			});
			return;
		}

		if (!serverMember.kickable) {
			await interaction.reply({
				content: `I'm not able to kick ${serverMember.displayName}`,
				ephemeral: true
			});
			return;
		}

		const interactionReply = new MessageEmbed()
			.setTitle('SUCCESS')
			.setColor('GREEN')
			.setDescription(
				`${user.username} has been kicked from the server.\nReason: ${reason}`
			);

		if (serverMember.user.bot) {
			serverMember.kick(reason);
			await interaction.reply({
				embeds: [interactionReply]
			});
			return;
		}

		const embed = new MessageEmbed()
			.setTitle(`Kicked from ${interaction.guild?.name}`)
			.setDescription(
				`You were kicked from ${interaction.guild?.name}\nReason: ${reason}`
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
				serverMember.kick(reason).then((member) => {
					interaction.reply({
						embeds: [interactionReply]
					});
				});
			});
	}
} as Command;
