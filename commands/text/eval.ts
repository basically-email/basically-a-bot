import { TextCommand } from '../../classes';
const { inspect } = require('util');

var sudo = [
    '892689836249591849',
    '532914066558156800',
    '688308495384313866',
    '782110657142194176'
];

export default {
    name: 'eval',

    callback: async ({ client, message, user, channel, args }) => {
        if (sudo.includes(user.id) == false) return; // only authorized people can access this command

        // const code = message.content.split(" ").slice(1).join(" ");
        const code = args.join(' ');

        try {
            let output = inspect(await eval(code));

            message.reply('```ts\n' + output + '\n```');
        } catch (error) {
            console.log(error);
            message.reply('```ts\n' + error + '\n```');
        }
    }
} as TextCommand;
