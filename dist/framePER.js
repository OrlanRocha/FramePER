/**
 * Frame PER - JavaScript Core
 * Modern UI Interactivity, HTTP Requests, Notifications, and Loaders
 */

(function (window, document) {
    'use strict';

    const FramePER = {
        
        // --- Theme Module ---
        // Follows the OS preference until the user makes an explicit choice
        // (toggle / set), which is then remembered in localStorage.
        Theme: {
            _storageKey: 'frameper_theme',
            _stored: function() {
                try { return localStorage.getItem(this._storageKey); } catch (e) { return null; }
            },
            _systemTheme: function() {
                return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
            },
            init: function() {
                this._apply(this._stored() || this._systemTheme());

                // Keep following the OS while the user has not chosen
                if (window.matchMedia) {
                    const mq = window.matchMedia('(prefers-color-scheme: dark)');
                    const onChange = () => { if (!this._stored()) this._apply(this._systemTheme()); };
                    if (mq.addEventListener) mq.addEventListener('change', onChange);
                    else if (mq.addListener) mq.addListener(onChange);
                }
            },
            _apply: function(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                // Keep any [data-toggle="theme"] switches in sync
                document.querySelectorAll('[data-toggle="theme"]').forEach(toggle => {
                    if (toggle.type === 'checkbox') toggle.checked = (theme === 'dark');
                });
            },
            get: function() {
                return document.documentElement.getAttribute('data-theme') || this._systemTheme();
            },
            // Explicit choice: persisted
            set: function(theme) {
                try { localStorage.setItem(this._storageKey, theme); } catch (e) { /* storage unavailable */ }
                this._apply(theme);
            },
            toggle: function() {
                this.set(this.get() === 'dark' ? 'light' : 'dark');
            },
            // Forget the choice and go back to following the OS
            reset: function() {
                try { localStorage.removeItem(this._storageKey); } catch (e) { /* storage unavailable */ }
                this._apply(this._systemTheme());
            }
        },

        // --- Backgrounds Module ---
        // .bg-interactive-wrapper > .bg-interactive-layer: a spotlight that follows the cursor
        Backgrounds: {
            init: function() {
                document.querySelectorAll('.bg-interactive-wrapper').forEach(wrapper => {
                    const layer = wrapper.querySelector('.bg-interactive-layer');
                    if (!layer) return;

                    wrapper.addEventListener('mousemove', (e) => {
                        const rect = wrapper.getBoundingClientRect();
                        layer.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                        layer.style.setProperty('--my', (e.clientY - rect.top) + 'px');
                    });
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
                this.initCollapse();
                this.initSidebar();
                this.initThemeToggle();
                this.initKeyboard();
                this.initTables();
            },
            initTables: function() {
                document.addEventListener('click', (e) => {
                    const th = e.target.closest('th.sortable');
                    if (!th) return;

                    const table = th.closest('table');
                    if (!table) return;
                    const tbody = table.querySelector('tbody');
                    if (!tbody) return;

                    const colIndex = Array.prototype.indexOf.call(th.parentNode.children, th);
                    const isAsc = !th.classList.contains('sorted-asc');

                    th.parentNode.querySelectorAll('th.sortable').forEach(sibling => {
                        sibling.classList.remove('sorted-asc', 'sorted-desc');
                    });

                    th.classList.add(isAsc ? 'sorted-asc' : 'sorted-desc');

                    const rows = Array.from(tbody.querySelectorAll('tr'));
                    rows.sort((rowA, rowB) => {
                        const cellA = rowA.children[colIndex] ? rowA.children[colIndex].textContent.trim() : '';
                        const cellB = rowB.children[colIndex] ? rowB.children[colIndex].textContent.trim() : '';

                        const numA = parseFloat(cellA.replace(/[^\d.-]/g, ''));
                        const numB = parseFloat(cellB.replace(/[^\d.-]/g, ''));

                        if (!isNaN(numA) && !isNaN(numB) && cellA.match(/[\d]/) && cellB.match(/[\d]/) && !cellA.match(/[a-zA-Z]{3,}/)) {
                            return isAsc ? numA - numB : numB - numA;
                        }

                        return isAsc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                    });

                    rows.forEach(row => tbody.appendChild(row));
                });

                document.addEventListener('input', (e) => {
                    const input = e.target.closest('[data-table-filter]');
                    if (!input) return;

                    const targetSelector = input.getAttribute('data-table-filter');
                    const table = document.querySelector(targetSelector);
                    if (!table) return;

                    const query = input.value.toLowerCase().trim();
                    const rows = table.querySelectorAll('tbody tr');

                    rows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.indexOf(query) !== -1 ? '' : 'none';
                    });
                });
            },


            // [data-toggle="collapse"][data-target="#menu"] → toggles .active on the target
            // (used by .navbar-toggler to open the mobile menu)
            initCollapse: function() {
                document.querySelectorAll("[data-toggle='collapse']").forEach(trigger => {
                    trigger.addEventListener("click", (e) => {
                        e.preventDefault();
                        const target = document.querySelector(trigger.getAttribute("data-target"));
                        if (!target) return;
                        const open = target.classList.toggle("active");
                        trigger.setAttribute("aria-expanded", open ? "true" : "false");
                    });
                });
            },
            // [data-toggle="sidebar"] → opens the .sidebar drawer (below the lg breakpoint)
            initSidebar: function() {
                const sidebar = document.querySelector(".sidebar");
                if (!sidebar) return;

                let backdrop = document.querySelector(".sidebar-backdrop");
                if (!backdrop) {
                    backdrop = document.createElement("div");
                    backdrop.className = "sidebar-backdrop";
                    document.body.appendChild(backdrop);
                }

                const close = () => { sidebar.classList.remove("show"); backdrop.classList.remove("show"); };
                const open = () => { sidebar.classList.add("show"); backdrop.classList.add("show"); };

                document.querySelectorAll("[data-toggle='sidebar']").forEach(trigger => {
                    trigger.addEventListener("click", (e) => {
                        e.preventDefault();
                        sidebar.classList.contains("show") ? close() : open();
                    });
                });
                backdrop.addEventListener("click", close);
                sidebar.querySelectorAll(".sidebar-link").forEach(link => link.addEventListener("click", close));
            },
            // [data-theme-toggle] → switches between light and dark
            initThemeToggle: function() {
                document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        e.preventDefault();
                        FramePER.Theme.toggle();
                    });
                });
            },
            // Escape closes the top-most overlay
            initKeyboard: function() {
                document.addEventListener("keydown", (e) => {
                    if (e.key !== "Escape") return;
                    document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show"));
                    document.querySelectorAll(".offcanvas.show").forEach(o => o.classList.remove("show"));
                    document.querySelectorAll(".offcanvas-backdrop.show, .sidebar.show, .sidebar-backdrop.show").forEach(el => el.classList.remove("show"));
                    document.querySelectorAll(".dropdown-menu.show").forEach(m => m.classList.remove("show"));
                    document.body.style.overflow = "";
                });
            },
            initModals: function() {
                document.addEventListener("click", (e) => {
                    const toggleBtn = e.target.closest("[data-toggle='modal']");
                    const dismissBtn = e.target.closest("[data-dismiss='modal']");

                    if (toggleBtn) {
                        e.preventDefault();
                        const targetSelector = toggleBtn.getAttribute("data-target") || toggleBtn.getAttribute("href");
                        if (targetSelector && targetSelector.startsWith("#")) {
                            const targetModal = document.querySelector(targetSelector);
                            if (targetModal) {
                                document.querySelectorAll(".modal.show").forEach(m => {
                                    if (m !== targetModal) m.classList.remove("show");
                                });
                                targetModal.classList.add("show");
                                document.body.style.overflow = "hidden";
                                return;
                            }
                        }
                    }

                    if (dismissBtn) {
                        e.preventDefault();
                        const currentModal = dismissBtn.closest(".modal");
                        if (currentModal) {
                            currentModal.classList.remove("show");
                            if (!document.querySelector(".modal.show")) {
                                document.body.style.overflow = "";
                            }
                        }
                        return;
                    }

                    if (e.target.classList && e.target.classList.contains("modal") && e.target.classList.contains("show")) {
                        e.target.classList.remove("show");
                        if (!document.querySelector(".modal.show")) {
                            document.body.style.overflow = "";
                        }
                    }
                });
            },
            initDropdowns: function() {
                document.addEventListener("click", (e) => {
                    const toggle = e.target.closest(".dropdown-toggle");
                    if (toggle) {
                        e.preventDefault();
                        const parent = toggle.closest(".dropdown");
                        if (parent) {
                            const menu = parent.querySelector(".dropdown-menu");
                            if (menu) {
                                const isShown = menu.classList.contains("show");
                                document.querySelectorAll(".dropdown-menu.show").forEach(m => m.classList.remove("show"));
                                if (!isShown) menu.classList.add("show");
                            }
                        }
                        return;
                    }

                    if (!e.target.closest(".dropdown-menu")) {
                        document.querySelectorAll(".dropdown-menu.show").forEach(menu => menu.classList.remove("show"));
                    }
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
                document.addEventListener("click", (e) => {
                    const tab = e.target.closest(".tab-link");
                    if (!tab) return;
                    const targetId = tab.getAttribute("data-target");

                    const parent = tab.closest(".tabs");
                    if (parent) {
                        parent.querySelectorAll(".tab-link").forEach(t => t.classList.remove("active"));
                    }
                    tab.classList.add("active");

                    if (targetId && targetId.startsWith("#")) {
                        e.preventDefault();
                        const targetContent = document.querySelector(targetId);
                        if (targetContent) {
                            const parentContainer = targetContent.parentElement;
                            if (parentContainer) {
                                parentContainer.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
                            }
                            targetContent.classList.add("active");
                        }
                    }
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
        },

        // --- 6. Clipboard Module ---
        Clipboard: {
            copy: function(text, successMsg = 'Copiado para a área de transferência!') {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        FramePER.Notify.success('Copiado', successMsg);
                    }).catch(() => {
                        this._fallbackCopy(text, successMsg);
                    });
                } else {
                    this._fallbackCopy(text, successMsg);
                }
            },
            _fallbackCopy: function(text, successMsg) {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    FramePER.Notify.success('Copiado', successMsg);
                } catch(e) {
                    FramePER.Notify.error('Falha', 'Não foi possível copiar.');
                }
                ta.remove();
            },
            init: function() {
                document.addEventListener('click', (e) => {
                    const btn = e.target.closest('[data-copy]');
                    if (!btn) return;
                    e.preventDefault();
                    let text = btn.getAttribute('data-copy');
                    const targetSel = btn.getAttribute('data-copy-target');
                    if (targetSel) {
                        const targetEl = document.querySelector(targetSel);
                        if (targetEl) text = targetEl.value !== undefined ? targetEl.value : targetEl.textContent.trim();
                    }
                    if (text) FramePER.Clipboard.copy(text);
                });
            }
        },

        // --- 7. Form Masks & Input Helpers ---
        Form: {
            masks: {
                cpf: function(v) {
                    return v.replace(/\D/g, '')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                            .substring(0, 14);
                },
                cnpj: function(v) {
                    return v.replace(/\D/g, '')
                            .replace(/^(\d{2})(\d)/, '$1.$2')
                            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                            .replace(/\.(\d{3})(\d)/, '.$1/$2')
                            .replace(/(\d{4})(\d)/, '$1-$2')
                            .substring(0, 18);
                },
                phone: function(v) {
                    v = v.replace(/\D/g, '');
                    if (v.length > 10) {
                        return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                    } else if (v.length > 5) {
                        return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                    } else if (v.length > 2) {
                        return v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                    }
                    return v;
                },
                cep: function(v) {
                    return v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
                },
                date: function(v) {
                    return v.replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '$1/$2')
                            .replace(/(\d{2})(\d)/, '$1/$2')
                            .substring(0, 10);
                },
                money: function(v) {
                    v = v.replace(/\D/g, '');
                    if (!v) return '';
                    const n = (parseFloat(v) / 100).toFixed(2);
                    if (isNaN(n)) return '';
                    return 'R$ ' + n.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
            },
            init: function() {
                document.addEventListener('input', (e) => {
                    const input = e.target.closest('[data-mask]');
                    if (!input) return;
                    const maskType = input.getAttribute('data-mask');
                    const fn = this.masks[maskType];
                    if (fn) {
                        input.value = fn(input.value);
                    }
                });

                document.addEventListener('click', (e) => {
                    const btn = e.target.closest('[data-toggle="password"]');
                    if (!btn) return;
                    e.preventDefault();
                    const targetSel = btn.getAttribute('data-target');
                    const input = targetSel ? document.querySelector(targetSel) : btn.previousElementSibling;
                    if (input && input.type) {
                        const isPass = input.type === 'password';
                        input.type = isPass ? 'text' : 'password';
                        const icon = btn.querySelector('.icon');
                        if (icon) {
                            icon.classList.toggle('icon-eye', !isPass);
                            icon.classList.toggle('icon-eye-off', isPass);
                        }
                    }
                });
            }
        },

        // --- 8. Animated Counters ---
        Counter: {
            animate: function(el, target, duration = 1200) {
                const start = 0;
                const startTime = performance.now();
                const isFloat = target.toString().includes('.');
                const prefix = el.getAttribute('data-counter-prefix') || '';
                const suffix = el.getAttribute('data-counter-suffix') || '';

                const step = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const current = start + (target - start) * ease;

                    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current).toLocaleString('pt-BR')) + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                };
                requestAnimationFrame(step);
            },
            init: function() {
                const elements = document.querySelectorAll('[data-counter]');
                if (!elements.length) return;

                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                                entry.target.classList.add('counted');
                                const targetVal = parseFloat(entry.target.getAttribute('data-counter'));
                                if (!isNaN(targetVal)) {
                                    FramePER.Counter.animate(entry.target, targetVal);
                                }
                            }
                        });
                    }, { threshold: 0.2 });

                    elements.forEach(el => observer.observe(el));
                } else {
                    elements.forEach(el => {
                        const val = parseFloat(el.getAttribute('data-counter'));
                        if (!isNaN(val)) el.textContent = val.toLocaleString('pt-BR');
                    });
                }
            }
        },

        // --- 9. Scroll Helpers ---
        Scroll: {
            toTop: function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            init: function() {
                const backToTopBtns = document.querySelectorAll('[data-scroll-top]');
                if (backToTopBtns.length) {
                    const checkScroll = () => {
                        const show = window.scrollY > 300;
                        backToTopBtns.forEach(btn => {
                            btn.style.opacity = show ? '1' : '0';
                            btn.style.pointerEvents = show ? 'auto' : 'none';
                            btn.style.transition = 'opacity 0.2s var(--ease)';
                        });
                    };
                    window.addEventListener('scroll', checkScroll);
                    checkScroll();

                    document.addEventListener('click', (e) => {
                        if (e.target.closest('[data-scroll-top]')) {
                            e.preventDefault();
                            FramePER.Scroll.toTop();
                        }
                    });
                }

                document.addEventListener('click', (e) => {
                    const anchor = e.target.closest('[data-scroll-to]');
                    if (!anchor) return;
                    const targetSel = anchor.getAttribute('data-scroll-to');
                    const targetEl = document.querySelector(targetSel);
                    if (targetEl) {
                        e.preventDefault();
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        },

        // --- 10. Interactive SVG Charts Framework ---
        Chart: (function() {
            const SVG_NS = 'http://www.w3.org/2000/svg';
            const DEFAULT_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

            function createSVG(tag, attrs = {}) {
                const el = document.createElementNS(SVG_NS, tag);
                for (const [k, v] of Object.entries(attrs)) {
                    if (v !== undefined && v !== null) el.setAttribute(k, v);
                }
                return el;
            }

            function calculateNiceTicks(min, max, maxTicks = 5) {
                if (min === max) {
                    if (min === 0) { max = 10; }
                    else { min = min > 0 ? 0 : min * 2; max = max > 0 ? max * 1.5 : 0; }
                }
                if (min > 0 && min < max * 0.25) min = 0;
                const range = max - min;
                const roughStep = range / (maxTicks - 1);
                const exponent = Math.floor(Math.log10(Math.max(roughStep, 0.0001)));
                const fraction = roughStep / Math.pow(10, exponent);
                let niceFraction = 10;
                if (fraction <= 1.5) niceFraction = 1;
                else if (fraction <= 3) niceFraction = 2;
                else if (fraction <= 7) niceFraction = 5;
                const niceStep = niceFraction * Math.pow(10, exponent);
                const niceMin = Math.floor(min / niceStep) * niceStep;
                const niceMax = Math.ceil(max / niceStep) * niceStep;
                const ticks = [];
                for (let v = niceMin; v <= niceMax + niceStep * 0.01; v += niceStep) {
                    ticks.push(Number(v.toFixed(6)));
                }
                return { min: niceMin, max: niceMax, ticks };
            }

            function getSplinePath(points) {
                if (!points || !points.length) return '';
                if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
                if (points.length === 2) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`;
                let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
                for (let i = 0; i < points.length - 1; i++) {
                    const p0 = i > 0 ? points[i - 1] : points[i];
                    const p1 = points[i];
                    const p2 = points[i + 1];
                    const p3 = i < points.length - 2 ? points[i + 2] : p2;
                    const cp1x = p1.x + (p2.x - p0.x) / 6;
                    const cp1y = p1.y + (p2.y - p0.y) / 6;
                    const cp2x = p2.x - (p3.x - p1.x) / 6;
                    const cp2y = p2.y - (p3.y - p1.y) / 6;
                    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
                }
                return d;
            }

            function getLinearPath(points) {
                if (!points || !points.length) return '';
                return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
            }

            function describeDonutSlice(cx, cy, innerR, outerR, startAngle, endAngle) {
                const angleDiff = endAngle - startAngle;
                if (angleDiff >= 360) endAngle = startAngle + 359.999;
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                const x1 = cx + outerR * Math.cos(startRad);
                const y1 = cy + outerR * Math.sin(startRad);
                const x2 = cx + outerR * Math.cos(endRad);
                const y2 = cy + outerR * Math.sin(endRad);
                const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

                if (innerR <= 0) {
                    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
                }
                const x3 = cx + innerR * Math.cos(endRad);
                const y3 = cy + innerR * Math.sin(endRad);
                const x4 = cx + innerR * Math.cos(startRad);
                const y4 = cy + innerR * Math.sin(startRad);
                return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
            }

            function describeArc(cx, cy, r, startAngle, endAngle) {
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                const x1 = cx + r * Math.cos(startRad);
                const y1 = cy + r * Math.sin(startRad);
                const x2 = cx + r * Math.cos(endRad);
                const y2 = cy + r * Math.sin(endRad);
                const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
                return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
            }

            function formatVal(val, fmt) {
                if (typeof fmt === 'function') return fmt(val);
                if (val === undefined || val === null || isNaN(val)) return '0';
                const n = Number(val);
                if (fmt === 'currency') {
                    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }
                if (fmt === 'percent') {
                    return n.toLocaleString('pt-BR') + '%';
                }
                return n.toLocaleString('pt-BR');
            }

            class FramePERChart {
                constructor(target, config = {}) {
                    this.container = typeof target === 'string' ? document.querySelector(target) : target;
                    if (!this.container) {
                        console.warn('FramePER.Chart: Elemento alvo não encontrado.', target);
                        return;
                    }
                    this.id = 'fpc-' + Math.random().toString(36).substring(2, 9);
                    this.config = Object.assign({}, config);
                    this.type = this.config.type || 'line';
                    this.data = this.config.data || { labels: [], series: [] };
                    this.options = Object.assign({
                        height: this.type === 'sparkline' ? 50 : 280,
                        curved: true,
                        fill: true,
                        showDots: true,
                        showGrid: true,
                        format: 'number',
                        tooltip: true,
                        legend: true,
                        animated: true,
                        donutCutout: 0.65,
                        strokeWidth: 2.5
                    }, this.config.options || {});

                    this._normalizeData();
                    this._setupDOM();
                    this._bindEvents();
                    this.render();

                    if ('ResizeObserver' in window) {
                        this._resizeObserver = new ResizeObserver(() => {
                            this.render();
                        });
                        this._resizeObserver.observe(this.container);
                    }
                }

                _normalizeData() {
                    if (Array.isArray(this.data.series)) {
                        this.series = this.data.series.map((s, idx) => {
                            const color = s.color || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
                            if (typeof s === 'number') {
                                return { name: this.data.labels ? this.data.labels[idx] || `Item ${idx + 1}` : `Item ${idx + 1}`, value: s, color, hidden: false };
                            }
                            if (s.value !== undefined && s.data === undefined) {
                                return { name: s.name || `Série ${idx + 1}`, value: s.value, color, hidden: !!s.hidden };
                            }
                            const rawData = Array.isArray(s.data) ? s.data : [];
                            return {
                                name: s.name || `Série ${idx + 1}`,
                                type: s.type || (this.type === 'mixed' ? (idx === 0 ? 'bar' : 'line') : this.type),
                                fill: !!s.fill,
                                data: rawData,
                                color,
                                hidden: !!s.hidden
                            };
                        });
                    } else {
                        this.series = [];
                    }
                    this.labels = Array.isArray(this.data.labels) ? this.data.labels : [];
                }

                _setupDOM() {
                    this.container.innerHTML = '';
                    this.container.classList.add('frame-chart-container');
                    if (this.type === 'sparkline') {
                        this.container.classList.add('frame-chart-sparkline');
                    }

                    if (this.config.title || this.config.subtitle) {
                        const header = document.createElement('div');
                        header.className = 'frame-chart-header';
                        if (this.config.title) {
                            const title = document.createElement('h4');
                            title.className = 'frame-chart-title';
                            title.textContent = this.config.title;
                            header.appendChild(title);
                        }
                        if (this.config.subtitle) {
                            const sub = document.createElement('span');
                            sub.className = 'frame-chart-subtitle';
                            sub.textContent = this.config.subtitle;
                            header.appendChild(sub);
                        }
                        this.container.appendChild(header);
                    }

                    this.svgWrap = document.createElement('div');
                    this.svgWrap.className = 'frame-chart-svg-wrap';
                    this.svgWrap.style.height = (this.options.height || 280) + 'px';
                    this.container.appendChild(this.svgWrap);

                    this.tooltip = document.createElement('div');
                    this.tooltip.className = 'frame-chart-tooltip';
                    this.container.appendChild(this.tooltip);

                    if (this.options.legend && this.type !== 'sparkline') {
                        this.legendWrap = document.createElement('div');
                        this.legendWrap.className = 'frame-chart-legend';
                        this.container.appendChild(this.legendWrap);
                    }
                }

                _bindEvents() {
                    this._onMouseMove = (e) => this._handleMouseMove(e);
                    this._onMouseLeave = () => this._handleMouseLeave();
                    this.svgWrap.addEventListener('mousemove', this._onMouseMove);
                    this.svgWrap.addEventListener('mouseleave', this._onMouseLeave);
                }

                render() {
                    if (!this.svgWrap) return;
                    this.svgWrap.innerHTML = '';
                    const width = Math.max(this.svgWrap.clientWidth || this.container.clientWidth || 320, 100);
                    const height = this.options.height || (this.type === 'sparkline' ? 50 : 280);

                    this.svg = createSVG('svg', {
                        class: 'frame-chart-svg',
                        viewBox: `0 0 ${width} ${height}`,
                        width: '100%',
                        height: '100%'
                    });
                    this.svgWrap.appendChild(this.svg);

                    this.defs = createSVG('defs');
                    this.svg.appendChild(this.defs);

                    if (this.type === 'line' || this.type === 'area') {
                        this._renderLineArea(width, height);
                    } else if (this.type === 'bar') {
                        this._renderBar(width, height);
                    } else if (this.type === 'mixed') {
                        this._renderMixed(width, height);
                    } else if (this.type === 'horizontal-bar') {
                        this._renderHorizontalBar(width, height);
                    } else if (this.type === 'donut' || this.type === 'pie') {
                        this._renderDonutPie(width, height);
                    } else if (this.type === 'gauge') {
                        this._renderGauge(width, height);
                    } else if (this.type === 'radar') {
                        this._renderRadar(width, height);
                    } else if (this.type === 'sparkline') {
                        this._renderSparkline(width, height);
                    }

                    this._renderLegend();
                }

                _renderLineArea(width, height) {
                    const visibleSeries = this.series.filter(s => !s.hidden && s.data && s.data.length);
                    let allVals = [];
                    visibleSeries.forEach(s => allVals.push(...s.data));
                    if (!allVals.length) allVals = [0, 10];

                    const { min, max, ticks } = calculateNiceTicks(Math.min(...allVals), Math.max(...allVals));
                    const valRange = max - min || 1;

                    // Dynamic left padding based on longest formatted tick string
                    const sampleTicks = ticks.map(t => formatVal(t, this.options.format));
                    const maxTickLen = Math.max(...sampleTicks.map(s => (s || '').length), 1);
                    const dynamicLeft = Math.min(Math.max(Math.ceil(maxTickLen * 7.5) + 18, 50), 96);
                    const padding = { top: 34, right: 24, bottom: 35, left: dynamicLeft };
                    const plotW = width - padding.left - padding.right;
                    const plotH = height - padding.top - padding.bottom;
                    if (plotW <= 0 || plotH <= 0) return;

                    // Grid & Y labels
                    if (this.options.showGrid) {
                        const gridG = createSVG('g', { class: 'frame-chart-grid' });
                        const labelsG = createSVG('g', { class: 'frame-chart-labels' });
                        ticks.forEach(t => {
                            const y = padding.top + plotH - ((t - min) / valRange) * plotH;
                            gridG.appendChild(createSVG('line', { x1: padding.left, y1: y, x2: width - padding.right, y2: y }));
                            const text = createSVG('text', {
                                x: padding.left - 8,
                                y: y + 4,
                                'text-anchor': 'end'
                            });
                            text.textContent = formatVal(t, this.options.format);
                            labelsG.appendChild(text);
                        });
                        this.svg.appendChild(gridG);
                        this.svg.appendChild(labelsG);
                    }

                    // X labels
                    const numPoints = Math.max(this.labels.length, ...visibleSeries.map(s => s.data.length), 1);
                    const stepX = numPoints > 1 ? plotW / (numPoints - 1) : plotW / 2;
                    const xLabelsG = createSVG('g', { class: 'frame-chart-labels' });
                    const isCompact = width < 460 && this.labels.length > 5;
                    this.labels.forEach((lbl, i) => {
                        if (isCompact && i % 2 !== 0 && i !== this.labels.length - 1) {
                            return;
                        }
                        const x = padding.left + (numPoints > 1 ? i * stepX : plotW / 2);
                        const text = createSVG('text', {
                            x,
                            y: height - 10,
                            'text-anchor': 'middle'
                        });
                        text.textContent = lbl;
                        xLabelsG.appendChild(text);
                    });
                    this.svg.appendChild(xLabelsG);

                    // Crosshair guideline
                    this.crosshair = createSVG('line', {
                        class: 'frame-chart-crosshair',
                        y1: padding.top,
                        y2: padding.top + plotH,
                        style: 'opacity: 0'
                    });
                    this.svg.appendChild(this.crosshair);

                    // Plot points and paths
                    this.computedPoints = [];
                    visibleSeries.forEach((s, sIdx) => {
                        const pts = s.data.map((val, i) => {
                            const x = padding.left + (numPoints > 1 ? i * stepX : plotW / 2);
                            const y = padding.top + plotH - ((val - min) / valRange) * plotH;
                            return { x, y, val, label: this.labels[i] || '', seriesName: s.name, color: s.color };
                        });
                        this.computedPoints.push({ series: s, points: pts });

                        // Gradient for Area
                        const isArea = this.type === 'area' || this.options.fill;
                        if (isArea) {
                            const gradId = `${this.id}-grad-${sIdx}`;
                            const grad = createSVG('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
                            grad.appendChild(createSVG('stop', { offset: '0%', 'stop-color': s.color, 'stop-opacity': '0.35' }));
                            grad.appendChild(createSVG('stop', { offset: '100%', 'stop-color': s.color, 'stop-opacity': '0.02' }));
                            this.defs.appendChild(grad);

                            const linePath = this.options.curved ? getSplinePath(pts) : getLinearPath(pts);
                            const baselineY = padding.top + plotH;
                            const areaD = `${linePath} L ${pts[pts.length - 1].x.toFixed(2)} ${baselineY} L ${pts[0].x.toFixed(2)} ${baselineY} Z`;
                            this.svg.appendChild(createSVG('path', {
                                class: 'frame-chart-area' + (this.options.animated !== false ? ' frame-chart-animated' : ''),
                                d: areaD,
                                fill: `url(#${gradId})`
                            }));
                        }

                        // Line stroke
                        const lineD = this.options.curved ? getSplinePath(pts) : getLinearPath(pts);
                        const line = createSVG('path', {
                            class: 'frame-chart-line' + (this.options.animated !== false ? ' frame-chart-animated' : ''),
                            d: lineD,
                            stroke: s.color,
                            'stroke-width': this.options.strokeWidth || 2.5
                        });
                        if (this.options.animated !== false) {
                            try {
                                const len = line.getTotalLength ? line.getTotalLength() : 1200;
                                line.style.strokeDasharray = len;
                                line.style.strokeDashoffset = len;
                            } catch (_) {
                                line.style.strokeDasharray = 1200;
                                line.style.strokeDashoffset = 1200;
                            }
                        }
                        this.svg.appendChild(line);

                        // Dots
                        if (this.options.showDots) {
                            const dotsG = createSVG('g', { class: 'frame-chart-dots' });
                            pts.forEach(p => {
                                const dot = createSVG('circle', {
                                    class: 'frame-chart-dot',
                                    cx: p.x.toFixed(2),
                                    cy: p.y.toFixed(2),
                                    r: 4,
                                    fill: s.color
                                });
                                dotsG.appendChild(dot);
                            });
                            this.svg.appendChild(dotsG);
                        }
                    });

                    this.plotArea = { padding, plotW, plotH, stepX, numPoints, min, max };
                }

                _renderBar(width, height) {
                    const visibleSeries = this.series.filter(s => !s.hidden && s.data && s.data.length);
                    let allVals = [];
                    visibleSeries.forEach(s => allVals.push(...s.data));
                    if (!allVals.length) allVals = [0, 10];

                    const { min, max, ticks } = calculateNiceTicks(Math.min(0, Math.min(...allVals)), Math.max(...allVals));
                    const valRange = max - min || 1;

                    // Dynamic left padding based on longest formatted tick string
                    const sampleTicks = ticks.map(t => formatVal(t, this.options.format));
                    const maxTickLen = Math.max(...sampleTicks.map(s => (s || '').length), 1);
                    const dynamicLeft = Math.min(Math.max(Math.ceil(maxTickLen * 7.5) + 18, 50), 96);
                    const padding = { top: 30, right: 24, bottom: 35, left: dynamicLeft };
                    const plotW = width - padding.left - padding.right;
                    const plotH = height - padding.top - padding.bottom;
                    if (plotW <= 0 || plotH <= 0) return;

                    // Grid & Y labels
                    if (this.options.showGrid) {
                        const gridG = createSVG('g', { class: 'frame-chart-grid' });
                        const labelsG = createSVG('g', { class: 'frame-chart-labels' });
                        ticks.forEach(t => {
                            const y = padding.top + plotH - ((t - min) / valRange) * plotH;
                            gridG.appendChild(createSVG('line', { x1: padding.left, y1: y, x2: width - padding.right, y2: y }));
                            const text = createSVG('text', {
                                x: padding.left - 8,
                                y: y + 4,
                                'text-anchor': 'end'
                            });
                            text.textContent = formatVal(t, this.options.format);
                            labelsG.appendChild(text);
                        });
                        this.svg.appendChild(gridG);
                        this.svg.appendChild(labelsG);
                    }

                    const numCategories = Math.max(this.labels.length, ...visibleSeries.map(s => s.data.length), 1);
                    const catWidth = plotW / numCategories;
                    const numSeries = Math.max(visibleSeries.length, 1);
                    const barGroupWidth = catWidth * 0.72;
                    const singleBarWidth = Math.max(barGroupWidth / numSeries - 3, 4);

                    const xLabelsG = createSVG('g', { class: 'frame-chart-labels' });
                    const isCompact = width < 460 && this.labels.length > 5;
                    this.labels.forEach((lbl, i) => {
                        if (isCompact && i % 2 !== 0 && i !== this.labels.length - 1) {
                            return;
                        }
                        const x = padding.left + i * catWidth + catWidth / 2;
                        const text = createSVG('text', { x, y: height - 10, 'text-anchor': 'middle' });
                        text.textContent = lbl;
                        xLabelsG.appendChild(text);
                    });
                    this.svg.appendChild(xLabelsG);

                    const barsG = createSVG('g', { class: 'frame-chart-bars' });
                    visibleSeries.forEach((s, sIdx) => {
                        s.data.forEach((val, cIdx) => {
                            const catStartX = padding.left + cIdx * catWidth + (catWidth - barGroupWidth) / 2;
                            const barX = catStartX + sIdx * (singleBarWidth + 3);
                            const barH = Math.max(((val - min) / valRange) * plotH, 2);
                            const barY = padding.top + plotH - barH;

                            const rect = createSVG('rect', {
                                class: 'frame-chart-bar' + (this.options.animated !== false ? ' frame-chart-animated' : ''),
                                x: barX.toFixed(2),
                                y: barY.toFixed(2),
                                width: singleBarWidth.toFixed(2),
                                height: barH.toFixed(2),
                                fill: s.color,
                                'data-series': s.name,
                                'data-val': val,
                                'data-label': this.labels[cIdx] || '',
                                'data-color': s.color
                            });
                            rect.addEventListener('mouseenter', (e) => this._showElementTooltip(e, rect, this.labels[cIdx] || '', s.name, val, s.color));
                            rect.addEventListener('mouseleave', () => this.tooltip.classList.remove('active'));
                            barsG.appendChild(rect);
                        });
                    });
                    this.svg.appendChild(barsG);
                }

                _renderMixed(width, height) {
                    const visibleSeries = this.series.filter(s => !s.hidden && s.data && s.data.length);
                    let allVals = [];
                    visibleSeries.forEach(s => allVals.push(...s.data));
                    if (!allVals.length) allVals = [0, 10];

                    const { min, max, ticks } = calculateNiceTicks(Math.min(0, Math.min(...allVals)), Math.max(...allVals));
                    const valRange = max - min || 1;

                    // Dynamic left padding based on longest formatted tick string
                    const sampleTicks = ticks.map(t => formatVal(t, this.options.format));
                    const maxTickLen = Math.max(...sampleTicks.map(s => (s || '').length), 1);
                    const dynamicLeft = Math.min(Math.max(Math.ceil(maxTickLen * 7.5) + 18, 50), 96);
                    const padding = { top: 32, right: 24, bottom: 35, left: dynamicLeft };
                    const plotW = width - padding.left - padding.right;
                    const plotH = height - padding.top - padding.bottom;
                    if (plotW <= 0 || plotH <= 0) return;

                    // Grid & Y labels
                    if (this.options.showGrid) {
                        const gridG = createSVG('g', { class: 'frame-chart-grid' });
                        const labelsG = createSVG('g', { class: 'frame-chart-labels' });
                        ticks.forEach(t => {
                            const y = padding.top + plotH - ((t - min) / valRange) * plotH;
                            gridG.appendChild(createSVG('line', { x1: padding.left, y1: y, x2: width - padding.right, y2: y }));
                            const text = createSVG('text', {
                                x: padding.left - 8,
                                y: y + 4,
                                'text-anchor': 'end'
                            });
                            text.textContent = formatVal(t, this.options.format);
                            labelsG.appendChild(text);
                        });
                        this.svg.appendChild(gridG);
                        this.svg.appendChild(labelsG);
                    }

                    const numCategories = Math.max(this.labels.length, ...visibleSeries.map(s => s.data.length), 1);
                    const catWidth = plotW / numCategories;

                    const xLabelsG = createSVG('g', { class: 'frame-chart-labels' });
                    const isCompact = width < 460 && this.labels.length > 5;
                    this.labels.forEach((lbl, i) => {
                        if (isCompact && i % 2 !== 0 && i !== this.labels.length - 1) {
                            return;
                        }
                        const x = padding.left + i * catWidth + catWidth / 2;
                        const text = createSVG('text', { x, y: height - 10, 'text-anchor': 'middle' });
                        text.textContent = lbl;
                        xLabelsG.appendChild(text);
                    });
                    this.svg.appendChild(xLabelsG);

                    // Separate bar and line series
                    const barSeries = visibleSeries.filter(s => s.type === 'bar');
                    const lineSeries = visibleSeries.filter(s => s.type !== 'bar');

                    // 1. Render Bar series
                    if (barSeries.length > 0) {
                        const numBarSeries = barSeries.length;
                        const barGroupWidth = catWidth * 0.65;
                        const singleBarWidth = Math.max(barGroupWidth / numBarSeries - 3, 4);
                        const barsG = createSVG('g', { class: 'frame-chart-bars' });

                        barSeries.forEach((s, sIdx) => {
                            s.data.forEach((val, cIdx) => {
                                const catStartX = padding.left + cIdx * catWidth + (catWidth - barGroupWidth) / 2;
                                const barX = catStartX + sIdx * (singleBarWidth + 3);
                                const barH = Math.max(((val - min) / valRange) * plotH, 2);
                                const barY = padding.top + plotH - barH;

                                const rect = createSVG('rect', {
                                    class: 'frame-chart-bar' + (this.options.animated !== false ? ' frame-chart-animated' : ''),
                                    x: barX.toFixed(2),
                                    y: barY.toFixed(2),
                                    width: singleBarWidth.toFixed(2),
                                    height: barH.toFixed(2),
                                    fill: s.color,
                                    'data-series': s.name,
                                    'data-val': val,
                                    'data-label': this.labels[cIdx] || '',
                                    'data-color': s.color
                                });
                                rect.addEventListener('mouseenter', (e) => this._showElementTooltip(e, rect, this.labels[cIdx] || '', s.name, val, s.color));
                                rect.addEventListener('mouseleave', () => this.tooltip.classList.remove('active'));
                                barsG.appendChild(rect);
                            });
                        });
                        this.svg.appendChild(barsG);
                    }

                    // 2. Render Line & Area series
                    this.computedPoints = [];
                    lineSeries.forEach((s, sIdx) => {
                        const pts = s.data.map((val, i) => {
                            const x = padding.left + i * catWidth + catWidth / 2;
                            const y = padding.top + plotH - ((val - min) / valRange) * plotH;
                            return { x, y, val, label: this.labels[i] || '', seriesName: s.name, color: s.color };
                        });
                        this.computedPoints.push({ series: s, points: pts });

                        // Area fill if series has fill or s.type === 'area'
                        if (s.fill || s.type === 'area') {
                            const gradId = `${this.id}-mixed-grad-${sIdx}`;
                            const grad = createSVG('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
                            grad.appendChild(createSVG('stop', { offset: '0%', 'stop-color': s.color, 'stop-opacity': '0.3' }));
                            grad.appendChild(createSVG('stop', { offset: '100%', 'stop-color': s.color, 'stop-opacity': '0.01' }));
                            this.defs.appendChild(grad);

                            const linePath = this.options.curved ? getSplinePath(pts) : getLinearPath(pts);
                            const baselineY = padding.top + plotH;
                            const areaD = `${linePath} L ${pts[pts.length - 1].x.toFixed(2)} ${baselineY} L ${pts[0].x.toFixed(2)} ${baselineY} Z`;
                            this.svg.appendChild(createSVG('path', {
                                class: 'frame-chart-area' + (this.options.animated !== false ? ' frame-chart-animated' : ''),
                                d: areaD,
                                fill: `url(#${gradId})`
                            }));
                        }

                        // Line stroke
                        const lineD = this.options.curved ? getSplinePath(pts) : getLinearPath(pts);
                        const line = createSVG('path', {
                            class: 'frame-chart-line' + (this.options.animated !== false ? ' frame-chart-animated' : ''),
                            d: lineD,
                            stroke: s.color,
                            'stroke-width': this.options.strokeWidth || 3
                        });
                        if (this.options.animated !== false) {
                            try {
                                const len = line.getTotalLength ? line.getTotalLength() : 1200;
                                line.style.strokeDasharray = len;
                                line.style.strokeDashoffset = len;
                            } catch (_) {
                                line.style.strokeDasharray = 1200;
                                line.style.strokeDashoffset = 1200;
                            }
                        }
                        this.svg.appendChild(line);

                        // Dots
                        if (this.options.showDots !== false) {
                            const dotsG = createSVG('g', { class: 'frame-chart-dots' });
                            pts.forEach(p => {
                                const dot = createSVG('circle', {
                                    class: 'frame-chart-dot',
                                    cx: p.x.toFixed(2),
                                    cy: p.y.toFixed(2),
                                    r: 4.5,
                                    fill: s.color
                                });
                                dotsG.appendChild(dot);
                            });
                            this.svg.appendChild(dotsG);
                        }
                    });

                    // Crosshair guideline for hover
                    if (lineSeries.length > 0 || barSeries.length > 0) {
                        this.crosshair = createSVG('line', {
                            class: 'frame-chart-crosshair',
                            y1: padding.top,
                            y2: padding.top + plotH,
                            style: 'opacity: 0'
                        });
                        this.svg.appendChild(this.crosshair);
                    }

                    this.plotArea = { padding, plotW, plotH, stepX: catWidth, numPoints: numCategories, min, max, isMixed: true };
                }

                _renderHorizontalBar(width, height) {
                    const visibleSeries = this.series.filter(s => !s.hidden);
                    const s = visibleSeries[0] || { data: [], color: DEFAULT_PALETTE[0] };
                    const vals = Array.isArray(s.data) ? s.data : (visibleSeries.map(item => item.value || 0));
                    const maxVal = Math.max(...vals, 10);
                    const numBars = Math.max(vals.length, 1);

                    // Dynamic left padding based on longest label text
                    const labelLengths = vals.map((v, i) => {
                        const lbl = this.labels[i] || (visibleSeries[i] ? visibleSeries[i].name : `Item ${i + 1}`);
                        return (lbl || '').length;
                    });
                    const maxLabelLen = Math.max(...labelLengths, 1);
                    const dynamicLeft = Math.min(Math.max(Math.ceil(maxLabelLen * 7.2) + 20, 85), 140);

                    // Dynamic right padding based on longest formatted value string
                    const sampleVals = vals.map(v => formatVal(v, this.options.format));
                    const maxValLen = Math.max(...sampleVals.map(str => (str || '').length), 1);
                    const dynamicRight = Math.min(Math.max(Math.ceil(maxValLen * 7.5) + 24, 55), 105);

                    const padding = { top: 20, right: dynamicRight, bottom: 25, left: dynamicLeft };
                    const plotW = width - padding.left - padding.right;
                    const plotH = height - padding.top - padding.bottom;
                    if (plotW <= 0 || plotH <= 0) return;

                    const rowH = plotH / numBars;
                    const barH = Math.min(rowH * 0.58, 24);

                    const barsG = createSVG('g', { class: 'frame-chart-bars' });
                    const labelsG = createSVG('g', { class: 'frame-chart-labels' });

                    vals.forEach((v, i) => {
                        const y = padding.top + i * rowH + (rowH - barH) / 2;
                        const barW = Math.max((v / maxVal) * plotW, 3);
                        const labelText = this.labels[i] || (visibleSeries[i] ? visibleSeries[i].name : `Item ${i + 1}`);
                        const color = (visibleSeries[i] && visibleSeries[i].color) || s.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];

                        // Y label
                        const text = createSVG('text', {
                            x: padding.left - 10,
                            y: y + barH / 2 + 4,
                            'text-anchor': 'end'
                        });
                        text.textContent = labelText;
                        labelsG.appendChild(text);

                        // Background track
                        barsG.appendChild(createSVG('rect', {
                            x: padding.left,
                            y: y.toFixed(2),
                            width: plotW.toFixed(2),
                            height: barH.toFixed(2),
                            fill: 'var(--bg-subtle)',
                            rx: 4,
                            ry: 4
                        }));

                        // Value bar
                        const rect = createSVG('rect', {
                            class: 'frame-chart-bar' + (this.options.animated !== false ? ' frame-chart-horiz-animated' : ''),
                            x: padding.left,
                            y: y.toFixed(2),
                            width: barW.toFixed(2),
                            height: barH.toFixed(2),
                            fill: color,
                            rx: 4,
                            ry: 4
                        });
                        rect.addEventListener('mouseenter', (e) => this._showElementTooltip(e, rect, labelText, '', v, color));
                        rect.addEventListener('mouseleave', () => this.tooltip.classList.remove('active'));
                        barsG.appendChild(rect);

                        // Value label at end
                        const valText = createSVG('text', {
                            x: padding.left + barW + 8,
                            y: y + barH / 2 + 4,
                            'text-anchor': 'start',
                            'font-weight': '600',
                            fill: 'var(--text-main)'
                        });
                        valText.textContent = formatVal(v, this.options.format);
                        labelsG.appendChild(valText);
                    });

                    this.svg.appendChild(barsG);
                    this.svg.appendChild(labelsG);
                }

                _renderDonutPie(width, height) {
                    const cx = width / 2;
                    const cy = height / 2;
                    const r = Math.min(width, height) / 2 - 20;
                    if (r <= 10) return;
                    const innerR = this.type === 'donut' ? r * (this.options.donutCutout || 0.65) : 0;

                    const visibleSeries = this.series.filter(s => !s.hidden);
                    const values = visibleSeries.map(s => s.value !== undefined ? s.value : (Array.isArray(s.data) ? s.data[0] || 0 : 0));
                    const total = values.reduce((acc, v) => acc + (Number(v) || 0), 0) || 1;

                    let currentAngle = 0;
                    const slicesG = createSVG('g', { class: 'frame-chart-slices' });

                    visibleSeries.forEach((s, i) => {
                        const val = values[i];
                        const sliceAngle = (val / total) * 360;
                        const startA = currentAngle;
                        const endA = currentAngle + sliceAngle;
                        currentAngle = endA;

                        const d = describeDonutSlice(cx, cy, innerR, r, startA, endA);
                        const slice = createSVG('path', {
                            class: 'frame-chart-slice',
                            d,
                            fill: s.color
                        });
                        const pct = ((val / total) * 100).toFixed(1) + '%';
                        slice.addEventListener('mouseenter', (e) => {
                            this._showElementTooltip(e, slice, s.name, pct, val, s.color);
                        });
                        slice.addEventListener('mouseleave', () => this.tooltip.classList.remove('active'));
                        slicesG.appendChild(slice);
                    });
                    this.svg.appendChild(slicesG);

                    // Donut center text
                    if (this.type === 'donut') {
                        const centerVal = this.options.centerText !== undefined ? this.options.centerText : formatVal(total, this.options.format);
                        const centerLbl = this.options.centerSubtext !== undefined ? this.options.centerSubtext : 'Total';

                        const valText = createSVG('text', {
                            class: 'frame-chart-center-val',
                            x: cx,
                            y: cy - 4
                        });
                        valText.textContent = centerVal;
                        this.svg.appendChild(valText);

                        if (centerLbl) {
                            const lblText = createSVG('text', {
                                class: 'frame-chart-center-lbl',
                                x: cx,
                                y: cy + 18
                            });
                            lblText.textContent = centerLbl;
                            this.svg.appendChild(lblText);
                        }
                    }
                }

                _renderGauge(width, height) {
                    const cx = width / 2;
                    const cy = height * 0.70;
                    const r = Math.min(width * 0.38, height * 0.48);
                    const strokeWidth = r * 0.22;
                    const startAngle = -100;
                    const endAngle = 100;
                    const totalAngle = endAngle - startAngle;

                    const val = (this.series[0] && (this.series[0].value !== undefined ? this.series[0].value : (this.series[0].data && this.series[0].data[0]))) || 75;
                    const maxVal = this.options.max || 100;
                    const minVal = this.options.min || 0;
                    const pct = Math.min(Math.max((val - minVal) / (maxVal - minVal), 0), 1);
                    const valAngle = startAngle + totalAngle * pct;
                    const color = (this.series[0] && this.series[0].color) || DEFAULT_PALETTE[0];

                    // Track arc
                    const bgArc = createSVG('path', {
                        class: 'frame-chart-gauge-bg',
                        d: describeArc(cx, cy, r, startAngle, endAngle),
                        'stroke-width': strokeWidth
                    });
                    this.svg.appendChild(bgArc);

                    // Progress arc
                    if (pct > 0) {
                        const valArc = createSVG('path', {
                            class: 'frame-chart-gauge-val',
                            d: describeArc(cx, cy, r, startAngle, valAngle),
                            stroke: color,
                            'stroke-width': strokeWidth
                        });
                        this.svg.appendChild(valArc);
                    }

                    // Value and Subtitle text
                    const centerVal = this.options.centerText || (formatVal(val, this.options.format));
                    const valText = createSVG('text', {
                        class: 'frame-chart-center-val',
                        x: cx,
                        y: cy - 10
                    });
                    valText.textContent = centerVal;
                    this.svg.appendChild(valText);

                    const subText = createSVG('text', {
                        class: 'frame-chart-center-lbl',
                        x: cx,
                        y: cy + 15
                    });
                    subText.textContent = this.options.centerSubtext || `${Math.round(pct * 100)}% da Meta`;
                    this.svg.appendChild(subText);

                    // Min & Max indicator labels
                    const labelsG = createSVG('g', { class: 'frame-chart-labels' });
                    const minRad = (startAngle - 90) * Math.PI / 180;
                    const maxRad = (endAngle - 90) * Math.PI / 180;
                    const minLabel = createSVG('text', { x: cx + (r + strokeWidth * 0.8) * Math.cos(minRad), y: cy + (r + strokeWidth * 0.8) * Math.sin(minRad) + 12, 'text-anchor': 'middle' });
                    minLabel.textContent = minVal;
                    const maxLabel = createSVG('text', { x: cx + (r + strokeWidth * 0.8) * Math.cos(maxRad), y: cy + (r + strokeWidth * 0.8) * Math.sin(maxRad) + 12, 'text-anchor': 'middle' });
                    maxLabel.textContent = maxVal;
                    labelsG.appendChild(minLabel);
                    labelsG.appendChild(maxLabel);
                    this.svg.appendChild(labelsG);
                }

                _renderRadar(width, height) {
                    const cx = width / 2;
                    const cy = height / 2;
                    const r = Math.min(width, height) / 2 - 46;
                    const categories = this.labels;
                    const numAxes = categories.length;
                    if (numAxes < 3 || r <= 10) return;

                    const levels = 4;
                    const maxVal = this.options.max || 100;

                    // Concentric polygon web
                    for (let l = 1; l <= levels; l++) {
                        const levelR = (r / levels) * l;
                        const polyPts = [];
                        for (let i = 0; i < numAxes; i++) {
                            const angle = ((i / numAxes) * 360 - 90) * Math.PI / 180;
                            polyPts.push(`${(cx + levelR * Math.cos(angle)).toFixed(2)},${(cy + levelR * Math.sin(angle)).toFixed(2)}`);
                        }
                        this.svg.appendChild(createSVG('polygon', {
                            class: 'frame-chart-radar-grid',
                            points: polyPts.join(' ')
                        }));
                    }

                    // Axis lines & labels
                    const labelsG = createSVG('g', { class: 'frame-chart-labels' });
                    for (let i = 0; i < numAxes; i++) {
                        const angle = ((i / numAxes) * 360 - 90) * Math.PI / 180;
                        const axX = cx + r * Math.cos(angle);
                        const axY = cy + r * Math.sin(angle);
                        this.svg.appendChild(createSVG('line', {
                            class: 'frame-chart-radar-axis',
                            x1: cx,
                            y1: cy,
                            x2: axX,
                            y2: axY
                        }));

                        const lblX = cx + (r + 18) * Math.cos(angle);
                        const lblY = cy + (r + 18) * Math.sin(angle);
                        const text = createSVG('text', {
                            x: lblX,
                            y: lblY + 4,
                            'text-anchor': Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end')
                        });
                        text.textContent = categories[i];
                        labelsG.appendChild(text);
                    }
                    this.svg.appendChild(labelsG);

                    // Series polygons
                    const visibleSeries = this.series.filter(s => !s.hidden && s.data);
                    visibleSeries.forEach(s => {
                        const pts = [];
                        s.data.forEach((val, i) => {
                            const pct = Math.min(Math.max(val / maxVal, 0), 1);
                            const curR = r * pct;
                            const angle = ((i / numAxes) * 360 - 90) * Math.PI / 180;
                            pts.push({ x: cx + curR * Math.cos(angle), y: cy + curR * Math.sin(angle), val, label: categories[i] });
                        });

                        const polyStr = pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
                        const poly = createSVG('polygon', {
                            class: 'frame-chart-radar-poly',
                            points: polyStr,
                            fill: s.color,
                            stroke: s.color
                        });
                        this.svg.appendChild(poly);

                        // Dots
                        pts.forEach(p => {
                            const dot = createSVG('circle', {
                                class: 'frame-chart-dot',
                                cx: p.x.toFixed(2),
                                cy: p.y.toFixed(2),
                                r: 3.5,
                                fill: s.color
                            });
                            dot.addEventListener('mouseenter', (e) => this._showElementTooltip(e, dot, p.label, s.name, p.val, s.color));
                            dot.addEventListener('mouseleave', () => this.tooltip.classList.remove('active'));
                            this.svg.appendChild(dot);
                        });
                    });
                }

                _renderSparkline(width, height) {
                    const padding = { top: 4, right: 4, bottom: 4, left: 4 };
                    const plotW = width - padding.left - padding.right;
                    const plotH = height - padding.top - padding.bottom;
                    const s = this.series[0] || { data: [5, 12, 8, 16, 10, 20], color: DEFAULT_PALETTE[0] };
                    const rawData = Array.isArray(s.data) ? s.data : [10, 20];
                    const min = Math.min(...rawData);
                    const max = Math.max(...rawData);
                    const range = max - min || 1;
                    const stepX = plotW / (rawData.length - 1);

                    const pts = rawData.map((val, i) => ({
                        x: padding.left + i * stepX,
                        y: padding.top + plotH - ((val - min) / range) * plotH
                    }));

                    // Area fill gradient
                    const gradId = `${this.id}-spark-grad`;
                    const grad = createSVG('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
                    grad.appendChild(createSVG('stop', { offset: '0%', 'stop-color': s.color, 'stop-opacity': '0.35' }));
                    grad.appendChild(createSVG('stop', { offset: '100%', 'stop-color': s.color, 'stop-opacity': '0.0' }));
                    this.defs.appendChild(grad);

                    const lineD = getSplinePath(pts);
                    const areaD = `${lineD} L ${pts[pts.length - 1].x.toFixed(2)} ${height} L ${pts[0].x.toFixed(2)} ${height} Z`;

                    this.svg.appendChild(createSVG('path', { d: areaD, fill: `url(#${gradId})` }));
                    this.svg.appendChild(createSVG('path', { d: lineD, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
                }

                _renderLegend() {
                    if (!this.legendWrap || !this.options.legend || this.type === 'sparkline') return;
                    this.legendWrap.innerHTML = '';

                    const isDonutOrPie = this.type === 'donut' || this.type === 'pie';
                    const items = isDonutOrPie
                        ? this.series.map(s => ({ name: s.name, color: s.color, hidden: s.hidden, ref: s }))
                        : this.series.map(s => ({ name: s.name, color: s.color, hidden: s.hidden, ref: s }));

                    items.forEach((item, idx) => {
                        const el = document.createElement('div');
                        el.className = 'frame-chart-legend-item' + (item.hidden ? ' dimmed' : '');
                        el.innerHTML = `<span class="frame-chart-legend-color" style="background-color: ${item.color}"></span><span>${item.name}</span>`;

                        el.addEventListener('click', () => {
                            this.toggleSeries(idx);
                        });
                        this.legendWrap.appendChild(el);
                    });
                }

                _handleMouseMove(e) {
                    if (!this.plotArea || !this.options.tooltip) return;
                    const rect = this.svgWrap.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const { padding, plotW, numPoints, isMixed, stepX: mixedStepX } = this.plotArea;
                    const stepX = isMixed ? mixedStepX : (numPoints > 1 ? plotW / (numPoints - 1) : plotW / 2);
                    let idx;
                    let curX;
                    if (isMixed) {
                        idx = Math.floor((mouseX - padding.left) / stepX);
                        idx = Math.max(0, Math.min(idx, numPoints - 1));
                        curX = padding.left + idx * stepX + stepX / 2;
                    } else {
                        idx = Math.round((mouseX - padding.left) / stepX);
                        idx = Math.max(0, Math.min(idx, numPoints - 1));
                        curX = padding.left + (numPoints > 1 ? idx * stepX : plotW / 2);
                    }

                    // Move crosshair
                    if (this.crosshair) {
                        this.crosshair.setAttribute('x1', curX.toFixed(2));
                        this.crosshair.setAttribute('x2', curX.toFixed(2));
                        this.crosshair.style.opacity = '1';
                    }

                    // Build tooltip
                    const headerText = this.labels[idx] || `Item ${idx + 1}`;
                    let itemsHtml = '';
                    let topY = Infinity;

                    this.series.forEach(s => {
                        if (!s.hidden && s.data && s.data[idx] !== undefined) {
                            itemsHtml += `
                                <div class="frame-chart-tooltip-item">
                                    <div class="frame-chart-tooltip-left">
                                        <span class="frame-chart-tooltip-dot" style="background-color: ${s.color}"></span>
                                        <span class="frame-chart-tooltip-label">${s.name}</span>
                                    </div>
                                    <span class="frame-chart-tooltip-value">${formatVal(s.data[idx], this.options.format)}</span>
                                </div>
                            `;
                        }
                    });

                    if (this.computedPoints) {
                        this.computedPoints.forEach(cp => {
                            const p = cp.points[idx];
                            if (p && !cp.series.hidden) {
                                topY = Math.min(topY, p.y);
                            }
                        });
                    }

                    this.tooltip.innerHTML = `
                        <div class="frame-chart-tooltip-header">${headerText}</div>
                        <div class="frame-chart-tooltip-items">${itemsHtml}</div>
                    `;

                    this.tooltip.style.left = curX + 'px';
                    this.tooltip.style.top = (isFinite(topY) ? Math.max(topY, 30) : 60) + 'px';
                    this.tooltip.classList.add('active');
                }

                _handleMouseLeave() {
                    if (this.crosshair) this.crosshair.style.opacity = '0';
                    if (this.tooltip) this.tooltip.classList.remove('active');
                }

                _showElementTooltip(e, targetEl, title, subtitle, val, color) {
                    if (!this.options.tooltip) return;
                    const rect = this.svgWrap.getBoundingClientRect();
                    const elRect = targetEl.getBoundingClientRect();
                    const posX = elRect.left - rect.left + elRect.width / 2;
                    const posY = elRect.top - rect.top;

                    this.tooltip.innerHTML = `
                        <div class="frame-chart-tooltip-header">${title}</div>
                        <div class="frame-chart-tooltip-items">
                            <div class="frame-chart-tooltip-item">
                                <div class="frame-chart-tooltip-left">
                                    <span class="frame-chart-tooltip-dot" style="background-color: ${color}"></span>
                                    <span class="frame-chart-tooltip-label">${subtitle || title}</span>
                                </div>
                                <span class="frame-chart-tooltip-value">${formatVal(val, this.options.format)}</span>
                            </div>
                        </div>
                    `;
                    this.tooltip.style.left = posX + 'px';
                    this.tooltip.style.top = posY + 'px';
                    this.tooltip.classList.add('active');
                }

                toggleSeries(idx) {
                    if (this.series[idx]) {
                        this.series[idx].hidden = !this.series[idx].hidden;
                        this.render();
                    }
                }

                update(newData, newOptions = {}) {
                    if (newData) {
                        this.data = newData;
                        this._normalizeData();
                    }
                    if (newOptions) {
                        this.options = Object.assign(this.options, newOptions);
                    }
                    this.render();
                }

                destroy() {
                    if (this._resizeObserver) this._resizeObserver.disconnect();
                    if (this.svgWrap) {
                        this.svgWrap.removeEventListener('mousemove', this._onMouseMove);
                        this.svgWrap.removeEventListener('mouseleave', this._onMouseLeave);
                    }
                    this.container.innerHTML = '';
                }

                exportSVG() {
                    if (!this.svg) return '';
                    return new XMLSerializer().serializeToString(this.svg);
                }

                exportPNG(filename = 'chart.png') {
                    const svgString = this.exportSVG();
                    if (!svgString) return;
                    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                    const URL = window.URL || window.webkitURL || window;
                    const blobURL = URL.createObjectURL(svgBlob);
                    const image = new Image();
                    image.onload = () => {
                        const canvas = document.createElement('canvas');
                        const scale = 2; // Retina 2x resolution
                        canvas.width = (this.svgWrap.clientWidth || 600) * scale;
                        canvas.height = (this.options.height || 280) * scale;
                        const ctx = canvas.getContext('2d');
                        ctx.scale(scale, scale);
                        ctx.drawImage(image, 0, 0);
                        const png = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.download = filename;
                        a.href = png;
                        a.click();
                        URL.revokeObjectURL(blobURL);
                    };
                    image.src = blobURL;
                }

                static autoInit() {
                    const elements = document.querySelectorAll('[data-chart]');
                    elements.forEach(el => {
                        if (el._frameChart) return;
                        const type = el.getAttribute('data-chart') || 'line';
                        let data = { labels: [], series: [] };
                        let options = {};
                        try {
                            const rawData = el.getAttribute('data-chart-data');
                            if (rawData) data = JSON.parse(rawData);
                            const rawOptions = el.getAttribute('data-chart-options');
                            if (rawOptions) options = JSON.parse(rawOptions);
                        } catch (err) {
                            console.error('FramePER.Chart autoInit erro ao fazer parse do JSON:', err);
                        }
                        el._frameChart = new FramePERChart(el, { type, data, options });
                    });
                }
            }

            return FramePERChart;
        })(),

        // --- 11. Command Palette (Spotlight / Cmd+K / Ctrl+K) ---
        CommandPalette: (function() {
            let dialog = null;
            let input = null;
            let body = null;
            let items = [];
            let selectedIndex = 0;
            let isOpen = false;

            const DEFAULT_COMMANDS = [
                {
                    group: 'Navegação Rápida',
                    id: 'nav-home',
                    title: 'Início & Destaques',
                    desc: 'Página inicial do Frame PER',
                    icon: 'icon-star',
                    action: () => { window.location.href = 'index.html'; }
                },
                {
                    group: 'Navegação Rápida',
                    id: 'nav-charts',
                    title: 'Gráficos SVG',
                    desc: 'Playground interativo com 9+ modelos vetoriais',
                    icon: 'icon-activity',
                    badge: 'Novo',
                    action: () => { window.location.href = 'charts.html'; }
                },
                {
                    group: 'Navegação Rápida',
                    id: 'nav-dashboard',
                    title: 'Admin Dashboard (Visão Geral)',
                    desc: 'Métricas, vendas e atividades do sistema',
                    icon: 'icon-home',
                    action: () => { window.location.href = 'dashboard.html'; }
                },
                {
                    group: 'Navegação Rápida',
                    id: 'nav-users',
                    title: 'Usuários & Permissões',
                    desc: 'Tabela com ordenação, busca e cadastro',
                    icon: 'icon-user',
                    action: () => { window.location.href = 'users.html'; }
                },
                {
                    group: 'Navegação Rápida',
                    id: 'nav-messages',
                    title: 'Mensagens & Inbox',
                    desc: 'Chat ao vivo e conversas de suporte',
                    icon: 'icon-envelope',
                    action: () => { window.location.href = 'messages.html'; }
                },
                {
                    group: 'Navegação Rápida',
                    id: 'nav-reports',
                    title: 'Agendamentos & Relatórios',
                    desc: 'Histórico de operações e métricas',
                    icon: 'icon-calendar',
                    action: () => { window.location.href = 'reports.html'; }
                },
                {
                    group: 'Navegação Rápida',
                    id: 'nav-settings',
                    title: 'Configurações do Sistema',
                    desc: 'Perfil, segurança, notificações e 2FA',
                    icon: 'icon-settings',
                    action: () => { window.location.href = 'settings.html'; }
                },
                {
                    group: 'Aplicações Temáticas',
                    id: 'nav-beauty',
                    title: 'Aura Beauty & Nails',
                    desc: 'Studio de beleza, catálogo e agendamento online',
                    icon: 'icon-sparkles',
                    action: () => { window.location.href = 'beauty.html'; }
                },
                {
                    group: 'Aplicações Temáticas',
                    id: 'nav-social',
                    title: 'Rede Social Demo',
                    desc: 'Feed, stories, trending hashtags e comentários',
                    icon: 'icon-heart',
                    action: () => { window.location.href = 'social.html'; }
                },
                {
                    group: 'Aplicações Temáticas',
                    id: 'nav-store',
                    title: 'Loja de Roupas & Moda',
                    desc: 'E-commerce com sacola lateral deslizante',
                    icon: 'icon-tag',
                    action: () => { window.location.href = 'store.html'; }
                },
                {
                    group: 'Componentes & Docs',
                    id: 'nav-components',
                    title: 'Galeria de Componentes UI',
                    desc: 'Botões, modais, tabelas, forms, chips e skeletons',
                    icon: 'icon-settings',
                    action: () => { window.location.href = 'components.html'; }
                },
                {
                    group: 'Componentes & Docs',
                    id: 'nav-manual',
                    title: 'Manual de API Completo',
                    desc: 'Documentação dos utilitários CSS e JS',
                    icon: 'icon-info',
                    action: () => { window.location.href = 'manual.html'; }
                },
                {
                    group: 'Ações do Sistema',
                    id: 'action-theme',
                    title: 'Alternar Tema Claro / Escuro',
                    desc: 'Alterna entre Dark Mode e Light Mode',
                    icon: 'icon-moon',
                    badge: 'Tema',
                    action: () => {
                        const toggle = document.querySelector('[data-theme-toggle]');
                        if (toggle) toggle.click();
                        else if (window.FramePER && window.FramePER.Theme) window.FramePER.Theme.toggle();
                    }
                }
            ];

            function createDOM() {
                if (dialog) return;
                const backdrop = document.createElement('div');
                backdrop.className = 'command-backdrop';
                backdrop.innerHTML = `
                    <div class="command-dialog" role="dialog" aria-modal="true" aria-label="Comandos Rápidos">
                        <div class="command-header">
                            <i class="icon icon-search command-search-icon"></i>
                            <input type="text" class="command-input" placeholder="Digite para buscar páginas, ações ou componentes..." autocomplete="off">
                            <button type="button" class="command-close-btn" aria-label="Fechar"><i class="icon icon-close"></i></button>
                        </div>
                        <div class="command-body"></div>
                        <div class="command-footer">
                            <div class="command-shortcuts">
                                <span class="command-shortcut"><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
                                <span class="command-shortcut"><kbd>↵</kbd> selecionar</span>
                                <span class="command-shortcut"><kbd>ESC</kbd> fechar</span>
                            </div>
                            <span>Frame PER Spotlight</span>
                        </div>
                    </div>
                `;
                document.body.appendChild(backdrop);
                dialog = backdrop;
                input = backdrop.querySelector('.command-input');
                body = backdrop.querySelector('.command-body');

                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) close();
                });
                backdrop.querySelector('.command-close-btn').addEventListener('click', close);

                input.addEventListener('input', (e) => {
                    renderList(e.target.value.trim());
                });

                input.addEventListener('keydown', (e) => {
                    const visibleItems = body.querySelectorAll('.command-item');
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (visibleItems.length) {
                            selectedIndex = (selectedIndex + 1) % visibleItems.length;
                            updateSelection(visibleItems);
                        }
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (visibleItems.length) {
                            selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
                            updateSelection(visibleItems);
                        }
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        if (visibleItems[selectedIndex]) {
                            visibleItems[selectedIndex].click();
                        }
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        close();
                    }
                });
            }

            function updateSelection(visibleEls) {
                visibleEls.forEach((el, i) => {
                    if (i === selectedIndex) {
                        el.classList.add('is-selected');
                        el.scrollIntoView({ block: 'nearest' });
                    } else {
                        el.classList.remove('is-selected');
                    }
                });
            }

            function renderList(query = '') {
                if (!body) return;
                body.innerHTML = '';
                const q = query.toLowerCase();
                const filtered = items.filter(it => {
                    if (!q) return true;
                    return (it.title && it.title.toLowerCase().includes(q)) ||
                           (it.desc && it.desc.toLowerCase().includes(q)) ||
                           (it.group && it.group.toLowerCase().includes(q));
                });

                if (filtered.length === 0) {
                    body.innerHTML = `
                        <div class="command-empty">
                            <div class="command-empty-icon"><i class="icon icon-search"></i></div>
                            <p>Nenhum resultado encontrado para "<strong>${escapeStr(query)}</strong>"</p>
                        </div>
                    `;
                    return;
                }

                const groups = {};
                filtered.forEach(it => {
                    const g = it.group || 'Geral';
                    if (!groups[g]) groups[g] = [];
                    groups[g].push(it);
                });

                let overallIdx = 0;
                Object.keys(groups).forEach(grpTitle => {
                    const groupWrap = document.createElement('div');
                    groupWrap.className = 'command-group';
                    const titleEl = document.createElement('div');
                    titleEl.className = 'command-group-title';
                    titleEl.textContent = grpTitle;
                    groupWrap.appendChild(titleEl);

                    groups[grpTitle].forEach(cmd => {
                        const itemIdx = overallIdx++;
                        const itemEl = document.createElement('div');
                        itemEl.className = 'command-item' + (itemIdx === selectedIndex ? ' is-selected' : '');
                        itemEl.setAttribute('tabindex', '0');
                        itemEl.innerHTML = `
                            <div class="command-item-left">
                                <span class="command-item-icon"><i class="icon ${cmd.icon || 'icon-activity'}"></i></span>
                                <div class="command-item-text">
                                    <div class="command-item-title">${cmd.title}</div>
                                    ${cmd.desc ? `<div class="command-item-desc">${cmd.desc}</div>` : ''}
                                </div>
                            </div>
                            ${cmd.badge ? `<span class="badge badge-primary badge-pill command-item-badge">${cmd.badge}</span>` : `<kbd class="command-item-badge">↵</kbd>`}
                        `;

                        itemEl.addEventListener('mouseenter', () => {
                            selectedIndex = itemIdx;
                            updateSelection(body.querySelectorAll('.command-item'));
                        });

                        itemEl.addEventListener('click', () => {
                            close();
                            if (typeof cmd.action === 'function') {
                                cmd.action();
                            }
                        });

                        groupWrap.appendChild(itemEl);
                    });
                    body.appendChild(groupWrap);
                });

                selectedIndex = 0;
                const visibleEls = body.querySelectorAll('.command-item');
                updateSelection(visibleEls);
            }

            function escapeStr(str) {
                return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
            }

            function open() {
                createDOM();
                isOpen = true;
                dialog.classList.add('open');
                selectedIndex = 0;
                input.value = '';
                renderList('');
                setTimeout(() => input.focus(), 50);
            }

            function close() {
                if (!dialog) return;
                isOpen = false;
                dialog.classList.remove('open');
            }

            function toggle() {
                if (isOpen) close();
                else open();
            }

            function register(newItems) {
                if (Array.isArray(newItems)) {
                    items.push(...newItems);
                } else if (newItems) {
                    items.push(newItems);
                }
            }

            function init(customCommands = []) {
                items = [...DEFAULT_COMMANDS, ...customCommands];
                createDOM();

                window.addEventListener('keydown', (e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                        e.preventDefault();
                        toggle();
                    }
                });

                document.addEventListener('click', (e) => {
                    const trigger = e.target.closest('[data-command-palette], [data-toggle="command-palette"]');
                    if (trigger) {
                        e.preventDefault();
                        open();
                    }
                });
            }

            return {
                init,
                open,
                close,
                toggle,
                register
            };
        })(),

        // ======================================================================
        // FramePER.Datepicker: Native Pure JS/CSS Date & Range Picker
        // ======================================================================
        Datepicker: (() => {
            const MONTH_NAMES = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

            function pad(n) { return String(n).padStart(2, '0'); }

            function formatDate(d) {
                if (!d || isNaN(d.getTime())) return '';
                return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
            }

            function parseDate(str) {
                if (!str || typeof str !== 'string') return null;
                const parts = str.trim().split('/');
                if (parts.length === 3) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                        const d = new Date(year, month, day);
                        if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
                            return d;
                        }
                    }
                }
                return null;
            }

            class Instance {
                constructor(input, options = {}) {
                    this.input = typeof input === 'string' ? document.querySelector(input) : input;
                    if (!this.input || this.input._frameDatepicker) return;
                    this.input._frameDatepicker = this;

                    this.isRange = options.range || this.input.getAttribute('data-datepicker') === 'range';
                    
                    const today = new Date();
                    this.viewYear = today.getFullYear();
                    this.viewMonth = today.getMonth();

                    this.selectedDate = null;
                    this.rangeStart = null;
                    this.rangeEnd = null;

                    if (this.input.value) {
                        if (this.isRange && this.input.value.includes(' - ')) {
                            const [s, e] = this.input.value.split(' - ');
                            this.rangeStart = parseDate(s);
                            this.rangeEnd = parseDate(e);
                            if (this.rangeStart) {
                                this.viewYear = this.rangeStart.getFullYear();
                                this.viewMonth = this.rangeStart.getMonth();
                            }
                        } else {
                            const parsed = parseDate(this.input.value);
                            if (parsed) {
                                this.selectedDate = parsed;
                                this.viewYear = parsed.getFullYear();
                                this.viewMonth = parsed.getMonth();
                            }
                        }
                    }

                    this._createDOM();
                    this._bindEvents();
                }

                _createDOM() {
                    this.popover = document.createElement('div');
                    this.popover.className = 'frame-datepicker-popover';
                    document.body.appendChild(this.popover);
                }

                _bindEvents() {
                    this.input.addEventListener('focus', () => this.open());
                    this.input.addEventListener('click', () => this.open());

                    document.addEventListener('click', (e) => {
                        if (!this.isOpen) return;
                        if (!this.popover.contains(e.target) && e.target !== this.input) {
                            this.close();
                        }
                    });

                    window.addEventListener('resize', () => {
                        if (this.isOpen) this._position();
                    });

                    window.addEventListener('scroll', () => {
                        if (this.isOpen) this._position();
                    }, true);

                    this.input.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && this.isOpen) {
                            this.close();
                        }
                    });
                }

                _position() {
                    const rect = this.input.getBoundingClientRect();
                    const popoverH = this.popover.offsetHeight || 310;
                    const popoverW = this.popover.offsetWidth || 296;
                    
                    let top = rect.bottom + window.scrollY + 6;
                    let left = rect.left + window.scrollX;

                    if (rect.bottom + popoverH + 10 > window.innerHeight && rect.top - popoverH > 0) {
                        top = rect.top + window.scrollY - popoverH - 6;
                        this.popover.classList.add('popover-top');
                    } else {
                        this.popover.classList.remove('popover-top');
                    }

                    if (left + popoverW > window.innerWidth - 10) {
                        left = window.innerWidth - popoverW - 10;
                    }
                    if (left < 10) left = 10;

                    this.popover.style.top = `${top}px`;
                    this.popover.style.left = `${left}px`;
                }

                render() {
                    const year = this.viewYear;
                    const month = this.viewMonth;

                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    const prevLastDay = new Date(year, month, 0);

                    const startingDay = firstDay.getDay();
                    const totalDays = lastDay.getDate();

                    const today = new Date();
                    const isTodayYearMonth = today.getFullYear() === year && today.getMonth() === month;

                    let html = `
                        <div class="frame-datepicker-header">
                            <button type="button" class="frame-datepicker-nav-btn prev-btn" aria-label="Mês anterior">&lsaquo;</button>
                            <span class="frame-datepicker-title">${MONTH_NAMES[month]} ${year}</span>
                            <button type="button" class="frame-datepicker-nav-btn next-btn" aria-label="Próximo mês">&rsaquo;</button>
                        </div>
                        <div class="frame-datepicker-weekdays">
                            ${WEEKDAY_NAMES.map(w => `<span>${w}</span>`).join('')}
                        </div>
                        <div class="frame-datepicker-days">
                    `;

                    // Previous month trailing days
                    const prevMonthDays = prevLastDay.getDate();
                    for (let i = startingDay - 1; i >= 0; i--) {
                        const dayNum = prevMonthDays - i;
                        html += `<button type="button" class="frame-datepicker-day is-other-month" data-action="prev-month-day" data-day="${dayNum}">${dayNum}</button>`;
                    }

                    // Current month days
                    for (let day = 1; day <= totalDays; day++) {
                        const currentD = new Date(year, month, day);
                        const isToday = isTodayYearMonth && today.getDate() === day;
                        
                        let classes = ['frame-datepicker-day'];
                        if (isToday) classes.push('is-today');

                        if (this.isRange) {
                            const time = currentD.getTime();
                            const sTime = this.rangeStart ? new Date(this.rangeStart.getFullYear(), this.rangeStart.getMonth(), this.rangeStart.getDate()).getTime() : null;
                            const eTime = this.rangeEnd ? new Date(this.rangeEnd.getFullYear(), this.rangeEnd.getMonth(), this.rangeEnd.getDate()).getTime() : null;

                            if (sTime && time === sTime) {
                                classes.push('is-range-start', 'is-selected');
                            } else if (eTime && time === eTime) {
                                classes.push('is-range-end', 'is-selected');
                            } else if (sTime && eTime && time > sTime && time < eTime) {
                                classes.push('is-in-range');
                            }
                        } else if (this.selectedDate) {
                            if (this.selectedDate.getFullYear() === year &&
                                this.selectedDate.getMonth() === month &&
                                this.selectedDate.getDate() === day) {
                                classes.push('is-selected');
                            }
                        }

                        html += `<button type="button" class="${classes.join(' ')}" data-action="select-day" data-day="${day}">${day}</button>`;
                    }

                    // Next month leading days
                    const remainingCells = 42 - (startingDay + totalDays);
                    const nextDaysToShow = remainingCells < 7 ? remainingCells : remainingCells - 7;
                    for (let day = 1; day <= nextDaysToShow; day++) {
                        html += `<button type="button" class="frame-datepicker-day is-other-month" data-action="next-month-day" data-day="${day}">${day}</button>`;
                    }

                    html += `
                        </div>
                        <div class="frame-datepicker-footer">
                            <button type="button" class="btn-link" data-action="today">Hoje</button>
                            <button type="button" class="btn-link text-muted" data-action="clear">Limpar</button>
                        </div>
                    `;

                    this.popover.innerHTML = html;

                    this.popover.querySelector('.prev-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.prevMonth();
                    });
                    this.popover.querySelector('.next-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.nextMonth();
                    });

                    this.popover.querySelectorAll('[data-action="select-day"]').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const day = parseInt(btn.getAttribute('data-day'), 10);
                            this.selectDay(day);
                        });
                    });

                    this.popover.querySelectorAll('[data-action="prev-month-day"]').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.prevMonth();
                            const day = parseInt(btn.getAttribute('data-day'), 10);
                            this.selectDay(day);
                        });
                    });

                    this.popover.querySelectorAll('[data-action="next-month-day"]').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.nextMonth();
                            const day = parseInt(btn.getAttribute('data-day'), 10);
                            this.selectDay(day);
                        });
                    });

                    const todayBtn = this.popover.querySelector('[data-action="today"]');
                    if (todayBtn) {
                        todayBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const now = new Date();
                            this.viewYear = now.getFullYear();
                            this.viewMonth = now.getMonth();
                            if (this.isRange) {
                                this.rangeStart = now;
                                this.rangeEnd = null;
                                this.input.value = formatDate(now);
                            } else {
                                this.selectedDate = now;
                                this.input.value = formatDate(now);
                                this.close();
                            }
                            this.input.dispatchEvent(new Event('input', { bubbles: true }));
                            this.input.dispatchEvent(new Event('change', { bubbles: true }));
                            this.render();
                        });
                    }

                    const clearBtn = this.popover.querySelector('[data-action="clear"]');
                    if (clearBtn) {
                        clearBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.selectedDate = null;
                            this.rangeStart = null;
                            this.rangeEnd = null;
                            this.input.value = '';
                            this.input.dispatchEvent(new Event('input', { bubbles: true }));
                            this.input.dispatchEvent(new Event('change', { bubbles: true }));
                            this.close();
                        });
                    }
                }

                selectDay(day) {
                    const picked = new Date(this.viewYear, this.viewMonth, day);

                    if (this.isRange) {
                        if (!this.rangeStart || (this.rangeStart && this.rangeEnd)) {
                            this.rangeStart = picked;
                            this.rangeEnd = null;
                            this.input.value = formatDate(picked);
                        } else {
                            if (picked < this.rangeStart) {
                                this.rangeEnd = this.rangeStart;
                                this.rangeStart = picked;
                            } else {
                                this.rangeEnd = picked;
                            }
                            this.input.value = `${formatDate(this.rangeStart)} - ${formatDate(this.rangeEnd)}`;
                            this.close();
                        }
                    } else {
                        this.selectedDate = picked;
                        this.input.value = formatDate(picked);
                        this.close();
                    }

                    this.input.dispatchEvent(new Event('input', { bubbles: true }));
                    this.input.dispatchEvent(new Event('change', { bubbles: true }));
                    this.render();
                }

                prevMonth() {
                    this.viewMonth--;
                    if (this.viewMonth < 0) {
                        this.viewMonth = 11;
                        this.viewYear--;
                    }
                    this.render();
                }

                nextMonth() {
                    this.viewMonth++;
                    if (this.viewMonth > 11) {
                        this.viewMonth = 0;
                        this.viewYear++;
                    }
                    this.render();
                }

                open() {
                    this.isOpen = true;
                    this.render();
                    this.popover.classList.add('show');
                    this._position();
                }

                close() {
                    this.isOpen = false;
                    this.popover.classList.remove('show');
                }

                destroy() {
                    if (this.popover && this.popover.parentNode) {
                        this.popover.parentNode.removeChild(this.popover);
                    }
                    delete this.input._frameDatepicker;
                }
            }

            return {
                create: (input, options) => new Instance(input, options),
                init: () => {
                    document.querySelectorAll('input[data-datepicker]').forEach(input => {
                        new Instance(input);
                    });
                }
            };
        })(),

        // ======================================================================
        // FramePER.Select: Rich Searchable Single & Multi-Select with Chips
        // ======================================================================
        Select: (() => {
            class Instance {
                constructor(select, options = {}) {
                    this.select = typeof select === 'string' ? document.querySelector(select) : select;
                    if (!this.select || this.select._frameSelect) return;
                    this.select._frameSelect = this;

                    this.isMultiple = this.select.multiple || options.multiple || false;
                    this.placeholder = options.placeholder || this.select.getAttribute('data-placeholder') || 'Selecione...';
                    this.searchPlaceholder = options.searchPlaceholder || 'Pesquisar...';

                    this._buildCustomDOM();
                    this._bindEvents();
                    this.syncFromNative();
                }

                _buildCustomDOM() {
                    this.select.style.display = 'none';

                    this.wrapper = document.createElement('div');
                    this.wrapper.className = 'frame-select';
                    if (this.select.disabled) this.wrapper.classList.add('is-disabled');

                    this.trigger = document.createElement('div');
                    this.trigger.className = 'frame-select-trigger';
                    this.trigger.setAttribute('tabindex', '0');

                    this.valueContainer = document.createElement('div');
                    this.valueContainer.className = 'frame-select-value';

                    this.arrow = document.createElement('span');
                    this.arrow.className = 'frame-select-arrow';
                    this.arrow.innerHTML = '&#9662;';

                    this.trigger.appendChild(this.valueContainer);
                    this.trigger.appendChild(this.arrow);

                    this.dropdown = document.createElement('div');
                    this.dropdown.className = 'frame-select-dropdown';

                    this.searchWrap = document.createElement('div');
                    this.searchWrap.className = 'frame-select-search-wrap';
                    this.searchInput = document.createElement('input');
                    this.searchInput.type = 'text';
                    this.searchInput.className = 'frame-select-search-input';
                    this.searchInput.placeholder = this.searchPlaceholder;
                    this.searchWrap.innerHTML = '<i class="icon icon-search"></i>';
                    this.searchWrap.appendChild(this.searchInput);

                    this.optionsContainer = document.createElement('div');
                    this.optionsContainer.className = 'frame-select-options';

                    this.dropdown.appendChild(this.searchWrap);
                    this.dropdown.appendChild(this.optionsContainer);

                    this.wrapper.appendChild(this.trigger);
                    this.wrapper.appendChild(this.dropdown);

                    this.select.parentNode.insertBefore(this.wrapper, this.select.nextSibling);
                }

                _bindEvents() {
                    this.trigger.addEventListener('click', (e) => {
                        if (e.target.closest('.tag-close')) return;
                        this.toggle();
                    });

                    this.trigger.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            this.open();
                        }
                    });

                    this.searchInput.addEventListener('input', () => {
                        this._filterOptions(this.searchInput.value.trim().toLowerCase());
                    });

                    this.searchInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            this.close();
                            this.trigger.focus();
                        } else if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            this._navigateOptions(1);
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            this._navigateOptions(-1);
                        } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const highlighted = this.optionsContainer.querySelector('.frame-select-option.is-highlighted');
                            if (highlighted) {
                                highlighted.click();
                            }
                        }
                    });

                    document.addEventListener('click', (e) => {
                        if (!this.isOpen) return;
                        if (!this.wrapper.contains(e.target)) {
                            this.close();
                        }
                    });

                    this.select.addEventListener('change', () => {
                        this.syncFromNative();
                    });
                }

                _renderOptions() {
                    this.optionsContainer.innerHTML = '';
                    const children = Array.from(this.select.children);
                    let hasItems = false;

                    const renderOption = (opt) => {
                        hasItems = true;
                        const optDiv = document.createElement('div');
                        optDiv.className = 'frame-select-option';
                        optDiv.setAttribute('data-value', opt.value);
                        if (opt.selected) optDiv.classList.add('is-selected');
                        if (opt.disabled) optDiv.classList.add('is-disabled');

                        const iconHtml = opt.getAttribute('data-icon') ? `<i class="icon ${opt.getAttribute('data-icon')}"></i> ` : '';
                        const badgeHtml = opt.getAttribute('data-badge') ? ` <span class="badge badge-sm badge-subtle m-l-1">${opt.getAttribute('data-badge')}</span>` : '';

                        optDiv.innerHTML = `
                            <span class="option-label">${iconHtml}${opt.textContent}${badgeHtml}</span>
                            <span class="option-check">&#10003;</span>
                        `;

                        optDiv.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (opt.disabled) return;
                            this._selectOption(opt.value);
                        });

                        this.optionsContainer.appendChild(optDiv);
                    };

                    children.forEach(child => {
                        if (child.tagName === 'OPTGROUP') {
                            const groupLabel = document.createElement('div');
                            groupLabel.className = 'frame-select-group-label';
                            groupLabel.textContent = child.label;
                            this.optionsContainer.appendChild(groupLabel);

                            Array.from(child.children).forEach(opt => renderOption(opt));
                        } else if (child.tagName === 'OPTION') {
                            renderOption(child);
                        }
                    });

                    if (!hasItems) {
                        this.optionsContainer.innerHTML = '<div class="frame-select-empty">Nenhuma opção disponível</div>';
                    }
                }

                _filterOptions(query) {
                    const options = this.optionsContainer.querySelectorAll('.frame-select-option');
                    let visibleCount = 0;

                    options.forEach(opt => {
                        const text = opt.textContent.toLowerCase();
                        if (!query || text.includes(query)) {
                            opt.style.display = 'flex';
                            visibleCount++;
                        } else {
                            opt.style.display = 'none';
                        }
                        opt.classList.remove('is-highlighted');
                    });

                    this.optionsContainer.querySelectorAll('.frame-select-group-label').forEach(lbl => {
                        let next = lbl.nextElementSibling;
                        let anyVisible = false;
                        while (next && !next.classList.contains('frame-select-group-label')) {
                            if (next.style.display !== 'none') anyVisible = true;
                            next = next.nextElementSibling;
                        }
                        lbl.style.display = anyVisible ? 'block' : 'none';
                    });

                    let emptyMsg = this.optionsContainer.querySelector('.frame-select-empty');
                    if (visibleCount === 0) {
                        if (!emptyMsg) {
                            emptyMsg = document.createElement('div');
                            emptyMsg.className = 'frame-select-empty';
                            emptyMsg.textContent = 'Nenhum resultado encontrado';
                            this.optionsContainer.appendChild(emptyMsg);
                        }
                    } else if (emptyMsg) {
                        emptyMsg.remove();
                    }
                }

                _navigateOptions(direction) {
                    const visible = Array.from(this.optionsContainer.querySelectorAll('.frame-select-option')).filter(el => el.style.display !== 'none');
                    if (visible.length === 0) return;

                    let currentIdx = visible.findIndex(el => el.classList.contains('is-highlighted'));
                    if (currentIdx !== -1) visible[currentIdx].classList.remove('is-highlighted');

                    currentIdx += direction;
                    if (currentIdx < 0) currentIdx = visible.length - 1;
                    if (currentIdx >= visible.length) currentIdx = 0;

                    visible[currentIdx].classList.add('is-highlighted');
                    visible[currentIdx].scrollIntoView({ block: 'nearest' });
                }

                _selectOption(val) {
                    if (this.isMultiple) {
                        const opt = Array.from(this.select.options).find(o => o.value === val);
                        if (opt) {
                            opt.selected = !opt.selected;
                        }
                    } else {
                        this.select.value = val;
                        this.close();
                    }

                    this.select.dispatchEvent(new Event('change', { bubbles: true }));
                    this.syncFromNative();
                    if (this.isOpen) {
                        this._renderOptions();
                    }
                }

                syncFromNative() {
                    const selectedOpts = Array.from(this.select.selectedOptions);

                    if (this.isMultiple) {
                        if (selectedOpts.length === 0) {
                            this.valueContainer.innerHTML = `<span class="frame-select-placeholder">${this.placeholder}</span>`;
                        } else {
                            this.valueContainer.innerHTML = '';
                            const tagsWrap = document.createElement('div');
                            tagsWrap.className = 'frame-select-tags';

                            selectedOpts.forEach(opt => {
                                const tag = document.createElement('span');
                                tag.className = 'frame-select-tag';
                                tag.innerHTML = `
                                    <span>${opt.textContent}</span>
                                    <span class="tag-close" data-val="${opt.value}">&times;</span>
                                `;
                                tag.querySelector('.tag-close').addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    opt.selected = false;
                                    this.select.dispatchEvent(new Event('change', { bubbles: true }));
                                    this.syncFromNative();
                                    if (this.isOpen) this._renderOptions();
                                });
                                tagsWrap.appendChild(tag);
                            });

                            this.valueContainer.appendChild(tagsWrap);
                        }
                    } else {
                        const selected = selectedOpts[0];
                        if (selected && selected.value !== '') {
                            const iconHtml = selected.getAttribute('data-icon') ? `<i class="icon ${selected.getAttribute('data-icon')}"></i> ` : '';
                            this.valueContainer.innerHTML = `<span>${iconHtml}${selected.textContent}</span>`;
                        } else {
                            this.valueContainer.innerHTML = `<span class="frame-select-placeholder">${this.placeholder}</span>`;
                        }
                    }
                }

                open() {
                    this.isOpen = true;
                    this.trigger.classList.add('is-open');
                    this.dropdown.classList.add('is-open');
                    this.searchInput.value = '';
                    this._renderOptions();
                    setTimeout(() => this.searchInput.focus(), 40);
                }

                close() {
                    this.isOpen = false;
                    this.trigger.classList.remove('is-open');
                    this.dropdown.classList.remove('is-open');
                }

                toggle() {
                    if (this.isOpen) this.close();
                    else this.open();
                }

                destroy() {
                    this.wrapper.remove();
                    this.select.style.display = '';
                    delete this.select._frameSelect;
                }
            }

            return {
                create: (select, options) => new Instance(select, options),
                init: () => {
                    document.querySelectorAll('select[data-select-search]').forEach(sel => {
                        new Instance(sel);
                    });
                }
            };
        })()
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
        FramePER.Clipboard.init();
        FramePER.Form.init();
        FramePER.Counter.init();
        FramePER.Scroll.init();
        if (FramePER.Chart && FramePER.Chart.autoInit) {
            FramePER.Chart.autoInit();
        }
        if (FramePER.CommandPalette && FramePER.CommandPalette.init) {
            FramePER.CommandPalette.init();
        }
        if (FramePER.Datepicker && FramePER.Datepicker.init) {
            FramePER.Datepicker.init();
        }
        if (FramePER.Select && FramePER.Select.init) {
            FramePER.Select.init();
        }
        
        // Hide global page loader if exists
        const staticLoader = document.querySelector('.page-loader-overlay');
        if(staticLoader) {
            staticLoader.classList.remove('show');
            setTimeout(() => staticLoader.remove(), 300);
        }
    });

    // Expose globally
    window.FramePER = FramePER;
    window.FramePERChart = FramePER.Chart;

})(window, document);

