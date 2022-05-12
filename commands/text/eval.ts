
import { TextCommand } from '../../classes';
import messageCreate from '../../events/messageCreate';

var sudo = [892689836249591849,532914066558156800,688308495384313866,782110657142194176]

export default {
    name: 'eval',

    callback: async ({ client, message, user, channel, args }) => {
        if (sudo.includes(user.id) == false ) return; // only authorized people can access this command 
        
        const code = args.join(" ");

        try {
          let output = await eval(code);
          message.channel.send(output, { code:'ts'})
        } catch (error) {
          message.channel.send('`eval() output is too long to display :/`')
        }
    },
} as TextCommand;
