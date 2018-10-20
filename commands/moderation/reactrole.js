const Commando = require('discord.js-commando');

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
    let templateSplit = template.split(/({\S+})/g).filter(function(el) {
      return el !== "";
    });
    let messages = [];
    templateSplit.forEach(function(value) {
      if (value[0] === "{") {
        if (!messages.length) {
          msg.reply("You cannot use a reaction section without a message first.");
        } else if (messages[messages.length - 1].used) {
          msg.reply("You cannot use more than one reaction section per message please use multiple roles in one reaction or multiple messages.")
        } else {
          let tempSplit = value.split(",").map(x => x.trim());
          //messages[messages.length - 1].reaction = tempSplit[0].slice(1, -2).replace(/([^:]*:){2}/, '');
          messages[messages.length - 1].reaction = tempSplit[0].slice(1, -1);
          messages[messages.length - 1].roles = tempSplit.slice(1);
          messages[messages.length - 1].used = true;
        }
      } else {
        messages.push({
          message: value,
          reaction: false,
          roles: [],
          used: false
        })
      }
    });
    sendMessages(channel, messages);
    console.log(template)
  }
}

function sendMessages(channel, messages) {
  messages.forEach(async function(value) {
    await channel.send(value.message).then(msg => {
      msg.react(value.reaction);
      console.log(value.reaction);
    }).catch(err => {
      console.log(err);
    });
  });
}