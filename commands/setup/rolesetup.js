const Commando = require('discord.js-commando');

module.exports = class RoleSetupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "rolesetup",
      aliases: ["setuprole"],
      group: "setup",
      memberName: "rolesetup",
      description: "Sets up the specified role to be able to use the role command or the roles giveable using the command",
      examples: ["rolesetup true gamer", "rolesetup false admin"],
      guildOnly: true,
      args: [{
          key: 'give',
          prompt: "Would you like to set the giveable roles?",
          type: "boolean"
        },
        {
          key: 'role',
          prompt: "What role(s) would you like to be able to give or giveable using the role command?",
          type: "role",
          infinite: true
        }
      ]
    })
  }

  run(msg, {
    give,
    role
  }) {
    let roleArray = role.map(x => x.id);
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can setup this command.`);
    } else if (give) {
      global.settings.set(msg.guild.id, "giveableRoles", roleArray).then(val => {
        msg.reply(`${role.map(x => x.name)} can now be given using the role command.`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      });
    } else {
      global.settings.set(msg.guild.id, "roleGivers", roleArray).then(val => {
        msg.reply(`${role.map(x => x.name)} can now use the role command.`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      })
    }
  }
}