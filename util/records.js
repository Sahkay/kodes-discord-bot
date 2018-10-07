function getRecord(id) {
  /*let file = read();
  let servers = getArrayFromJSON(file);
  for (i = 0; i < servers.length; i++) {
    if (servers[i].id == id) {
      return servers[i];
    }
  }
  return undefined;*/
  return global.pool.query("SELECT * FROM serverData WHERE serverID = $1", [id])
}

function setRecord(id, property, value, property2, value2) {
  //Modify
  //let file = read();
  //let servers = getArrayFromJSON(file);
  //Add guild to JSON
  getRecord(id).then(res => {
    if (res.rows.length) {
      return true;
    } else {
      return false;
    }
  }).then(exists => {
    if (exists) {
      global.pool.query(`UPDATE serverData SET ${property} = $1, ${property2} = $2 WHERE serverID = $3`, [value, value2, id], (err, res) => {
        if (err) throw err;
      });
    }
  })
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
  setRecord(id, 'joinMsg', 'Welcome {user}', 'msgChannel', 'general');
};

module.exports.remove = function(id) {
  delRecord(id);
}

module.exports.get = function(id) {
  return getRecord(id);
}

module.exports.put = function(id, property, value, property2, value2) {
  setRecord(id, property, value, property2, value2);
}