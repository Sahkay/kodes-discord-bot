const Commando = require('discord.js-commando');
//const records = require('../../util/records');

module.exports = class JoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "join",
      aliases: ["welcome", "hello", "hi", "hey"],
      group: "auto",
      memberName: "join",
      description: "Sets up the current channel for user join messages and an automatic role.",
      examples: ["join Welcome {user}"],
      guildOnly: true,
      args: [{
          key: 'role',
          prompt: "What role would you like to be automatically given?",
          type: "role",
          default: null
        },
        {
          key: 'text',
          prompt: "What would you like the welcome message to be?",
          type: "string",
          default: null
        }
      ]
    })
  }

  run(msg, {
    role,
    text
  }) {
    /* if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can use this command.`);
    } else if (!role && !text) {
      records.put(msg.guild.id, "joinMsgChannel", msg.channel.id).then(exists => {
        if (exists) {
          msg.reply(`${msg.channel} is now the welcoming channel.`);
        } else {
          msg.reply("The welcoming channel could not be saved.");
        }
      })
    } else {
      records.putDouble(msg.guild.id, (text ? "joinMsg" : "joinRole"), (text ? text : role), 'joinMsgChannel', msg.channel.id).then(exists => {
        if (exists && text && role) {
          records.put(msg.guild.id, "joinRole", role).then(existsSecond => {
            if (existsSecond) {
              msg.reply(`${msg.channel} is now the welcoming channel with ${role} as the automatic role and a new message.`);
            } else {
              msg.reply(`${msg.channel} is now the welcoming channel with a new message but the role could not be saved.`);
            }
          });
        } else if (exists && text) {
          msg.reply(`${msg.channel} is now the welcoming channel with a new message.`);
        } else if (exists && role) {
          msg.reply(`${msg.channel} is now the welcoming channel with ${role} as the automatic role.`)
        } else {
          msg.reply("The data could not be saved.");
        }
      })
    } */
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can use this command.`);
    } else if (!role && !text) {
      global.settings.set(msg.guild.id, "joinMsgChannel", msg.channel.id).then(val => {
        msg.reply(`${msg.channel} is now the welcoming channel.`);
      }).catch(err => {
        msg.reply("The welcoming channel could not be saved.");
      });
    } else {
      global.settings.set(msg.guild.id, (text ? "joinMsg" : "joinRole"), (text ? text : role)).then(val => {
        if (text && role) {
          global.settings.set(msg.guild.id, "joinRole", role.id).then(val2 => {
            global.settings.set(msg.guild.id, "joinMsgChannel", msg.channel.id).then(val3 => {
              msg.reply(`${msg.channel} is now the welcoming channel with ${role} as the automatic role and a new message.`);
            }).catch(err => {
              msg.reply(`${role} is now the automatic role with a new message but the channel could not be saved.`);
            })
          }).catch(err => {
            msg.reply(`The new welcome message has been set but the other data could not be saved.`);
          })
        } else if (text) {
          global.settings.set(msg.guild.id, "joinMsgChannel", msg.channel.id).then(val2 => {
            msg.reply(`${msg.channel} is now the welcoming channel with a new message.`);
          }).catch(err => {
            msg.reply(`The new welcome message has been set but the channel could not be saved.`);
          })
        } else if (role) {
          global.settings.set(msg.guild.id, "joinMsgChannel", msg.channel.id).then(val2 => {
            msg.reply(`${msg.channel} is now the welcoming channel with ${role} as the automatic role.`);
          }).catch(err => {
            msg.reply(`${role} is now the automatic role but the channel could not be saved.`);
          })
        }
      }).catch(err => {
        msg.reply("The data could not be saved.");
      });
    }
  }
}