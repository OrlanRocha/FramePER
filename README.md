# Frame PER

![NPM Version](https://img.shields.io/badge/version-2.8.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frame PER** é um **UI Framework** (CSS & JS) moderno, elegante, ultraleve e responsivo desenvolvido com SCSS modular e Vanilla JS sem nenhuma dependência externa. Combina design minimalista de alto padrão (Dribbble/Apple/Vercel) com utilitários flexíveis, modo escuro nativo, **Datepicker nativo (Data única & Range)**, **Select pesquisável com Multi-Select e chips**, **Tooltips direcionais em 4 posições**, **Command Palette (Ctrl+K)**, **Framework de Gráficos Vetoriais SVG com animações e modo misto**, biblioteca de **104 ícones vetoriais** Pure CSS e utilitários interativos de ponta.

---

## 🚀 Principais Recursos & Componentes

- **📅 Datepicker & Calendário Nativo (`FramePER.Datepicker`)**:
  - **Zero Dependências**: Calendário popover em puro JavaScript Vanilla e SCSS modular.
  - **Data Única & Intervalo (Range)**: Seleção de data única (`data-datepicker`) ou range contínuo (`data-datepicker="range"`) com realce no grid.
  - **Formatação Brasileira**: Padrão `DD/MM/AAAA`, atalhos de "Hoje", "Limpar", navegação de mês/ano e fechamento com `Escape` ou clique fora.
- **🔍 Dropdown Select Pesquisável (`FramePER.Select`)**:
  - **Filtro em Tempo Real**: Campo de pesquisa rápida com filtragem instantânea de opções.
  - **Multi-Select & Chips**: Suporte ao atributo `multiple` nativo com renderização de tags/chips interativas e remoção individual.
  - **Optgroups & Badges**: Suporte a grupos de opções, ícones e badges decorativas (`data-badge`).
- **💬 Tooltips Flutuantes Direcionais**:
  - **4 Posições**: Top (padrão), Bottom (`data-tooltip-pos="bottom"`), Left (`data-tooltip-pos="left"`), Right (`data-tooltip-pos="right"`).
  - **Variantes Semânticas**: Primary, Success, Danger, Warning e Light.
  - **Suporte Multilinha**: Quebra automática para mensagens explicativas longas (`data-tooltip-multiline="true"`).
- **📊 Framework de Gráficos SVG Nativo (`FramePER.Chart`)**:
  - **Zero Dependências**: Gráficos 100% vetoriais em puro SVG e Vanilla JS, infinitamente nítidos em telas Retina/HiDPI e com carga instantânea.
  - **✨ Animações Nativas de Entrada**: Traçado progressivo de curvas (`stroke-dashoffset`), crescimento fluido de barras a partir do eixo base (`scaleY`) e desvanecimento suave de áreas degradê.
  - **10 Modelos Suportados**:
    - **Gráfico Misto / Combo (`mixed`)**: Combinação flexível de barras agrupadas verticais com linhas/splines e pontos no mesmo gráfico.
    - **Área (`area`)**: Curvas bezier suaves com degradê vertical translúcido.
    - **Linha (`line`)**: Splines com pontos interativos, crosshair vertical e valores em tempo real.
    - **Colunas Verticais (`bar`)**: Barras agrupadas com cantos superiores arredondados e hover spotlight.
    - **Barras Horizontais (`horizontal-bar`)**: Rankings, canais e comparações com track de fundo.
    - **Rosca (`donut`)**: Anel com espessura customizável, texto no centro e cálculo automático de fatias.
    - **Pizza (`pie`)**: Distribuição percentual com hover highlight e tooltip.
    - **Velocímetro / Meta (`gauge`)**: Arco de progresso (180° a 220°) com limites e meta atingida.
    - **Radar / Teia (`radar`)**: Análise multi-eixos e matriz de competências.
    - **Mini-gráficos (`sparkline`)**: Gráficos compactos sem eixos para cartões de KPI e tabelas.
  - **Interatividade Total**: Tooltips flutuantes inteligentes, legendas clicáveis para alternar séries, adaptação automática ao Dark Mode e exportação direta para imagem **PNG (2x Retina)** e **SVG**.
  - **Inicialização Dupla**: Tanto programática via JS (`new FramePER.Chart('#id', config)`) quanto declarativa via HTML5 (`data-chart="area"` com `data-chart-data`).
- **🔍 Command Palette / Spotlight (`FramePER.CommandPalette`)**: Menu flutuante de busca global e execução de comandos acionado por atalho de teclado (`Ctrl+K` ou `Cmd+K`) ou botão declarativo `[data-command-palette]`, com navegação por teclado (`↑`, `↓`, `Enter`, `Esc`), categorias, badges e extensibilidade.
- **📱 Mobile First**: Layouts responsivos baseados em CSS Grid que se adaptam automaticamente a telas menores e expandem via breakpoints (`.grid-sm-*`, `.grid-md-*`, `.grid-lg-*`, `.grid-xl-*`).
- **🌙 Dark Mode & Light Mode Nativo**: Alternância automática de temas detectando a preferência do sistema operacional, com transições suaves e contraste otimizado.
- **🎨 Biblioteca de 104 Ícones Pure CSS**: Ícones SVG incorporados via máscara CSS (`-webkit-mask-image` / `mask-image`) com `currentColor`:
  - **Tecnologia, Computação & Redes (12)**: Processador/CPU (`icon-cpu`), Servidor rack (`icon-server`), Banco de dados (`icon-database`), Wi-Fi (`icon-wifi`), Nuvem (`icon-cloud`), Escudo (`icon-shield`), Bug/Depuração (`icon-bug`), Laptop (`icon-laptop`), Monitor (`icon-monitor`), Rede/Nodes (`icon-network`), Bluetooth (`icon-bluetooth`), Bateria com carga (`icon-battery`).
  - **Espaço & Cosmos (5)**: Foguete (`icon-rocket`), Planeta com anel (`icon-planet`), Satélite em órbita (`icon-satellite`), Telescópio (`icon-telescope`), Cometa (`icon-comet`).
  - **Animais & Pets (5)**: Pegada/Pata (`icon-paw`), Gato (`icon-cat`), Cachorro (`icon-dog`), Peixe (`icon-fish`), Pássaro (`icon-bird`).
  - **Atletismo, Esportes & Fitness (7)**: Troféu campeão (`icon-trophy`), Medalha de honra (`icon-medal`), Haltere/Musculação (`icon-dumbbell`), Frequência cardíaca/Atividade (`icon-activity`), Chama de calorias (`icon-flame`), Cronômetro de corrida (`icon-stopwatch`), Alvo/Precisão (`icon-target`).
  - **Jornalismo, Imprensa & Mídia (7)**: Jornal impresso (`icon-newspaper`), Artigo/Pauta (`icon-article`), Megafone/Divulgação (`icon-megaphone`), Câmera fotográfica (`icon-camera`), Microfone de reportagem (`icon-mic`), Rádio transmissor (`icon-radio`), Livro/Documento (`icon-book`).
  - **Beleza, Nail Design & Spa (22)**: Esmalte (`icon-nail-polish`), batom (`icon-lipstick`), tesoura (`icon-scissors`), brilho (`icon-sparkles`), pincel de maquiagem (`icon-makeup-brush`), pente (`icon-comb`), secador (`icon-hairdryer`), espelho (`icon-mirror`), perfume (`icon-perfume`), flor de lótus spa (`icon-lotus`), diamante (`icon-gem`), coroa (`icon-crown`), sérum hidratante (`icon-droplet`), pena (`icon-feather`), paleta de cores (`icon-palette`), creme facial (`icon-cream`), varinha de brilho (`icon-wand`), mão/manicure (`icon-hand`), flor floral (`icon-flower`), spray fixador (`icon-spray`), vela aromática (`icon-candle`), laço decorativo (`icon-ribbon`).
  - **E-Commerce & Vendas (5)**: Carrinho (`icon-cart`), etiqueta de preço (`icon-tag`), cartão de crédito (`icon-credit-card`), caixa/pacote (`icon-package`), caminhão de entrega (`icon-truck`).
  - **Comunicação, Mídia & Sistema (46)**: Mensagem, telefone, compartilhar, play, cadeado, olho, terminal, código, upload, download, etc.
- **✨ Componentes Avançados de Interface**:
  - **Command Palette Dialog**: Modal Spotlight com backdrop blur, atalhos de teclado e grupos filtráveis.
  - **Skeleton Loaders Shimmer**: Efeito ondulante suave (`.skeleton-avatar`, `.skeleton-title`, `.skeleton-text`, `.skeleton-rect`).
  - **Chips & Tags**: Pílulas compactas interativas, filtros clicáveis e tags removíveis (`.chip`, `.chip-clickable`, `.chip-remove`).
  - **Steppers de Progresso**: Guias em etapas responsivos para checkout e wizards (`.stepper`, `.step-done`, `.step-active`).
  - **Avatares com Status de Presença**: Indicadores visuais de presença (`.status-online`, `.status-busy`, `.status-away`, `.status-offline`).
- **🗂️ Side Modals & Drawers Laterais**: Modais flutuantes deslizantes (`.modal-side`, `.modal-side-right`, `.modal-side-left`, `.modal-bottom`).
- **📊 Tabelas Interativas Inteligentes**: Ordenação automática por colunas (`th.sortable`) e busca rápida em tempo real (`data-table-filter`).
- **🖥️ Demonstrativos Completos**:
  - **Gráficos Interativos (Charts Showcase)**: 10 modelos incluindo Gráfico Misto (Combo) com sandbox dinâmico e exportação PNG/SVG.
  - **SaaS Admin Dashboard Suite**: Visão Geral com mini sparklines nos KPIs, gráfico misto com seletor de períodos reativos (7D, 30D, 90D, 1A), Donut de pagamentos e Command Palette.
  - **Aura Beauty & Nails Studio**: Salão de estética, nail design e agendamento online com ícones temáticos.
  - **Rede Social Demo**: Feed com Stories, hashtags, reações e chat.
  - **Loja de Roupas & Moda (E-Commerce)**: Vitrine de produtos com sacola lateral deslizante interativa.

---

## ⚙️ Módulos & Recursos JavaScript (`window.FramePER`)

- **📅 FramePER.Datepicker**: Calendário flutuante em popover com seleção de data única e intervalo (range) `DD/MM/AAAA`.
- **🔍 FramePER.Select**: Select customizado pesquisável em tempo real com suporte a multi-select e tags/chips.
- **📈 FramePER.Chart**: Motor completo de gráficos vetoriais SVG com 10 tipos, animações nativas de entrada e exportação PNG/SVG.
- **🔍 FramePER.CommandPalette**: Spotlight flutuante com atalho `Ctrl+K` / `Cmd+K`, catálogo de páginas e ações rápidas extensíveis.
- **📋 FramePER.Clipboard**: Cópia para a área de transferência com um clique (`data-copy="texto"` ou `data-copy-target="#seletor"`).
- **📝 FramePER.Form**: Máscaras automáticas em tempo real para CPF, CNPJ, Telefone/Celular, CEP, Data e Moeda brasileira (`data-mask="cpf|cnpj|phone|cep|date|money"`).
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

