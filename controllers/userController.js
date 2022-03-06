const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv/config');

module.exports = {
  signup: async (req, res, next)=> {
    try {
      const user = new userModel ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })

      // sendConfirmationEmail(user)

      const document = await user.save()
      res.json({document, error: "No", message: "Registro exitoso"})
      // res.json({document, error: "No", message: "Se envió un mail de verificación"})
    } catch (e) {
      console.log(e);
      if (e.name === 'MongoServerError' && e.code === 11000) {
        res.status(200).json({error: "Si", message: "Este email ya se registró"});
      } else if (e.errors.email) {
        res.status(200).json({error: "Si", message: e.errors.email.message});
      }
      next(e);
    }
  },
  login: async (req, res, next)=> {
    try {
      const document = await userModel.findOne({email:req.body.email});

      if (document) {
        if (bcrypt.compareSync(req.body.password, document.password)) {
          const token = jwt.sign({id:document._id, name:document.name}, req.app.get('k'),{expiresIn:"10m"})
          res.json({message: "Bienvenid@", token: token})
        } else {
          res.json({error: true, message: "Contraseña incorrecta"})
        }
      } else {
        res.json({error: true, message: "Este email no está registrado en el sitio"})
      }
    } catch(e) {
      next(e);
    }
  }
};
