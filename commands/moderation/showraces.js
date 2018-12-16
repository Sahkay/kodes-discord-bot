const Commando = require('discord.js-commando');

module.exports = class ShowRacesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "showraces",
      aliases: ["races", "race", "showrace"],
      group: "moderation",
      memberName: "showraces",
      description: "Shows the currently set races for the guild",
      examples: ["showraces"],
      guildOnly: true
    })
  }

  run(msg) {
    let savedRaces = global.settings.get(msg.guild.id, "races", false);
    if (savedRaces) {
      msg.reply(`The races in this guild are ${msg.guild.roles.filter(r => savedRaces.includes(r.id)).map(x => x.name)}`);
    } else {
      msg.reply(`This guild has no races set.`);
    }
  }
}
