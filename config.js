// eslint-disable-next-line max-len
// Acá se asignan las variables de entorno-----argumento de línea de comandos---variable de entorno---puerto
exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.MONGO_URL || process.env.DB_URL || 'mongodb://127.0.0.1:27017/test';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
/* crear un archivo con extentension .env y poner
index cargar las variables----npm script

token-.com
 */