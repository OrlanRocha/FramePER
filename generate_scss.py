import os

SCSS_DIR = "src/scss"

files = {
    f"{SCSS_DIR}/_variables.scss": """// Colors
$colors: (
  "white": rgba(255, 255, 255, 1.0),
  "black": rgba(75, 75, 75, 1.0),
  "blue": rgba(50, 150, 225, 1.0),
  "yellow": rgba(255, 225, 50, 1.0),
  "green": rgba(50, 175, 75, 1.0),
  "red": rgba(200, 75, 75, 1.0),
  "orange": rgba(255, 165, 0, 1.0),
  "grey": rgba(180, 180, 180, 1.0),
  "texto": rgba(80, 80, 80, 1.0)
);

// Breakpoints
$breakpoints: (
  "sm": 576px,
  "md": 768px,
  "lg": 992px,
  "xl": 1200px,
  "xxl": 1400px
);

// Spacing
$spacing: (
  0: 0,
  1: 0.2rem,
  2: 0.4rem,
  3: 0.6rem,
  4: 0.8rem,
  5: 1rem,
  6: 1.2rem,
  7: 1.4rem,
  8: 1.6rem
);

// Fonts
$font-family-base: Arial, sans-serif;
$font-family-heading: Calibri, sans-serif;

// Border Radius
$radius: (
  0: 0,
  1: 0.2rem,
  2: 0.4rem,
  3: 0.6rem,
  4: 0.8rem,
  5: 1rem,
  6: 1.2rem,
  7: 1.4rem,
  "circle": 50%
);
""",
    f"{SCSS_DIR}/base/_reset.scss": """@use '../variables' as *;

:root {
  @each $name, $color in $colors {
    --#{$name}: #{$color};
  }
}

html {
  box-sizing: border-box;
  font-size: 16px;
}

*, *:before, *:after {
  box-sizing: inherit;
  font-family: $font-family-base;
  margin: 0;
  padding: 0;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, .2) transparent;
}

*::-webkit-scrollbar {
  width: .8rem;
  border-radius: .4rem;
}

*::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, .05);
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, .2);
  border-radius: .4rem;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

body {
  width: 100%;
  color: var(--texto);
  background-color: var(--white);
  line-height: 1.5;
}
""",
    f"{SCSS_DIR}/base/_typography.scss": """@use '../variables' as *;

h1, h2, h3, h4, h5, h6 {
  color: rgba(25, 25, 25, 1.0);
  font-weight: 400;
  font-family: $font-family-heading;
  margin-bottom: 0.5rem;
}

.h1 { font-size: 4.2rem; }
.h2 { font-size: 5.8rem; }
.h3 { font-size: 6.4rem; }
.h4 { font-size: 7.8rem; }
.h5 { font-size: 8.4rem; }

.p {
  font-family: $font-family-heading;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.txt-center { text-align: center; }
.txt-left { text-align: left; }
.txt-right { text-align: right; }

// Font weights
@for $i from 1 through 9 {
  .f-w-#{$i} { font-weight: $i * 100; }
}

// Font sizes
$fs: (1: 0.6rem, 2: 0.75rem, 3: 0.9rem, 4: 1.2rem, 5: 1.5rem, 6: 1.8rem, 7: 2.1rem, 8: 2.4rem, 9: 2.7rem);
@each $num, $size in $fs {
  .f-s-#{$num} { font-size: $size; }
}
""",
    f"{SCSS_DIR}/layout/_grid.scss": """@use '../variables' as *;

.container {
  width: 100%;
  margin: 0 auto;
  max-width: 1366px;
  min-width: 320px;
  padding: 1rem;
}

.grid {
  display: grid;
  gap: 1rem; // modern grids use gap
}

// Generate base grids
@for $i from 1 through 12 {
  .grid-#{$i} {
    display: grid;
    grid-template-columns: repeat($i, 1fr);
    gap: 1rem;
  }
}

// Custom uneven grids from original framework
.grid-1-9 { display: grid; grid-template-columns: 10% 90%; gap: 1rem; }
.grid-2-8 { display: grid; grid-template-columns: 20% 80%; gap: 1rem; }
.grid-3-7 { display: grid; grid-template-columns: 30% 70%; gap: 1rem; }
.grid-4-6 { display: grid; grid-template-columns: 40% 60%; gap: 1rem; }
.grid-5-5 { display: grid; grid-template-columns: 50% 50%; gap: 1rem; }
.grid-6-4 { display: grid; grid-template-columns: 60% 40%; gap: 1rem; }
.grid-7-3 { display: grid; grid-template-columns: 70% 30%; gap: 1rem; }
.grid-8-2 { display: grid; grid-template-columns: 80% 20%; gap: 1rem; }
.grid-9-1 { display: grid; grid-template-columns: 90% 10%; gap: 1rem; }

// Responsive Grids
@each $bp, $value in $breakpoints {
  @media (min-width: #{$value}) {
    @for $i from 1 through 12 {
      .grid-#{$bp}-#{$i} {
        grid-template-columns: repeat($i, 1fr);
      }
    }
  }
}
""",
    f"{SCSS_DIR}/components/_buttons.scss": """@use '../variables' as *;

button {
  width: 100%;
  border-style: none;
  border: 2px solid transparent;
  border-radius: .4rem;
}

.btn {
  display: inline-block;
  padding: .8rem 1.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: .4rem;
  font-weight: 500;
  text-align: center;
  transition: all .3s ease;
  
  &:focus, &:active {
    outline: none;
    transform: scale(0.98);
  }
}

@each $name, $color in $colors {
  .btn-#{$name} {
    background-color: var(--#{$name});
    color: if($name == 'white' or $name == 'yellow', var(--black), var(--white));
    
    &:hover {
      filter: brightness(90%);
    }
  }
}
""",
    f"{SCSS_DIR}/components/_forms.scss": """@use '../variables' as *;

input, select, textarea {
  width: 100%;
  max-width: 100%;
  outline: none;
  border: none;
}

.input, .textarea, .select {
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: .6rem 1.4rem;
  border-radius: .4rem;
  font-size: 1rem;
  background-color: var(--white);
  box-shadow: 0 3px 3px 1px rgba(45, 45, 45, 0.1);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  
  &:focus {
    box-shadow: 0 0 5px rgba(50, 150, 225, 0.5);
    border-color: var(--blue);
  }
}
""",
    f"{SCSS_DIR}/components/_tables.scss": """@use '../variables' as *;

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

table th, table td {
  padding: 0.7rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: left;
  font-size: 0.9rem; // Increased from 0.7 for better readability
}

table thead tr {
  background-color: var(--blue);
  color: var(--white);
}

table tbody tr {
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
}
""",
    f"{SCSS_DIR}/utilities/_spacing.scss": """@use '../variables' as *;

@each $num, $val in $spacing {
  // Margin
  .m-#{$num} { margin: $val; }
  .m-t-#{$num} { margin-top: $val; }
  .m-b-#{$num} { margin-bottom: $val; }
  .m-l-#{$num} { margin-left: $val; }
  .m-r-#{$num} { margin-right: $val; }
  .m-x-#{$num} { margin-left: $val; margin-right: $val; }
  .m-y-#{$num} { margin-top: $val; margin-bottom: $val; }

  // Padding
  .p-#{$num} { padding: $val; }
  .p-t-#{$num} { padding-top: $val; }
  .p-b-#{$num} { padding-bottom: $val; }
  .p-l-#{$num} { padding-left: $val; }
  .p-r-#{$num} { padding-right: $val; }
  .p-x-#{$num} { padding-left: $val; padding-right: $val; }
  .p-y-#{$num} { padding-top: $val; padding-bottom: $val; }
}

// Auto margins
.m-auto { margin: auto; }
.m-x-auto { margin-left: auto; margin-right: auto; }
""",
    f"{SCSS_DIR}/utilities/_colors.scss": """@use '../variables' as *;

@each $name, $color in $colors {
  .bg-#{$name} { background-color: var(--#{$name}) !important; color: if($name == 'white' or $name == 'yellow', var(--black), var(--white)); }
  .text-#{$name} { color: var(--#{$name}) !important; }
  .b-#{$name} { border-color: var(--#{$name}) !important; }
}
""",
    f"{SCSS_DIR}/utilities/_borders.scss": """@use '../variables' as *;

@each $num, $val in $radius {
  .r-#{$num} { border-radius: $val !important; }
  .r-t-#{$num} { border-top-left-radius: $val !important; border-top-right-radius: $val !important; }
  .r-b-#{$num} { border-bottom-left-radius: $val !important; border-bottom-right-radius: $val !important; }
  .r-l-#{$num} { border-top-left-radius: $val !important; border-bottom-left-radius: $val !important; }
  .r-r-#{$num} { border-top-right-radius: $val !important; border-bottom-right-radius: $val !important; }
}

@for $i from 0 through 6 {
  .b-#{$i} { border: #{$i}px solid rgba(55,55,55, .2); }
  .b-t-#{$i} { border-top: #{$i}px solid rgba(55,55,55, .2); }
  .b-b-#{$i} { border-bottom: #{$i}px solid rgba(55,55,55, .2); }
  .b-l-#{$i} { border-left: #{$i}px solid rgba(55,55,55, .2); }
  .b-r-#{$i} { border-right: #{$i}px solid rgba(55,55,55, .2); }
}
""",
    f"{SCSS_DIR}/utilities/_sizing.scss": """
.w-100 { width: 100%; max-width: 100%; }
.w-75 { width: 75%; max-width: 75%; }
.w-50 { width: 50%; max-width: 50%; }
.w-25 { width: 25%; max-width: 25%; }
.w-auto { width: auto; }

.h-100 { height: 100%; }
.h-auto { height: auto; }
.vh-100 { height: 100vh; }
.vw-100 { width: 100vw; }

// Fixed sizes from original
@for $i from 1 through 6 {
  .h-#{$i} { height: $i * 10rem; }
  .w-#{$i} { width: $i * 10rem; }
}
""",
    f"{SCSS_DIR}/utilities/_misc.scss": """
.d-none { display: none !important; }
.d-block { display: block !important; }
.d-inline-block { display: inline-block !important; }
.d-flex { display: flex !important; }
.d-inline-flex { display: inline-flex !important; }

.flex-row { flex-direction: row !important; }
.flex-column { flex-direction: column !important; }
.flex-wrap { flex-wrap: wrap !important; }

.justify-content-center { justify-content: center !important; }
.justify-content-start { justify-content: flex-start !important; }
.justify-content-end { justify-content: flex-end !important; }
.justify-content-between { justify-content: space-between !important; }
.justify-content-around { justify-content: space-around !important; }

.align-items-center { align-items: center !important; }
.align-items-start { align-items: flex-start !important; }
.align-items-end { align-items: flex-end !important; }

.p-relative { position: relative !important; }
.p-absolute { position: absolute !important; }
.p-fixed { position: fixed !important; }
.p-sticky { position: sticky !important; }

.f-left { float: left !important; }
.f-right { float: right !important; }

.o-h { overflow: hidden !important; }
.o-s { overflow: scroll !important; }
.o-auto { overflow: auto !important; }
.o-h-s { overflow-x: hidden !important; overflow-y: scroll !important; }
.o-h-v { overflow-y: hidden !important; }

.unselect { user-select: none !important; }
.cursor { cursor: pointer !important; }

.sombra { box-shadow: 0 3px 20px -2px rgba(45, 45, 45, 0.2); }
.sombra-hover:hover { box-shadow: 0 8px 25px -5px rgba(45, 45, 45, 0.3); transform: translateY(-2px); transition: all 0.3s ease; }

@keyframes cima-baixo {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}
.animacao { animation: cima-baixo 2s ease-in-out infinite alternate-reverse both; }

.hidden { visibility: hidden !important; }
.visible { visibility: visible !important; }
""",
    f"{SCSS_DIR}/framePER.scss": """
// FramePER CSS - Professional Edition
@use 'variables';
@use 'base/reset';
@use 'base/typography';
@use 'layout/grid';
@use 'components/buttons';
@use 'components/forms';
@use 'components/tables';
@use 'utilities/spacing';
@use 'utilities/colors';
@use 'utilities/borders';
@use 'utilities/sizing';
@use 'utilities/misc';
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("SCSS files created successfully.")
