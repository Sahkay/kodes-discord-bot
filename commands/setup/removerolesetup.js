const Commando = require('discord.js-commando');

module.exports = class RemoveRoleSetupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "removerolesetup",
      aliases: ["setupremoverole"],
      group: "setup",
      memberName: "removerolesetup",
      description: "Sets up the specified role to be able to use the remove role command or the roles removable using the command",
      examples: ["removerolesetup true gamer", "removerolesetup false admin"],
      guildOnly: true,
      args: [{
          key: 'take',
          prompt: "Would you like to set the removable roles?",
          type: "boolean"
        },
        {
          key: 'role',
          prompt: "What role(s) would you like to be able to remove or removable using the removerole command?",
          type: "role",
          infinite: true
        }
      ]
    })
  }

  run(msg, {
    take,
    role
  }) {
    let roleArray = role.map(x => x.id);
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can setup this command.`);
    } else if (take) {
      global.settings.set(msg.guild.id, "removableRoles", roleArray).then(val => {
        msg.reply(`${role.map(x => x.name)} can now be taken using the role command.`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      });
    } else {
      global.settings.set(msg.guild.id, "roleRemovers", roleArray).then(val => {
        msg.reply(`${role.map(x => x.name)} can now use the removerole command.`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      })
    }
  }
}