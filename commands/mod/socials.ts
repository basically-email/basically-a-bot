import { Command } from '../../classes';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    name: 'socials',

    category: 'MOD',
    description: 'Sends a message with all the socials of basically.email',

    defaultPermission: false,
    permissions: ['ADMINISTRATOR'],

    callback: async ({ channel, member }) => {
        if (
            ![
                '532914066558156800',
                '688308495384313866',
                '892689836249591849'
            ].includes(member.id)
        )
            return;

        await channel.send({
            content:
                'https://media.discordapp.net/attachments/978964101193683014/982201479781822464/unknown.png',
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Website')
                        .setURL('https://www.basically.email/'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Twitter')
                        .setURL('https://basically.email/twitter'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('GitHub')
                        .setURL('https://basically.email/github')
                ),
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Instagram')
                        .setURL('https://basically.email/insta'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('LinkedIn')
                        .setURL('https://basically.email/linkedin')
                )
            ]
        });
    }
} as Command;
