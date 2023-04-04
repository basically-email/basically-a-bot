import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../classes';
import { inspect } from 'util';

const sudo = [
    '892689836249591849',
    '532914066558156800',
    '688308495384313866',
    '782110657142194176'
];

export default {
    name: 'eval',
    category: 'MOD',
    description: 'Evaluate some code!',

    options: [
        {
            name: 'code',
            description: 'The code you want to execute.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    callback: async ({ interaction, user }) => {
        if (sudo.includes(user.id) == false) return; // only authorized people can access this command

        // const code = message.content.split(" ").slice(1).join(" ");
        const code = interaction.options.getString('code', true);

        try {
            let output = inspect(await eval(code));

            interaction.reply('```ts\n' + output + '\n```');
        } catch (error) {
            console.log(error);
            interaction.reply('```ts\n' + error + '\n```');
        }
    }
} as Command;
