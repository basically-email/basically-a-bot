import { MessageAttachment, GuildMember } from 'discord.js';
import { Event } from '../classes';
import Canvas from 'canvas';
import path from 'path';

export default {
	name: 'guildMemberAdd',
	once: false,

	callback: async ({ instance }, member: GuildMember) => {
		if (member.user.bot) return;

		if (instance.server === '928247861626409000')
			member.roles.add(
				member.guild.roles.cache.get('930837244489629736')!
			);

		const dm = await member.createDM();

		const bg = await Canvas.loadImage(
			path.join(__dirname, '../welcomeTemplate.png')
		);

		Canvas.registerFont('./Inter.ttf', { family: 'Inter-400' });

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const pfp = await Canvas.loadImage(
			member.displayAvatarURL({
				dynamic: true,
				format: 'png',
				size: 128
			})
		);

		ctx.drawImage(bg, 0, 0, 700, 250);

		ctx.fillStyle = '#383838';
		ctx.fillRect(
			canvas.width / 2 - pfp.width / 2 - 10,
			canvas.height / 2 - pfp.height / 2 - 10 - 25,
			148,
			148
		);

		ctx.drawImage(
			pfp,
			canvas.width / 2 - pfp.width / 2,
			canvas.height / 2 - pfp.height / 2 - 25
		);

		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.font = '45px "Inter-400"';
		ctx.textAlign = 'center';
		ctx.fillText(
			`Welcome ${member.displayName}!`,
			canvas.width / 2,
			canvas.height / 2 + 95
		);

		await dm.send({
			content: `Hey, welcome to the basically.email discord server!\nbasically.email offers you your daily dose of humor and intellect needed for survival in this gen-z world.\nPlease check out <#931555127687528478> for more details`,
			files: [
				new MessageAttachment(
					canvas.toBuffer(),
					`welcome-${member.displayName}.png`
				)
			]
		});
	}
} as Event;
