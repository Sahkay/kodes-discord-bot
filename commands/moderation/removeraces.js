const Commando = require('discord.js-commando');

module.exports = class RemoveRacesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "removeraces",
      aliases: ["removerace"],
      group: "moderation",
      memberName: "removerace",
      description: "Removes roles from the races",
      examples: ["removeraces human elf"],
      guildOnly: true,
      args: [{
          key: 'race',
          prompt: "What races do you want to remove?",
          type: "role",
          infinite: true
        }
      ]
    })
  }

  run(msg, { race }) {
    let savedRaces = global.settings.get(msg.guild.id, "races", false);
    if (msg.guild.ownerID === msg.member.id) {
      if (savedRaces) {
        let racesToRemove = race.filter(r => savedRaces.includes(r.id));
        if (!racesToRemove.length) {
          msg.reply("These roles are not saved races.");
        } else if (racesToRemove.length === race.length) {
          /* global.settings.set(msg.guild.id, "races", race.map(x => x.id)).then(val => {
            msg.reply("The races have been saved.");
          }).catch(err => {
            msg.reply("The races could not be saved.");
          }); */
          global.settings.remove(msg.guild.id, "races").then(val => {
            msg.reply("The races specified have been removed.");
          }).catch(err => {
            msg.reply("The races specified could not be removed.");
          })
        } else {
          global.settings.set(msg.guild.id, "races", savedRaces.filter(r => !racesToRemove.map(x => x.id).includes(r))).then(val => {
            msg.reply(`The races specified have been removed.`)
          }).catch(err => {
            msg.reply("The races specified could not be removed.");
          });
        }
        /* global.settings.set(msg.guild.id, "races", raceGroup).then(val => {
          msg.reply(`The races have been saved.`);
        }).catch(err => {
          msg.reply("The races could not be saved.");
        }); */
      } else {
        msg.reply("No races have been set so none can be removed.");
        /* roleGroups = []
        roleGroups.push({
          separator: separator.id,
          roles:  role.map(x => x.id)
        });
        global.settings.set(msg.guild.id, "races", roleGroups).then(val => {
          msg.reply(`The races have been saved.`);
        }).catch(err => {
          msg.reply("The races could not be saved.");
        }); */
      }
    } else {
      msg.reply(`Only the guild owner can use this command.`)
    }
  }
}
