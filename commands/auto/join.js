const Commando = require('discord.js-commando');
const records = require('.../util/records');

module.exports = class JoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "join",
      aliases: ["welcome"],
      group: "auto",
      memberName: "join",
      description: "Sets up the current channel for user join messages.",
      examples: ["join Welcome USER"],
      guildOnly: true
    })
  }

  run(msg) {
    records.put(msg.member.guild.id, "join", msg);
    records.put(msg.member.guild.id, 'channel', msg.channel);
  }
}