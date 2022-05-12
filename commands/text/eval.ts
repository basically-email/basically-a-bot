
import { TextCommand } from '../../classes';
const { inspect } = require('util');
import messageCreate from '../../events/messageCreate';

var sudo = ["892689836249591849","532914066558156800","688308495384313866","782110657142194176"]

export default {
    name: 'eval',

    callback: async ({ client, message, user, channel }) => {
        if (sudo.includes(user.id) == false ) return; // only authorized people can access this command 
        
        const code = message.content.split(" ").slice(1).join(" ");

        try {
          let output = inspect(await eval(code));
            
          message.channel.reply({content: output, code: "ts"})
        } catch (error) {
            console.log(error)
            message.channel.reply({content: error, code: "ts"})
        }
    },
} as TextCommand;
