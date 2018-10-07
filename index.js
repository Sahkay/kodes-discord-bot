const {
  Pool
} = require('pg');
global.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
const SequelizeProvider = require("./util/sequelize");
const Database = require("./util/PostgreSQL")
const Commando = require('discord.js-commando');
const client = new Commando.Client({
  owner: '206620273443602432'
});
const path = require('path');
const records = require('./util/records');

pool.connect();

/* pool.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  pool.end();
}); */
pool.query("CREATE TABLE IF NOT EXISTS serverData (serverID bigint PRIMARY KEY, joinMsg text NULL, msgChannel text NULL)", (err, res) => {
  if (err) throw err;
  //pool.end();
})

client.registry.registerGroups([
  ['auto', 'Automatic commands such as join/leave messages.'],
  ['roles', 'Commands related to roles and their assignment.'],
  ['moderation', 'Commands related to server moderation']
]).registerDefaults().registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(new SequelizeProvider(Database.db));

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
    let serverQuery = records.get(member.guild.id).then(res => {
      if (res.rows.length) {
        return res.rows[0]
      } else {
        return {};
      }
    }).then(server => {
      console.log(server);
      if (server.joinmsg != undefined && server.msgchannel != undefined) {
        let msg = server.joinmsg.replace('{user}', '<@' + member.id + '>');
        member.guild.channels.find("name", server.msgchannel).send(msg, {
          files: [member.user.avatarURL]
        });
      }
    })
  });

client.login(process.env.TOKEN)