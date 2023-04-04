import { Client } from 'discord.js';
import path from 'path';
import HandleBot from './classes';

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMessageReactions',
        'GuildMembers'
    ]
});

new HandleBot({
    client: client, // the client

    commandFileTypes: 'ts', // typescript or javascript

    handleCommands: true, // whether to handle slash commands or no
    handleEvents: true, // whether to use event handler or no
    handleFeatures: true, // whether to handle features

    jsonFilePathForRoleInfo: path.join(__dirname, 'roles.json'), // the directory for where to store the role info (should be a json file with the full path included)

    commandsDir: path.join(__dirname, 'commands'), // the directory of the commands (make sure to include the whole path)
    eventsDir: path.join(__dirname, 'events'), // event file directory (make sure to include the whole path)
    featuresDir: path.join(__dirname, 'features'), // the directory of the features (full path)

    defaultPrefix: '.', // the default prefix
    test: false
});
