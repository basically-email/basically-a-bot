import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Command } from '../../../classes';

export default {
	name: 'game',
	category: 'MISC',
	description: 'Jobless? Want to click a button? Here!',

	callback: async ({ interaction, member, client }) => {
		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setLabel('Anger')
				.setStyle('DANGER')
				.setCustomId('game-btn1'),

			new MessageButton()
				.setLabel('Happy')
				.setStyle('SUCCESS')
				.setCustomId('game-btn2'),

			new MessageButton()
				.setLabel('Not Really Happy')
				.setStyle('PRIMARY')
				.setCustomId('game-btn3'),

			new MessageButton()
				.setLabel('Sad')
				.setStyle('SECONDARY')
				.setCustomId('game-btn4')
		]);

		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('Click the buttons!')
					.setDescription(
						"Click the **RED** if you're angry!\nClick the **GREEN** if you're really happy!\nClick the **BLUE** if you're not really happy!\nClick the **GREY** if you're sad!"
					)
					.setColor('GREY')
					.setAuthor({
						name: member.displayName,
						iconURL: member.displayAvatarURL({ dynamic: true })
					})
			],
			components: [row]
		});
	}
} as Command;
