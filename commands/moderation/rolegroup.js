const Commando = require('discord.js-commando');

module.exports = class RoleGroupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "rolegroup",
      aliases: ["group"],
      group: "moderation",
      memberName: "rolegroup",
      description: "Creates or updates a role group",
      examples: ["role races human elf dwarf"],
      guildOnly: true,
      args: [{
          key: 'group',
          prompt: "What is the name of the group?",
          type: "string"
        },
        {
          key: 'separator',
          prompt: "What is the separator in the roles list?",
          type: "string"
        },
        {
          key: 'role',
          prompt: "What roles are in the group?",
          type: "role",
          default: '',
          infinite: true
        }
      ]
    })
  }

  run(msg, {
    group,
    separator,
    role
  }) {
    let roleGroups = global.settings.get(msg.guild.id, "roleGroups", false);
    if (msg.guild.ownerID === msg.member.id) {
      if (roleGroups) {
        roleGroups[group.toLowerCase()] = {
          separator: separator,
          roles: role
        }
        global.settings.set(msg.guild.id, "roleGroups", roleGroups).then(val => {
          msg.reply(`The role group ${group.toLowerCase()} has been saved.`);
        }).catch(err => {
          msg.reply("The role group could not be saved.");
        });
      } else {
        roleGroups = {};
        roleGroups[group.toLowerCase()] = {
          separator: separator,
          roles: role
        }
        global.settings.set(msg.guild.id, "roleGroups", roleGroups).then(val => {
          msg.reply(`The role group ${group.toLowerCase()} has been saved.`);
        }).catch(err => {
          msg.reply("The role group could not be saved.");
        });
      }
      /*msg.guild.ban(user, reason).then(bannedUser => {
        msg.reply(`Banned ${bannedUser} for ${reason}.`);
      }).catch(err => {
        msg.reply(`The user could not be banned.`);
        console.log(err);
      }); */
    } else {
      msg.reply(`Only the guild owner can use this command.`)
    }
  }
}