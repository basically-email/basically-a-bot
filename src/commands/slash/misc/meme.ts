import { Command } from '../../../classes';
import axios from 'axios';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export default {
	name: 'meme',
	description: 'Sends a meme.',
	category: 'MISC',
	permissions: [],

	callback: async ({ interaction }) => {
		const meme = await (
			await axios.get('https://meme-api.herokuapp.com/gimme')
		).data;

		const embed = new MessageEmbed()
			.setAuthor({
				name: meme.author
			})
			.setTitle(meme.title)
			.setURL(meme.postLink)
			.setImage(meme.preview[meme.preview.length - 1]);

		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel('Next Meme')
				.setStyle('SUCCESS')
				.setCustomId('next-meme')
		);

		await interaction.reply({
			embeds: [embed],
			components: [row]
		});
	}
} as Command;
