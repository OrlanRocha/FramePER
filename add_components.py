import os

# 1. Navbar SCSS
with open("src/scss/components/_navbar.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: var(--white);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: relative;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--black);
    text-decoration: none;
}

.navbar-nav {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    margin: 0;
    
    .nav-item {
        .nav-link {
            color: var(--texto);
            text-decoration: none;
            transition: color 0.3s;
            &:hover { color: var(--blue); }
        }
    }
}

.navbar-toggler {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

@media (max-width: 768px) {
    .navbar-toggler { display: block; }
    .navbar-nav {
        display: none;
        flex-direction: column;
        width: 100%;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: var(--white);
        padding: 1rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        
        &.active { display: flex; }
    }
}
""")

# 2. Cards SCSS
with open("src/scss/components/_cards.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.card {
    background-color: var(--white);
    border-radius: 0.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
}

.card-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.card-body {
    padding: 1.5rem;
}

.card-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--black);
}

.card-text {
    color: var(--texto);
    margin-bottom: 1rem;
}

.card-footer {
    padding: 1rem 1.5rem;
    background-color: rgba(0,0,0,0.02);
    border-top: 1px solid rgba(0,0,0,0.05);
}
""")

# 3. Accordions SCSS
with open("src/scss/components/_accordions.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.accordion {
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 0.4rem;
    overflow: hidden;
    margin-bottom: 1rem;
}

.accordion-item {
    border-bottom: 1px solid rgba(0,0,0,0.1);
    &:last-child { border-bottom: none; }
}

.accordion-header {
    background-color: var(--white);
    padding: 1rem 1.5rem;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s;
    
    &:hover { background-color: rgba(0,0,0,0.02); }
    
    &::after {
        content: '+';
        font-size: 1.2rem;
        transition: transform 0.3s;
    }
    
    &.active {
        background-color: rgba(0,0,0,0.05);
        &::after { content: '-'; transform: rotate(180deg); }
    }
}

.accordion-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out, padding 0.3s ease;
    background-color: var(--white);
    
    &.active {
        padding: 1rem 1.5rem;
        max-height: 1000px; /* arbitrary max height for transition */
    }
}
""")

# 4. Badges SCSS
with open("src/scss/components/_badges.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.badge {
    display: inline-block;
    padding: 0.25em 0.6em;
    font-size: 0.75rem;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
    color: var(--white);
    
    &.badge-pill { border-radius: 10rem; }
}

@each $name, $color in $colors {
    .badge-#{$name} {
        background-color: var(--#{$name});
        color: if($name == 'white' or $name == 'yellow', var(--black), var(--white));
    }
}
""")

# 5. Carousel SCSS
with open("src/scss/components/_carousel.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.carousel {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 0.5rem;
}

.carousel-inner {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.carousel-item {
    min-width: 100%;
    box-sizing: border-box;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.5);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
    
    &:hover { background: rgba(0,0,0,0.8); }
    &.prev { left: 10px; }
    &.next { right: 10px; }
}

.carousel-indicators {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    
    .indicator {
        width: 10px;
        height: 10px;
        background: rgba(255,255,255,0.5);
        border-radius: 50%;
        cursor: pointer;
        
        &.active { background: white; }
    }
}
""")

# 6. Toasts SCSS
with open("src/scss/components/_toasts.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
}

.toast {
    min-width: 250px;
    background-color: var(--white);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 0.4rem;
    overflow: hidden;
    transform: translateX(120%);
    transition: transform 0.3s ease-out, opacity 0.3s ease;
    opacity: 0;
    
    &.show {
        transform: translateX(0);
        opacity: 1;
    }
}

.toast-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: rgba(0,0,0,0.03);
    border-bottom: 1px solid rgba(0,0,0,0.05);
    font-weight: bold;
}

.toast-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--grey);
}

.toast-body {
    padding: 1rem;
    color: var(--texto);
}
""")

# 7. Tooltips SCSS
with open("src/scss/components/_tooltips.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

[data-tooltip] {
    position: relative;
    cursor: help;
    
    &::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-5px);
        background-color: var(--black);
        color: var(--white);
        padding: 0.4rem 0.8rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, transform 0.2s;
        z-index: 100;
        pointer-events: none;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(5px);
        border-width: 5px;
        border-style: solid;
        border-color: var(--black) transparent transparent transparent;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, transform 0.2s;
        z-index: 100;
        pointer-events: none;
    }
    
    &:hover::before {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(-10px);
    }
    
    &:hover::after {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
}
""")

# Append to framePER.scss
with open("src/scss/framePER.scss", "a", encoding="utf-8") as f:
    f.write("""@use 'components/navbar';
@use 'components/cards';
@use 'components/accordions';
@use 'components/badges';
@use 'components/carousel';
@use 'components/toasts';
@use 'components/tooltips';
""")

# Update JS with new component logic
with open("src/js/framePER.js", "a", encoding="utf-8") as f:
    f.write("""
    // 4. Navbar Mobile Toggle
    const navbarToggles = document.querySelectorAll('.navbar-toggler');
    navbarToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const target = document.querySelector(toggle.getAttribute('data-target'));
            if(target) target.classList.toggle('active');
        });
    });

    // 5. Accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const body = header.nextElementSibling;
            if(body) body.classList.toggle('active');
        });
    });

    // 6. Carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const nextBtn = carousel.querySelector('.carousel-control.next');
        const prevBtn = carousel.querySelector('.carousel-control.prev');
        const indicators = carousel.querySelectorAll('.carousel-indicators .indicator');
        
        let currentIndex = 0;
        
        function updateCarousel() {
            inner.style.transform = `translateX(-${currentIndex * 100}%)`;
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === currentIndex);
            });
        }
        
        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            });
        }
        
        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateCarousel();
            });
        }
        
        indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
        });
    });

    // 7. Toasts (Global function)
    window.FramePER = window.FramePER || {};
    window.FramePER.showToast = function(id) {
        const toast = document.getElementById(id);
        if(toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000); // Auto hide after 3s
        }
    };
    
    // Toast close buttons
    const toastCloseBtns = document.querySelectorAll('.toast-close');
    toastCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const toast = btn.closest('.toast');
            if(toast) toast.classList.remove('show');
        });
    });
""")

print("New components added to SCSS and JS.")
