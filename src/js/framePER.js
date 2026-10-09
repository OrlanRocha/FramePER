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
        FramePER.Clipboard.init();
        FramePER.Form.init();
        FramePER.Counter.init();
        FramePER.Scroll.init();
        
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

