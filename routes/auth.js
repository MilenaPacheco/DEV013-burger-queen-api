const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { connect } = require('../connect');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    console.log('Email y passw: ', email, password);
    //preguntar a la base de Datos sí existe el usuario con ese email, sino return ERROR 401
    const connection = await connect();
    const user = await connection.collection('users').findOne({ email });
    if (!user) {
      //return resp.status(401).send();
      return resp.send(401);
    }
    try {
      // Validar contraseña con hash, utilizar método librería bCrypt---compare(ingreso,baseDatos) --- promesa aw, then/catch
      const validation = await bcrypt.compare(password, user.password);
      console.log('validación:', validation);
      console.log(typeof validation);
      if (validation) {
        console.log('validación:', validation);
        const { _id, email, role } = user;
        const payload = { uid: _id, email, role };
        //crear token jwt, sign (info,claveSe,exp)
        const token = jwt.sign(payload, secret);
        console.log('token', token);
        //console.log('solicitud', req);
        //req devolver el token--- obj
        resp.json({ ok: 'Ingreso', token: token });
      } else {
        console.log('Contraseña incorrecta');
        return resp.json(401);
      }
    } catch (error) {
      console.error('Error during login:', error);
      return resp.json(500);
    }

    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT
  });

  return nextMain();
};
