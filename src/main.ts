import express from 'express'
import userRoutes from './routes/users'

var bodyParser = require('body-parser')

const app = express();
const port = 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

console.log(userRoutes);

userRoutes(app);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});