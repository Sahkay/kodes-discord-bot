const Commando = require('discord.js-commando');

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
    //records.put(msg.member.guild.id, "joinMsg", text, 'joinMsgChannel', msg.channel.name);
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