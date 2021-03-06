const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

const writeTodo = (callback, id, text) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.writeFile(filePath, text, (err) => {
    if (err) {
      throw ('error writing todo');
    } else {
      callback(null, { id, text });
    }
  });
};

const readTodo = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, '', (err, text) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id, text });
    }
  });
};

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    writeTodo(callback, id, text);
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, todos) => {
    if (err) {
      callback(err, []);
    } else {
      var data = _.map(todos, (id) => {
        id = path.basename(id, path.extname(id));
        return { id, text: id };
      });
      callback(null, data);
    }
  });

};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.open(filePath, 'r+', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      writeTodo(callback, id, text);
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.rm(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
