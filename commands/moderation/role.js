const Commando = require('discord.js-commando');
//const records = require('../../util/records');

module.exports = class RoleCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "role",
      aliases: ["addrole"],
      group: "moderation",
      memberName: "role",
      description: "Gives the specified member the specified role",
      examples: ["role @member#1111 admin"],
      guildOnly: true,
      args: [{
          key: 'member',
          prompt: "What member would you like to give a role?",
          type: "member"
        },
        {
          key: 'role',
          prompt: "What role would you like to give?",
          type: "role"
        }
      ]
    })
  }

  run(msg, {
    member,
    role
  }) {
    /* records.get(msg.guild.id).then(res => {
      if (res.rows.length) {
        return res.rows[0]
      } else {
        return {};
      }
    }).then(server => {
      if (msg.guild.ownerID === msg.member.id || (server.roleGivers != undefined && msg.member.roles.has(server.roleGivers))) {
        member.addRole(role);
        msg.reply(`Gave ${role} to ${member}.`);
      } else if (server.roleGivers == undefined) {
        msg.reply(`This command has not been setup. Please notify ${msg.guild.owner.displayName} to setup this command.`)
      } else {
        msg.reply(`You cannot use this command.`)
      }
    }); */
    if (msg.guild.ownerID === msg.member.id || (global.settings.get(msg.guild.id, "roleGivers", false) && server.roleGivers.filter(element => msg.member.roles.has(element)).length > 0)) {
      member.addRole(role);
      msg.reply(`Gave ${role} to ${member}.`);
    } else if (!global.settings.get(msg.guild.id, "roleGivers", false)) {
      msg.reply(`This command has not been setup. Please notify ${msg.guild.owner.displayName} to setup this command.`)
    } else {
      msg.reply(`You cannot use this command.`)
    }
  }
}