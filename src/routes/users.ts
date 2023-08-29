import db from '../db/index';
const { createHash } = require('crypto');

function userRoutes (app) {
  app.get('/users', (req, res) => {
    db.many('SELECT * FROM users')
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err.message)
      });
  });

  app.post('/users', async (req, res) => {
    const username = req.body.username;
    const password = createHash('sha256').update(req.body.password).digest('hex');
    const email = req.body.email;
    const elo = 1000;
    
    db.none('INSERT INTO users (username, password, email, elo) VALUES ($1, $2, $3, $4);', [username, password, email, elo])
      .then(() => {
        res.send(JSON.stringify({success: true, user: { username: username, email: email, elo: elo }}));
        
      })
      .catch((err) => {
        console.log(err.constraint);
        if (err.constraint === 'unique_username')
          res.send(JSON.stringify({ success: false, err: 'That username is already taken. Please try again.', username: username}));
        else if (err.constraint === 'unique_email')
          res.send(JSON.stringify({ success: false, err: 'That email is already taken. Please try again.', email: email}));
        else
          res.send(JSON.stringify({ success: false, err: err}));
      });
  });

  app.post('/login', async (req, res) => {

    if (req.body.username === '' || req.body.username === undefined || req.body.password == '' || req.body.password === undefined) {
      res.send(JSON.stringify({success: false, err: 'Either the username or password field is empty. Please try again.'}))
      return;
    }
  
    const username = req.body.username;
    const password = createHash('sha256').update(req.body.password).digest('hex');

    db.many('SELECT * FROM users WHERE username=$1', username)
      .then((data) => {
        if (data[0].password === password)
          res.send(JSON.stringify({success: true, user: { username: data[0].username, email: data[0].email, elo: data[0].elo }}))
        else
          res.send(JSON.stringify({success: false, err: 'That password doesn\'t match our records. Please try again.'}));
      })
      .catch((err) => {
        db.many('SELECT * FROM users WHERE email=$1', username)
          .then((data) => {
            if (data[0].password === password)
              res.send(JSON.stringify({success: true, user: { username: data[0].username, email: data[0].email, elo: data[0].elo }}))
            else
              res.send(JSON.stringify({success: false, err: 'That password doesn\'t match our records. Please try again.'}));
          })
          .catch((err) => {
            res.send(JSON.stringify({success: false, err: 'We couldn\'t find that username or email. Please try again.'}));
          });
      });
  });
}

export default userRoutes;