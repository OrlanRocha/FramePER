/**
 * Frame PER - JavaScript Components
 * Vanilla JS logic for interactive UI components
 */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Modals
    const modalTriggers = document.querySelectorAll("[data-toggle='modal']");
    modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute("data-target");
            const modal = document.querySelector(targetId);
            if(modal) {
                modal.classList.add("show");
                document.body.style.overflow = "hidden"; // Prevent scrolling
            }
        });
    });

    const modalCloseButtons = document.querySelectorAll("[data-dismiss='modal']");
    modalCloseButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const modal = btn.closest(".modal");
            if(modal) {
                modal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
    });

    // Close modal on click outside
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if(e.target === modal) {
                modal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
    });

    // 2. Dropdowns
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = toggle.closest(".dropdown");
            if(parent) {
                const menu = parent.querySelector(".dropdown-menu");
                if(menu) {
                    menu.classList.toggle("show");
                }
            }
        });
    });

    // Close dropdowns on outside click
    document.addEventListener("click", () => {
        const menus = document.querySelectorAll(".dropdown-menu.show");
        menus.forEach(menu => menu.classList.remove("show"));
    });

    // 3. Dismissible Alerts
    const alertDismissButtons = document.querySelectorAll("[data-dismiss='alert']");
    alertDismissButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const alert = btn.closest(".alert");
            if(alert) {
                alert.classList.add("fade-out");
                setTimeout(() => {
                    alert.remove();
                }, 300); // Matches transition duration
            }
        });
    });
});

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
