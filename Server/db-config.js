
const knex = require('knex');
const config = require('./knexfile.js');
//Use dev config
const db = knex(config.development);
module.exports = db;
