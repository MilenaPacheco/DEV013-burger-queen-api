const bcrypt = require('bcrypt');
const { connect } = require('../connect');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controller/users');

const initAdminUser = async (app, next) => {
  try {
    const { adminEmail, adminPassword } = app.get('config');
    if (!adminEmail || !adminPassword) {
      return next();
    }

    const adminUser = {
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      role: 'admin',
    };

    // TODO: Create admin user
    const dbUsers = await connect();
    const collect = dbUsers.collection('users');
    // First, check if adminUser already exists in the database
    const existAdmin = await collect.findOne({ email: adminEmail });
    // If it doesn't exist, it needs to be saved
    if (!existAdmin) {
      await collect.insertOne(adminUser);
      console.log('A new administrator was created');
    } else {
      console.log('The administrator exists');
    }
  } catch (error) {
    console.error('Error creating admin user', error);
  }
  next();
};

module.exports = (app, next) => {
  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:uid', requireAuth, getUser);

  app.post('/users', requireAdmin, createUser);

  app.put('/users/:uid', requireAuth, updateUser);

  app.delete('/users/:uid', requireAuth, deleteUser);

  initAdminUser(app, next);
};
