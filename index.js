const express = require('express');
const bodyParser = require('body-parser');
const talker = require('./routes/talker');
const login = require('./routes/login');

// onde aprendi sobre a refatorar usando o express.router()
// https://www.youtube.com/watch?v=iM_S4RczozU

const app = express();
app.use(bodyParser.json());
app.use('/talker', talker);
app.use('/login', login);

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
