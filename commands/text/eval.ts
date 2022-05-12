
import { TextCommand } from '../../classes';
const { inspect } = require('util');
import messageCreate from '../../events/messageCreate';

var sudo = [892689836249591849,532914066558156800,688308495384313866,782110657142194176]

export default {
    name: 'eval',

    callback: async ({ client, message, user, channel }) => {
        //if (sudo.includes(user.id) == false ) return; // only authorized people can access this command 
        if (user.id !== 892689836249591849 or user.id !== 532914066558156800 or user.id !== 688308495384313866 or user.id !== 782110657142194176) return;
        
        const code = message.content.split(" ").slice(1).join(" ");

        try {
          let output = inspect(await eval(code));
            
          message.channel.send("```ts\n"+output+"```")
        } catch (error) {
          message.channel.send('`eval() output is too long to display :/`')
        }
    },
} as TextCommand;
