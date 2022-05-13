import { Command } from '../../../classes'

export default {
	name: 'unban',
	description: 'Unbans any banned members.',

	category: 'MODERATION',

	permissions: ['BAN_MEMBERS'],

	options: [
		{
			name: 'user_id',
			description: "The user's ID that you want to unban.",
			type: 'STRING',
			required: true
		}
	],

	callback: ({ interaction }) => {
		const userId = interaction.options.getString('user_id')!;

		interaction.guild?.members
			.unban(userId)
			.then((user) => {
				interaction.reply({
					content: `${user!.tag} has been unbanned from this server!`
				});
			})
			.catch((err) => {
				console.error(err);
				interaction.reply({
					content: "Please specify a valid banned member's ID."
				});
			});
	}
} as Command;
