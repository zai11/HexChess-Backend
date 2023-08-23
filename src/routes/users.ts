import db from '../db/index';
const { createHash } = require('crypto');

function userRoutes (app) {
  app.get('/users', (req, res) => {
    db.many('SELECT * FROM users')
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.post('/users', async (req, res) => {
    const username = req.body.username;
    const password = createHash('sha256').update(req.body.password).digest('hex');
    const email = req.body.email;
    const elo = 1000;
    
    db.none('INSERT INTO users (username, password, email, elo) VALUES ($1, $2, $3, $4);', [username, password, email, elo])
      .then(() => {
        res.send(JSON.stringify("{'success': 'true'}"));
        
      })
      .catch((err) => {
        res.send(JSON.stringify("{ success: false, err: '" + err + "'}"));
      });
  });
}

export default userRoutes;