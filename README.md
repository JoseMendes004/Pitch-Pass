# PitchPass

PitchPass es una plataforma para reservar canchas deportivas. Los jugadores pueden buscar canchas disponibles, ver horarios y hacer reservas en tiempo real. Los dueños de canchas tienen un panel para gestionar sus instalaciones, configurar horarios y ver las reservas de sus clientes.

## ¿Qué puedes hacer?

**Como jugador:**
- Buscar canchas por ciudad y tipo de superficie
- Ver disponibilidad en tiempo real
- Reservar un horario y recibir un QR de confirmación
- Ver y cancelar tus reservas

**Como dueño de cancha:**
- Registrar tus canchas con fotos, precio por hora y amenidades
- Crear bloques de tiempo disponibles
- Ver todas las reservas de tus canchas
- Gestionar el estado de cada reserva

## Stack

| Capa | Tecnología |
|------|-----------|
| API | NestJS 10, Prisma 5, PostgreSQL, Socket.io, Firebase Admin |
| Web | Next.js 14, React 18, TailwindCSS, TanStack Query |
| Mobile | Expo 51, React Native 0.74, Expo Router, NativeWind |
| Auth | Firebase Authentication |
| Cache | Redis |

## Estructura del proyecto

```
PitchPass/
├── apps/
│   ├── api/        # Backend NestJS
│   ├── web/        # App web Next.js
│   └── mobile/     # App móvil Expo
└── packages/
    ├── types/      # Tipos TypeScript compartidos
    └── config/     # Constantes y helpers compartidos
```

---

## Cómo ejecutar el proyecto

### Requisitos previos

- Node.js 20+
- pnpm 9+ → `npm install -g pnpm`
- PostgreSQL corriendo en localhost:5432
- Redis corriendo en localhost:6379
- Proyecto en Firebase con Authentication habilitado

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Crea los archivos `.env` copiando el ejemplo:

```bash
# En la raíz del proyecto
cp .env.example apps/api/.env
```

Luego crea `apps/web/.env.local` y `apps/mobile/.env` con los valores correspondientes del `.env.example`.

Rellena los valores reales de tu proyecto Firebase en cada archivo.

### 3. Crear la base de datos

```bash
cd apps/api
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### 4. Levantar los servicios

Abre 3 terminales:

```bash
# Terminal 1 — API (http://localhost:3001)
pnpm --filter @pitch-pass/api dev

# Terminal 2 — Web (http://localhost:3000)
pnpm --filter @pitch-pass/web dev

# Terminal 3 — Mobile
pnpm --filter @pitch-pass/mobile start
```
