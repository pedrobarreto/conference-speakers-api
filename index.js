const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const fs = require('fs/promises');

function getTalkers() {
  return fs.readFile('./talker.json', 'utf-8')
    .then((fileContent) => JSON.parse(fileContent));
}

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talkers = await getTalkers();
 if (talkers.length === 0) return res.status(HTTP_OK_STATUS).json([]);
res.status(HTTP_OK_STATUS).json(talkers);
});

app.listen(PORT, () => {
  console.log('Online');
});
