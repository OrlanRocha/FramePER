# Frame PER

![NPM Version](https://img.shields.io/badge/version-2.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frame PER** é um **UI Framework** (CSS & JS) moderno, elegante, ultraleve e responsivo desenvolvido com SCSS modular e Vanilla JS sem dependências externas. Combina design minimalista inspirado em referências de alto padrão (Dribbble/Apple/Vercel) com utilitários flexíveis, modo escuro nativo, componentes avançados de interface e requisições HTTP seguras.

---

## 🚀 Principais Recursos & Componentes

- **📱 Mobile First**: Layouts responsivos baseados em CSS Grid que se adaptam automaticamente a telas menores e expandem via breakpoints (`.grid-sm-*`, `.grid-md-*`, `.grid-lg-*`, `.grid-xl-*`).
- **🌙 Dark Mode & Light Mode Nativo**: Alternância automática de temas detectando a preferência do sistema operacional, com transições suaves.
- **🗂️ Side Modals & Drawers Laterais**: Modais flutuantes deslizantes (`.modal-side`, `.modal-side-right`, `.modal-side-left`, `.modal-bottom`) ideais para carrinhos de compras, filtros laterais e painéis de notificação.
- **📊 Tabelas Interativas Inteligentes**: Suporte nativo para ordenação por colunas (`th.sortable`) com ordenação automática (texto, números e moedas) e busca rápida em tempo real (`data-table-filter`).
- **🖥️ Demonstrativos Completos**:
  - **SaaS Admin Dashboard Suite**: Páginas de Visão Geral, Usuários, Mensagens/Chat, Agendamentos e Configurações.
  - **Rede Social Demo**: Feed com Stories, publicações ricas, hashtags, recomendações e notificações.
  - **Loja de Roupas & Moda (E-Commerce)**: Vitrine de produtos com arte vetorial SVG offline, seletor de cores e sacola de compras deslizante.
- **⚡ Icons Vetoriais sem Dependências**: 20 ícones SVG incorporados via máscara CSS.
- **🛡️ Módulo HTTP & Segurança (Vanilla JS API)**: Fetch wrapper com detector de internet offline, CSRF token automático, prevenção de XSS e notificações não-bloqueantes (*Toasts*).

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

## 🗂️ Exemplo: Side Modal / Drawer Lateral

```html
<!-- Botão disparador -->
<button class="btn btn-primary" data-toggle="modal" data-target="#cartDrawer">Abrir Sacola</button>

<!-- Side Modal deslizante -->
<div id="cartDrawer" class="modal modal-side modal-side-right">
  <div class="modal-content stack gap-4">
    <div class="modal-header">
      <h3 class="modal-title">Sua Sacola</h3>
      <button class="modal-close" data-dismiss="modal">&times;</button>
    </div>
    <div class="modal-body">
      Conteúdo do painel lateral...
    </div>
  </div>
</div>
```

---

## 📊 Exemplo: Tabelas com Busca Rápida e Ordenação

```html
<!-- Campo de filtro em tempo real -->
<input type="text" class="input" data-table-filter="#tabelaClientes" placeholder="Buscar cliente...">

<!-- Tabela com colunas ordenáveis -->
<table id="tabelaClientes" class="table">
  <thead>
    <tr>
      <th class="sortable">Nome</th>
      <th class="sortable">Cargo</th>
      <th class="sortable">Faturamento</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ana Clara Silva</td>
      <td>Administrador</td>
      <td class="tabular">R$ 14.500</td>
    </tr>
  </tbody>
</table>
```

---

## 🧠 API JavaScript (`window.FramePER`)

```javascript
// Alternar Tema Claro / Escuro
FramePER.Theme.toggle();

// Disparar Notificações Toast
FramePER.Notify.success('Concluído', 'Suas alterações foram salvas!');
FramePER.Notify.error('Erro', 'Não foi possível conectar ao servidor.');

// Executar Requisições HTTP com CSRF & Notificações Automáticas
async function carregarDados() {
    const res = await FramePER.Http.get('/api/dados');
    if (res.ok) {
        console.log(res.data);
    }
}
```

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais detalhes.
