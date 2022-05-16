import { TextCommand } from '../../classes';
import { MessageEmbed } from 'discord.js';

export default {
	name: 'snipe',
	callback: async ({ channel }) => {
  let data = snipe.get(message.channel.id)
  if (!data) return message.channel.send('there is nothing to snipe.')
  const output = new MessageEmbed()
  .setAuthor('${data.author.tag}', data.author.displayAvatarURL())
  .setColor("RANDOM")
  .setDescription(data.content)
  message.channel.semd(output)
} as TextCommand;
