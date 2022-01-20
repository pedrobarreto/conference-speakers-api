const express = require('express');

const router = express.Router();
const fs = require('fs/promises');
const middlewares = require('../middlewares');

const HTTP_OK_STATUS = 200;
const HTTP_NOCONTENT_STATUS = 204;
const HTTP_CREATED_STATUS = 201;
const HTTP_ERROR_STATUS = 404;

const { validateAge, validateName,
   validateDate, validateRate, validateAuth } = middlewares;

   function getTalkers() {
    return fs.readFile('./talker.json', 'utf-8')
      .then((fileContent) => JSON.parse(fileContent));
  }
  
  function setTalkers(talker) {
    return fs.writeFile('./talker.json', JSON.stringify(talker));
  }
  
router
.route('/')
.get(async (req, res) => {
  const talkers = await getTalkers();
 if (talkers.length === 0) return res.status(HTTP_OK_STATUS).json([]);
res.status(HTTP_OK_STATUS).json(talkers);
})
.post(validateAuth, validateName,
 validateDate, validateAge, validateRate, async (req, res) => {
  const talkers = await getTalkers();
  const id = talkers.length + 1;
  const { name, age, talk } = req.body;
  talkers.push({ name, age, id, talk });
  await setTalkers(talkers);
  res.status(HTTP_CREATED_STATUS).json(talkers[id - 1]);
});

router
.route('/search')
.get(validateAuth, async (req, res) => {
  const talkers = await getTalkers();
 const { q } = req.query;
  const filteredTalker = talkers.filter((talker) => talker.name.includes(q));

  if ([q].includes(undefined) || q.length === 0) {
    return res.status(HTTP_OK_STATUS).json(talkers);
  }
  res.status(HTTP_OK_STATUS).json(filteredTalker);
});

router
.route('/:id')
.get(async (req, res) => {
  const talkers = await getTalkers();
  const { id } = req.params;
  const talkerId = talkers.find((talker) => talker.id === +id);

  if (!talkerId) {
 return res.status(HTTP_ERROR_STATUS)
  .json({ message: 'Pessoa palestrante não encontrada' }); 
}

  res.status(HTTP_OK_STATUS).json(talkerId);
})
.put(validateAuth, validateName,
 validateDate, validateAge, validateRate, async (req, res) => {
  const talkers = await getTalkers();
  const { name, age, talk } = req.body;
  const { id } = req.params;
  const talker = talkers.findIndex((person) => person.id === +id);
  talkers[talker] = ({ name, age, id: +id, talk });
  await setTalkers(talkers);
  res.status(HTTP_OK_STATUS).json(talkers[talkers.length - 1]);
})

.delete(validateAuth, async (req, res) => {
  const talkers = await getTalkers();
  const { id } = req.params;
  const talker = talkers.findIndex((person) => person.id === +id);
  talkers.splice(talker, 1);
  await setTalkers(talkers);
  res.status(HTTP_NOCONTENT_STATUS).json(talkers[talkers.length - 1]);
});

module.exports = router;