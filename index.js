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
	Ban Command with similar setup to assign role
	Unban Command uses setup for ban
	Warning command:
		similar setup to assign role
		Dm player with reason and give mute role for specified time using timer stored in db
	Auto warning with setup to be triggered on specified profanity in chat and mute the rule breaker after specified amount of infractions for specified time
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
    client.guilds.forEach(guild => {
      let warningsGiven = global.settings.get(guild.id, "warningsGiven", false);
      Object.keys(warningsGiven).map(function(objKey, index) {
        let dateNow = new Date();
        let unwarnDate = new Date(warningsGiven[objKey].endTime);
        if (dateNow >= unwarnDate) {
          guild.fetchMember(objKey, false).then(guildMember => {
            guildMember.removeRoles(warningsGiven[objKey].roleApplied).catch(err => {
              console.log(err);
              return false;
            });
          })
        }
      })
    })
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
        files: [member.user.displayAvatarURL.indexOf("?") > -1 ? member.user.displayAvatarURL.substring(0, member.user.displayAvatarURL.indexOf("?")) : member.user.displayAvatarURL]
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
        files: [member.user.displayAvatarURL.indexOf("?") > -1 ? member.user.displayAvatarURL.substring(0, member.user.displayAvatarURL.indexOf("?")) : member.user.displayAvatarURL]
      });
    }
  })
  .on('messageReactionAdd', (reaction, user) => {
    if (!user.bot) {
      let reactMessages = global.settings.get(reaction.message.guild.id, "reactRoles", false)
      if (reactMessages) {
        let messageMatch = reactMessages.filter(e => e.id === reaction.message.id);
        if (messageMatch.length > 0) {
          if (messageMatch[0].reaction === reaction.emoji.id || messageMatch[0].reaction === reaction.emoji.name) {
            if (messageMatch[0].roles.length > 0) {
              reaction.message.guild.fetchMember(user).then(val => {
                if (val) {
                  val.addRoles(messageMatch[0].roles).catch(err => {
                    console.log(err);
                    return false;
                  });
                }
              }).catch(err => {
                console.log(err);
              });
            }
          }
        }
      }
    }
  })
  .on('messageReactionRemove', (reaction, user) => {
    if (!user.bot) {
      let reactMessages = global.settings.get(reaction.message.guild.id, "reactRoles", false)
      if (reactMessages) {
        let messageMatch = reactMessages.filter(e => e.id === reaction.message.id);
        if (messageMatch.length > 0) {
          if (messageMatch[0].reaction === reaction.emoji.id || messageMatch[0].reaction === reaction.emoji.name) {
            if (messageMatch[0].roles.length > 0) {
              reaction.message.guild.fetchMember(user).then(val => {
                if (val) {
                  val.removeRoles(messageMatch[0].roles).catch(err => {
                    return false;
                  });
                }
              }).catch(err => {
                console.log(err);
              });
            }
          }
        }
      }
    }
  })
  .on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
      // Emojis can have identifiers of name:id format, so we have to account for that case as well
      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      // This gives us the reaction we need to emit the event properly, in top of the message object
      const reaction = message.reactions.get(emoji);
      // Check which type of event it is before emitting
      if (packet.t === 'MESSAGE_REACTION_ADD') {
        client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
      }
      if (packet.t === 'MESSAGE_REACTION_REMOVE') {
        client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
      }
    });
  });

client.login(process.env.TOKEN)