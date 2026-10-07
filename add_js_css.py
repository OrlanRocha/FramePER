import os

os.makedirs("src/js", exist_ok=True)
with open("src/js/framePER.js", "w", encoding="utf-8") as f:
    f.write("""/**
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
""")

# Create Animations SCSS
with open("src/scss/utilities/_animations.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.fade-in {
    animation: fadeIn 0.3s ease-in-out forwards;
}

.fade-out {
    animation: fadeOut 0.3s ease-in-out forwards;
}

.slide-up {
    animation: slideUp 0.4s ease-out forwards;
}

.slide-down {
    animation: slideDown 0.4s ease-out forwards;
}

.bounce {
    animation: bounce 2s infinite;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
}
""")

# Create Transitions SCSS
with open("src/scss/utilities/_transitions.scss", "w", encoding="utf-8") as f:
    f.write("""
.transition { transition: all 0.3s ease !important; }
.transition-fast { transition: all 0.15s ease !important; }
.transition-slow { transition: all 0.5s ease !important; }

.hover-scale {
    transition: transform 0.3s ease;
    &:hover { transform: scale(1.05); }
}

.hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }
}
""")

# Update main SCSS
with open("src/scss/framePER.scss", "a", encoding="utf-8") as f:
    f.write("""@use 'utilities/animations';
@use 'utilities/transitions';
@use 'components/modals';
@use 'components/dropdowns';
@use 'components/alerts';
""")

# Modals SCSS
with open("src/scss/components/_modals.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    &.show {
        opacity: 1;
        visibility: visible;
        .modal-content {
            transform: translateY(0);
        }
    }
}

.modal-content {
    background-color: var(--white);
    padding: 2rem;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 500px;
    transform: translateY(-20px);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding-bottom: 0.5rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    color: var(--grey);
    width: auto;
    
    &:hover { color: var(--black); }
}
""")

# Dropdowns SCSS
with open("src/scss/components/_dropdowns.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: var(--white);
    min-width: 150px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-radius: 0.4rem;
    padding: 0.5rem 0;
    margin-top: 0.5rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.2s ease;
    z-index: 100;

    &.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
}

.dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    color: var(--black);
    text-decoration: none;
    
    &:hover {
        background-color: rgba(0,0,0,0.05);
    }
}
""")

# Alerts SCSS
with open("src/scss/components/_alerts.scss", "w", encoding="utf-8") as f:
    f.write("""@use '../variables' as *;

.alert {
    padding: 1rem 1.5rem;
    border-radius: 0.4rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &.alert-blue { background-color: rgba(50, 150, 225, 0.2); color: var(--blue); border: 1px solid var(--blue); }
    &.alert-green { background-color: rgba(50, 175, 75, 0.2); color: var(--green); border: 1px solid var(--green); }
    &.alert-red { background-color: rgba(200, 75, 75, 0.2); color: var(--red); border: 1px solid var(--red); }
    &.alert-yellow { background-color: rgba(255, 225, 50, 0.2); color: #856404; border: 1px solid var(--yellow); }
}

.alert-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.5;
    width: auto;
    
    &:hover { opacity: 1; }
}
""")

print("JS and CSS components created.")
