# Análise do projeto FramePER-CSS

Este documento resume observações feitas no arquivo [`css/framePERCSS.css`](css/framePERCSS.css) para facilitar futuras melhorias.

## Visão geral
- O arquivo define uma paleta de cores com variáveis CSS e uma coleção extensa de utilitários para botões, textos, espaçamentos, grades e efeitos visuais.
- Há forte foco em compatibilidade com navegadores legados (`-ms-grid`, `-webkit-`), mas várias regras podem ser modernizadas ou simplificadas.

## Pontos positivos
- Uso de variáveis em `:root` permite alterar rapidamente o tema.
- Conjunto abrangente de classes utilitárias cobre bordas, espaçamentos, cores e layout, útil para prototipagem rápida.
- Customizações de tabela, barra de rolagem e estados focados melhoram a experiência visual.

## Inconsistências e oportunidades de melhoria
1. **Inconsistência de nomes de variáveis:** As classes `.bg-yelow`, `.b-yelow` e `.yelow` usam `var(--yelow)`, porém a variável declarada é `--yellow`. Isso impede que essas classes exibam a cor esperada.
2. **Declarações duplicadas ou conflitantes:**
   - `.r-5`, `.r-r-5`, `.r-b-5` e `.r-l-5` aparecem duas vezes com valores diferentes.
   - O bloco `.m-` redefine `.m-3`, `.m-4`, `.m-5` com novos valores, sobrescrevendo os anteriores.
   - `.btn` aplica `border: none;` e em seguida `border: 1px solid transparent;`, e `scale: 0.9;` não é amplamente suportado; o mesmo acontece em `button .btn:focus`.
3. **Seletores possivelmente incorretos:** `button .btn` seleciona um elemento com classe `.btn` dentro de `button`, mas a intenção aparente era `button.btn`.
4. **Acessibilidade:** O reset define a mesma família de fonte para todo o documento (`font-family: Arial;`) e remove `outline` de vários elementos focáveis, o que pode prejudicar a navegação por teclado.
5. **Layout:** Definir `body, img { width: 100%; display: inline-block; }` pode causar comportamentos inesperados, especialmente para imagens.
6. **Redundância nas grids:** Existem dezenas de combinações de `.grid-*` que podem ser substituídas por utilitários mais escaláveis (por exemplo, `grid-template-columns: repeat(n, 1fr)` com variáveis CSS ou classes parametrizadas).

## Sugestões iniciais
- Corrigir a grafia da variável `--yellow` ou das classes que a referenciam.
- Remover duplicações e reorganizar utilitários repetidos para evitar sobrescritas acidentais.
- Revisar resets globais para preservar `outline` padrão ou oferecer alternativa com contraste suficiente.
- Modernizar as classes de grade usando CSS moderno (`grid-template-columns`, `gap`) e considerar o uso de funções `repeat()`.
- Adotar convenções de nomenclatura consistentes (ex.: `kebab-case` ou abreviações padronizadas) para facilitar a manutenção.

Esta análise fornece um ponto de partida para refatorar os estilos e melhorar a consistência do framework CSS.
