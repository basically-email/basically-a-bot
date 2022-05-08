import { TextCommand } from '../../classes';

export default {
	name: 'purge',
	permissions: ['MANAGE_MESSAGES'],

	callback: async ({ channel, args }) => {
		let number = args[0] as unknown as number;

		if (!number) number = 1;

		await channel.messages
			.fetch({
				limit: number + 1
			})
			.then((messages) => {
				if (channel.type === 'DM') {
					return;
				}

				channel.bulkDelete(messages).then(async () => {
					const msg = await channel.send({
						content: `Deleted ${number} messages successfully!`
					});
					setTimeout(async () => {
						await msg.delete();
					}, 2000);
				});
			})
			.catch(async () => {
				const msg = await channel.send({
					content:
						"I don't have enough permissions to delete the messages in this channel."
				});
				setTimeout(async () => {
					await msg.delete();
				}, 2000);
				return;
			});
	}
} as TextCommand;
