const Commando = require('discord.js-commando');
const records = require('../../util/records');

module.exports = class LeaveCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "leave",
      aliases: ["goodbye", "bye"],
      group: "auto",
      memberName: "leave",
      description: "Sets up the current channel for user leave messages.",
      examples: ["leave Goodbye {user}"],
      guildOnly: true,
      args: [{
        key: 'text',
        prompt: "What would you like the goodbye message to be?",
        type: "string"
      }]
    })
  }

  run(msg, {
    text
  }) {
    records.put(msg.member.guild.id, "leaveMsg", text, 'leaveMsgChannel', msg.channel.name);
  }
}