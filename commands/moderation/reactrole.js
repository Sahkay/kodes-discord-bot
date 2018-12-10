const Commando = require('discord.js-commando');
const Name = require("emoji-unicode-map");

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports = class ReactRoleCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "reactrole",
      aliases: ["react"],
      group: "moderation",
      memberName: "reactrole",
      description: "Sets the reaction role message for the server.",
      examples: ["reactrole getroles get admin {:grinning:, admin}"],
      guildOnly: true,
      args: [{
          key: 'channel',
          prompt: "What channel would you like to house the role reactions?",
          type: "channel"
        },
        {
          key: 'template',
          prompt: "Enter the message using appropriate sections for reactions",
          type: "string"
        }
      ]
    })
  }

  run(msg, {
    channel,
    template
  }) {
    if (msg.guild.ownerID !== msg.member.id) {
      msg.reply(`Only ${msg.guild.owner.displayName} can use this command.`);
    } else {
      let templateSplit = template.split(/({[^{}]+})/g).filter(function(el) {
        return el !== "";
      });
      let messages = [];
      let continueHandler = templateSplit.every(function(value) {
        if (value[0] === "{") {
          if (!messages.length) {
            msg.reply("You cannot use a reaction section without a message first.");
            return false;
          } else if (messages[messages.length - 1].used) {
            msg.reply("You cannot use more than one reaction section per message please use multiple roles in one reaction or multiple messages.");
            return false;
          } else {
            let tempSplit = value.trim().slice(1, -1).split(",").map(x => x.trim());
            if (!this.client.emojis.find(emoji => emoji.id === tempSplit[0].slice(1, -1).replace(/([^:]*:){2}/, ''))) {
              if (!Name.get(tempSplit[0])) {
                msg.reply(`I cannot use the ${tempSplit[0]} emoji that you provided.`);
                return false;
              }
            }
            let tempRoles = tempSplit.slice(1);
            let validRoles = [];
            let gotError = false;
            for (let i = 0; i < tempRoles.length; i++) {
              const matches2 = tempRoles[i].match(/^(?:<@&)?([0-9]+)>?$/);
              const matches = /^(?:<@&)?([0-9]+)>?$/.exec(tempRoles[i]);
              if (matches && msg.guild.roles.has(matches[1])) {
                validRoles.push(matches[1]);
              } else {
                const search = tempRoles[i].toLowerCase();
                let roles = msg.guild.roles.filter(nameFilterInexact(search));
                if (roles.size > 0) {
                  if (roles.size === 1) {
                    validRoles.push(roles.first().id);
                  } else {
                    const exactRoles = roles.filter(nameFilterExact(search));
                    if (exactRoles.size === 1) {
                      validRoles.push(exactRoles.first().id);
                    } else {
                      msg.reply(`Too many roles match ${tempRoles[i]}.`);
                      gotError = true;
                      break;
                    }
                  }
                } else {
                  msg.reply(`I could not find the role ${tempRoles[i]}.`);
                  gotError = true;
                  break;
                }
              }
            }
            if (gotError) {
              return false;
            }
            messages[messages.length - 1].reaction = this.client.emojis.find(emoji => emoji.id === tempSplit[0].slice(1, -1).replace(/([^:]*:){2}/, '')) ? this.client.emojis.find(emoji => emoji.id === tempSplit[0].slice(1, -1).replace(/([^:]*:){2}/, '')).id : tempSplit[0];
            messages[messages.length - 1].roles = validRoles;
            messages[messages.length - 1].used = true;
            return true;
          }
        } else {
          messages.push({
            message: value,
            reaction: false,
            roles: [],
            used: false
          });
          return true;
        }
      }, this);
      if (continueHandler) {
        sendMessages(channel, messages, msg.guild.id);
      }
    }
  }
}

const sendMessages = async (channel, messages, guildID) => {
  let gotError = false;
  await asyncForEach(messages, async (value) => {
    await channel.send(value.message).then(async (msg) => {
      await msg.react(value.reaction).then(reaction => {
        value.id = msg.id;
      }).catch(err => {
        console.log(err);
        gotError = true;
      })
    }).catch(err => {
      console.log(err);
      gotError = true;
    });
  });
  if (!gotError) {
    global.settings.set(guildID, "reactRoles", messages).then(val => {
      global.settings.set(guildID, "reactRolesChannel", channel.id).catch(err => {
        msg.reply("Could not save the data.");
      })
    }).catch(err => {
      msg.reply("Could not save the data.");
    })

  }
}

function nameFilterExact(search) {
  return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
  return thing => thing.name.toLowerCase().includes(search);
}