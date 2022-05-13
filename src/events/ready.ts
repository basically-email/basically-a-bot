import { Event } from '../classes';

export default {
	name: 'ready',
	once: true,
	
	callback: ({ client }) => {
		console.log(`Logged in as ${client.user!.tag}!`);

		client.user!.setPresence({
			status: 'online',
			activities: [
				{
					name: 'basically.email',
					type: 'PLAYING'
				}
			]
		});
	}
} as Event;
