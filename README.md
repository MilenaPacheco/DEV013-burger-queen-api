# Burger Queen API - API con Node.js
## Descripción
Este proyecto consiste en una API construida con Node.js y Express para manejar el sistema de una aplicación de restaurante. Proporciona endpoints para gestionar usuarios, productos, pedidos y roles de usuarios.

## Criterios de Aceptación Mínimos
- La API debe exponer los servicios especificados en la documentación entregada por la clienta que se visualiza en [SwaggerHub](https://app.swaggerhub.com/apis-docs/ssinuco/BurgerQueenAPI/2.0.0).
- Implementar un comando `npm start` que ejecute la aplicación Node.js y pueda recibir información de configuración como el puerto, la URL de la base de datos y el secreto JWT.
- La aplicación debe poder arrancar en diferentes puertos especificados como argumentos de línea de comando.
- Se deben utilizar las siguientes variables de entorno:
  - `PORT`: Especifica el puerto en el que la aplicación escuchará.
  - `DB_URL`: String de conexión de MongoDB para la base de datos.
  - `JWT_SECRET`: Secreto utilizado para firmar y verificar tokens JWT.
  - `ADMIN_EMAIL`: Email opcional para el usuario admin.
  - `ADMIN_PASSWORD`: Contraseña para el usuario admin.
  
## Características
- Autenticación mediante JSON Web Tokens (JWT) para proteger los endpoints según los roles de los usuarios.
- Manejo de usuarios con roles de admin y cliente.
- CRUD (Crear, Leer, Actualizar, Eliminar) para productos y pedidos.
- Gestión de usuarios y roles.
- Seguridad en las rutas para proteger ciertos recursos según los permisos de los usuarios.

## Esquemas de Modelos de Datos

En el proyecto utilicé MongoDB como base de datos NoSQL para almacenar los datos. A continuación, se presenta la estructura general de las colecciones y documentos principales:

### Colección de Usuarios

La colección de usuarios almacena la información de los usuarios registrados en la aplicación. Cada documento en esta colección sigue una estructura similar a la siguiente:

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "createdAt": "Date"
}

### Estructura de Usuario
A continuación se describen los campos utilizados para el modelo de usuario en nuestra base de datos:

- `_id`: Identificador único del usuario.
- `name`: Nombre del usuario.
- `email`: Correo electrónico del usuario (debe ser único).
- `password`: Contraseña del usuario (almacenada de forma segura).
- `role`: Rol del usuario en la aplicación (p. ej., 'admin' o 'user').

Esta estructura nos permite almacenar y gestionar la información de los usuarios de manera eficiente en nuestra base de datos MongoDB.

## Tipos de Autenticación por Endpoint

### GET /users
- **Autenticación requerida:** Admin
- **Descripción:** Esta ruta permite obtener la lista de usuarios.
- **Requisitos:** El usuario debe ser un administrador para acceder a esta ruta.

### GET /users/:uid
- **Autenticación requerida:** Auth
- **Descripción:** Esta ruta permite obtener información de un usuario específico.
- **Requisitos:** El usuario debe estar autenticado para acceder a esta ruta.

### POST /users
- **Autenticación requerida:** Admin
- **Descripción:** Esta ruta permite crear un nuevo usuario.
- **Requisitos:** El usuario debe ser un administrador para acceder a esta ruta.

### PUT /users/:uid
- **Autenticación requerida:** Auth
- **Descripción:** Esta ruta permite actualizar la información de un usuario.
- **Requisitos:** El usuario debe estar autenticado para acceder a esta ruta.

### DELETE /users/:uid
- **Autenticación requerida:** Auth
- **Descripción:** Esta ruta permite eliminar un usuario.
- **Requisitos:** El usuario debe estar autenticado para acceder a esta ruta.

## Flujo de funcionamiento de la API

### Paso 1: Conectar a la base de datos
En el archivo `connect.js` se establece la conexión con la base de datos Mongodb utilizando el `dbUrl` proporcionado en el archivo de configuración.

### Paso 2: Crear el usuario admin
Se necesita un usuario administrador en la base de datos para gestionar otros usuarios. Esto se realiza en la función initAdminUser en routes/users.js.

### Paso 3: Autenticación de usuario
En routes/auth.js, en la ruta '/login', se implementa la lógica de autenticación para verificar las credenciales del usuario y generar un token JWT para autorizar las solicitudes futuras.

### Paso 4: Middleware de autenticación
El archivo middleware/auth.js contiene funciones de autenticación que verifica los tokens JWT en las solicitudes y verificación del Role.

### Paso 5: Implementación de las peticiones de la ruta /users
En la ruta '/users' se conecta al archivo controller/users.js para dar manejo a las peticiones como obtener la lista de usuarios, información de usuario, crear usuario, actualizar usuario y eleminar usuario de la base de datos.

## Tecnologías Utilizadas
- Node.js
- Express.js
- MongoDB (para la base de datos)
- JSON Web Tokens (JWT) para autenticación
- bcrypt para encriptación de contraseñas

## Endpoints Disponibles
- `/api/users`: Endpoints para gestionar usuarios.
- `/api/products`: Endpoints para gestionar productos.
- `/api/orders`: Endpoints para gestionar pedidos.

## Uso
1. Registra un usuario administrador para obtener un token JWT.
2. Con el token JWT, realiza las solicitudes a los diferentes endpoints según los roles de usuario.
3. Puedes probar los endpoints usando herramientas como Postman o cURL.
4. Puedes ver el despliegue de la página [Aquí]([https://github.com/MilenaPacheco](https://dev-013-burger-queen-cdt7ab61s-milena-pachecos-projects.vercel.app/?vercelToolbarCode=9UDqM7MOpQ7Yr_C))

## Documentación API
La documentación detallada de la API está disponible en [enlace-a-tu-documentacion](https://tu-enlace-a-la-documentacion-api.com).

---
Creado por [Milena Pacheco](https://github.com/MilenaPacheco)
