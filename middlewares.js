const HTTP_BAD_STATUS = 400;
const HTTP_UNAUTHORIZED_STATUS = 401;

// onde aprendi sobre o modulo email validator do node 
// https://stackoverflow.com/questions/52456065/how-to-format-and-validate-email-node-js
const validator = require('email-validator');

// onde aprendi sobre o modulo moment do node 
// https://stackoverflow.com/questions/40123747/check-if-date-is-a-valid-one

const moment = require('moment');

 module.exports = {
  validateAuth(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(HTTP_UNAUTHORIZED_STATUS).json({ message: 'Token não encontrado' });
    }
    if (authorization.length < 16) {
      return res.status(HTTP_UNAUTHORIZED_STATUS)
      .json({ message: 'Token inválido' });
    }
    next();
    },
    validateAge(req, res, next) {
    const { age } = req.body;
    if ([age].includes(undefined)) {
      return res.status(HTTP_BAD_STATUS).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < 18) {
      return res.status(HTTP_BAD_STATUS)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' });
    }
    next();
    },
    validateName(req, res, next) {
    const { name } = req.body;
    if ([name].includes(undefined) || name.length === 0) {
      return res.status(HTTP_BAD_STATUS).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
      return res.status(HTTP_BAD_STATUS)
      .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    next();
    },
    validateMail(req, res, next) {
      const { email } = req.body;
      if ([email].includes(undefined) || email.length === 0) {
        return res.status(HTTP_BAD_STATUS).json({ message: 'O campo "email" é obrigatório' });
      }
      if (!validator.validate(email)) {
        return res.status(HTTP_BAD_STATUS)
        .json({ message: 'O "email" deve ter o formato "email@email.com"' });
      }
      next();
    },
    validateDate(req, res, next) {
      const { talk } = req.body;
      if ([talk].includes(undefined) || [talk.watchedAt].includes(undefined)
       || [talk.rate].includes(undefined)) {
        return res.status(HTTP_BAD_STATUS).json({ 
          message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios', 
        });
      }
      const validDate = moment(talk.watchedAt, 'DD/MM/YYYY').isValid();
        if (!validDate) {
        return res.status(HTTP_BAD_STATUS)
        .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
      }
      next();
    },
    validateRate(req, res, next) {
      const { talk } = req.body;
      const { rate } = talk;
      if (rate < 1 || rate > 5) {
        return res.status(HTTP_BAD_STATUS)
        .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
      }
      next();
    },
};
