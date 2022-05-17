import { TextCommand } from '../../classes';
import { MessageEmbed } from 'discord.js';

export default {
    name: 'snipe',

    callback: async ({ channel, message, instance }) => {
        let data = instance.snipe.get(message.channel.id);
        if (!data) return channel.send('there is nothing to snipe.');
        const output = new MessageEmbed()
            .setAuthor({
                name: data.author.tag,
                iconURL: data.author.displayAvatarURL()
            })
            .setTitle(data.author.username)
            .setColor('RANDOM')
            .setDescription(data.content)
            .setFooter({
                text: `Created at: ${data.createdTimestamp.toString()}`
            });
        channel.send({
            embeds: [output]
        });
    }
} as TextCommand;
