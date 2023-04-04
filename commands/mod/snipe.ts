import { Command } from '../../classes';
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'snipe',

    category: 'MISC',
    description: 'Snipe.',
    defaultPermission: false,
    permissions: ['ADMINISTRATOR'],

    callback: async ({ channel, interaction, instance }) => {
        let data = instance.snipe.get(channel.id);
        if (!data) return channel.send('there is nothing to snipe.');
        const output = new EmbedBuilder()
            .setAuthor({
                name: data.author.tag,
                iconURL: data.author.displayAvatarURL()
            })
            .setTitle(data.author.username)
            .setColor('Random')
            .setDescription(data.content)
            .setFooter({
                text: `Created at: ${data.createdTimestamp.toString()}`
            });
        await interaction.reply({
            embeds: [output]
        });
    }
} as Command;
