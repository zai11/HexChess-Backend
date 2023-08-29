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
            res.send(err.message);
        });
    });
    app.post('/users', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = createHash('sha256').update(req.body.password).digest('hex');
        const email = req.body.email;
        const elo = 1000;
        index_1.default.none('INSERT INTO users (username, password, email, elo) VALUES ($1, $2, $3, $4);', [username, password, email, elo])
            .then(() => {
            res.send(JSON.stringify({ success: true, user: { username: username, email: email, elo: elo } }));
        })
            .catch((err) => {
            console.log(err.constraint);
            if (err.constraint === 'unique_username')
                res.send(JSON.stringify({ success: false, err: 'That username is already taken. Please try again.', username: username }));
            else if (err.constraint === 'unique_email')
                res.send(JSON.stringify({ success: false, err: 'That email is already taken. Please try again.', email: email }));
            else
                res.send(JSON.stringify({ success: false, err: err }));
        });
    }));
    app.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (req.body.username === '' || req.body.username === undefined || req.body.password == '' || req.body.password === undefined) {
            res.send(JSON.stringify({ success: false, err: 'Either the username or password field is empty. Please try again.' }));
            return;
        }
        const username = req.body.username;
        const password = createHash('sha256').update(req.body.password).digest('hex');
        index_1.default.many('SELECT * FROM users WHERE username=$1', username)
            .then((data) => {
            if (data[0].password === password)
                res.send(JSON.stringify({ success: true, user: { username: data[0].username, email: data[0].email, elo: data[0].elo } }));
            else
                res.send(JSON.stringify({ success: false, err: 'That password doesn\'t match our records. Please try again.' }));
        })
            .catch((err) => {
            index_1.default.many('SELECT * FROM users WHERE email=$1', username)
                .then((data) => {
                if (data[0].password === password)
                    res.send(JSON.stringify({ success: true, user: { username: data[0].username, email: data[0].email, elo: data[0].elo } }));
                else
                    res.send(JSON.stringify({ success: false, err: 'That password doesn\'t match our records. Please try again.' }));
            })
                .catch((err) => {
                res.send(JSON.stringify({ success: false, err: 'We couldn\'t find that username or email. Please try again.' }));
            });
        });
    }));
}
exports.default = userRoutes;
//# sourceMappingURL=users.js.map