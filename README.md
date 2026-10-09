# Frame PER

![NPM Version](https://img.shields.io/badge/version-2.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frame PER** é um **UI Framework** (CSS & JS) moderno, elegante, ultraleve e responsivo desenvolvido com SCSS modular e Vanilla JS sem nenhuma dependência externa. Combina design minimalista de alto padrão (Dribbble/Apple/Vercel) com utilitários flexíveis, modo escuro nativo, componentes avançados de interface, biblioteca de 47 ícones vetoriais e utilitários interativos de ponta.

---

## 🚀 Principais Recursos & Componentes

- **📱 Mobile First**: Layouts responsivos baseados em CSS Grid que se adaptam automaticamente a telas menores e expandem via breakpoints (`.grid-sm-*`, `.grid-md-*`, `.grid-lg-*`, `.grid-xl-*`).
- **🌙 Dark Mode & Light Mode Nativo**: Alternância automática de temas detectando a preferência do sistema operacional, com transições suaves e contraste otimizado.
- **🎨 Biblioteca de 47 Ícones Pure CSS**: Ícones SVG incorporados via máscara CSS com `currentColor` (e-commerce, comunicação, arquivos, segurança, mídia, código e navegação), sem fontes externas pesadas.
- **✨ Novos Componentes de Interface**:
  - **Skeleton Loaders Shimmer**: Efeito ondulante suave (`.skeleton-avatar`, `.skeleton-title`, `.skeleton-text`, `.skeleton-rect`) para melhorar o carregamento percebido.
  - **Chips & Tags**: Pílulas compactas interativas, filtros clicáveis e tags removíveis (`.chip`, `.chip-clickable`, `.chip-remove`).
  - **Steppers de Progresso**: Guias em etapas responsivos para checkout e wizards (`.stepper`, `.step-done`, `.step-active`).
  - **Avatares com Status de Presença**: Indicadores visuais de presença (`.status-online`, `.status-busy`, `.status-away`, `.status-offline`) com anel protetor anti-conflito.
- **🗂️ Side Modals & Drawers Laterais**: Modais flutuantes deslizantes (`.modal-side`, `.modal-side-right`, `.modal-side-left`, `.modal-bottom`) ideais para sacolas de compras e filtros laterais.
- **📊 Tabelas Interativas Inteligentes**: Ordenação automática por colunas (`th.sortable`) de números, datas, moedas e strings, além de busca rápida em tempo real (`data-table-filter`).
- **🖥️ Demonstrativos Completos**:
  - **SaaS Admin Dashboard Suite**: Visão Geral, Usuários, Mensagens/Chat, Agendamentos e Configurações.
  - **Rede Social Demo**: Feed com Stories, posts com imagem, hashtags, reações e chat.
  - **Loja de Roupas & Moda (E-Commerce)**: Vitrine de produtos offline, galeria e sacola lateral deslizante interativa.

---

## ⚙️ Módulos & Recursos JavaScript (`window.FramePER`)

- **📋 FramePER.Clipboard**: Cópia para a área de transferência com um clique (`data-copy="texto"` ou `data-copy-target="#seletor"`) com notificação toast de sucesso.
- **📝 FramePER.Form**: Máscaras automáticas em tempo real para CPF, CNPJ, Telefone/Celular, CEP, Data e Moeda brasileira (`data-mask="cpf|cnpj|phone|cep|date|money"`), além de alternador de senha (`data-toggle="password"`).
- **🔢 FramePER.Counter**: Números animados com aceleração ease-out acionados via IntersectionObserver (`data-counter="14500"`).
- **🚀 FramePER.Scroll**: Botão flutuante automático de volta ao topo (`data-scroll-top`) e rolagem suave para âncoras (`data-scroll-to="#id"`).
- **🛡️ FramePER.Http & Security**: Fetch wrapper com detector de internet offline, CSRF token automático, sanitização anti-XSS (`FramePER.Security.escapeHTML`) e notificações toast (`FramePER.Notify`).

---

## 📦 Como Utilizar

Inclua os arquivos compilados `dist/framePER.min.css` e `dist/framePER.min.js` no seu HTML:

```html
<!-- No <head> do projeto -->
<link rel="stylesheet" href="dist/framePER.min.css">

<!-- Antes de fechar a tag </body> -->
<script src="dist/framePER.min.js"></script>
```

---

## 💡 Exemplos Rápidos de Uso

### Máscaras e Alternador de Senha
```html
<input type="text" class="input" data-mask="cpf" placeholder="000.000.000-00">
<input type="text" class="input" data-mask="money" placeholder="R$ 0,00">

<div class="input-icon">
  <input type="password" id="senha" class="input">
  <button type="button" data-toggle="password" data-target="#senha">
    <i class="icon icon-eye"></i>
  </button>
</div>
```

### Copiar para Clipboard
```html
<button class="btn btn-outline" data-copy="git clone https://github.com/OrlanRocha/FramePER-CSS.git">
  <i class="icon icon-copy"></i> Copiar Repositório
</button>
```

### Contadores Animados
```html
<span data-counter="14850" data-counter-prefix="R$ ">R$ 0</span>
<span data-counter="99.9" data-counter-suffix="%">0%</span>
```

### Botão Voltar ao Topo
```html
<button class="btn btn-primary btn-icon back-to-top-btn" data-scroll-top aria-label="Voltar ao topo">
  <i class="icon icon-arrow-up"></i>
</button>
```

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais detalhes.

