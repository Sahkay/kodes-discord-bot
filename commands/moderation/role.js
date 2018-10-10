const Commando = require('discord.js-commando');
const records = require('../../util/records');

module.exports = class RoleCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "role",
      aliases: ["give"],
      group: "moderation",
      memberName: "role",
      description: "Gives the specified user the specified role",
      examples: ["role @user#1111 admin"],
      guildOnly: true,
      args: [{
          key: 'user',
          prompt: "What user would you like to give a role?",
          type: "user"
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
    user,
    role
  }) {
    records.get(msg.member.guild.id).then(res => {
      if (res.rows.length) {
        return res.rows[0]
      } else {
        return {};
      }
    }).then(server => {
      if (server.roleGiver != undefined && msg.member.roles.has(server.roleGiver)) {
        user.addRole(role);
        msg.reply(`Gave ${role} to ${user}`);
      }
    });
  }
}

module.exports = class RoleSetupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "rolesetup",
      aliases: ["givesetup"],
      group: "moderation",
      memberName: "rolesetup",
      description: "Sets up the specified role to be able to use the role command",
      examples: ["rolesetup admin"],
      guildOnly: true,
      args: [{
        key: 'desiredRole',
        prompt: "What role would you like to be able to use the role command?",
        type: "role"
      }]
    })
  }

  run(msg, {
    desiredRole
  }) {
    records.put(msg.member.guild.id, "roleGiver", desiredRole.id);
  }
}