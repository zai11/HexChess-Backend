"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgp = require('pg-promise')( /* options */);
const db = pgp('postgres://server:password@localhost:5432/hexchess');
exports.default = db;
//# sourceMappingURL=index.js.map