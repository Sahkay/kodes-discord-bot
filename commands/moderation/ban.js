const Commando = require('discord.js-commando');

module.exports = class BanCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "ban",
      group: "moderation",
      memberName: "ban",
      description: "Bans the specified user",
      examples: ["ban hacks4life spamming profanity"],
      guildOnly: true,
      args: [{
          key: 'user',
          prompt: "What user would you like to ban?",
          type: "user"
        },
        {
          key: 'reason',
          prompt: "Why is the user being banned?",
          type: "string",
          infinite: true
        }
      ]
    })
  }

  run(msg, {
    user,
    reason
  }) {
    let banGivers = global.settings.get(msg.guild.id, "banGivers", false);
    if (msg.guild.ownerID === msg.member.id) {
      /*member.addRoles(role).catch(err => {
        return false;
      });
      msg.reply(`Gave ${role.map(x => x.name)} to ${member}.`); */
      msg.guild.ban(user, reason).then(bannedUser => {
        msg.reply(`Banned ${bannedUser} for ${reason}.`);
      }).catch(err => {
        msg.reply(`The user could not be banned.`);
        console.log(err);
      });
    } else if (banGivers && banGivers.filter(element => msg.member.roles.has(element)).length > 0) {
      msg.guild.ban(user, reason).then(bannedUser => {
        msg.reply(`Banned ${bannedUser} for ${reason}.`);
      }).catch(err => {
        msg.reply(`The user could not be banned.`);
        console.log(err);
      });
    } else if (!banGivers) {
      msg.reply(`This command has not been setup with ban givers. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else {
      msg.reply(`You cannot use this command.`)
    }
    /* let roleGivers = global.settings.get(msg.guild.id, "roleGivers", false);
    let giveableRoles = global.settings.get(msg.guild.id, "giveableRoles", false);
    if (msg.guild.ownerID === msg.member.id) {
      member.addRoles(role).catch(err => {
        return false;
      });
      msg.reply(`Gave ${role.map(x => x.name)} to ${member}.`);
    } else if (roleGivers && giveableRoles && roleGivers.filter(element => msg.member.roles.has(element)).length > 0) {
      let allowedRoles = role.filter(element => giveableRoles.includes(element.id));
      if (!allowedRoles.length) {
        msg.reply("You cannot give any of these roles.");
      } else if (allowedRoles.length == role.length) {
        member.addRoles(role).catch(err => {
          return false;
        });
        msg.reply(`Gave ${role.map(x => x.name)} to ${member}.`);
      } else {
        member.addRoles(allowedRoles).catch(err => {
          return false;
        });
        msg.reply(`Gave ${allowedRoles.map(x => x.name)} to ${member} but you cannot give ${role.filter(element => !giveableRoles.includes(element.id)).map(x => x.name)}.`)
      }
    } else if (!roleGivers) {
      msg.reply(`This command has not been setup with role givers. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else if (!giveableRoles) {
      msg.reply(`This command has not been setup with giveable roles. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else {
      msg.reply(`You cannot use this command.`)
    } */
  }
}