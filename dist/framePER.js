/**
 * Frame PER - JavaScript Core
 * Modern UI Interactivity, HTTP Requests, Notifications, and Loaders
 */

(function (window, document) {
    'use strict';

    const FramePER = {
        
        // --- Theme Module ---
        Theme: {
            init: function() {
                const savedTheme = localStorage.getItem('frameper_theme');
                if (savedTheme) {
                    this.set(savedTheme);
                } else {
                    // Check system preference
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        this.set('dark');
                    } else {
                        this.set('light');
                    }
                }
            },
            set: function(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('frameper_theme', theme);
                // Update switches if they exist
                document.querySelectorAll('[data-toggle="theme"]').forEach(toggle => {
                    if(toggle.type === 'checkbox') toggle.checked = (theme === 'dark');
                });
            },
            toggle: function() {
                const current = document.documentElement.getAttribute('data-theme');
                this.set(current === 'dark' ? 'light' : 'dark');
            }
        },
        
        // --- Backgrounds Module ---
        Backgrounds: {
            init: function() {
                document.querySelectorAll('.bg-interactive-wrapper').forEach(wrapper => {
                    const layer = wrapper.querySelector('.bg-interactive-layer');
                    if(layer) {
                        wrapper.addEventListener('mousemove', (e) => {
                            const x = (e.clientX / window.innerWidth - 0.5) * 40;
                            const y = (e.clientY / window.innerHeight - 0.5) * 40;
                            layer.style.transform = `translate(${x}px, ${y}px)`;
                        });
                    }
                });
            }
        },

        // --- 1. UI Components (Auto-initialized) ---
        UI: {
            init: function() {
                this.initModals();
                this.initDropdowns();
                this.initAccordions();
                this.initCarousels();
                this.initAlerts();
                this.initTabs();
                this.initOffcanvas();
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
            initTabs: function() {
                document.querySelectorAll('.tab-link').forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = tab.getAttribute('data-target');
                        const parent = tab.closest('.tabs');
                        const wrapper = parent.nextElementSibling; // assuming content is next to tabs
                        
                        // Remove active from all tabs in this group
                        parent.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        
                        // Hide all content panes
                        const allContent = document.querySelectorAll(targetId).length > 0 ? 
                            document.querySelector(targetId).parentNode.querySelectorAll('.tab-content') : [];
                        allContent.forEach(c => c.classList.remove('active'));
                        
                        // Show target
                        const targetContent = document.querySelector(targetId);
                        if(targetContent) targetContent.classList.add('active');
                    });
                });
            },
            initOffcanvas: function() {
                let backdrop = document.querySelector('.offcanvas-backdrop');
                if(!backdrop) {
                    backdrop = document.createElement('div');
                    backdrop.className = 'offcanvas-backdrop';
                    document.body.appendChild(backdrop);
                }

                const closeAll = () => {
                    document.querySelectorAll('.offcanvas.show').forEach(oc => oc.classList.remove('show'));
                    backdrop.classList.remove('show');
                    document.body.style.overflow = "";
                };

                backdrop.addEventListener('click', closeAll);

                document.querySelectorAll("[data-toggle='offcanvas']").forEach(trigger => {
                    trigger.addEventListener("click", (e) => {
                        e.preventDefault();
                        const targetId = trigger.getAttribute("data-target");
                        const offcanvas = document.querySelector(targetId);
                        if(offcanvas) {
                            offcanvas.classList.add("show");
                            backdrop.classList.add("show");
                            document.body.style.overflow = "hidden";
                        }
                    });
                });

                document.querySelectorAll("[data-dismiss='offcanvas']").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        e.preventDefault();
                        closeAll();
                    });
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

        
        // --- 4. Security Utilities ---
        Security: {
            escapeHTML: function(str) {
                if(typeof str !== 'string') return str;
                return str.replace(/[&<>'"]/g, 
                    tag => ({
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        "'": '&#39;',
                        '"': '&quot;'
                    }[tag] || tag)
                );
            }
        },

        // --- 5. HTTP / AJAX Requests (Fetch API Wrapper) ---
        Http: {
            getCsrfToken: function() {
                const meta = document.querySelector('meta[name="csrf-token"]');
                return meta ? meta.content : '';
            },
            
            _request: async function(url, options = {}) {
                // Automatic offline detection
                if (!navigator.onLine) {
                    FramePER.Notify.error('Sem conexão', 'Você está offline. Verifique sua conexão com a internet.');
                    return { ok: false, error: 'Offline', status: 0 };
                }

                // Automatic CSRF protection for mutations
                if (options.method && options.method !== 'GET' && options.method !== 'HEAD') {
                    if (!options.headers) options.headers = {};
                    const token = this.getCsrfToken();
                    if (token && !options.headers['X-CSRF-TOKEN']) {
                        options.headers['X-CSRF-TOKEN'] = token;
                    }
                }

                try {
                    const response = await fetch(url, options);
                    
                    let data = null;
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        data = await response.json();
                    } else {
                        data = await response.text();
                    }

                    // Security: Automatic handling of common HTTP Status Errors
                    if (!response.ok) {
                        const errorMsg = (data && (data.message || data.error)) || 'Erro inesperado na requisição';
                        
                        if (response.status === 401) {
                            FramePER.Notify.error('Acesso Negado', 'Sua sessão expirou ou você precisa se autenticar.');
                        } else if (response.status === 403) {
                            FramePER.Notify.error('Proibido', 'Você não tem permissão para realizar esta ação.');
                        } else if (response.status === 404) {
                            FramePER.Notify.error('Não Encontrado', 'O recurso solicitado não existe no servidor.');
                        } else if (response.status >= 500) {
                            FramePER.Notify.error('Erro no Servidor', 'Ocorreu um erro interno. Tente novamente mais tarde.');
                        } else {
                            // General 4xx errors
                            FramePER.Notify.error('Atenção', errorMsg);
                        }
                        
                        return { ok: false, error: errorMsg, status: response.status, data };
                    }
                    
                    return { ok: true, data, status: response.status };
                } catch(error) {
                    FramePER.Notify.error('Erro de Rede', 'Não foi possível conectar ao servidor.');
                    return { ok: false, error: error.message, status: 0 };
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


    
    window.addEventListener('offline', () => {
        FramePER.Notify.error('Sem conexão', 'Você perdeu a conexão com a internet.', 0);
    });
    
    window.addEventListener('online', () => {
        FramePER.Notify.success('Conectado', 'A conexão com a internet foi restaurada!', 5000);
    });

    // Auto-init UI when DOM is ready

    document.addEventListener("DOMContentLoaded", () => {
        FramePER.Theme.init();
        FramePER.Backgrounds.init();
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
