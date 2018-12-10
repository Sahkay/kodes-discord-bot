const Commando = require('discord.js-commando');

class ReactTemplateArgumentType extends Commando.ArgumentType {
  constructor(client) {
    super(client, 'reactTemplate');
  }
  validate(val, msg, arg) {
    //return val.toLowerCase() === 'dank';
    let templateSplit = template.split(/({[^{}]+})/g).filter(function(el) {
      return el !== "";
    });
    let messages = [];
    let continueHandler = templateSplit.every(function(value) {
      if (value[0] === "{") {
        if (!messages.length) {
          return "You cannot use a reaction section without a message first.";
        } else if (messages[messages.length - 1].used) {
          msg.reply();
          return "You cannot use more than one reaction section per message please use multiple roles in one reaction or multiple messages.";
        } else {
          let tempSplit = value.trim().slice(1, -1).split(",").map(x => x.trim());
          if (!this.client.emojis.find(emoji => emoji.id === tempSplit[0].slice(1, -1).replace(/([^:]*:){2}/, ''))) {
            if (!Name.get(tempSplit[0])) {
              msg.reply(`I cannot use the ${tempSplit[0]} emoji that you provided.`);
              return false;
            }
          }
          let tempRoles = tempSplit.slice(1);
          tempRoles.forEach(roleName => {
            msg.guild.roles.find(guildRole => guildRole.name === guild)
          }, this)
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
  }
  parse(val, msg) {
    return val;
  }
}

module.exports = ReactTemplateArgumentType;