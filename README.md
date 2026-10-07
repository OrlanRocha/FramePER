# Frame PER

![NPM Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frame PER** is a modern, responsive, and lightweight **UI Framework** (CSS & JS) designed to simplify and accelerate web development. Built with SCSS and Vanilla JS, it provides a highly customizable utility-first approach combined with powerful layout components, interactive elements, and animations.

## 🚀 Features

- **CSS & JS Integrated**: Now includes a Vanilla JS library for interactive components (Modals, Dropdowns, Alerts).
- **Smooth Animations & Transitions**: Built-in CSS utilities for `fade-in`, `slide-up`, `hover-scale`, and more.
- **Responsive Grid System**: Modern CSS Grid based layout with breakpoints (`sm`, `md`, `lg`, `xl`).
- **SCSS Architecture**: Highly modular, organized by variables, base, components, layouts, and utilities.
- **Utility-First**: Extensive classes for margins, paddings, sizing, borders, colors, typography, and flexbox/grid.
- **Production Ready**: Automated build process via PostCSS & Terser resulting in optimized `framePER.min.css` and `framePER.min.js`.

## 📦 Getting Started

### Using the Pre-compiled Version

Include the compiled CSS and JS files in your HTML:

```html
<!-- In your <head> -->
<link rel="stylesheet" href="dist/framePER.min.css">

<!-- Right before closing </body> -->
<script src="dist/framePER.min.js"></script>
```

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/OrlanRocha/FramePER-CSS.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the assets:
   ```bash
   npm run build
   ```
   This will generate the `/dist` folder with both CSS and JS compiled files.

## 🛠️ Components & Utilities

### 1. Interactive Components (New! ✨)
Frame PER now comes with pure JavaScript behaviors (No jQuery needed!).

**Modals:**
```html
<button class="btn btn-blue" data-toggle="modal" data-target="#myModal">Open Modal</button>

<div id="myModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="h3">Modal Title</h3>
      <button class="modal-close" data-dismiss="modal">&times;</button>
    </div>
    <p>Modal body content goes here.</p>
  </div>
</div>
```

**Dismissible Alerts:**
```html
<div class="alert alert-blue">
  This is a primary alert!
  <button class="alert-close" data-dismiss="alert">&times;</button>
</div>
```

### 2. Animations & Transitions (New! ✨)
Add life to your UI with simple classes:
```html
<div class="fade-in">Fades in on load</div>
<div class="slide-up">Slides up on load</div>
<button class="btn btn-green hover-lift transition">Hover me to lift</button>
```

### 3. Grid System
Frame PER offers a powerful grid system:
```html
<div class="grid grid-3">
  <div>1</div><div>2</div><div>3</div>
</div>
```

### 4. Typography & Spacing
Clean heading styles and text utilities:
```html
<h1 class="h1 m-b-4">Display Heading</h1>
<p class="p txt-center f-w-7">Paragraph text, centered, bold (700)</p>
```

## 📜 License

This project is licensed under the MIT License.
