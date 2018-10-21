/* Requirements:
	Welcome Message setup by only owner with auto role on joined user
	Leave Message setup by only owner
	with roles store role groups (i.e. prevent multiple races)
	Assign Role Command:
		Assign multiple roles at once
		Setup:
			Allow multiple roles using single command that overrides previous setups
			setup for what roles can be assigned
		Remove role command with seperate setup and seperate takeable roles
	React Role Command (more than one role per reaction)
	Blacklist:
		Counts warnings for members, who is banned and why
	Ban Command with similar setup to assign role
	Unban Command uses setup for ban
	Warning command:
		similar setup to assign role
		Dm player with reason and strip roles for one hour using timer stored in db
*/
const SequelizeProvider = require("./util/sequelize");
const Database = require("./util/PostgreSQL")
const Commando = require('discord.js-commando');
const client = new Commando.Client({
  owner: '206620273443602432'
});
const path = require('path');

global.settings = new SequelizeProvider(Database.db);
client.registry.registerGroups([
  ['auto', 'Automatic commands such as join/leave messages.'],
  ['moderation', 'Commands related to server moderation.'],
  ['setup', 'Commands used to setup permissions and the like for other commands.']
]).registerDefaults().registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(global.settings);

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
  })
  .on('disconnect', () => {
    console.warn('Disconnected!');
  })
  .on('reconnecting', () => {
    console.warn('Reconnecting...');
  })
  .on('commandError', (cmd, err) => {
    if (err instanceof Commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine `
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine `
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine `
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('guildMemberAdd', member => {
    let joinMsg = global.settings.get(member.guild.id, "joinMsg", false);
    let joinMsgChannel = global.settings.get(member.guild.id, "joinMsgChannel", false)
    let joinRole = global.settings.get(member.guild.id, "joinRole", false);
    if (joinMsg && joinMsgChannel) {
      let msg = joinMsg.replace('{user}', '<@' + member.id + '>');
      member.guild.channels.get(joinMsgChannel).send(msg, {
        files: [member.user.avatarURL.indexOf("?") > -1 ? member.user.avatarURL.substring(0, member.user.avatarURL.indexOf("?")) : member.user.avatarURL]
      });
      if (joinRole) {
        member.addRole(joinRole).catch(err => {
          return false;
        });
      }
    }
  })
  .on('guildMemberRemove', member => {
    let leaveMsg = global.settings.get(member.guild.id, "leaveMsg", false);
    let leaveMsgChannel = global.settings.get(member.guild.id, "leaveMsgChannel", false)
    if (leaveMsg && leaveMsgChannel) {
      let msg = leaveMsg.replace('{user}', '<@' + member.id + '>');
      member.guild.channels.get(leaveMsgChannel).send(msg, {
        files: [member.user.avatarURL.indexOf("?") > -1 ? member.user.avatarURL.substring(0, member.user.avatarURL.indexOf("?")) : member.user.avatarURL]
      });
    }
  })
  .on('messageReactionAdd', (reaction, user) => {
    console.log(user);
  });

client.login(process.env.TOKEN)