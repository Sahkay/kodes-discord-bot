const Commando = require('discord.js-commando');

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
    const channel = msg.channel;
    const messageArg = msg.argString;
    this.client.on("guildMemberAdd", member => {
      member.guild.channels.get(channel.id).send(messageArg.replace("USER", member), {
        files: [member.user.avatarURL()]
      });
    })
  }
}