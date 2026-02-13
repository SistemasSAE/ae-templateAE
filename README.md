# Asiste Tech - Landing Page

Landing page moderna para soluciones tecnológicas educativas, desarrollada con HTML5, Bootstrap 5 y JavaScript Vanilla.

## 🚀 Características

- ✅ Diseño responsivo (mobile-first)
- ✅ Animaciones CSS suaves y modernas
- ✅ Navbar con scroll spy
- ✅ Contador animado de estadísticas
- ✅ Formulario de contacto con validación
- ✅ Carrusel infinito de logos
- ✅ Botón "Volver arriba"
- ✅ SEO optimizado con meta tags
- ✅ Sin dependencias de jQuery o frameworks

## 📁 Estructura del Proyecto
```
asiste-landing/
│
├── index.html              # Página principal
├── README.md              # Este archivo
├── assets/
│   ├── css/
│   │   └── styles.css     # Estilos personalizados
│   └── js/
│       └── app.js         # Funcionalidad JavaScript
└── data/
    └── contact.json       # Simulación de respuesta API
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **Bootstrap 5.3.2**: Framework CSS (CDN)
- **Bootstrap Icons 1.11.2**: Iconos (CDN)
- **JavaScript Vanilla**: Sin dependencias adicionales
- **Fetch API**: Para simulación de envío de formulario

## 🎨 Paleta de Colores

- **Azul Principal**: `#0253ac`
- **Verde Secundario**: `#17d597`
- **Oscuro**: `#1a1a2e`
- **Claro**: `#f8f9fa`

## 🚀 Cómo Usar

### Opción 1: Abrir Directamente
1. Descarga o clona el proyecto
2. Abre `index.html` en tu navegador
3. ¡Listo! No requiere servidor local

### Opción 2: Con Live Server (Recomendado)
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html` → "Open with Live Server"
3. Se abrirá automáticamente en `http://localhost:5500`

## ✨ Funcionalidades JavaScript

### 1. Navbar Activo
El navbar detecta automáticamente la sección visible usando `IntersectionObserver`.

### 2. Animación de Contadores
Los números en la sección de estadísticas se animan al entrar en el viewport.

### 3. Validación de Formulario
- Nombre: mínimo 2 caracteres
- Email: formato válido
- Mensaje: mínimo 10 caracteres

### 4. Envío Simulado
El formulario usa Fetch para simular el envío leyendo `data/contact.json`.

### 5. Botón Volver Arriba
Aparece después de 300px de scroll y permite regresar suavemente al inicio.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: > 991px

## 🎯 Secciones de la Landing

1. **Hero**: Título principal con CTAs y animaciones
2. **Confían en Nosotros**: Carrusel infinito de logos
3. **Estadísticas**: Números con animación de contador
4. **Servicios**: Grid de 6 servicios con íconos
5. **Frase Destacada**: Quote inspiracional
6. **Testimonios**: Cards de clientes reales
7. **Contacto**: Formulario funcional con validación
8. **Footer**: Enlaces y redes sociales

## 🔧 Personalización

### Cambiar Colores
Edita las variables CSS en `assets/css/styles.css`:
```css
:root {
    --primary-color: #0253ac;
    --secondary-color: #17d597;
    /* ... más colores */
}
```

### Modificar Contenido
Todo el texto está en `index.html` y puede editarse directamente.

### Ajustar Animaciones
Los keyframes y transiciones están en `styles.css` bajo comentarios descriptivos.

## 📝 Notas Importantes

- ⚠️ El formulario NO envía datos a un servidor real (es simulación local)
- ⚠️ Para producción, implementa un backend real (PHP, Node.js, etc.)
- ⚠️ Las imágenes/logos son placeholders (íconos de Bootstrap)
- ⚠️ Para producción, considera minificar CSS/JS

## 🤝 Soporte

Para preguntas o problemas:
- Email: contacto@asistetech.com
- Teléfono: +1 (555) 123-4567

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y comerciales.