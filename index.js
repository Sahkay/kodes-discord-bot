const sqlite = require('sqlite');
const Commando = require('discord.js-commando');
const client = new Commando.Client({
  owner: '206620273443602432'
});
const path = require('path');
const records = require('./util/records');

client.registry.registerGroups([
  ['auto', 'Automatic commands such as join/leave messages.'],
  ['roles', 'Commands related to roles and their assignment.'],
  ['moderation', 'Commands related to server moderation']
]).registerDefaults().registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

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
  .on('guildCreate', guild => {
    records.add(guild.id);
  })
  .on('guildDelete', guild => {
    records.remove(guild.id);
  })
  .on('guildMemberAdd', member => {
    console.log(member.guild.id);
    let server = records.get(member.guild.id);
    console.log(server);
    if (server.join != undefined && server.channel != undefined) {
      let msg = server.join.replace('{user}', '<@' + member.id + '>');
      member.guild.channels.find("name", server.channel).send(msg, {
        files: [member.user.avatarURL]
      });
    }
    if (server.role != undefined) {
      let role = member.guild.roles.find("name", server.role);
      if (role != undefined) {
        member.addRole(role).catch(error => {
          member.guild.owner.send("Error on **" + member.guild.name + "**: I dont have the permission to auto-assign the role you set. Make sure my role `Welcome Bot` is higher in the roles list than the one you want me to auto-assign");
        });
      }
    }
  });

client.login(process.env.TOKEN)