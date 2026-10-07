# Frame PER

![NPM Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frame PER** is a modern, responsive, and lightweight **UI Framework** (CSS & JS) designed to simplify and accelerate web development. Built with SCSS and Vanilla JS, it provides a highly customizable utility-first approach combined with powerful layout components, interactive elements, and animations.

## 🚀 Features

- **Comprehensive UI Kit**: Now includes Navbars, Cards, Accordions, Carousels, Toasts, Tooltips, Modals, and Badges.
- **CSS & JS Integrated**: Includes a Vanilla JS library for interactive components.
- **Smooth Animations & Transitions**: Built-in CSS utilities for `fade-in`, `slide-up`, `hover-scale`, and more.
- **Responsive Grid System**: Modern CSS Grid based layout with breakpoints (`sm`, `md`, `lg`, `xl`).
- **SCSS Architecture**: Highly modular, organized by variables, base, components, layouts, and utilities.
- **Production Ready**: Automated build process via PostCSS & Terser.

## 📦 Getting Started

Include the compiled CSS and JS files in your HTML:

```html
<!-- In your <head> -->
<link rel="stylesheet" href="dist/framePER.min.css">

<!-- Right before closing </body> -->
<script src="dist/framePER.min.js"></script>
```

## 🛠️ Components Showcase (New! ✨)

Frame PER now comes with a massive arsenal of UI components!

### Navbar
Responsive navigation with mobile toggle:
```html
<nav class="navbar">
  <a href="#" class="navbar-brand">Brand</a>
  <button class="navbar-toggler" data-target="#nav-menu">☰</button>
  <ul class="navbar-nav" id="nav-menu">
    <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
  </ul>
</nav>
```

### Cards
Clean cards with hover animations:
```html
<div class="card">
  <img src="img.jpg" class="card-img">
  <div class="card-body">
    <h3 class="card-title">Card Title</h3>
    <p class="card-text">Content goes here.</p>
  </div>
</div>
```

### Accordions
Expandable FAQs or lists:
```html
<div class="accordion">
  <div class="accordion-item">
    <div class="accordion-header">Section 1</div>
    <div class="accordion-body">Content here...</div>
  </div>
</div>
```

### Badges
```html
<span class="badge badge-blue">New!</span>
<span class="badge badge-pill badge-red">99+</span>
```

### Toasts
Floating notifications:
```html
<div class="toast-container">
  <div id="myToast" class="toast">
    <div class="toast-header">Notification <button class="toast-close">&times;</button></div>
    <div class="toast-body">Task completed!</div>
  </div>
</div>
<script>
  FramePER.showToast('myToast'); // triggers toast
</script>
```

### Tooltips
Pure CSS tooltips:
```html
<button data-tooltip="This is a tooltip">Hover me</button>
```

### Carousels
Simple image slider:
```html
<div class="carousel">
  <div class="carousel-inner">
    <div class="carousel-item">Slide 1</div>
    <div class="carousel-item">Slide 2</div>
  </div>
  <button class="carousel-control prev"><</button>
  <button class="carousel-control next">></button>
  <div class="carousel-indicators">
    <div class="indicator active"></div>
    <div class="indicator"></div>
  </div>
</div>
```

## 📜 License

This project is licensed under the MIT License.
