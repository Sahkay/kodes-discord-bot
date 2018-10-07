/*
MIT License

Copyright (c) 2017 WeebDev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const Sequelize = require('sequelize');
const winston = require('winston');

const {
  DB
} = process.env;
const database = new Sequelize(DB, {
  logging: false
});

class Database {
  static get db() {
    return database;
  }

  static start() {
    database.authenticate()
      .then(() => winston.info('[POSTGRES]: Connection to database has been established successfully.'))
      .then(() => winston.info('[POSTGRES]: Synchronizing database...'))
      .then(() => database.sync()
        .then(() => winston.info('[POSTGRES]: Done Synchronizing database!'))
        .catch(error => winston.error(`[POSTGRES]: Error synchronizing the database: \n${error}`))
      )
      .catch(error => {
        winston.error(`[POSTGRES]: Unable to connect to the database: \n${error}`);
        winston.error(`[POSTGRES]: Try reconnecting in 5 seconds...`);
        setTimeout(() => Database.start(), 5000);
      });
  }
}

module.exports = Database;