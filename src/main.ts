import express from 'express'
import userRoutes from './routes/users'

var bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const port = 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

userRoutes(app);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});