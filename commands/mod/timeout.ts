import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Command } from '../../classes';

export default {
	name: 'timeout',
	description:
		'Time a person out. Works like mute, but uses the new discord feature!',

	permissions: ['MODERATE_MEMBERS'],

	category: 'MODERATION',
	
	options: [
		{
			name: 'target',
			description: 'The user who gets timed out.',
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: 'duration',
			description: 'The duration of the timeout.',
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: '60 secs',
					value: '60 * 1000'
				},
				{
					name: '5 mins',
					value: '5 * 60 * 1000'
				},
				{
					name: '10 mins',
					value: '10 * 60 * 1000'
				},
				{
					name: '1 hour',
					value: '60 * 60 * 1000'
				},
				{
					name: '1 day',
					value: '24 * 60 * 60 * 1000'
				},
				{
					name: '1 week',
					value: '7 * 24 * 60 * 60 * 1000'
				}
			],
			required: true
		},
		{
			name: 'reason',
			description: "The reason you're timing this user out.",
			type: ApplicationCommandOptionType.String,
			required: false
		}
	],

	callback: ({ interaction }) => {
		const user = interaction.options.getUser('target');
		const member = interaction.guild?.members.cache.get(user!.id);

		let reason: string | undefined;
		reason = interaction.options.getString('reason') as string | undefined;
		if (!reason) reason = 'No reason provided';

		const duration = interaction.options.getString('duration')!;

		if (!duration) {
			interaction.reply({
				content: `Please provide a valid number for the duration.`,
				ephemeral: true
			});
			return;
		}

		if (!member) {
			interaction.reply({
				content: `Member provided doesn't exist in the server.`,
				ephemeral: true
			});
			return;
		}

		if (!member.moderatable) {
			interaction.reply({
				content: 'Sorry, I am not able to time this person out.',
				ephemeral: true
			});
		}

		if (!user!.bot) {
			member.timeout(eval(duration), reason).then((serverMember) => {
				serverMember.createDM().then((channel) => {
					const interactionReply = new EmbedBuilder()
						.setTitle('Timeout Notice!')
						.setDescription(
							`You have been timed out in ${interaction.guild?.name} for ${10}`
						)
						.setColor('Blue');
					channel.send({
						embeds: [interactionReply]
					});
				});
			});
		} else {
			member.timeout(eval(duration), reason);
		}

		let durString;

		switch (duration) {
			case '60 * 1000':
				durString = '60 seconds'
				break;

			case '5 * 60 * 1000':
				durString = '5 minutes';
				break;

			case '10 * 60 * 1000':
				durString = '10 minutes';
				break;

			case '60 * 60 * 1000':
				durString = '1 hour';
				break;

			case '24 * 60 * 60 * 1000':
				durString = '1 day';
				break;

			case '7 * 24 * 60 * 60 * 1000':
				durString = '1 week';
				break;
		}

		const embed = new EmbedBuilder()
			.setTitle('SUCCESS')
			.setDescription(
				`${user!.tag} has been timed out for ${durString}.`
			)
			.setColor('Green');

		interaction.reply({
			embeds: [embed]
		});
	}
} as Command;
