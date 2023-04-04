import { Command } from '../../classes';

export default {
    name: 'sweep',

    category: 'MOD',
    description: 'Allows @Azure to clean the chat.',

    callback: async ({ user, channel, interaction }) => {
        if (user.id !== '892689836249591849') return await interaction.reply({
            content: 'Not allowed.'
        }); // makes sure only Azure can run

        const msg = await interaction.reply({
            content: 'Cleaning...'
        });

        for (let i = 0; i < 2; i++) {
            await msg.edit('** **🧹');
            await msg.edit('**  **🧹');
            await msg.edit('**   **🧹');
            await msg.edit('**    **🧹');
            await msg.edit('**     **🧹');
            await msg.edit('**      **🧹');
            await msg.edit('**     **🧹');
            await msg.edit('**    **🧹');
            await msg.edit('**   **🧹');
            await msg.edit('**  **🧹');
            await msg.edit('** **🧹');
        }
    },
} as Command;
