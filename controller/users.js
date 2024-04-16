const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { connect } = require('../connect');

module.exports = {
  getUsers: async (req, resp, next) => {
    // TODO: Implement the necessary function to fetch the `users` collection or table
    try {
      const { _page = 1, _limit = 10 } = req.query;
      const page = parseInt(_page, 10);
      const limit = parseInt(_limit, 10);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const dbUsers = await connect();
      const collection = dbUsers.collection('users');
      const users = await collection.find({}).toArray();
      const paginatedUsers = users.slice(startIndex, endIndex);

      if (users.length === 0) {
        return resp.status(404).json({ error: 'No se encontraron usuarios' });
      }
      console.log("Type of paginatedUsers:", Array.isArray(paginatedUsers));
      const mapUsers = paginatedUsers.map((user) => ({
        _id: user._id,
        email: user.email,
        role: user.role,
      }));
      console.log("Type of mapUsers:", Array.isArray(mapUsers)); // Verifica si es un array
      console.log("mapUsers:", mapUsers); // Verifica el contenido de mapUsers

      console.log("type map", typeof mapUsers);
      console.log("map", mapUsers[0]);
      console.log("map longitus", mapUsers.length);
      //console.log("map longitus", Array.isArray(resp.json(mapUsers)));

      return resp.status(200).json(mapUsers);
    } catch (error) {
      console.error('No se pudo conectar a la base de datos', error);
      return resp.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  getUser: async (req, resp) => {
    try {
      // Verificar si el usuario tiene permisos de acceso
      if (req.decodedToken.role !== 'admin' && req.decodedToken.uid !== req.params.uid && req.decodedToken.email !== req.params.uid) {
        return resp.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
      }
      /*true && (true || false)   true && true && false
      true && true                    true && false
      true                               false*/
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const db = await connect();
      const dbUsers = db.collection('users');
      let user;
  
      // Verificar si el UID es un correo electrónico
      if (regexCorreo.test(req.params.uid)) {
        user = await dbUsers.findOne({ email: req.params.uid });
        console.log('correo ingresado', req.params.uid);
        console.log('Role LOGIN', req.decodedToken.role);
        console.log('Correo LOGIN', req.decodedToken.email);
        console.log('Petición', req.decodedToken);

        if (!user) {
          return resp.status(404).json({ error: 'Correo no encontrado' });
        }
      } else {
        // eslint-disable-next-line max-len
        // Si el UID no es un correo, se asume que es un ID de usuario y se dejara una variable en común para realizar el mismo propceso
        user = await dbUsers.findOne({ _id: new ObjectId(req.params.uid) });
      }
  
      // Verificar si el usuario existe
      if (!user) {
        return resp.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Devolver los datos del usuario y código de estado 200
      if (req.decodedToken.uid === req.params.uid) {
        return resp.status(200).json({ id: user._id, email: user.email, role: user.role });
      }
      return resp.status(200).json({ id: user._id, email: user.email, role: user.role });
    } catch (error) {
      console.error('Error al obtener usuario', error);
      return resp.status(500).json({ error: 'Error al obtener usuario' });
    }
  },
  createUser: async (req, resp, next) => {
    const userData = req.body;

    try {
      // Validar campos requeridos
      if (!userData.email || !userData.password) {
        return resp.status(400).json({ error: 'Llene todos los campos requeridos' });
      }

      // Validar formato de correo electrónico
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(userData.email)) {
        return resp.status(400).json({ error: 'Correo electrónico inválido' });
      }

      // Verificar longitud de la contraseña
      if (userData.password.length < 3) {
        return resp.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      // Hashear la contraseña antes de almacenarla
      userData.password = bcrypt.hashSync(userData.password, 10);

      // Conectar a la base de datos y guardar el usuario
      const db = await connect();
      const dbUsers = db.collection('users');
      const compareEmail = await dbUsers.findOne({ email: userData.email });
      console.log("compare",compareEmail)

      // verificar si el correo existe
      if (compareEmail) {
        return resp.status(403).json({ error: 'El correo ya se encuentra registrado' });
      }
      const insertUser = await dbUsers.insertOne(userData);
      // Enviar una respuesta con los detalles del usuario creado
      console.log(typeof insertUser.insertedId.toString());
      console.log(typeof userData.email);
      console.log(typeof userData.password);
      console.log(typeof userData.role);

      return resp.status(200).json({
        _id: insertUser.insertedId.toString(),
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return resp.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  updateUser: async (req, resp) => {
    console.log("DECODETOKEN LOGIN", req.decodedToken.role);
    const userData = req.body;
    const newPassword = userData.password;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if (req.decodedToken.uid !== req.params.uid && req.decodedToken.role !== 'admin' && req.decodedToken.email !== req.params.uid) {
        return resp.status(403).json({ error: 'No tiene los permisos para actualizar' });
      }
      if (userData.role) {
        if (userData.role === 'admin') {
          return resp.status(403).json({ error: 'No puede cambiar el rol' });
        }
      }
      if (!userData.email || !newPassword) {
        return resp.status(400).json({ error: 'Ingrese los campos requeridos' });
      }
      const db = await connect();
      const dbUsers = db.collection('users');
      let user;
      console.log("Testeando parámetro como correo", req.params.uid)
      if (regexCorreo.test(req.params.uid)) {
        user = await dbUsers.findOne({ email: req.params.uid });
        console.log("USER EN EMAIL",user)
      } else {
        user = await dbUsers.findOne({ _id: new ObjectId(req.params.uid) });
      }
      console.log("verificar CORREO", regexCorreo.test(req.params.uid))
      console.log("USER", user);
      if (!user) {
        console.log("HOLA")
        return resp.status(404).json({ error: 'El usuario no existe' });
      }
      // Actualizar datos del usuario
      const newPasswordHash = bcrypt.hashSync(newPassword, 10);
      console.log("pass HASH",newPasswordHash);
      const updateData = { $set: { email: userData.email, password: newPasswordHash } };
      console.log("upDateDATA",updateData);
      const updateUser = await dbUsers.updateOne({ _id: new ObjectId(user._id) }, updateData);
      
      console.log("upDateUSER",updateUser);
      if (updateUser.modifiedCount === 1) {
        return resp.status(200).json({ id: user._id, email: userData.email, role: user.role });
      }
      return resp.status(400).json({ error: 'Error al actualizar datos' });
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      return resp.status(500).json({ error: 'Error al actualizar datos' });
    }
  },
  // 7

  deleteUser: async (req, resp, next) => {
    try {
      const userData = req.body;
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const db = await connect();
      const dbUsers = db.collection('users');
      // Verificar permisos antes de eliminar
      if (req.decodedToken.uid !== req.params.uid && req.decodedToken.role !== 'admin' && req.decodedToken.email !== req.params.uid) {
        return resp.status(403).json({ error: 'No tiene los permisos para eliminar usuario' });
      }
      let user;
      if (regexCorreo.test(req.params.uid)) {
        // Si el uid es un correo, buscar por email
        user = await dbUsers.findOne({ email: req.params.uid });
      } else {
        // Si no, buscar por _id
        user = await dbUsers.findOne({ _id: new ObjectId(req.params.uid) });
      }
      if (!user) {
        return resp.status(404).json({ error: 'El usuario no existe' });
      }
      // Eliminar el usuario
      const userDelete = await dbUsers.deleteOne({ _id: user._id });
      if (userDelete.deletedCount === 1) {
        return resp.status(200).json({ message: 'Usuario eliminado exitosamente' });
      }
      return resp.status(400).json({ error: 'Error al eliminar usuario' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return resp.status(500).json({ error: 'Error interno al eliminar usuario' });
    }
  }
  
};
