import {
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed
} from 'discord.js';
import { Command } from '../../../classes';

export default {
    name: 'game',
    category: 'MISC',
    description: 'Jobless? Want to click a button? Here!',

    callback: async ({ interaction, member }) => {
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Click!')
                .setCustomId('game-btn')
                .setStyle('SUCCESS')
        );

        const msg = await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Click the buttons!')
                    .setColor('GREY')
                    .setColor('#2e3137')
                    .setAuthor({
                        name: member.displayName,
                        iconURL: member.displayAvatarURL({ dynamic: true })
                    })
            ],
            components: [row],
            fetchReply: true
        });

        const collector = (msg as Message).createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 7000,

            filter: (inter) => {
                return !inter.user.bot;
            }
        });

		collector.on('collect', (inter) => {
			collector.resetTimer();
		});

        collector.on('end', async () => {
            await (msg as Message).edit({
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setLabel('Click!')
                            .setCustomId('game-btn')
                            .setStyle('DANGER')
                            .setDisabled(true)
                    )
                ]
            });
        });
    }
} as Command;
