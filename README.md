# Frame PER

![NPM Version](https://img.shields.io/badge/version-1.7.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frame PER** is a modern, responsive, and lightweight **UI Framework** (CSS & JS) designed to simplify and accelerate web development. Built with SCSS and Vanilla JS, it provides a highly customizable utility-first approach combined with powerful layout components, interactive elements, animations, and icons.

## 🚀 Features

- **📱 Mobile First**: A base do Frame PER é totalmente Mobile First. Componentes colapsam nativamente no celular e expandem via utilitários (ex: `.grid-md-3`, `.d-lg-flex`).
- **Advanced JS Interactivity**: Built-in HTTP Fetch wrappers, Page Loaders, and dynamic Toasts.
- **Comprehensive UI Kit**: Navbars, Cards, Accordions, Carousels, Toasts, Tooltips, Modals, Badges, Tabs, Offcanvas, Avatars, Pagination, Breadcrumbs and Switch toggles.
- **Pure CSS Icons**: 20 Built-in SVG icons rendered natively via CSS `mask-image`.
- **Smooth Animations & Transitions**: Built-in CSS utilities for `fade-in`, `slide-up`, `hover-scale`, and Loaders.
- **Responsive Grid System**: Modern CSS Grid based layout with breakpoints (`sm`, `md`, `lg`, `xl`).
- **Production Ready**: Automated build process via PostCSS & Terser.

## 📦 Getting Started

Include the compiled CSS and JS files in your HTML:

```html
<!-- In your <head> -->
<link rel="stylesheet" href="dist/framePER.min.css">

<!-- Right before closing </body> -->
<script src="dist/framePER.min.js"></script>
```

## 📱 Mobile First & Utilitários Responsivos

O Grid System do Frame PER prioriza telas pequenas.

**Comportamento Padrão Mobile:**
Ao usar a classe `.grid`, seu conteúdo ocupará apenas **1 coluna** (100% de largura) para se adaptar às telas dos celulares, sem quebrar layout.

**Evoluindo para Desktop:**
Para aplicar múltiplas colunas em telas maiores, utilize as classes `.grid-{breakpoint}-{colunas}`.
```html
<!-- Fica 1 coluna no celular, e expande para 3 colunas em telas Médias (md) e maiores -->
<div class="grid grid-md-3">
  <div>Coluna A</div>
  <div>Coluna B</div>
  <div>Coluna C</div>
</div>
```

**Utilitários de Display e Flexbox Mobile First:**
Você pode controlar quando exibir elementos utilizando as classes `.d-{bp}-none` e `.d-{bp}-block`.
```html
<!-- Este elemento é escondido no celular, e só aparece em telas Grandes (lg) -->
<div class="d-none d-lg-block">
  Exibido apenas no Desktop
</div>

<!-- Flexbox responsivo: Fica em coluna no celular, e fica em linha no Desktop (lg) -->
<div class="d-flex flex-column flex-lg-row">...</div>
```

## 🧠 Advanced JavaScript API

O **Frame PER** agora expõe um objeto global `FramePER` contendo métodos utilitários poderosos.

### 1. Loader da Página
```javascript
FramePER.Loader.showPageLoad();
FramePER.Loader.hidePageLoad();

const myButton = document.querySelector('#submitBtn');
FramePER.Loader.buttonLoading(myButton, true);
```

### 2. Notificações Dinâmicas (Toasts)
```javascript
FramePER.Notify.success('Sucesso', 'Operação realizada com êxito!', 3000);
FramePER.Notify.error('Falha', 'Não foi possível salvar os dados.', 5000);
FramePER.Notify.info('Aviso', 'Seu perfil foi atualizado.');
```

### 3. Requisições HTTP (AJAX/Fetch API Wrapper)
```javascript
async function carregarUsuarios() {
    FramePER.Loader.showPageLoad();
    const response = await FramePER.Http.get('/api/usuarios');
    FramePER.Loader.hidePageLoad();
    
    if (response.ok) {
        FramePER.Notify.success('Carregado', 'Usuários recebidos com sucesso!');
    }
}
```

## 📜 License

This project is licensed under the MIT License.
