# 📐 Guidelines de Design e Desenvolvimento
## The Best Speaker 2025 - Simulação de Wireframes

---

## 🎨 Princípios de Design (UX/UI)

### Consistência Visual
- **Tipografia padronizada**: 
  - **Display**: Bruta Pro (títulos principais)
  - **Corpo**: Google Fonts Inter (pesos: 300, 400, 500, 600, 700, 800, 900)
- **Paleta de cores fixa**:
  - Primária: `#FF6B35` (Laranja TBS)
  - Secundária: `#F7931E` (Laranja claro)
  - Acento: `#FFD23F` (Dourado)
  - Sucesso: `#10b981` (Verde)
  - Erro: `#ef4444` (Vermelho)
  - Neutro: `#6b7280` (Cinza)
  - Fundo: `#FFFFFF` (Branco)
  - Texto: `#1A1A1A` (Preto)
- **Hierarquia clara**: 
  - Títulos: `clamp(2.5rem, 5vw, 4.5rem)` (responsivo)
  - Subtítulos: `1.25rem`
  - Corpo: `1.125rem`
  - Pequeno: `0.875rem`

### Clareza Acima de Tudo
- **Objetivo central por cenário**: Cada wireframe tem um propósito específico
- **Navegação intuitiva**: Seletor de cenários sempre visível no header
- **Feedback visual imediato**: Estados claros (concluído, atual, parado, bloqueado)
- **Sem elementos supérfluos**: Foco no conteúdo essencial

### Design Responsivo
- **Mobile-first**: Layout otimizado para telas pequenas
- **Breakpoints**:
  - Mobile: `max-width: 768px`
  - Tablet: `768px - 1024px`
  - Desktop: `min-width: 1024px`
- **Componentes fluidos**: Timeline, hero sections e formulários adaptáveis

### Acessibilidade
- **Contraste WCAG AA**: Mínimo 4.5:1 para texto normal
- **Navegação por teclado**: Todos os botões acessíveis via Tab
- **Textos alternativos**: Emojis com significado semântico
- **Estados de foco**: Visíveis e consistentes

---

## 🏗️ Princípios de Arquitetura

### Separação de Camadas
```
📁 Estrutura Atual:
├── index.html (Apresentação)
├── styles.css (Estilos)
├── script.js (Interatividade)
└── materiais/ (Assets)
```

### Componentização
- **Atomic Design aplicado**:
  - **Átomos**: Botões, ícones, inputs
  - **Moléculas**: Timeline items, form groups
  - **Organismos**: Header, hero sections, timeline completa
  - **Templates**: Cenários de wireframes
  - **Páginas**: Cenários específicos

### Escalabilidade
- **Módulos independentes**:
  - `scenario-selector`: Navegação entre cenários
  - `timeline-component`: Sistema de progresso
  - `hero-sections`: Conteúdo principal por cenário
  - `form-components`: Formulários de interação

### Segurança por Padrão
- **Validação de entrada**: Formulários com validação client-side
- **Sanitização**: Escape de caracteres especiais
- **HTTPS**: Sempre usar em produção

---

## 🔧 Boas Práticas de Desenvolvimento

### Código Limpo

#### CSS
```css
/* ✅ Bom: Nome descritivo e organização */
.timeline-item.completed .timeline-icon {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

/* ❌ Ruim: Nome genérico */
.icon {
    background: green;
}
```

#### JavaScript
```javascript
// ✅ Bom: Função pequena e descritiva
function createConfettiEffect(element) {
    const rect = element.getBoundingClientRect();
    // ... lógica específica
}

// ❌ Ruim: Função gigante e genérica
function doStuff() {
    // ... 100 linhas de código
}
```

### Estrutura de Arquivos
```
📁 Projeto/
├── 📄 index.html (Estrutura principal)
├── 📄 styles.css (Estilos organizados por seções)
├── 📄 script.js (Funcionalidades interativas)
├── 📁 materiais/
│   ├── 📁 BANCO DE IMAGENS/
│   ├── 📁 BANCO DE VÍDEOS/
│   └── 📁 MOCKUPS/
└── 📄 GUIDELINES.md (Este arquivo)
```

### Convenções de Nomenclatura

#### CSS Classes
```css
/* BEM Methodology */
.scenario-selector { }           /* Block */
.scenario-selector__button { }   /* Element */
.scenario-selector--active { }   /* Modifier */

/* Component-based */
.timeline-item { }
.timeline-item.completed { }
.timeline-icon { }
.hero-content { }
```

#### JavaScript Functions
```javascript
// camelCase para funções
function showScenario(scenarioId) { }
function createConfettiEffect(element) { }

// PascalCase para constantes
const SCENARIO_MAPPING = { };
```

### Organização do CSS
```css
/* 1. Reset e configurações base */
* { }
:root { }

/* 2. Layout principal */
.scenario-selector { }
.hero-timeline-container { }

/* 3. Componentes */
.timeline-item { }
.timeline-icon { }

/* 4. Estados e modificadores */
.timeline-item.completed { }
.timeline-item.current { }

/* 5. Animações */
@keyframes pulse { }

/* 6. Responsividade */
@media (max-width: 768px) { }
```

### Controle de Versão
```bash
# Commits descritivos
git commit -m "feat: add confetti effect to completed timeline items"
git commit -m "fix: remove ugly side borders from timeline items"
git commit -m "style: improve timeline visual hierarchy"

# Branches organizadas
main                    # Produção
develop                 # Desenvolvimento
feature/timeline-design # Nova funcionalidade
hotfix/confetti-bug    # Correção urgente
```

---

## 📱 Especificações Técnicas

### Performance
- **CSS otimizado**: Usar `transform` e `opacity` para animações
- **Imagens**: WebP quando possível, fallback para JPG/PNG
- **Fonts**: Preload das fontes Google
- **JavaScript**: Lazy loading para efeitos pesados

### Browser Support
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Fallbacks**: Graceful degradation para browsers antigos
- **Progressive enhancement**: Funcionalidade básica sempre disponível

### Métricas de Qualidade
- **Lighthouse Score**: >90 em todas as categorias
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Acessibilidade**: Score >95

---

## 🎯 Checklist de Desenvolvimento

### Antes de Commitar
- [ ] Código revisado e testado
- [ ] Responsividade verificada (mobile, tablet, desktop)
- [ ] Acessibilidade checada (contraste, navegação por teclado)
- [ ] Performance otimizada
- [ ] Commits descritivos e pequenos

### Antes de Deploy
- [ ] Todos os cenários funcionando
- [ ] Animações suaves e não intrusivas
- [ ] Imagens otimizadas
- [ ] CSS minificado (em produção)
- [ ] Testes em diferentes dispositivos

### Manutenção
- [ ] Documentação atualizada
- [ ] Dependências atualizadas
- [ ] Logs de erro monitorados
- [ ] Feedback de usuários coletado

---

## 🚀 Próximos Passos

1. **Implementar sistema de build** (Webpack/Vite)
2. **Adicionar testes automatizados** (Jest/Cypress)
3. **Configurar CI/CD** (GitHub Actions)
4. **Implementar analytics** (Google Analytics)
5. **Otimizar performance** (lazy loading, code splitting)

---

*Este documento deve ser atualizado conforme o projeto evolui. Última atualização: Dezembro 2024*
