const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const questions = require('./questions.json');

app.get('/api/questions', (req, res) => {
    res.json(questions);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
