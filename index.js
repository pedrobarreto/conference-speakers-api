const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOCONTENT_STATUS = 204;
const HTTP_CREATED_STATUS = 201;
const HTTP_ERROR_STATUS = 404;
const HTTP_BAD_STATUS = 400;
const PORT = '3000';

function generateToken() {
 return crypto.randomBytes(8).toString('hex');
}

const fs = require('fs/promises');
const middlewares = require('./middlewares');

const { validateAge, validateMail, validateName,
   validateDate, validateRate, validateAuth } = middlewares;

function getTalkers() {
  return fs.readFile('./talker.json', 'utf-8')
    .then((fileContent) => JSON.parse(fileContent));
}

function setTalkers(talker) {
  return fs.writeFile('./talker.json', JSON.stringify(talker));
}

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', validateAuth, async (req, res) => {
  const talkers = await getTalkers();
 const { q } = req.query;
  const filteredTalker = talkers.filter((talker) => talker.name.includes(q));

  if ([q].includes(undefined) || q.length === 0) {
    return res.status(HTTP_OK_STATUS).json(talkers);
  }
  res.status(HTTP_OK_STATUS).json(filteredTalker);
});

app.get('/talker', async (req, res) => {
  const talkers = await getTalkers();
 if (talkers.length === 0) return res.status(HTTP_OK_STATUS).json([]);
res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await getTalkers();
  const { id } = req.params;
  const talkerId = talkers.find((talker) => talker.id === +id);

  if (!talkerId) {
 return res.status(HTTP_ERROR_STATUS)
  .json({ message: 'Pessoa palestrante não encontrada' }); 
}

  res.status(HTTP_OK_STATUS).json(talkerId);
});

app.post('/login', validateMail, async (req, res) => {
  const { password } = req.body;
  const token = await generateToken();

  if ([password].includes(undefined) || password.length === 0) {
    return res.status(HTTP_BAD_STATUS).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(HTTP_BAD_STATUS)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', validateAuth, validateName,
 validateDate, validateAge, validateRate, async (req, res) => {
  const talkers = await getTalkers();
  const id = talkers.length + 1;
  const { name, age, talk } = req.body;
  talkers.push({ name, age, id, talk });
  await setTalkers(talkers);
  res.status(HTTP_CREATED_STATUS).json(talkers[id - 1]);
});

app.put('/talker/:id', validateAuth, validateName,
 validateDate, validateAge, validateRate, async (req, res) => {
  const talkers = await getTalkers();
  const { name, age, talk } = req.body;
  const { id } = req.params;
  const talker = talkers.findIndex((person) => person.id === +id);
  talkers[talker] = ({ name, age, id: 5, talk });
  await setTalkers(talkers);
  res.status(HTTP_OK_STATUS).json(talkers[talkers.length - 1]);
});

app.delete('/talker/:id', validateAuth, async (req, res) => {
  const talkers = await getTalkers();
  const { id } = req.params;
  const talker = talkers.findIndex((person) => person.id === +id);
  talkers.splice(talker, 1);
  await setTalkers(talkers);
  res.status(HTTP_NOCONTENT_STATUS).json(talkers[talkers.length - 1]);
});

app.listen(PORT, () => {
  console.log('Online');
});
