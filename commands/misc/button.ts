import {
    Message,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,
    ComponentType
} from 'discord.js';
import { Command } from '../../classes';

export default {
    name: 'game',
    category: 'MISC',
    description: 'Jobless? Want to click a button? Here!',

    callback: async ({ interaction, member }) => {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Click!')
                .setCustomId('game-btn')
                .setStyle(ButtonStyle.Success)
        );

        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Click the buttons!')
                    .setColor('Grey')
                    .setColor('#2e3137')
                    .setAuthor({
                        name: member.displayName,
                        iconURL: member.displayAvatarURL()
                    })
            ],
            components: [row],
            fetchReply: true
        });

        const collector = (msg as Message).createMessageComponentCollector({
            componentType: ComponentType.Button,
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
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setLabel('Click!')
                            .setCustomId('game-btn')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )
                ]
            });
        });
    }
} as Command;
