const Commando = require('discord.js-commando');

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
          type: "role",
          infinite: true
        }
      ]
    })
  }

  run(msg, {
    member,
    role
  }) {
    let roleGivers = global.settings.get(msg.guild.id, "roleGivers", false);
    let giveableRoles = global.settings.get(msg.guild.id, "giveableRoles", false);
    if (msg.guild.ownerID === msg.member.id) {
      member.addRoles(role).catch(err => {
        return false;
      });
      msg.reply(`Gave ${role.map(x => x.name)} to ${member}.`);
    } else if (roleGivers && giveableRoles && roleGivers.filter(element => msg.member.roles.has(element)).length > 0) {
      let allowedRoles = role.filter(element => giveableRoles.includes(element.id));
      if (!allowedRoles.length) {
        msg.reply("You cannot give any of these roles.");
      } else if (allowedRoles.length == role.length) {
        member.addRoles(role).catch(err => {
          return false;
        });
        msg.reply(`Gave ${role.map(x => x.name)} to ${member}.`);
      } else {
        member.addRoles(allowedRoles).catch(err => {
          return false;
        });
        msg.reply(`Gave ${allowedRoles.map(x => x.name)} to ${member} but you cannot give ${role.filter(element => !giveableRoles.includes(element.id)).map(x => x.name)}.`)
      }
    } else if (!roleGivers) {
      msg.reply(`This command has not been setup with role givers. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else if (!giveableRoles) {
      msg.reply(`This command has not been setup with giveable roles. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else {
      msg.reply(`You cannot use this command.`)
    }
  }
}