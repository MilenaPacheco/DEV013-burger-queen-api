const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { connect } = require('../connect');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ error: 'Email y contraseña son requeridos' })
    }
    console.log('Email y passw: ', email, password);
    //preguntar a la base de Datos sí existe el usuario con ese email, sino return ERROR 401
    const connection = await connect();
    const user = await connection.collection('users').findOne({ email });
    if (!user) {
      return resp.status(404).json({ error: 'Usuario no encontrado' });
    }
    try {
      // Validar contraseña con hash, utilizar método librería bCrypt---compare(ingreso,baseDatos) --- promesa aw, then/catch
      const validation = await bcrypt.compare(password, user.password);
      console.log('cxomparacion:', password, user.password);
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
        return resp.status(200).json({ token: token });
      }
      console.log('Contraseña incorrecta');
      return resp.status(401).json({ error: 'correo y contraseña incorrectas' });
    } catch (error) {
      console.error('Error during login:', error);
      return resp.status(500).json({ error: 'Error during login' });
    }
  });

  return nextMain();
};
