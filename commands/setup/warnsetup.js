const Commando = require('discord.js-commando');

module.exports = class WarnSetupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "warnsetup",
      aliases: ["setupwarn"],
      group: "setup",
      memberName: "warnsetup",
      description: "Sets up the specified role to be able to use the warn command",
      examples: ["warnsetup admin"],
      guildOnly: true,
      args: [{
          key: 'mutedRole',
          prompt: "Would you like to set the muted role(s)?",
          type: "boolean"
        },
        {
          key: 'role',
          prompt: "What role(s) would you like to be able to warn or the muted role(s) applied using the warn command?",
          type: "role",
          infinite: true
        }
      ]
    })
  }

  run(msg, {
    mutedRole,
    role
  }) {
    let roleArray = role.map(x => x.id);
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can setup this command.`);
    } else if (mutedRole) {
      global.settings.set(msg.guild.id, "mutedRole", roleArray).then(val => {
        msg.reply(`${role.map(x => x.name)} is now the muted role(s).`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      });
    } else {
      global.settings.set(msg.guild.id, "warnGivers", roleArray).then(val => {
        msg.reply(`${role.map(x => x.name)} can now use the warn command.`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      })
    }
  }
}