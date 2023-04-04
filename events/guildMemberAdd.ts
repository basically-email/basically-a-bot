import {
    GuildMember,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';
import { Event } from '../classes';

export default {
    name: 'guildMemberAdd',
    once: false,

    callback: async ({ instance }, member: GuildMember) => {
        if (member.user.bot) return;

        if (instance.server === '928247861626409000')
            member.roles.add(
                member.guild.roles.cache.get('930837244489629736')!
            );
        ``;

        const dm = await member.createDM();

        const msgEmbed = new EmbedBuilder()
            .setColor('#2e3036')
            .setTitle('Welcome to Basically HQ')
            .setURL('https://basically.email')
            .setDescription(
                "Hey there,\nwelcome to the basically.email discord server!\n\n<:emblem:982588268254216202>** ** [basically.email](https://basically.email) offers you your weekly dose of humor and intellect needed for survival in this gen-z world.\n\nCheck out <#931555127687528478> to get to know more about us. \nAlso make sure to use the `/register` command to sign up incase you haven't already!\n& dont forget to grab some roles from <#931047440604332083>!"
            )
            .setImage(
                `https://basically-banner.up.railway.app/banner/${member.id}`
            )
            .setTimestamp()
            .setFooter({
                text: 'Sent by Basically The Team with 💖',
                iconURL: ''
            });

        const socialbuttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Website')
                .setURL('https://basically.email/')
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel('Twitter')
                .setURL('https://basically.email/twitter')
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel('Instagram')
                .setURL('https://basically.email/insta')
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel('Github')
                .setURL('https://basically.email/github')
                .setStyle(ButtonStyle.Link)
        );

        await dm.send({
            embeds: [msgEmbed],
            components: [socialbuttons]
        });
    }
} as Event;
