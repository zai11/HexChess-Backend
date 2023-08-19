import express from 'express';

const app = express();
const port = 5501;

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});