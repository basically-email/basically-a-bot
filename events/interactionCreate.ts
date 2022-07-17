import {
    GuildMemberRoleManager,
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    Role
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
            } else if (customId === 'game-btn') {
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
                            .setAuthor({
                                name: message.embeds[0].author!.name,
                                iconURL: message.embeds[0].author!.iconURL
                            })
                            .setColor('RANDOM')
                            .setDescription(`Click the button one more time!`)
                    ],
                    components: message.components
                });
            }
        } else if (interaction.isSelectMenu()) {
            const { values, member, guild, customId } = interaction;

            await interaction.deferReply({
                ephemeral: true
            });

            if (customId.includes('roles-')) {
                const ageKeys = {
                    'roles-age-gz': '974643442686771211',
                    'roles-age-gx': '974927260710735882',
                    'roles-age-m': '974643544901963786',
                    'roles-age-alpha': '974977402109321236'
                };

                const pingKeys = {
                    'roles-ping-announcement': '931047198836285462',
                    'roles-ping-poll': '931047245850222592',
                    'roles-ping-launch': '973830935214714940'
                };

                const pronounKeys = {
                    'roles-pronoun-he-him': '974644213746663444',
                    'roles-pronoun-she-her': '974644258873167882',
                    'roles-pronoun-they-them': '974644341253488690',
                    'roles-pronoun-gender-fluid': '974644369963503686',
                    'roles-pronoun-neo-pronoun': '974925502076821564'
                };

                const interestKeys = {
                    'roles-interests-web3': '974644755759792178',
                    'roles-interests-startups-or-VCs': '974647336422744074',
                    'roles-interests-ia': '974651666467012688',
                    'roles-interests-programming': '974644817839657020',
                    'roles-interests-design': '974644832880435251',
                    'roles-interests-finance': '974646258138501120',
                    'roles-interests-esports': '974648646786236436',
                    'roles-interests-humor': '974652388537425930',
                    'roles-interests-space': '974887270047961098',
                    'roles-interests-technology': '974888338609815622',
                    'roles-interests-science': '974888521934458963',
                    'roles-interests-automobile': '974887397638697030'
                };

                const locationKeys = {
                    'roles-location-asia': '974981229415919627',
                    'roles-location-oceania': '974981193940467722',
                    'roles-location-na': '974981350455136276',
                    'roles-location-sa': '974981362555695134',
                    'roles-location-eu': '974981263008071691',
                    'roles-location-africa': '974981276467617822'
                };

                const colorKeys = {
                    'roles-color-lime': '974649505817456670',
                    'roles-color-velvet': '974649573840650281',
                    'roles-color-blurple': '974649564055371816',
                    'roles-color-bland': '974673855614423041',
                    'roles-color-ew': '974672774150905927',
                    'roles-color-cyan': '974649621588627456',
                    'roles-color-orange': '974909863354306641'
                };

                if (customId === 'roles-age') {
                    const component = interaction.component as MessageSelectMenu;
                    const removed = component.options.filter((option) => !values.includes(ageKeys[option.value as keyof typeof ageKeys]));

                    for (const option of removed) {
                        (member!.roles as GuildMemberRoleManager).remove(ageKeys[option.value as keyof typeof ageKeys]);
                    }

                    for (const value of values) {
                        await (member!.roles as GuildMemberRoleManager).add(ageKeys[value as keyof typeof ageKeys]);
                    }

                    await interaction.editReply({
                        content: `Updated roles!`
                    });
                } else if (customId === 'roles-pronouns') {
                    const component = interaction.component as MessageSelectMenu;
                    const removed = component.options.filter((option) => !values.includes(pronounKeys[option.value as keyof typeof pronounKeys]));

                    for (const option of removed) {
                        (member!.roles as GuildMemberRoleManager).remove(pronounKeys[option.value as keyof typeof pronounKeys]);
                    }

                    for (const value of values) {
                        await (member!.roles as GuildMemberRoleManager).add(pronounKeys[value as keyof typeof pronounKeys]);
                    }

                    await interaction.editReply({
                        content: `Updated roles!`
                    });
                } else if (customId === 'roles-interests') {
                    const component = interaction.component as MessageSelectMenu;
                    const removed = component.options.filter((option) => !values.includes(interestKeys[option.value as keyof typeof interestKeys]));

                    for (const option of removed) {
                        (member!.roles as GuildMemberRoleManager).remove(interestKeys[option.value as keyof typeof interestKeys]);
                    }

                    for (const value of values) {
                        await (member!.roles as GuildMemberRoleManager).add(interestKeys[value as keyof typeof interestKeys]);
                    }

                    await interaction.editReply({
                        content: `Updated roles!`
                    });
                } else if (customId === 'roles-location') {
                    const component = interaction.component as MessageSelectMenu;
                    const removed = component.options.filter((option) => !values.includes(locationKeys[option.value as keyof typeof locationKeys]));

                    for (const option of removed) {
                        (member!.roles as GuildMemberRoleManager).remove(locationKeys[option.value as keyof typeof locationKeys]);
                    }

                    for (const value of values) {
                        await (member!.roles as GuildMemberRoleManager).add(locationKeys[value as keyof typeof locationKeys]);
                    }

                    await interaction.editReply({
                        content: `Updated roles!`
                    });
                } else if (customId === 'roles-color') {
                    const component = interaction.component as MessageSelectMenu;
                    const removed = component.options.filter((option) => !values.includes(colorKeys[option.value as keyof typeof colorKeys]));

                    for (const option of removed) {
                        (member!.roles as GuildMemberRoleManager).remove(colorKeys[option.value as keyof typeof colorKeys]);
                    }

                    for (const value of values) {
                        await (member!.roles as GuildMemberRoleManager).add(colorKeys[value as keyof typeof colorKeys]);
                    }

                    await interaction.editReply({
                        content: `Updated roles!`
                    });
                } else if (customId === 'roles-ping') {
                    const component = interaction.component as MessageSelectMenu;
                    const removed = component.options.filter((option) => !values.includes(pingKeys[option.value as keyof typeof pingKeys]));

                    for (const option of removed) {
                        (member!.roles as GuildMemberRoleManager).remove(pingKeys[option.value as keyof typeof pingKeys]);
                    }

                    for (const value of values) {
                        await (member!.roles as GuildMemberRoleManager).add(pingKeys[value as keyof typeof pingKeys]);
                    }

                    await interaction.editReply({
                        content: `Updated roles!`
                    });
                }
            }
        }
    }
} as Event;
