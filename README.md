# Nebula

**Tu trabajo, en orden.**

Gestor de tareas completo con autenticacion de usuarios, tablero Kanban y vista de lista. Cada
persona registrada gestiona unicamente sus propias tareas: la propiedad se comprueba tanto en el
cliente como en el servidor.

El nombre viene de la identidad visual: un fondo de aurora en movimiento y una marca formada por
tres columnas de tablero que, juntas, dibujan una `n`.

## Caracteristicas

- Registro e inicio de sesion con JWT persistido en `localStorage` y sesion revalidada al recargar.
- CRUD completo de tareas: crear, leer, editar y eliminar.
- Cada tarea tiene titulo, descripcion, prioridad (baja/media/alta), estado (pendiente/en
  progreso/completada), fecha limite y fecha de creacion.
- Filtrado por estado y prioridad, y ordenacion por fecha limite, prioridad o fecha de creacion.
- Dos formas de trabajar: tablero Kanban con tres columnas (con arrastrar y soltar en escritorio) y
  vista de lista, con conmutador que recuerda la ultima eleccion.
- Marcar una tarea como completada con un solo clic, contadores por estado y barra de progreso.
- Rutas protegidas en el frontend y verificacion de propietario en cada endpoint del backend.
- Interfaz oscura, responsive y mobile-first, con estados de carga y mensajes de error visibles.

## Identidad visual

El tema se define con variables CSS en `frontend/src/styles/variables.css`; cambiando ahi los
tokens cambia toda la interfaz.

| Elemento    | Decision                                                                 |
| ----------- | ------------------------------------------------------------------------ |
| Tipografia  | `Space Grotesk` para titulos, cifras y marca; `Inter` para el resto       |
| Fondo       | Negro frio con una aurora animada, vineta y una capa de grano             |
| Superficies | Blanco translucido, no grises solidos: recogen el color del fondo         |
| Acento      | Degradado violeta -> magenta -> ambar, reservado a la accion principal    |
| Prioridades | Coral (alta), ambar (media) y azul (baja), independientes del acento      |
| Marca       | Tres columnas en violeta, magenta y ambar que dibujan una `n`             |

La marca es un SVG en linea (`components/BrandMark.jsx`) y no una imagen, para que herede el
tamano del contexto y no pierda nitidez. El favicon es la misma marca sobre una placa oscura, que
le da contraste en las pestanas del navegador con tema claro.

Los recursos graficos viven en `frontend/public`:

- `aurora-loop.mp4` (2,7 MB) es el fondo en bucle de las pantallas de acceso y registro. Ocupa la
  pantalla completa en las dos resoluciones, va silenciado y con `playsinline`. Se pintan dos
  copias desfasadas media vuelta y se cruza la opacidad entre ellas, porque el primer y el ultimo
  fotograma del clip no coinciden y el bucle a secas dejaba un corte visible.
- `aurora-poster.jpg` es el primer fotograma del video. Sirve de `poster` mientras carga y
  sustituye al video cuando el sistema pide reducir el movimiento.
- `empty-tasks.jpg` acompana al estado vacio. Se funde con el fondo mediante
  `mix-blend-mode: screen` y una mascara radial, asi que necesita un fondo oscuro para verse
  correctamente.

## Stack

| Capa          | Tecnologia                                        |
| ------------- | ------------------------------------------------- |
| Frontend      | React 18, Vite, JavaScript (JSX), CSS puro        |
| Backend       | Node.js, Express                                  |
| Base de datos | MongoDB con Mongoose                              |
| Autenticacion | JSON Web Tokens y bcrypt                          |
| Validacion    | celebrate / Joi en el servidor                    |

## Estructura del proyecto

```
nebula/
├── backend/
│   ├── controllers/      Logica de usuarios y tareas
│   ├── models/           Esquemas de Mongoose
│   ├── routes/           Definicion de endpoints
│   ├── middlewares/      Autenticacion, validacion y errores
│   ├── utils/            Clases de error y constantes
│   ├── app.js            Punto de entrada del servidor
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   Componentes reutilizables
│   │   ├── pages/        Pantallas enrutadas
│   │   ├── utils/        api.js, constantes y formateadores
│   │   ├── contexts/     Estado de sesion y de tareas
│   │   ├── styles/       Hojas de estilo por componente
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Una instancia de MongoDB accesible (local o MongoDB Atlas)

## Variables de entorno

### `backend/.env`

| Variable         | Descripcion                                          | Ejemplo                                         |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `PORT`           | Puerto del servidor                                  | `3001`                                          |
| `MONGO_URI`      | Cadena de conexion a MongoDB                         | `mongodb://127.0.0.1:27017/taskmanager`         |
| `JWT_SECRET`     | Clave para firmar los tokens (obligatoria)           | cadena larga y aleatoria                        |
| `JWT_EXPIRES_IN` | Vida util del token                                  | `7d`                                            |
| `CORS_ORIGIN`    | Origenes permitidos, separados por coma              | `http://localhost:5173`                         |

El servidor se detiene al arrancar si falta `JWT_SECRET`.

### `frontend/.env`

| Variable       | Descripcion                | Ejemplo                 |
| -------------- | -------------------------- | ----------------------- |
| `VITE_API_URL` | URL base del backend       | `http://localhost:3001` |

Ambas carpetas incluyen un `.env.example` que puedes copiar como punto de partida.

## Instalacion y ejecucion en local

El backend y el frontend son proyectos independientes: necesitas dos terminales.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # en Windows: copy .env.example .env
# edita .env y define al menos JWT_SECRET y MONGO_URI
npm run dev               # con recarga automatica (nodemon)
# o bien
npm start
```

La API queda disponible en `http://localhost:3001`. Puedes comprobarlo con `GET /health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev
```

La aplicacion se abre en `http://localhost:5173`. Registra una cuenta desde `/signup` y empieza a
crear tareas.

### Scripts disponibles

**backend**

| Script        | Accion                                   |
| ------------- | ---------------------------------------- |
| `npm start`   | Arranca el servidor                      |
| `npm run dev` | Arranca el servidor con recarga en caliente |

**frontend**

| Script            | Accion                                  |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Servidor de desarrollo de Vite          |
| `npm run build`   | Compilacion de produccion en `dist/`    |
| `npm run preview` | Sirve localmente la compilacion         |
| `npm run lint`    | Analisis estatico con ESLint            |

## API

Todas las respuestas son JSON. Los errores devuelven `{ "message": "..." }`.

### Usuarios

| Metodo | Ruta            | Autenticada | Descripcion                                     |
| ------ | --------------- | ----------- | ----------------------------------------------- |
| `POST` | `/users/signup` | No          | Crea una cuenta y devuelve el usuario y el token |
| `POST` | `/users/signin` | No          | Inicia sesion y devuelve el usuario y el token   |
| `GET`  | `/users/me`     | Si          | Devuelve el perfil del usuario del token         |

### Tareas

| Metodo   | Ruta         | Descripcion                                    |
| -------- | ------------ | ---------------------------------------------- |
| `GET`    | `/tasks`     | Lista las tareas del usuario autenticado       |
| `POST`   | `/tasks`     | Crea una tarea                                 |
| `GET`    | `/tasks/:id` | Devuelve una tarea concreta                    |
| `PATCH`  | `/tasks/:id` | Actualiza los campos enviados                  |
| `DELETE` | `/tasks/:id` | Elimina la tarea                               |

Todas las rutas de `/tasks` requieren la cabecera `Authorization: Bearer <token>`.

`GET /tasks` admite los parametros de consulta `status`, `priority` y `sort`. Los valores validos de
`sort` son `dueDate`, `-dueDate`, `priority`, `-priority`, `createdAt` y `-createdAt`; el prefijo `-`
invierte el orden. Las tareas sin fecha limite se colocan siempre al final.

Ejemplo:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/tasks?priority=alta&sort=dueDate"
```

### Codigos de error

| Codigo | Cuando se devuelve                                        |
| ------ | --------------------------------------------------------- |
| `400`  | Datos invalidos o identificador con formato incorrecto     |
| `401`  | Falta el token, es invalido o las credenciales no coinciden |
| `403`  | La tarea existe pero pertenece a otro usuario              |
| `404`  | El recurso solicitado no existe                            |
| `409`  | El correo electronico ya esta registrado                   |
| `500`  | Error inesperado del servidor                              |

## Notas de implementacion

- Las contrasenas se guardan con hash de bcrypt y el campo nunca se devuelve en las respuestas.
- El campo `owner` de cada tarea es interno: se usa para comprobar permisos y se elimina antes de
  serializar la respuesta.
- La fecha limite es una fecha de calendario y se maneja en UTC de extremo a extremo, para que no se
  desplace un dia segun el huso horario del navegador.
- Un `401` en cualquier peticion cierra la sesion en el cliente y redirige al inicio de sesion.
- `node_modules/`, `dist/` y los archivos `.env` estan excluidos del control de versiones.
