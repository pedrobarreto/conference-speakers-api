const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const middlewares = require('../middlewares');

const HTTP_BAD_STATUS = 400;
const HTTP_OK_STATUS = 200;

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
 }
 
 const { validateMail } = middlewares;

 router
 .route('/')
 .post(validateMail, async (req, res) => {
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

module.exports = router;