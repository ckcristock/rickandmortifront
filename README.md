# Rick and Morty Frontend

Aplicación web desarrollada con Angular 21 que consume la API de Rick and Morty para mostrar información sobre los personajes de la serie.

## 📋 Descripción

Esta aplicación permite:

- Ver un listado de todos los personajes de Rick and Morty
- Ver detalles específicos de cada personaje
- Navegar entre diferentes vistas usando Angular Router
- Interfaz responsive y moderna

## 🚀 Tecnologías

- **Angular 21.0.0** - Framework principal
- **TypeScript 5.9.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva
- **Vitest 4.0.8** - Framework de testing
- **Angular Router** - Navegación entre vistas
- **Standalone Components** - Arquitectura moderna de Angular

## 📦 Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado:

- **Node.js**: versión 20.x o superior (recomendado)
- **npm**: versión 11.x o superior

Para verificar las versiones instaladas:

```bash
node --version
npm --version
```

## 🔧 Instalación

1. **Clonar el repositorio** (si aplica) o descomprimir el proyecto

2. **Instalar las dependencias**:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias definidas en `package.json`.

## ▶️ Ejecución del Proyecto

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm start
```

O alternativamente:

```bash
ng serve
```

Una vez que el servidor esté en ejecución, abre tu navegador y navega a:

```
http://localhost:4200/
```

La aplicación se recargará automáticamente cada vez que modifiques algún archivo del código fuente.

### Otras opciones de ejecución

- **Modo watch** (compilación continua):

```bash
npm run watch
```

## 🏗️ Compilación para Producción

Para compilar el proyecto para producción, ejecuta:

```bash
npm run build
```

Los archivos compilados se almacenarán en el directorio `dist/`. Esta compilación está optimizada para rendimiento y velocidad.

## 🧪 Pruebas

Para ejecutar las pruebas unitarias con Vitest:

```bash
npm test
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── character-list/          # Listado de personajes
│   │   ├── character-detail/        # Detalle de un personaje
│   │   ├── character-detail-page/   # Página de detalle
│   │   └── toolbar/                 # Barra de navegación
│   ├── models/
│   │   └── character.interface.ts   # Interfaces de TypeScript
│   ├── services/
│   │   └── character.service.ts     # Servicio para API
│   ├── app.config.ts                # Configuración de la app
│   ├── app.routes.ts                # Rutas de la aplicación
│   └── app.ts                       # Componente principal
├── index.html
├── main.ts
└── styles.scss
```

## 🌐 API Utilizada

Este proyecto consume la [Rick and Morty API](https://rickandmortyapi.com/):

- Endpoint base: `https://rickandmortyapi.com/api`
- Documentación: https://rickandmortyapi.com/documentation

## 💡 Características Técnicas

- **Standalone Components**: Sin uso de NgModules
- **Signals**: Gestión de estado moderna con señales
- **OnPush Change Detection**: Optimización de rendimiento
- **Lazy Loading**: Carga diferida de rutas
- **Reactive Forms**: Formularios reactivos
- **TypeScript Strict Mode**: Tipado estricto

## 🐛 Solución de Problemas

### El servidor no inicia

- Verifica que todas las dependencias estén instaladas: `npm install`
- Asegúrate de que el puerto 4200 no esté en uso por otra aplicación
- Intenta limpiar la caché: `npm cache clean --force`

### Error al instalar dependencias

- Verifica tu versión de Node.js: `node --version`
- Elimina `node_modules` y `package-lock.json`, luego ejecuta `npm install` nuevamente

## 📝 Notas para el Evaluador

1. Este proyecto fue desarrollado siguiendo las mejores prácticas de Angular 21
2. Se utilizan standalone components (sin NgModules)
3. La gestión de estado se realiza con signals
4. Todo el código sigue TypeScript strict mode
5. Se implementó lazy loading para optimizar la carga inicial

## 🔗 Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Rick and Morty API](https://rickandmortyapi.com/documentation)
