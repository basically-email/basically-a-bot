import {
    ClientEvents,
    ApplicationCommandOptionData,
    PermissionString,
    Client,
    Guild,
    GuildMember,
    Message,
    TextBasedChannel,
    User,
    CommandInteraction,
    Collection
} from 'discord.js';

import { PathLike } from 'fs';

export default class HandleBot {
    client!: Client;

    private database!: PathLike;

    slashCommands = new Collection<string, Command>();
    textCommands = new Collection<string, TextCommand>();

    private separator!: string;
    prefix!: string;

    server!: string;
    token!: string;

    options: ConstructorOptions;

    private textCommandTable: Table;
    private slashCommandTable: Table;
    private eventTable: Table;

    constructor(options: ConstructorOptions): void;

    private get roleData(): any;
    private saveRoleData(data: any): void;

    private handleDelete(): void;
    private handleReactions(): void;
    private handleReactionRemove(): void;

    private filter(
        directory: PathLike,
        type: 'ts' | 'js'
    ): string[];

    private handleSlashCommands(
        directory: PathLike,
        type: 'ts' | 'js',
        testServer: string
    ): void;
    private handleSlashCommandInteractions(): void;

    private handleTextCommands(
        directory: PathLike,
        type: 'ts' | 'js'
    ): void;

    private handleFeatures(
        directory: PathLike,
        type: 'ts' | 'js'
    ): void;
}

export class RoleInfo {
    roleID!: string;
    messageID!: string;
    emoji!: string;
    guildID!: string;

    constructor(
        roleID: string,
        messageID: string,
        emoji: string,
        guildID: string
    ) {
        this.emoji = emoji;
        this.roleID = roleID;
        this.messageID = messageID;
        this.guildID = guildID;
    }
}

export interface Command {
    name: string;
    aliases?: string[];
    description: string;
    category: string;

    options?: ApplicationCommandOptionData[];

    defaultPermission?: boolean;
    permissions?: PermissionString[];

    callback(obj: CallbackObject): void;
}

export interface Feature {
	name: string;
    description: string;
    
	callback(obj: featureCallbackObject): void;
}

export interface featureCallbackObject {
	client: Client,
	instance: HandleBot;
}

export interface EventCallbackObject {
    client: Client;
    instance: HandleBot;
}

export interface Event {
    name: keyof ClientEvents;
    once: boolean;

    callback(obj: EventCallbackObject, ...items: any): void;
}

export interface textCallbackObject {
    message: Message;
    args: string[];
    prefix: string;
    member: GuildMember;
    client: Client;
    user: User;
    guild: Guild;
    channel: TextBasedChannel;
    instance: HandleBot;
}

export interface ConstructorOptions {
    handleCommands: boolean;
    handleEvents: boolean;
    handleTextCommands: boolean;
    handleFeatures: boolean;
    test: boolean;

    client: Client;
    jsonFilePathForRoleInfo: PathLike;
    commandsDir: PathLike;
    textCommandsDir: PathLike;
    featuresDir: PathLike;
    commandFileTypes: 'js' | 'ts';
    eventsDir: PathLike;

    defaultPrefix: string;

    reactionRoles: boolean;
}

export interface CallbackObject {
    user: User;
    member: GuildMember;
    interaction: CommandInteraction;
    channel: TextBasedChannel;
    guild: Guild;
    client: Client;
    instance: HandleBot;
}

export interface TextCommand {
    name: string;
    aliases?: string[];
    permissions?: PermissionString[];
    callback(obj: textCallbackObject): void;
}
