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

const {
  Pool
} = require('pg');
global.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  //ssl: true,
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

/* pool.query("CREATE TABLE IF NOT EXISTS serverData (serverID bigint PRIMARY KEY, roleGivers bigint[] NULL, giveableRoles bigint[] NULL, roleTakers bigint[] NULL, takeableRoles bigint[] NULL, joinRole bigint NULL, joinMsg text NULL, joinMsgChannel bigint NULL, leaveMsg text Null, leaveMsgChannel bigint NULL, reactRoles bigint[][], warnTimers warn_timer[])", (err, res) => {
  if (err) throw err;
  //pool.end();
});

pool.query("CREATE TABLE IF NOT EXISTS warnedMembers (warnedMemberID integer PRIMARY KEY, serverID bigint REFERENCES serverData, memberID bigint, endTime timestamp NULL, warningCount smallint DEFAULT 0, reason text NULL, banned boolean DEFAULT false)", (err, res) => {
  if (err) throw err;
  //pool.end();
});

pool.query("CREATE TABLE IF NOT EXISTS roleGroups (roleGroupID integer PRIMARY KEY, serverID bigint REFERENCES serverData, roles bigint[] NULL, groupName text NULL, groupLabelRole bigint NULL)", (err, res) => {
  if (err) throw err;
  //pool.end();
});

pool.query("CREATE TABLE IF NOT EXISTS reactRolesMessages (reactRolesMessageID integer PRIMARY KEY, serverID bigint REFERENCES serverData, roleGroupID integer REFERENCES roleGroups, groupName text NULL, groupLabelRole bigint NULL)", (err, res) => {
  if (err) throw err;
  //pool.end();
}); */
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
  .on('guildCreate', guild => {
    records.add(guild.id);
  })
  .on('guildDelete', guild => {
    records.remove(guild.id);
  })
  .on('guildMemberAdd', member => {
    records.get(member.guild.id).then(res => {
      if (res.rows.length) {
        return res.rows[0]
      } else {
        return {};
      }
    }).then(server => {
      if (server.joinmsg != undefined && server.joinmsgchannel != undefined) {
        let msg = server.joinmsg.replace('{user}', '<@' + member.id + '>');
        member.guild.channels.find("name", server.joinmsgchannel).send(msg, {
          files: [member.user.avatarURL.indexOf("?") > -1 ? member.user.avatarURL.substring(0, member.user.avatarURL.indexOf("?")) : member.user.avatarURL]
        });
        if (server.joinRole != undefined) {
          member.addRole(server.joinRole);
        }
      }
    })
  })
  .on('guildMemberRemove', member => {
    let serverQuery = records.get(member.guild.id).then(res => {
      if (res.rows.length) {
        return res.rows[0]
      } else {
        return {};
      }
    }).then(server => {
      if (server.leavemsg != undefined && server.leavemsgchannel != undefined) {
        let msg = server.leavemsg.replace('{user}', '<@' + member.id + '>');
        member.guild.channels.find("name", server.leavemsgchannel).send(msg, {
          files: [member.user.avatarURL]
        });
      }
    })
  });

client.login(process.env.TOKEN)