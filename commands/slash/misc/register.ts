import { Command } from '../../../classes';
import axios from 'axios';

export default {
	name: 'register',
	category: 'MISC',
	description:
		"Too lazy to sign-up from the website? Here's an easier solution!",
	permissions: [],

	options: [
		{
			name: 'email',
			type: 'STRING',
			description: 'The EMail you want to register with.',
			required: true
		}
	],

	callback: async ({ interaction }) => {
		const headers = {
			'Content-Type': 'application/json'
		};

		interaction.deferReply({
			ephemeral: true
		});

		try {
			const res = await axios.post(
				'https://basically.email/api/subscribe',
				{
					email: interaction.options.getString('email')!,
					headers: headers
				}
			);

			const result: any = res.data;

			if (result.error) {
				await interaction.editReply({
					content: result.message
				});
			} else {
				await interaction.editReply({
					content:
						"You've successfully subscribed, please check your email! It should be in your mail in a couple of seconds"
				});
			}
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content: 'That is not a valid email!'
			});
			return;
		}
	}
} as Command;
