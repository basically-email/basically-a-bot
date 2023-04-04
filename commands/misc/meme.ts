import { Command } from '../../classes';
import axios from 'axios';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';

export default {
    name: 'meme',
    description: 'Sends a meme.',
    category: 'MISC',
    permissions: [],

    callback: async ({ interaction }) => {
        const meme = await (
            await axios.get('https://meme-api.herokuapp.com/gimme')
        ).data;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: meme.author
            })
            .setTitle(meme.title)
            .setURL(meme.postLink)
            .setImage(meme.preview[meme.preview.length - 1]);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Next Meme')
                .setStyle(ButtonStyle.Success)
                .setCustomId('next-meme')
        );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
} as Command;
