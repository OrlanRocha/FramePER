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
