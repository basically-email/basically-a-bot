import axios from 'axios';

import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { TextCommand } from '../../classes';

export default {
	name: 'meme',
	callback: async ({ channel }) => {
		const meme = await axios.get('https://meme-api.herokuapp.com/gimme');

		const embed = new MessageEmbed()
			.setAuthor({
				name: meme.data.author
			})
			.setTitle(meme.data.title)
			.setURL(meme.data.postLink)
			.setImage(meme.data.preview[meme.data.preview.length - 1]);

		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel('Next Meme')
				.setCustomId('next-meme')
				.setStyle('SUCCESS')
		);

		await channel.send({
			embeds: [embed],
			components: [row]
		});
	}
} as TextCommand;
