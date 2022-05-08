import {
	Interaction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed
} from 'discord.js';
import { Event } from '../classes';
import axios from 'axios';

export default {
	name: 'interactionCreate',
	once: false,

	callback: async ({}, interaction: Interaction) => {
		if (interaction.isButton()) {
			const { customId } = interaction;
			const message = interaction.message as Message;

			if (customId === 'next-meme') {
				await interaction.deferUpdate();

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

				await message.edit({
					embeds: [embed],
					components: [row]
				});
			} else if (
				['game-btn1', 'game-btn2', 'game-btn3', 'game-btn4'].includes(
					customId
				)
			) {
				await interaction.deferUpdate();

				let clicks: number;

				if (message.embeds[0]!.title === 'Click the buttons!') {
					clicks = 0;
				} else {
					clicks = message.embeds[0]!.title!.split(
						/ +/
					)[3] as unknown as number;
				}

				clicks++;

				let title;

				if (clicks === 1) {
					title = `Yes Keep Going! ${clicks} Click!`;
				} else {
					title = `Yes Keep Going! ${clicks} Clicks!`;
				}

				await message.edit({
					embeds: [
						new MessageEmbed()
							.setTitle(title)
							.setDescription(
								"Click the **RED** if you're angry!\nClick the **GREEN** if you're really happy!\nClick the **BLUE** if you're not really happy!\nClick the **GREY** if you're sad!\n\nOne more time!"
							)
					],
					components: message.components
				});
			}
		}
	}
} as Event;
