const Commando = require('discord.js-commando');

module.exports = class BanSetupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "bansetup",
      aliases: ["setupban"],
      group: "setup",
      memberName: "bansetup",
      description: "Sets up the specified role to be able to use the ban command",
      examples: ["bansetup admin"],
      guildOnly: true,
      args: [{
        key: 'role',
        prompt: "What role(s) would you like to be able to ban and unban using the commands?",
        type: "role",
        infinite: true
      }]
    })
  }

  run(msg, {
    give,
    role
  }) {
    let roleArray = role.map(x => x.id);
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can setup this command.`);
    } else {
      global.settings.set(msg.guild.id, "banGivers", roleArray).then(val => {
        msg.reply(`${role.map(x => x.name)} can now use the ban command.`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      })
    }
  }
}