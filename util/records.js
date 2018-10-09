function getRecord(id) {
  return global.pool.query("SELECT * FROM serverData WHERE serverID = $1", [id])
}

function setRecords(id, property, value, property2, value2) {
  return getRecord(id).then(res => {
    if (res.rows.length) {
      return true;
    } else {
      return false;
    }
  }).then(exists => {
    if (exists) {
      global.pool.query(`UPDATE serverData SET ${property} = $1, ${property2} = $2 WHERE serverID = $3`, [value, value2, id], (err, res) => {
        if (err) throw err;
        return true;
      });
    } else {
      global.pool.query(`INSERT INTO serverData (serverID, ${property}, ${property2}) VALUES ($1, $2, $3)`, [id, value, value2], (err, res) => {
        if (err) throw err;
        return true;
      })
    }
  })
}

function setRecord(id, property, value) {
  return getRecord(id).then(res => {
    if (res.rows.length) {
      return true;
    } else {
      return false;
    }
  }).then(exists => {
    if (exists) {
      global.pool.query(`UPDATE serverData SET ${property} = $1 WHERE serverID = $2`, [value, id], (err, res) => {
        if (err) throw err;
        return true;
      });
    } else {
      global.pool.query(`INSERT INTO serverData (serverID, ${property}) VALUES ($1, $2)`, [id, value], (err, res) => {
        if (err) throw err;
        return true;
      })
    }
  })
}

function delRecord(id) {
  global.pool.query("DELETE FROM serverData WHERE serverID = $1", [id], (err, res) => {
    if (err) throw err;
  });
}

//MODULE
module.exports.add = function(id) {
  setRecords(id, 'joinMsg', 'Welcome {user}', 'joinMsgChannel', 'general').then(success => {
    if (success) {
      setRecords(id, 'leaveMsg', 'Goodbye {user}', 'leaveMsgChannel', 'general');
    }
  });
};

module.exports.remove = function(id) {
  delRecord(id);
}

module.exports.get = function(id) {
  return getRecord(id);
}

module.exports.putDouble = function(id, property, value, property2, value2) {
  setRecords(id, property, value, property2, value2);
}

module.exports.put = function(id, property, value) {
  setRecord(id, property, value);
}