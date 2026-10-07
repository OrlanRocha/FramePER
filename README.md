# FramePER CSS

![NPM Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

FramePER CSS is a modern, responsive, and lightweight CSS framework designed to simplify and accelerate web development. Built with SCSS, it provides a highly customizable utility-first approach combined with powerful layout components.

## 🚀 Features

- **Responsive Grid System**: Modern CSS Grid based layout with breakpoints (`sm`, `md`, `lg`, `xl`).
- **SCSS Architecture**: Highly modular, organized by variables, base, components, layouts, and utilities.
- **Utility-First**: Extensive classes for margins, paddings, sizing, borders, colors, typography, and flexbox/grid.
- **Modern CSS**: Leveraging CSS Variables for theming, CSS Grid for layouts, and flexbox.
- **Production Ready**: Automated build process via PostCSS resulting in highly optimized, minified code (`framePER.min.css`).

## 📦 Getting Started

### Using the Pre-compiled Version

Just include the compiled and minified CSS file in your HTML `<head>`:

```html
<link rel="stylesheet" href="dist/framePER.min.css">
```

### Building from Source

If you want to customize variables, colors, or breakpoints, you can build from source.

1. Clone the repository:
   ```bash
   git clone https://github.com/OrlanRocha/FramePER-CSS.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the CSS:
   ```bash
   npm run build
   ```
   This will generate `dist/framePER.css` and `dist/framePER.min.css`.

## 🎨 Customization

All core configurations are located in `src/scss/_variables.scss`. You can easily change:
- Colors (`$colors`)
- Breakpoints (`$breakpoints`)
- Spacing Scales (`$spacing`)
- Border Radius (`$radius`)
- Typography (`$font-family-base`, `$font-family-heading`)

## 🛠️ Components & Utilities

### 1. Grid System
FramePER CSS offers a powerful grid system:
```html
<div class="grid grid-3">
  <!-- 3 equal columns -->
  <div>1</div><div>2</div><div>3</div>
</div>

<div class="grid grid-md-4">
  <!-- 4 columns on medium screens and up -->
</div>
```

### 2. Spacing
Consistent spacing scale using `m` (margin) and `p` (padding) with modifiers (`t`, `b`, `l`, `r`, `x`, `y`):
```html
<div class="m-t-5 p-3">
  Margin Top 5 (1rem), Padding 3 (0.6rem)
</div>
```

### 3. Typography
Clean heading styles and text utilities:
```html
<h1 class="h1">Display Heading</h1>
<p class="p txt-center f-w-7">Paragraph text, centered, bold (700)</p>
```

### 4. Buttons
Easily add stylish, modern buttons:
```html
<button class="btn btn-blue">Primary Action</button>
<a href="#" class="btn btn-green">Link Button</a>
```

### 5. Forms & Tables
Pre-styled form inputs and clean tables ready for use:
```html
<input type="text" class="input" placeholder="Type here...">
<table class="w-100">...</table>
```

## 📜 License

This project is licensed under the MIT License.
