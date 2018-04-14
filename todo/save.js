'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/todo',
  { logging: false });
const Todo = sequelize.define('Todo', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  todo: {
    type: Sequelize.STRING
  },
  status: {
    //真偽値
    type: Sequelize.BOOLEAN
  }
}, {
  freezeTableName: true,
  timestamps: true
});

Todo.sync();
module.exports = Todo;