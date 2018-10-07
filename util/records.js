function getRecord(id) {
  /*let file = read();
  let servers = getArrayFromJSON(file);
  for (i = 0; i < servers.length; i++) {
    if (servers[i].id == id) {
      return servers[i];
    }
  }
  return undefined;*/
  global.pool.query("SELECT * FROM serverData WHERE serverID = $1", [id], (err, res) => {
    if (err) throw err;
    if (res.rows.length) {
      return res.rows[0];
    } else {
      return undefined;
    }
  })
}

function hasRecord(id) {
  return getRecord(id) != undefined;
}

function setRecord(id, property, value) {
  //Modify
  //let file = read();
  //let servers = getArrayFromJSON(file);
  //Add guild to JSON
  if (hasRecord(id)) {
    /*for (i = 0; i < servers.length; i++) {
      if (servers[i].id == id) {
        let s = servers[i];
        s[property] = value;
        servers[i] = s;
        break;
      }
    } */
    global.pool.query("UPDATE serverData SET $1 = $2 WHERE serverID = $3", [property, value, id], (err, res) => {
      if (err) throw err;
    });
  } else {
    /* servers.push({
      id: id
    });
    servers[servers.length - 1][property] = value; */
    global.pool.query(`INSERT INTO serverData (serverID, ${property}) VALUES ($1, $2)`, [id, value], (err, res) => {
      if (err) throw err;
    });
  }
}

function delRecord(id) {
  /* let file = read();
  let servers = getArrayFromJSON(file);
  for (i = 0; i < servers.length; i++) {
    if (servers[i].id == id) {
      servers.splice(i, 1);
    }
  } */
  global.pool.query("DELETE FROM serverData WHERE serverID = $1", [id], (err, res) => {
    if (err) throw err;
  });
}

//MODULE
module.exports.add = function(id) {
  setRecord(id, 'join', 'Welcome {user}');
  setRecord(id, 'channel', 'general');
};

module.exports.remove = function(id) {
  delRecord(id);
}

module.exports.get = function(id) {
  return getRecord(id);
}

module.exports.has = function(id) {
  return hasRecord(id);
}

module.exports.put = function(id, property, value) {
  setRecord(id, property, value);
}