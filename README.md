# App Chat GEA

Plataforma de mensajería en tiempo real desarrollada con **React Native**, **Node.js** y **MongoDB**.
Permite la comunicación instantánea entre usuarios mediante sockets, autenticación y gestión de conversaciones.

---

## Características

* Autenticación de usuarios (JWT)
* Envío y recepción de mensajes en tiempo real
* Comunicación con WebSockets (Socket.IO)
* Backend escalable con Node.js + Express
* Persistencia de datos con MongoDB
* Aplicación móvil multiplataforma (React Native)

---

## Arquitectura

```bash
Mobile (React Native)
        ↓
Backend (Node.js + Express + Socket.IO)
        ↓
Database (MongoDB)
```

---

## Estructura del proyecto

```bash
aquimovil/
│
├── cliente/        # Aplicación móvil (React Native)
├── jeje/           # Backend (Node.js + Express)
│
├── .gitignore
└── README.md
```

---

## Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/223110358/app-chat-gea.git
cd app-chat-gea
```

---

### 2. Configurar Backend

```bash
cd jeje
npm install
cp .env.example .env
```

Configurar variables en `.env`:

```env
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
PORT=8004
IP_SERVER=localhost
```

---

### 3. Ejecutar Backend

```bash
npm run dev
```

---

### 4. Ejecutar App (React Native)

```bash
cd ../cliente
npm install
npm start
```

---

## Seguridad

* Las credenciales **NO están incluidas en el repositorio**
* Se utilizan variables de entorno (`.env`)
* `.env` está ignorado mediante `.gitignore`
* `.env.example` sirve como referencia de configuración

---

## Equipo

Proyecto desarrollado en equipo como parte de formación en desarrollo full-stack.

---

## Tecnologías utilizadas

* **Frontend:** React Native, Expo
* **Backend:** Node.js, Express
* **Realtime:** Socket.IO
* **Base de datos:** MongoDB
* **Control de versiones:** Git & GitHub

---

## Estado del proyecto

 En desarrollo — mejoras continuas en funcionalidades y arquitectura.

---

## Licencia

Este proyecto es de uso académico.

