import { TextCommand } from '../../classes';
import messageCreate from '../../events/messageCreate';

export default {
    name: 'sweep',

    callback: async ({ user, channel }) => {
        if (user.id !== '892689836249591849') return; // makes sure only Azure can run

        const msg = await channel.send('Cleaning..');

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
} as TextCommand;
