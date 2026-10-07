/**
 * Frame PER - JavaScript Core
 * Modern UI Interactivity, HTTP Requests, Notifications, and Loaders
 */

(function (window, document) {
    'use strict';

    const FramePER = {
        // --- 1. UI Components (Auto-initialized) ---
        UI: {
            init: function() {
                this.initModals();
                this.initDropdowns();
                this.initAccordions();
                this.initCarousels();
                this.initAlerts();
            },
            initModals: function() {
                document.querySelectorAll("[data-toggle='modal']").forEach(trigger => {
                    trigger.addEventListener("click", (e) => {
                        e.preventDefault();
                        const targetId = trigger.getAttribute("data-target");
                        const modal = document.querySelector(targetId);
                        if(modal) {
                            modal.classList.add("show");
                            document.body.style.overflow = "hidden";
                        }
                    });
                });
                document.querySelectorAll("[data-dismiss='modal']").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        e.preventDefault();
                        const modal = btn.closest(".modal");
                        if(modal) {
                            modal.classList.remove("show");
                            document.body.style.overflow = "";
                        }
                    });
                });
                document.querySelectorAll(".modal").forEach(modal => {
                    modal.addEventListener("click", (e) => {
                        if(e.target === modal) {
                            modal.classList.remove("show");
                            document.body.style.overflow = "";
                        }
                    });
                });
            },
            initDropdowns: function() {
                document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
                    toggle.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const parent = toggle.closest(".dropdown");
                        if(parent) {
                            const menu = parent.querySelector(".dropdown-menu");
                            if(menu) menu.classList.toggle("show");
                        }
                    });
                });
                document.addEventListener("click", () => {
                    document.querySelectorAll(".dropdown-menu.show").forEach(menu => menu.classList.remove("show"));
                });
            },
            initAccordions: function() {
                document.querySelectorAll('.accordion-header').forEach(header => {
                    header.addEventListener('click', () => {
                        header.classList.toggle('active');
                        const body = header.nextElementSibling;
                        if(body) body.classList.toggle('active');
                    });
                });
            },
            initCarousels: function() {
                document.querySelectorAll('.carousel').forEach(carousel => {
                    const inner = carousel.querySelector('.carousel-inner');
                    const items = carousel.querySelectorAll('.carousel-item');
                    const nextBtn = carousel.querySelector('.carousel-control.next');
                    const prevBtn = carousel.querySelector('.carousel-control.prev');
                    const indicators = carousel.querySelectorAll('.carousel-indicators .indicator');
                    let currentIndex = 0;
                    
                    const update = () => {
                        if(inner) inner.style.transform = `translateX(-${currentIndex * 100}%)`;
                        indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
                    };
                    
                    if(nextBtn) nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % items.length; update(); });
                    if(prevBtn) prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + items.length) % items.length; update(); });
                    indicators.forEach((ind, i) => ind.addEventListener('click', () => { currentIndex = i; update(); }));
                });
            },
            initAlerts: function() {
                document.querySelectorAll("[data-dismiss='alert']").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        e.preventDefault();
                        const alert = btn.closest(".alert");
                        if(alert) {
                            alert.classList.add("fade-out");
                            setTimeout(() => alert.remove(), 300);
                        }
                    });
                });
            }
        },

        // --- 2. Dynamic Notifications (Toasts) ---
        Notify: {
            container: null,
            _getContainer: function() {
                if(!this.container) {
                    this.container = document.querySelector('.toast-container');
                    if(!this.container) {
                        this.container = document.createElement('div');
                        this.container.className = 'toast-container';
                        document.body.appendChild(this.container);
                    }
                }
                return this.container;
            },
            show: function(title, message, type = 'info', duration = 3000) {
                const container = this._getContainer();
                const toast = document.createElement('div');
                toast.className = `toast toast-${type}`; // Can use types like info, success, error
                
                let iconStr = '<i class="icon icon-info"></i>';
                if(type === 'success') iconStr = '<i class="icon icon-check"></i>';
                if(type === 'error') iconStr = '<i class="icon icon-close"></i>';

                toast.innerHTML = `
                    <div class="toast-header">
                        <span>${iconStr} ${title}</span>
                        <button class="toast-close"><i class="icon icon-close"></i></button>
                    </div>
                    <div class="toast-body">${message}</div>
                `;
                container.appendChild(toast);
                
                // Animate in
                requestAnimationFrame(() => toast.classList.add('show'));
                
                // Close event
                toast.querySelector('.toast-close').addEventListener('click', () => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                });
                
                // Auto dismiss
                if(duration > 0) {
                    setTimeout(() => {
                        toast.classList.remove('show');
                        setTimeout(() => toast.remove(), 300);
                    }, duration);
                }
            },
            success: function(title, msg, time) { this.show(title, msg, 'success', time); },
            error: function(title, msg, time) { this.show(title, msg, 'error', time); },
            info: function(title, msg, time) { this.show(title, msg, 'info', time); }
        },

        // --- 3. Page & Element Loaders ---
        Loader: {
            pageOverlay: null,
            showPageLoad: function() {
                if(!this.pageOverlay) {
                    this.pageOverlay = document.createElement('div');
                    this.pageOverlay.className = 'page-loader-overlay';
                    this.pageOverlay.innerHTML = '<div class="spinner spinner-xl text-blue"></div>';
                    document.body.appendChild(this.pageOverlay);
                }
                this.pageOverlay.classList.add('show');
            },
            hidePageLoad: function() {
                if(this.pageOverlay) {
                    this.pageOverlay.classList.remove('show');
                    setTimeout(() => {
                        if(this.pageOverlay) this.pageOverlay.remove();
                        this.pageOverlay = null;
                    }, 300);
                }
            },
            // Add a spinner inside a button
            buttonLoading: function(btnElement, isLoading = true) {
                if(isLoading) {
                    btnElement.setAttribute('disabled', 'true');
                    btnElement.dataset.originalText = btnElement.innerHTML;
                    btnElement.innerHTML = '<span class="spinner spinner-sm"></span> Carregando...';
                } else {
                    btnElement.removeAttribute('disabled');
                    btnElement.innerHTML = btnElement.dataset.originalText || '';
                }
            }
        },

        // --- 4. HTTP / AJAX Requests (Fetch API Wrapper) ---
        Http: {
            _request: async function(url, options = {}) {
                try {
                    const response = await fetch(url, options);
                    const data = await response.json();
                    if(!response.ok) throw new Error(data.message || 'Erro na requisição');
                    return { ok: true, data, status: response.status };
                } catch(error) {
                    FramePER.Notify.error('Erro de Rede', error.message);
                    return { ok: false, error: error.message };
                }
            },
            get: function(url, headers = {}) {
                return this._request(url, { method: 'GET', headers: { 'Content-Type': 'application/json', ...headers } });
            },
            post: function(url, body, headers = {}) {
                return this._request(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...headers } });
            },
            put: function(url, body, headers = {}) {
                return this._request(url, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...headers } });
            },
            delete: function(url, headers = {}) {
                return this._request(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...headers } });
            }
        }
    };

    // Auto-init UI when DOM is ready
    document.addEventListener("DOMContentLoaded", () => {
        FramePER.UI.init();
        
        // Hide global page loader if exists
        const staticLoader = document.querySelector('.page-loader-overlay');
        if(staticLoader) {
            staticLoader.classList.remove('show');
            setTimeout(() => staticLoader.remove(), 300);
        }
    });

    // Expose globally
    window.FramePER = FramePER;

})(window, document);
