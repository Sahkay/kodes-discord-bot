const Commando = require('discord.js-commando');

module.exports = class RemoveRoleCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "removerole",
      aliases: ["takerole"],
      group: "moderation",
      memberName: "removerole",
      description: "Removes the specified role from the specified member",
      examples: ["removerole member admin"],
      guildOnly: true,
      args: [{
          key: 'member',
          prompt: "What member would you like to remove a role from?",
          type: "member"
        },
        {
          key: 'role',
          prompt: "What role would you like to remove?",
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
    let roleRemovers = global.settings.get(msg.guild.id, "roleRemovers", false);
    let removableRoles = global.settings.get(msg.guild.id, "removableRoles", false);
    if (msg.guild.ownerID === msg.member.id) {
      member.removeRoles(role).catch(err => {
        return false;
      });
      msg.reply(`Took ${role.map(x => x.name)} from ${member}.`);
    } else if (roleRemovers && removableRoles && roleRemovers.filter(element => msg.member.roles.has(element)).length > 0) {
      let allowedRoles = role.filter(element => removableRoles.includes(element.id));
      if (!allowedRoles.length) {
        msg.reply("You cannot remove any of these roles.");
      } else if (allowedRoles.length == role.length) {
        member.removeRoles(role).catch(err => {
          return false;
        });
        msg.reply(`Took ${role.map(x => x.name)} from ${member}.`);
      } else {
        member.removeRoles(allowedRoles).catch(err => {
          return false;
        });
        msg.reply(`Took ${allowedRoles.map(x => x.name)} from ${member} but you cannot take ${role.filter(element => !removableRoles.includes(element.id)).map(x => x.name)}.`)
      }
    } else if (!roleRemovers) {
      msg.reply(`This command has not been setup with role removers. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else if (!removableRoles) {
      msg.reply(`This command has not been setup with removable roles. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else {
      msg.reply(`You cannot use this command.`)
    }
  }
}