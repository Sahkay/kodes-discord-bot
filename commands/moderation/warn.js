const Commando = require('discord.js-commando');

module.exports = class WarnCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "warn",
      aliases: ["warning"],
      group: "moderation",
      memberName: "warn",
      description: "Warns the specified member for a specified reason and removes their perms for an specified duration",
      examples: ["warn member 1/2/30 Do not spam!"],
      guildOnly: true,
      args: [{
          key: 'member',
          prompt: "What member would you like to warn?",
          type: "member"
        },
        {
          key: 'time',
          prompt: "How long should they be muted for?",
          type: "string"
        },
        {
          key: 'reason',
          prompt: "Why is the member being warned?",
          type: "string",
          infinite: true
        }
      ]
    })
  }

  run(msg, {
    member,
    time,
    reason
  }) {
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
    let warnGivers = global.settings.get(msg.guild.id, "warnGivers", false);
    let mutedRole = global.settings.get(msg.guild.id, "mutedRole", false);
    let warningsGiven = global.settings.get(msg.guild.id, "warningsGiven", {});
    if ((msg.guild.ownerID === msg.member.id || (warnGivers && warnGivers.some(element => msg.member.roles.has(element)))) && mutedRole) {
      if (warningsGiven[member.id]) {
        msg.reply(`The member is already warned until ${new Date(warningsGiven[member.id].endTime).toTimeString()}`);
      } else {
        member.addRoles(mutedRole).catch(err => {
          console.log(err);
          msg.reply(`The member could not be given the muted role as punishment.`);
          return false;
        });
        member.send(reason);
        setTimeout(function(warnedMember, roleApplied) {
          warnedMember.removeRoles(roleApplied).catch(err => {
            console.log(err);
            return false;
          });
          let tempWarningsGiven = global.settings.get(msg.guild.id, "warningsGiven", false);
          if (tempWarningsGiven && tempWarningsGiven[warnedMember.id]) {
            delete tempWarningsGiven[warnedMember.id];
            global.settings.set(warnedMember.guild.id, "warningsGiven", tempWarningsGiven).catch(err => {
              console.log(err);
              return false;
            });
          }
        }, 3600000, member, mutedRole);
        let tempEndTime = new Date();
        tempEndTime.setTime(tempEndTime.getTime() + 3600000);
        warningsGiven[member.id] = {
          endTime: tempEndTime.valueOf(),
          roleApplied: mutedRole
        }
        global.settings.set(msg.guild.id, "warningsGiven", warningsGiven).then(val => {
          msg.reply(`The member has been warned for an hour.`);
        }).catch(err => {
          msg.reply(`The member has been warned for an hour but the warning could not be saved to the database.`);
        });
      }
    } else if (!mutedRole) {
      msg.reply(`This command has not been setup with the muted role. This command cannot be used without anyone until a muted role is set.`)
    } else if (!warnGivers) {
      msg.reply(`This command has not been setup with warning givers. Please notify ${msg.guild.owner.displayName} to setup this command.`);
    } else {
      msg.reply(`You cannot use this command.`)
    }
  }
}