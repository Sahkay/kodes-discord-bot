const Commando = require('discord.js-commando');
const Name = require("emoji-name-map");

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
          type: "string",
          parse: text => {
            return text.replace(/```/g, '');
          }
        }
      ]
    })
  }

  run(msg, {
    channel,
    template
  }) {
    let templateSplit = template.split(/({[^\s{}]+})/g).filter(function(el) {
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
          console.log(tempSplit[0].slice(1, -1));
          if (!this.client.emojis.find(emoji => emoji.name === tempSplit[0].slice(1, -1))) {
            if (!Name.get(tempSplit[0])) {
              msg.reply(`I cannot use the ${tempSplit[0]} emoji that you provided.`);
              return false;
            }
          }
          messages[messages.length - 1].reaction = this.client.emojis.find(emoji => emoji.name === tempSplit[0].slice(1, -1)) ? this.client.emojis.find(emoji => emoji.name === tempSplit[0].slice(1, -1)).id : Name.get(tempSplit[0]);
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
    console.log(continueHandler);
    if (continueHandler) {
      sendMessages(channel, messages);
    }
    console.log(template)
  }
}

function sendMessages(channel, messages) {
  messages.forEach(async function(value) {
    await channel.send(value.message).then(msg => {
      msg.react(value.reaction).then(reaction => {

      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    });
  });
}