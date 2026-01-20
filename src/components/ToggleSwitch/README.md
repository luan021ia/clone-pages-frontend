# ToggleSwitch Component

## Descrição

Componente Toggle Switch simples e funcional, construído com React e CSS puro, sem dependências externas.

## Funcionalidades

- ✅ Alterna entre estados "ligado" e "desligado"
- ✅ Design estilo celular (oval com bolinha deslizante)
- ✅ Cores personalizáveis para estados ligado/desligado
- ✅ Múltiplos tamanhos (small, medium, large)
- ✅ Estado disabled
- ✅ Acessibilidade (focus styles)
- ✅ Animações suaves

## Uso Básico

```jsx
import ToggleSwitch from './ToggleSwitch/ToggleSwitch';

function App() {
  const [enabled, setEnabled] = useState(false);

  return (
    <ToggleSwitch
      checked={enabled}
      onChange={setEnabled}
    />
  );
}
```

## Props

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|---------|-----------|
| `checked` | `boolean` | `false` | Estado atual do toggle |
| `onChange` | `function` | - | Callback quando estado muda `(checked) => void` |
| `disabled` | `boolean` | `false` | Desabilita o toggle |
| `size` | `string` | `'medium'` | Tamanho: `'small'`, `'medium'`, `'large'` |
| `colorOn` | `string` | `'#a855f7'` | Cor quando ligado |
| `colorOff` | `string` | `'#475569'` | Cor quando desligado |

## Exemplos de Uso

### Cores Personalizadas

```jsx
<ToggleSwitch
  checked={enabled}
  onChange={setEnabled}
  colorOn="#10b981"  // Verde
  colorOff="#ef4444"  // Vermelho
/>
```

### Diferentes Tamanhos

```jsx
<div>
  <ToggleSwitch size="small" checked={enabled} onChange={setEnabled} />
  <ToggleSwitch size="medium" checked={enabled} onChange={setEnabled} />
  <ToggleSwitch size="large" checked={enabled} onChange={setEnabled} />
</div>
```

### Estado Disabled

```jsx
<ToggleSwitch
  checked={enabled}
  onChange={setEnabled}
  disabled={true}
/>
```

## Estrutura dos Arquivos

```
ToggleSwitch/
├── ToggleSwitch.jsx    # Componente React
├── ToggleSwitch.css    # Estilos CSS
└── README.md          # Documentação
```

## CSS Classes

- `.toggle-switch` - Container principal
- `.toggle-switch__input` - Input escondido
- `.toggle-switch__slider` - Track do slider
- `.toggle-switch--small/medium/large` - Modificadores de tamanho
- `.toggle-switch--disabled` - Estado desabilitado

## Compatibilidade

- ✅ React 16+
- ✅ CSS moderno (CSS Variables)
- ✅ Todos os navegadores modernos
- ♿ Acessível (keyboard navigation, screen readers)

## Customização

As cores podem ser customizadas via props ou CSS variables:

```css
.toggle-switch__slider {
  --toggle-color-on: #your-color;
  --toggle-color-off: #your-color;
}
```