"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../db/index"));
const { createHash } = require('crypto');
function userRoutes(app) {
    app.get('/users', (req, res) => {
        index_1.default.many('SELECT * FROM users')
            .then((data) => {
            res.send(data);
        })
            .catch((err) => {
            console.log(err);
        });
    });
    app.post('/users', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = createHash('sha256').update(req.body.password).digest('hex');
        const email = req.body.email;
        const elo = 1000;
        index_1.default.none('INSERT INTO users (username, password, email, elo) VALUES ($1, $2, $3, $4);', [username, password, email, elo])
            .then(() => {
            res.send(JSON.stringify("{'success': 'true'}"));
        })
            .catch((err) => {
            res.send(JSON.stringify("{ success: false, err: '" + err + "'}"));
        });
    }));
}
exports.default = userRoutes;
//# sourceMappingURL=users.js.map