# FramePER-CSS

FramePER-CSS é um micro framework de utilitários que reúne classes CSS reutilizáveis para acelerar o desenvolvimento de interfaces web consistentes. Ele concentra estilos base para tipografia, cores, espaçamento e componentes comuns, permitindo combinar utilitários de acordo com a necessidade de cada projeto.

## Estrutura do projeto

```
.
├── ANALISE.md        # Avaliação detalhada dos utilitários disponíveis
├── README.md         # Este guia
└── css/
    └── framePERCSS.css
```

## Como começar

1. Faça o download deste repositório ou instale os arquivos através de seu gerenciador preferido.
2. Importe o arquivo `css/framePERCSS.css` na página HTML:

```html
<link rel="stylesheet" href="css/framePERCSS.css" />
```

3. Aplique as classes utilitárias diretamente nos elementos para compor layouts e componentes sem escrever regras adicionais.

## Paleta de cores

As cores são expostas via variáveis CSS e podem ser sobrescritas conforme necessário:

| Variável     | Valor RGBA             | Uso sugerido             |
|--------------|------------------------|--------------------------|
| `--black`    | rgba(75, 75, 75, 1.0)  | Texto contrastante       |
| `--blue`     | rgba(50, 150, 225, 1.0)| Estados primários        |
| `--yellow`   | rgba(255, 225, 50, 1.0)| Destaques e alertas      |
| `--green`    | rgba(50, 175, 75, 1.0) | Sucesso                  |
| `--white`    | rgba(255, 255, 255, 1.0)| Fundos neutros          |
| `--red`      | rgba(200, 75, 75, 1.0) | Erros ou avisos          |
| `--orange`   | rgba(255, 165, 0, 1.0) | Chamada para ação        |
| `--grey`     | rgba(180, 180, 180, 1.0)| Bordas e separadores    |
| `--texto`    | rgba(80, 80, 80, 1.0)  | Tipografia padrão        |

Classes utilitárias como `.bg-blue`, `.white`, `.b-red` e `.bg-yelow` facilitam aplicar essas cores a fundos, textos e bordas. *Observação:* as classes relacionadas a "yellow" utilizam a variável `--yelow`; ajuste o nome da variável ou sobrescreva o valor caso deseje consistência com `--yellow`.

## Principais utilitários

- **Reset e elementos básicos:** normalização de `box-sizing`, estilização de listas, botões, inputs e barras de rolagem.
- **Tipografia:** classes `.h1` a `.h5` para títulos em diferentes tamanhos, `.p` para parágrafos e utilitários de cor para texto.
- **Layout:** `.container` com largura responsiva, grids flexíveis, controle de overflow e classes de posicionamento (`.p-relative`, `.p-absolute`, `.p-fixed`).
- **Espaçamento e bordas:** utilitários de padding, margin, borda (`.b-*`) e raio (`.r-*`, `.r-circle`).
- **Componentes:** `.btn` para botões, variações de foco/ativo, tabelas com estilos prontos e classes para inputs (`.input`).

## Exemplo de uso

```html
<section class="container bg-blue white r-2 p-3">
  <h1 class="h2">Comece com FramePER-CSS</h1>
  <p class="p">
    Combine utilitários de cor, espaçamento e tipografia para criar componentes rapidamente.
  </p>
  <button class="btn bg-white blue r-2">Chamada para ação</button>
</section>
```

## Análises e roadmap

O arquivo [ANALISE.md](ANALISE.md) apresenta uma visão crítica sobre pontos fortes, oportunidades de melhoria e sugestões de evolução para o framework.

## Licença

Este projeto está licenciado sob os termos da licença MIT. Consulte o arquivo [LICENSE.md](LICENSE.md) para mais informações.
