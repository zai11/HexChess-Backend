import express from 'express';

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://server:password@localhost:5432/hexchess')

export default db;