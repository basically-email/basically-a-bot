const { DMChannel, MessageEmbed, Collection } = require('discord.js');
const AsciiTable = require('ascii-table');
const path = require('path');
const { readFileSync, writeFileSync, readdirSync } = require('fs');
require('dotenv').config();

class HandleBot {
    get roleData() {
        let info = readFileSync(this.database);

        try {
            info = JSON.parse(info);
        } catch (error) {
            info = {};
        }

        return info;
    }

    saveRoleData(data) {
        writeFileSync(this.database, JSON.stringify(data));
    }

    filter(files, type, path) {
        let commands = [];

        for (const file of files) {
            if (file.isDirectory()) {
                commands = [
                    ...commands,
                    ...this.filter(
                        readdirSync(`${path}${this.separator}${file.name}`, {
                            withFileTypes: true
                        }),
                        type,
                        `${path}${this.separator}${file.name}`
                    )
                ];
            } else if (file.name.endsWith(`.${type}`)) {
                commands.push(`${path}${this.separator}${file.name}`);
            }
        }

        return commands;
    }

    handleEvents(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        for (const file of files) {
            const event = require(`${file.slice(0, file.length - 3)}`).default;

            this.eventTable.addRow(event.name, '🟩 SUCCESS');

            if (!event.once) {
                this.client.on(event.name, (...args) => {
                    event.callback(
                        {
                            client: this.client,
                            instance: this
                        },
                        ...args
                    );
                });
            } else {
                this.client.once(event.name, (...args) => {
                    event.callback(
                        {
                            client: this.client,
                            instance: this
                        },
                        ...args
                    );
                });
            }
        }

        console.log(this.eventTable.toString());
    }

    handleSlashCommands(directory, type, serverId) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        const commands = [];

        for (const file of files) {
            const command = require(`${file.slice(
                0,
                file.length - 3
            )}`).default;
            this.slashCommandTable.addRow(
                command.name.charAt(0).toUpperCase() + command.name.slice(1),
                command.category.toUpperCase(),
                '🟩 SUCCESS'
            );
            commands.push(command);
            this.slashCommands.set(command.name, command);
        }

        console.log(this.slashCommandTable.toString());

        console.log();

        const guild = this.client.guilds.cache.get(serverId);

        if (!guild) {
            console.log(
                `[CODE] Server ID: ${serverId} is invalid. Please pass in a server that exists AND make sure the bot is a member of that server.`
            );
            return;
        } else {
            guild.commands.set(commands);

            console.log(
                `[CODE] Commands have been added to the server with the ID: ${guild.id} and the name: ${guild.name}`
            );
        }

        console.log();
    }

    handleSlashCommandInteractions() {
        this.client.on('interactionCreate', (interaction) => {
            if (interaction.isChatInputCommand()) {
                const command = this.slashCommands.get(interaction.commandName);

                if (!command) {
                    interaction.reply({
                        content: 'No code found for that command...',
                        ephemeral: true
                    });
                    return;
                }

                let hasPerms = true;

                if (command.permissions) {
                    for (
                        let permNum = 0;
                        permNum < command.permissions.length;
                        permNum++
                    ) {
                        const perm = command.permissions[permNum];
                        if (
                            !interaction.memberPermissions
                                ?.toArray()
                                .includes(perm)
                        ) {
                            hasPerms = false;
                            break;
                        } else {
                            continue;
                        }
                    }
                }

                if (!hasPerms) {
                    interaction.reply({
                        content: `You don't have enough permissions. You need: ${command.permissions.join(
                            ', '
                        )}`,
                        ephemeral: true
                    });
                    return;
                }

                command.callback({
                    channel: interaction.channel,
                    client: this.client,
                    guild: interaction.guild,
                    interaction: interaction,
                    member: interaction.member,
                    user: interaction.user,
                    instance: this
                });
            }
        });
    }

    handleFeatures(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        for (const file of files) {
            const feature = require(file).default;

            this.featureTable.addRow(feature.name, 'SUCCESS');
            this.features.push(feature);
        }

        console.log(this.featureTable.toString());
        console.log();
    }

    constructor(options) {
        this.slashCommandTable = new AsciiTable('Slash Commands!');
        this.eventTable = new AsciiTable('Events!');
        this.featureTable = new AsciiTable('Features!');

        if (options.test) {
            this.server = process.env.TEST_SERVER;
            this.token = process.env.TEST_TOKEN;
        } else {
            this.server = process.env.REAL_SERVER;
            this.token = process.env.REAL_TOKEN;
        }

        this.slashCommandTable.setHeading(
            'Slash Command Name',
            'Category',
            'Status'
        );
        this.eventTable.setHeading('Event Name', 'Status');
        this.featureTable.setHeading('Feature Name', 'Status');

        this.slashCommands = new Collection();
        this.features = [];

        this.snipe = new Collection();

        this.client = options.client;
        this.database = options.jsonFilePathForRoleInfo;
        this.options = options;

        this.separator = path.sep;

        this.client.login(this.token);

        this.client.once('ready', () => {
            if (options.handleFeatures) {
                this.handleFeatures(
                    options.featuresDir,
                    options.commandFileTypes
                );

                for (const feature of this.features) {
                    feature.callback({
                        client: this.client,
                        instance: this
                    });
                }
            }
        });

        this.client.on('messageDelete', (message) => {
            this.snipe.set(message.id, message);
        });

        if (options.handleCommands) {
            this.client.once('ready', () => {
                this.handleSlashCommands(
                    options.commandsDir,
                    options.commandFileTypes,
                    this.server
                );
                this.handleSlashCommandInteractions();
            });
        }

        if (options.handleEvents) {
            this.handleEvents(options.eventsDir, options.commandFileTypes);
        }

        console.log();
    }
}

module.exports = HandleBot;
