# Frame PER

![NPM Version](https://img.shields.io/badge/version-1.6.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frame PER** is a modern, responsive, and lightweight **UI Framework** (CSS & JS) designed to simplify and accelerate web development. Built with SCSS and Vanilla JS, it provides a highly customizable utility-first approach combined with powerful layout components, interactive elements, animations, and icons.

## 🚀 Features

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

## 🧠 Advanced JavaScript API (New!)

O **Frame PER** agora expõe um objeto global `FramePER` contendo métodos utilitários poderosos para facilitar a criação de aplicativos web complexos sem a necessidade de bibliotecas gigantescas como jQuery ou Axios.

### 1. Loader da Página
Exiba um overlay de carregamento quando estiver executando uma requisição longa.

```javascript
// Exibe a tela de carregamento inteira
FramePER.Loader.showPageLoad();

// Esconde a tela de carregamento
FramePER.Loader.hidePageLoad();
```

Você também pode exibir um spinner dentro de um botão durante o carregamento:
```javascript
const myButton = document.querySelector('#submitBtn');
FramePER.Loader.buttonLoading(myButton, true); // Adiciona o spinner e desabilita o botão
FramePER.Loader.buttonLoading(myButton, false); // Restaura o botão original
```

### 2. Notificações Dinâmicas (Toasts)
Chega de criar HTML manual para cada Toast. Você pode invocá-los dinamicamente!

```javascript
// Notificação de sucesso
FramePER.Notify.success('Sucesso', 'Operação realizada com êxito!', 3000);

// Notificação de erro
FramePER.Notify.error('Falha', 'Não foi possível salvar os dados.', 5000);

// Informação padrão
FramePER.Notify.info('Aviso', 'Seu perfil foi atualizado.');
```

### 3. Requisições HTTP (AJAX/Fetch API Wrapper)
O Frame PER simplifica o uso da Fetch API padrão do navegador, lidando com erros e parseamento de JSON de forma elegante.

```javascript
async function carregarUsuarios() {
    FramePER.Loader.showPageLoad(); // Mostra loader
    
    // Faz a requisição GET
    const response = await FramePER.Http.get('https://api.exemplo.com/usuarios');
    
    FramePER.Loader.hidePageLoad(); // Esconde loader
    
    if (response.ok) {
        console.log('Dados recebidos:', response.data);
        FramePER.Notify.success('Carregado', 'Usuários recebidos com sucesso!');
    } else {
        // Se der erro de rede ou código 400/500, a notificação de erro é disparada automaticamente!
        console.error('Erro:', response.error);
    }
}

// Exemplos de POST
FramePER.Http.post('/api/save', { nome: 'João', idade: 30 });
```

## 📜 License

This project is licensed under the MIT License.
