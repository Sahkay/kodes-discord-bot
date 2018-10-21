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
      examples: ["reactrole getroles Get your roles here"],
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
          messages[messages.length - 1].reaction = this.client.emojis.find(emoji => emoji.id === tempSplit[0].slice(1, -1).replace(/([^:]*:){2}/, '')) ? this.client.emojis.find(emoji => emoji.id === tempSplit[0].slice(1, -1).replace(/([^:]*:){2}/, '')).id : tempSplit[0];
          messages[messages.length - 1].roles = tempSplit.slice(1);
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
    global.settings.set(guildID, "reactRoles", {
      channel: channel.id,
      messages: messages
    });
  }
}