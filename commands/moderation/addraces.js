const Commando = require('discord.js-commando');

module.exports = class AddRacesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "addraces",
      aliases: ["addrace"],
      group: "moderation",
      memberName: "addrace",
      description: "Adds roles to the races",
      examples: ["addraces human elf dwarf"],
      guildOnly: true,
      args: [{
          key: 'race',
          prompt: "What races do you want to add?",
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
        let newRaces = race.filter(r => !savedRaces.includes(r.id));
        if (!newRaces.length) {
          msg.reply("These races are all already set.");
        } else if (newRaces.length === race.length) {
          global.settings.set(msg.guild.id, "races", race.map(x => x.id)).then(val => {
            msg.reply("The races have been saved.");
          }).catch(err => {
            msg.reply("The races could not be saved.");
          });
        } else {
          global.settings.set(msg.guild.id, "races", savedRaces.concat(newRaces.map(x => x.id))).then(val => {
            msg.reply(`The races ${newRaces.map(x => x.name)} have been saved but the races ${race.filter(e => savedRaces.includes(e.id)).map(x => x.name)} were already saved.`)
          }).catch(err => {
            msg.reply("The races could not be saved.");
          });
        }
        /* global.settings.set(msg.guild.id, "races", raceGroup).then(val => {
          msg.reply(`The races have been saved.`);
        }).catch(err => {
          msg.reply("The races could not be saved.");
        }); */
      } else {
        global.settings.set(msg.guild.id, "races", race.map(x => x.id)).then(val => {
          msg.reply("The races have been saved.");
        }).catch(err => {
          msg.reply("The races could not be saved.");
        });
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
