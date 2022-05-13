import { Feature } from "../classes";

export default {
    name: 'change-pfp',
    description: 'Changes the profile picture of the bot depending on the time of the day (GMT +5:30)',

    callback: async ({ client }) => {
        setInterval(() => {
            const date = new Date();

            if (date.getHours() > 6 && date.getHours() < 17) {
                if (client.user!.avatar !== 'https://media.discordapp.net/attachments/960507288416837642/973577011111006288/unknown.png?width=1238&height=1238') {
                    client.user!.setAvatar('https://media.discordapp.net/attachments/960507288416837642/973577011111006288/unknown.png?width=1238&height=1238');
                }
                
                return;
            } else {
                if (client.user!.avatar !== 'https://cdn.discordapp.com/attachments/960507288416837642/973577010871951400/unknown.png') {
                    client.user!.setAvatar('https://cdn.discordapp.com/attachments/960507288416837642/973577010871951400/unknown.png');
                }

                return;
            }
        }, 60000 * 15);
    }
} as Feature;