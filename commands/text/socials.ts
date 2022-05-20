import { TextCommand } from '../../classes';
import { MessageActionRow, MessageButton } from 'discord.js';

export default {
    name: 'socials',

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
                'https://media.discordapp.net/attachments/975999722974220358/977142056327725056/unknown.png',
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Website')
                        .setURL('https://www.basically.email/'),
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Twitter')
                        .setURL('https://basically.email/twitter'),
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('GitHub')
                        .setURL('https://basically.email/github')
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Instagram')
                        .setURL('https://basically.email/insta'),
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('LinkedIn')
                        .setURL('https://basically.email/linkedin')
                )
            ]
        });
    }
} as TextCommand;
