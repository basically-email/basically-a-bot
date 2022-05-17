import { GuildMember, TextBasedChannel } from 'discord.js';
import { Event } from '../classes';

export default {
	name: 'messageCreate',
	once: false,

	callback: async ({ instance }, message) => {

		if (!message.content.startsWith(instance.prefix)) {
			return;
		}

		const args = message.content.slice(instance.prefix.length).split(/ +/);
		const command_name = args.shift()!;

		const command = instance.textCommands.get(command_name);

		if (!command) {
			return;
		}

		let hasPerms = true;

		if (command.permissions) {
			for (
				let permNum = 0;
				permNum < command.permissions.length;
				permNum++
			) {
				const perm = command.permissions[permNum];
				if (!message.member!.permissions.has(perm)) {
					hasPerms = false;
					break;
				} else {
					continue;
				}
			}
		}

		if (!hasPerms) {
			message.channel.send({
				content: `You don't have enough permissions. You need: ${command.permissions!.join(
					', '
				)}`
			});
			return;
		}

		command.callback({
			args: args,
			message: message,
			prefix: instance.prefix,
			member: message.member! as GuildMember,
			user: message.author,
			channel: message.channel as TextBasedChannel,
			guild: message.guild!,
			instance: this!,
			client: instance.client
		});
	}
} as Event;
