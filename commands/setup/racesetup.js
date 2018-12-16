const Commando = require('discord.js-commando');

module.exports = class RaceSetupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "racesetup",
      aliases: ["setuprace"],
      group: "setup",
      memberName: "racesetup",
      description: "Sets up the specified role as the label for races",
      examples: ["racesetup --race--"],
      guildOnly: true,
      args: [{
        key: 'role',
        prompt: "What role would you like to be the label for races?",
        type: "role"
      }]
    })
  }

  run(msg, {
    role
  }) {
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can setup this command.`);
    } else {
      global.settings.set(msg.guild.id, "raceLabel", role.id).then(val => {
        msg.reply(`${role.name} is now the race label.`);
      }).catch(err => {
        msg.reply("The data could not be saved.");
      })
    }
  }
}
