const mongoose = require('../bin/connect');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    trim: true,
    minlength: [3, "El nombre debe contener al menos 3 caracteres"],
    maxlength: [20, "El nombre no debe contener más de 20 caracteres"],
    required: [true, "Este campo es obligatorio"],
    validate: {
      validator: function(v) {
        return /^[a-zA-ZÑñ ]*$/g.test(v);
      }, message: props => "El nombre no debe contener números"
    }
  },
  email: {
    type: String,
    minlength: [3, "El email debe contener al menos 3 caracteres"],
    maxlength: [100, "El email no debe contener más de 100 caracteres"],
    unique: true,
    trim: true,
    required: [true, "Este campo es obligatorio"],
    validate: {
      validator: function(v) {
        return /^([a-zA-ZÑñ0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(v);
      }, message: props => "El email no cumple con el formato"
    }
  },
  password: {
    type: String,
    minlength: [5, "El email debe contener al menos 5 caracteres"],
    maxlength: [20, "El email no debe contener más de 20 caracteres"],
    required: [true, "Este campo es obligatorio"],
  }
});

userSchema.pre ("save", function(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("user", userSchema);
