const Commando = require('discord.js-commando');
//const records = require('../../util/records');

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
        type: "string",
        default: null
      }]
    })
  }

  run(msg, {
    text
  }) {
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can use this command.`);
    } else if (!text) {
      /* records.put(msg.guild.id, "leaveMsgChannel", msg.channel.id).then(exists => {
        if (exists) {
          msg.reply(`${msg.channel} is now the farewells channel.`);
        } else {
          msg.reply("The farewells channel could not be saved.");
        }
      }) */
      global.settings.set(msg.guild.id, "leaveMsgChannel", msg.channel.id).then(val => {
        msg.reply(`${msg.channel} is now the farewells channel.`);
      }).catch(err => {
        msg.reply("The farewells channel could not be saved.");
      })
    } else {
      /* records.putDouble(msg.guild.id, "leaveMsg", text, 'leaveMsgChannel', msg.channel.id).then(exists => {
        if (exists) {
          msg.reply(`${msg.channel} is now the farewells channel with a new message.`);
        } else {
          msg.reply("The data could not be saved.");
        }
      }) */
      global.settings.set(msg.guild.id, "leaveMsg", text).then(val => {
        global.settings.set(msg.guild.id, "leaveMsgChannel", msg.channel.id).then(val2 => {
          msg.reply(`${msg.channel} is now the farewells channel with a new message.`);
        }).catch(err => {
          msg.reply(`The new farewell message has been set but the channel could not be saved.`);
        })
      }).catch(err => {
        msg.reply("The data could not be saved.");
      })
    }
  }
}