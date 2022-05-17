import {
    GuildMemberRoleManager,
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
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
            } else if (customId.includes('ping-role-btn')) {
                if (customId === 'roles-ping-btn-announcement') {
                    const role =
                        interaction.guild!.roles.cache.get(
                            '931047198836285462'
                        )!;

                    if (
                        (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).cache.has('931047198836285462')
                    ) {
                        await (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).remove(role);
                    } else {
                        await (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).add(role);
                    }
                } else if (customId === 'roles-ping-btn-poll') {
                    const role =
                        interaction.guild!.roles.cache.get(
                            '931047245850222592'
                        )!;

                    if (
                        (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).cache.has('931047245850222592')
                    ) {
                        await (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).remove(role);
                    } else {
                        await (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).add(role);
                    }
                } else if (customId === 'roles-ping-btn-launch') {
                    const role =
                        interaction.guild!.roles.cache.get(
                            '973830935214714940'
                        )!;

                    if (
                        (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).cache.has('973830935214714940')
                    ) {
                        await (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).remove(role);
                    } else {
                        await (
                            interaction.member!.roles as GuildMemberRoleManager
                        ).add(role);
                    }
                }
            }
        } else if (interaction.isSelectMenu()) {
            const { values, member, guild, customId } = interaction;

            interaction.deferReply({
                ephemeral: true
            });

            if (customId.includes('roles-')) {
                const keys = {
                    'roles-age-gz': '974643442686771211',
                    'roles-age-gx': '974927260710735882',
                    'roles-age-m': '974643544901963786',
                    'roles-age-alpha': '974977402109321236',

                    'he-him': '974644213746663444',
                    'she-her': '974644258873167882',
                    'they-them': '974644341253488690',
                    'gender-fluid': '974644369963503686',
                    'neo-pronoun': '974925502076821564',

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
                    'roles-interests-automobile': '974887397638697030',

                    'roles-location-asia': '974981229415919627',
                    'roles-location-oceania': '974981193940467722',
                    'roles-location-na': '974981350455136276',
                    'roles-location-sa': '974981362555695134',
                    'roles-location-eu': '974981263008071691',
                    'roles-location-africa': '974981276467617822',

                    'roles-color-lime': '974649505817456670',
                    'roles-color-velvet': '974649573840650281',
                    'roles-color-blurple': '974649564055371816',
                    'roles-color-bland': '974673855614423041',
                    'roles-color-ew': '974672774150905927',
                    'roles-color-cyan': '974649621588627456',
                    'roles-color-orange': '974909863354306641'
                };

                Object.keys(keys).forEach((key) => {
                    (member!.roles as GuildMemberRoleManager).remove(
                        keys[key as keyof typeof keys]
                    );
                });

                let roles: string;
                let rolePings: Role[] = [];

                values.forEach((value) => {
                    const role = guild!.roles.cache.get(
                        keys[value as keyof typeof keys]
                    )!;
                    rolePings.push(role);
                });

                if (values.length === 1) {
                    roles = rolePings[0].toString();
                } else {
                    roles = rolePings.join(', ');
                }

                values.forEach((value) => {
                    const key = keys[value as keyof typeof keys];
                    const role = guild!.roles.cache.get(key)!;

                    (member!.roles as GuildMemberRoleManager)
                        .add(role)
                        .then(async () => {
                            await interaction.editReply({
                                content: `Added ${roles}`
                            });
                        });
                });
            }
        }
    }
} as Event;
