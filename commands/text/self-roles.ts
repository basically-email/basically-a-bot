import {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu
} from 'discord.js';
import { TextCommand } from '../../classes';

export default {
    name: 'self-roles',
    description: 'Choose your roles!',
    category: 'MISC',

    callback: async ({ message, channel, member }) => {
        // if (
        //     ![
        //         '532914066558156800',
        //         '688308495384313866',
        //         '892689836249591849'
        //     ].includes(member.id)
        // )
        //     return;

        await message.delete();

        await channel.send({
            content: '**Age**',
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setMaxValues(1)
                        .setCustomId('roles-age')
                        .setPlaceholder('Nothing chosen.')
                        .setOptions(
                            {
                                label: 'Gen-Alpha',
                                value: 'roles-age-alpha',
                                emoji: '👦'
                            },
                            {
                                label: 'Gen-Z',
                                value: 'roles-age-gz',
                                emoji: '👦'
                            },
                            {
                                label: 'Millenial',
                                value: 'roles-age-m',
                                emoji: '👨‍🦰'
                            },
                            {
                                label: 'Gen-X',
                                value: 'roles-age-gx',
                                emoji: '🧔‍♂️'
                            }
                        )
                )
            ]
        });

        await channel.send({
            content: '**Pronoun**',
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setMaxValues(1)
                        .setCustomId('roles-pronouns')
                        .setPlaceholder('Nothing chosen.')
                        .addOptions(
                            {
                                label: 'He / Him',
                                value: 'he-him'
                            },
                            {
                                label: 'She / Her',
                                value: 'she-her'
                            },
                            {
                                label: 'They / Them',
                                value: 'they-them'
                            },
                            {
                                label: 'Gender Fluid',
                                value: 'gender-fluid'
                            },
                            {
                                label: 'Neo Pronoun',
                                value: 'neo-pronoun'
                            }
                        )
                )
            ]
        });

        await channel.send({
            content: '**Interest**',
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setMaxValues(12)
                        .setCustomId('roles-interests')
                        .setPlaceholder('Nothing chosen.')
                        .addOptions(
                            {
                                label: 'Web 3',
                                value: 'roles-interests-web3',
                                emoji: '🌐'
                            },
                            {
                                label: 'Startups / VCs',
                                value: 'roles-interests-startups-or-VCs',
                                emoji: '💫'
                            },
                            {
                                label: 'International Affairs',
                                value: 'roles-interests-ia',
                                emoji: '🗞️'
                            },
                            {
                                label: 'Programming',
                                value: 'roles-interests-programming',
                                emoji: '🖥️'
                            },
                            {
                                label: 'Design',
                                value: 'roles-interests-design',
                                emoji: '🎨'
                            },
                            {
                                label: 'Finance',
                                value: 'roles-interests-finance',
                                emoji: '💵'
                            },
                            {
                                label: 'Esports',
                                value: 'roles-interests-esports',
                                emoji: '🎮'
                            },
                            {
                                label: 'Humor',
                                value: 'roles-interests-humor',
                                emoji: '🪅'
                            },
                            {
                                label: 'Space',
                                value: 'roles-interests-space',
                                emoji: '🪐'
                            },
                            {
                                label: 'Technology',
                                value: 'roles-interests-technology',
                                emoji: '🔌'
                            },
                            {
                                label: 'Science',
                                value: 'roles-interests-science',
                                emoji: '🧪'
                            },
                            {
                                label: 'Automobile',
                                value: 'roles-interests-automobile',
                                emoji: '🏎️'
                            }
                        )
                )
            ]
        });

        await channel.send({
            content: '**Location**',
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setMaxValues(1)
                        .setCustomId('roles-location')
                        .setPlaceholder('Nothing chosen.')
                        .addOptions(
                            {
                                label: 'Oceania',
                                value: 'roles-location-oceania'
                            },
                            {
                                label: 'Asia',
                                value: 'roles-location-asia'
                            },
                            {
                                label: 'Europe',
                                value: 'roles-location-eu'
                            },
                            {
                                label: 'North America',
                                value: 'roles-location-na'
                            },
                            {
                                label: 'South America',
                                value: 'roles-location-sa'
                            },
                            {
                                label: 'Africa',
                                value: 'roles-location-africa'
                            }
                        )
                )
            ]
        });

        await channel.send({
            content: '**Color Roles**',
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setMaxValues(1)
                        .setCustomId('roles-location')
                        .setPlaceholder('Nothing chosen.')
                        .addOptions(
                            {
                                label: 'Lime',
                                value: 'roles-color-lime'
                            },
                            {
                                label: 'Velvet',
                                value: 'roles-color-velvet'
                            },
                            {
                                label: 'Blurple',
                                value: 'roles-color-blurple'
                            },
                            {
                                label: 'Bland',
                                value: 'roles-color-bland'
                            },
                            {
                                label: 'Evil White',
                                value: 'roles-color-ew'
                            },
                            {
                                label: 'Cyan',
                                value: 'roles-color-cyan'
                            },
                            {
                                label: 'Orange',
                                value: 'roles-color-orange'
                            }
                        )
                )
            ]
        });

        await channel.send({
            content: '**Ping Roles**',
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setLabel('Announement Ping')
                        .setCustomId('roles-ping-btn-announcement'),
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setLabel('Poll Ping')
                        .setCustomId('roles-ping-btn-poll'),
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setLabel('Launch Ping')
                        .setCustomId('roles-ping-btn-launch')
                )
            ]
        });
    }
} as TextCommand;
