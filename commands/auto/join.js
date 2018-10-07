const Commando = require('discord.js-commando');
const records = require('../../util/records');

module.exports = class JoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "join",
      aliases: ["welcome"],
      group: "auto",
      memberName: "join",
      description: "Sets up the current channel for user join messages.",
      examples: ["join Welcome {user}"],
      guildOnly: true,
      args: [{
        key: 'text',
        prompt: "What would you like the welcome message to be?",
        type: "string"
      }]
    })
  }

  run(msg, {
    text
  }) {
    records.put(msg.member.guild.id, "join", text);
    records.put(msg.member.guild.id, 'channel', msg.channel.name);
  }
}