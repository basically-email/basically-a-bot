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

    handleDelete() {
        /**
         * Runs when the bot is kicked or banned from a server, or when the server is deleted.
         * If the server has messages with reaction roles, it deletes the data of the roles completely.
         */
        this.client.on('guildDelete', (guild) => {
            const file = JSON.parse(readFileSync('./roles.json'));

            if (!Object.keys(file).includes(guild.id)) return;
            delete file[guild.id];

            this.saveRoleData(file);
        });

        /**
         * Runs when a channel is deleted or the bot is declined access from a certain channel.
         * If the channel has messages related to Reaction Roles, it deletes all the data.
         */
        this.client.on('channelDelete', (channel) => {
            const file = this.roleData;

            if (channel instanceof DMChannel) return;

            if (!Object.keys(file).includes(channel.guild.id)) return;
            if (!Object.keys(file[channel.guild.id]).includes(channel.id))
                return;

            delete file[channel.guild.id][channel.id];

            if (Object.keys(file[channel.guild.id]).length === 0) {
                delete file[channel.guild.id];
            }

            this.saveRoleData(file);
        });

        /**
         * Runs when a message is deleted in any server that the bot is in.
         * If the message has reaction roles added to it, then the bot removes the data of the role completely.
         */
        this.client.on('messageDelete', (message) => {
            const file = this.database;

            if (!Object.keys(file).includes(message.guild.id)) return;
            if (
                !Object.keys(file[message.guild.id]).includes(
                    message.channel.id
                )
            )
                return;
            if (
                !Object.keys(
                    file[message.guild.id][message.channel.id]
                ).includes(message.id)
            )
                return;

            delete file[message.guild.id][message.channel.id][message.id];

            if (
                Object.keys(file[message.guild.id][message.channel.id])
                    .length === 0
            ) {
                delete file[message.guild.id][message.channel.id];
            }

            if (Object.keys(file[message.guild.id]).length === 0) {
                delete file[message.guild.id];
            }

            this.saveRoleData(file);
        });
    }

    handleReactions() {
        /*
			Handles reactions. When a reaction is added to any message, the bot checks if the message relates to any ID associated with reaction roles.
			If there is no connection, the bot returns, otherwise the bot assigns the role to the user and sends a message to the user who reacted to the message with the correct emoji
		*/
        this.client.on('messageReactionAdd', (reaction, user) => {
            const { message, emoji } = reaction;
            const { channel, guild } = message;

            const data = this.roleData;

            if (!Object.keys(data).includes(guild.id)) return;
            if (!Object.keys(data[guild.id]).includes(channel.id)) return;
            if (!Object.keys(data[guild.id][channel.id]).includes(message.id))
                return;
            if (
                !Object.keys(data[guild.id][channel.id][message.id]).includes(
                    emoji.name
                )
            )
                return;

            guild.roles
                .fetch(
                    data[guild.id][channel.id][message.id][emoji.name].roleID
                )
                .then((role) => {
                    if (!role) return;
                    if (user.id === this.client.user.id) return;

                    const member = guild.members.cache.get(user.id);
                    member.roles.add(role).then((member) => {
                        if (member.user.bot) return;
                        member
                            .createDM()
                            .then(async (channel) => {
                                await channel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            author: {
                                                name: member.displayName,
                                                iconURL:
                                                    member.displayAvatarURL()
                                            },
                                            title: 'Role Assignment',
                                            description: `Added the \`${role.name}\` role to you.`,
                                            color: 'AQUA'
                                        })
                                    ]
                                });
                            })
                            .catch(() => {
                                member.user.dmChannel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            author: {
                                                name: member.displayName,
                                                iconURL:
                                                    member.displayAvatarURL()
                                            },
                                            title: 'Role Assignment',
                                            description: `Added the \`${role.name}\` role to you.`,
                                            color: 'AQUA'
                                        })
                                    ]
                                });
                            });
                    });
                })
                .catch(console.error);
        });
    }

    handleReactionRemove() {
        this.client.on('messageReactionRemove', (reaction, user) => {
            const { message, emoji } = reaction;
            const { channel, guild } = message;

            const data = this.roleData;

            if (!Object.keys(data).includes(guild.id)) return;
            if (!Object.keys(data[guild.id]).includes(channel.id)) return;
            if (!Object.keys(data[guild.id][channel.id]).includes(message.id))
                return;
            if (
                !Object.keys(data[guild.id][channel.id][message.id]).includes(
                    emoji.name
                )
            )
                return;

            guild.roles
                .fetch(
                    data[guild.id][channel.id][message.id][emoji.name].roleID
                )
                .then(async (role) => {
                    if (!role)
                        return await message.channel.send(
                            "That role doesn't exist..."
                        );

                    if (user.id === this.client.user.id) return;
                    const member = guild.members.cache.get(user.id);
                    member.roles.remove(role).then(async (member) => {
                        if (user.bot) return;
                        await user
                            .createDM()
                            .then(async (channel) => {
                                await channel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            author: {
                                                name: member.displayName,
                                                iconURL:
                                                    member.displayAvatarURL()
                                            },
                                            title: 'Role Deassignment',
                                            description: `Removed the \`${role.name}\` role from you.`,
                                            color: 'AQUA'
                                        })
                                    ]
                                });
                            })
                            .catch(() => {
                                member.user.createDM();
                                member.user.dmChannel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            author: {
                                                name: member.displayName,
                                                iconURL:
                                                    member.displayAvatarURL()
                                            },
                                            title: 'Role Deassignment',
                                            description: `Removed the \`${role.name}\` role from you.`,
                                            color: 'AQUA'
                                        })
                                    ]
                                });
                            });
                    });
                })
                .catch(console.error);
        });
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
            if (interaction.isCommand()) {
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

    handleTextCommands(directory, type) {
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
            this.textCommandTable.addRow(
                command.name.charAt(0).toUpperCase() + command.name.slice(1),
                '🟩 SUCCESS'
            );
            commands.push(command);
            this.textCommands.set(command.name, command);
        }

        console.log(this.textCommandTable.toString());

        console.log();
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
        this.textCommandTable = new AsciiTable('Text Commands!');
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

        this.textCommandTable.setHeading('Text Command Name', 'Status');
        this.textCommandTable.setHeading(
            'Slash Command Name',
            'Category',
            'Status'
        );
        this.textCommandTable.setHeading('Event Name', 'Status');
        this.featureTable.setHeading('Feature Name', 'Status');

        this.slashCommands = new Collection();
        this.textCommands = new Collection();
        this.features = [];

        this.snipe = new Collection();

        this.client = options.client;
        this.database = options.jsonFilePathForRoleInfo;
        this.prefix = options.defaultPrefix;
        this.options = options;

        this.separator = path.sep;

        this.client.login(this.token);

        if (options.reactionRoles) {
            this.handleDelete();
            this.handleReactions();
            this.handleReactionRemove();
        }

        if (options.handleTextCommands) {
            this.handleTextCommands(
                options.textCommandsDir,
                options.commandFileTypes
            );
        }

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
            this.snipe.set(message.channel.id, message);
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
