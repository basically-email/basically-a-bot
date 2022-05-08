import { TextBasedChannel } from 'discord.js';
import fs from 'fs';
import { RoleInfo, Command } from '../../../classes/';

export default {
	name: 'setup',
	description: 'Setup reaction roles!',

	category: 'REACTION ROLES',
	permissions: ['ADMINISTRATOR'],

	options: [
		{
			name: 'message_id',
			description:
				'The ID of the message you want to add reaction roles to.',
			type: 'STRING',
			required: true
		},
		{
			name: 'role',
			description:
				'The role that gets assigned when the person reacts to the message.',
			type: 'ROLE',
			required: true
		},
		{
			name: 'emoji',
			description:
				'The emoji to react with for the bot to assign the role to the person.',
			type: 'STRING',
			required: true
		}
	],

	callback: async ({ interaction, guild }) => {
		const message_id = interaction.options
			.getString('message_id')
			?.split('-')!;

		const channel = guild.channels.cache.get(message_id[0]);

		if (!channel) {
			return await interaction.reply({
				content: "That message doesn't exist.",
				ephemeral: true
			});
		}

		const message = (channel as TextBasedChannel).messages.cache.get(
			message_id[1]
		);

		if (!message)
			return await interaction.reply({
				content: "That message doesn't exist.",
				ephemeral: true
			});

		const role = interaction.options.getRole('role')!;

		if (role.position > interaction.guild!.me!.roles.highest.position) {
			return await interaction.reply({
				content:
					'I cannot assign that role to others because that role is higher than my highest role.',
				ephemeral: true
			});
		}

		try {
			await message.react(interaction.options.getString('emoji')!);
		} catch (error) {
			return await interaction.reply({
				content: 'Please enter a valid emoji.',
				ephemeral: true
			});
		}

		await interaction.reply({
			content: `Successfully reacted to message with ${interaction.options.getString(
				'emoji'
			)}...`,
			ephemeral: true
		});

		const collector = message.createReactionCollector({
			filter: () => {
				return true;
			}
		});

		collector.on('collect', (reaction, user) => {
			reaction.message.reply('Successfully registered reaction.');
		});

		const data: any = JSON.parse(
			fs.readFileSync('./roles.json') as unknown as string
		);

		if (!Object.keys(data).includes(interaction.guild!.id)) {
			data[interaction.guild!.id] = {};
		}

		if (
			!Object.keys(data[interaction.guild!.id]).includes(
				message.channel.id
			)
		) {
			data[interaction.guild!.id][message.channel.id] = {};
		}

		if (
			!Object.keys(
				data[interaction.guild!.id][message.channel.id]
			).includes(message.id)
		) {
			data[interaction.guild!.id][message.channel.id][message.id] = {};
		}

		data[interaction.guild!.id][message.channel.id][message_id[1]][
			interaction.options.getString('emoji')!
		] = {
			roleID: role.id,
			messageID: message_id[1],
			guildID: guild.id,
			emoji: interaction.options.getString('emoji')
		} as RoleInfo;

		fs.writeFileSync('./roles.json', JSON.stringify(data));
	}
} as Command;
