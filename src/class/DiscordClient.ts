import Discord from 'discord.js';
import Enmap from 'enmap';
import BotConfig from '@bot_config';

class DiscordClient extends Discord.Client {
    // Define time of startup
    starttime = new Date();
    startuptime: number = 0;

    // Define databases/objects
    profiles = new Enmap({ name: "profiles" });
    logins = new Enmap({ name: "logins" });
    spotify = new Enmap({ name: "spotify" });
    settings = new Enmap({ name: "settings" });
    notes = new Enmap({ name: "notes" });
    bugs = new Enmap({ name: "bugreports" });
    starboard = new Enmap({ name: "starboardmid" });
    warns = new Enmap({ name: "warns" });
    tags = new Enmap({ name: "tags" });
    points = new Enmap({ name: "points" });
    pingwords = new Enmap({ name: "pingwords" });
    inventory = new Enmap({ name: "inventory" });
    garden = new Enmap({ name: "garden" });
    money = new Enmap({ name: "money" });
    cooldown = new Enmap({ name: "cooldown" });
    badges = new Enmap({ name: "badges" });
    reputation = new Enmap({ name: "reputation" });
    fish = new Enmap({ name: "fish" });
    flags = new Enmap({ name: "flags" });
    profile = new Enmap({ name: "profile" });
    life = new Enmap({ name: "life" });
    uses = new Enmap({ name: "commandpop" });

    commands = new Discord.Collection();
    aliases = new Discord.Collection();
    liusers = new Discord.Collection();
    music = {};
    levelCache: any = {};

    // Custom functions

    permlevel = (message: Discord.Message) => {
        let permlvl = 0;

        // Sorts the permission levels
        const permOrder = BotConfig.permLevels.slice(0).sort((p: any, c: any) => p.level < c.level ? 1 : -1);

        while (permOrder.length) {
            // Make the current level the first level in the array
            const currentLevel = permOrder.shift();

            // If the message is sent in a guild, continue
            if (message.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    };

    getSettings = (guild: string | number) => {
        const defaults = BotConfig.defaultSettings || {};
        if (!guild) return defaults;
        const guildData = this.settings.get(guild) || {};
        const returnObject: any = {};
        Object.keys(defaults).forEach((key) => {
            returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
        });
        return returnObject;
    };

    awaitReply = async (msg: Discord.Message, question: any, limit = 30000) => {
        const filter = (m: Discord.Message) => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
            return collected.first()?.content;
        } catch (e) {
            return false;
        }
    };

    loadCommand = (commandName: string) => {
        try {
            const props = require(`../src/commands/${commandName}`);
            if (props.init) props.init(this);

            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach((alias: any) => {
                this.aliases.set(alias, props);
            });
            return false;
        } catch (e) {
            return "Unable to load command `${commandName}`: ${e}";
        }
    };

    unloadCommand = async (commandName: string) => {
        let command: any;
        if (this.commands.has(commandName)) command = this.commands.get(commandName);

        if (!command) return `The command \`${commandName}\` doesn't seem to exist. Try again!`;

        await command.conf.aliases.forEach((alias: any) => {
            this.aliases.delete(alias);
        });

        this.commands.delete(command.help.name);

        const mod = require.cache[require.resolve(`../src/commands/${commandName}`)];
        delete require.cache[require.resolve(`../src/commands/${commandName}.js`)];
        // @ts-ignore
        for (let i = 0; i < mod.parent.children.length; i++) {
            // @ts-ignore
            if (mod.parent.children[i] === mod) {
                // @ts-ignore
                mod.parent.children.splice(i, 1);
                break;
            }
        }
        return false;
    };

    wait = require("util").promisify(setTimeout);

    truncate = (str: string, num = 20) => {
        if (str.length > num) return str.slice(0, num) + "...";
        else return str;
    };

    spoilerify = (ts: string) => {
        return "||" + ts.replace("||", "\\||") + "||";
    };

    Embed = class {
        constructor(type: any, settings: any) {
            type = type;
            settings = settings;

            const embed = new Discord.MessageEmbed();

            if (type !== "blend") embed.setColor("#eeeeee");
            else embed.setColor("#363942");

            if (settings.title) embed.setTitle(settings.title);
            if (settings.url) embed.setURL(settings.url);
            if (settings.timestamp) embed.setTimestamp();

            if (settings.description) embed.setDescription(settings.description);

            if (settings.files) embed.attachFiles(settings.files);

            if (settings.footer) embed.setFooter(settings.footer);

            if (settings.image) embed.setImage(settings.image);
            if (settings.thumbnail) embed.setThumbnail(settings.thumbnail);

            if (settings.author) embed.setAuthor(settings.author.name, settings.author.icon || null, settings.author.url || null);

            return embed;
        }
    };

    // This function makes the results from os.platform more readable
    friendlyOS = (rawPlat: string) => {
        switch (rawPlat) {
            case "win32":
                return "Windows";
                break;
            case "linux":
                return "GNU/Linux";
                break;
            case "darwin":
                return "macOS";
                break;
            default:
                return "an unknown OS. Maybe BSD?";
        }
    };

}

export default DiscordClient;