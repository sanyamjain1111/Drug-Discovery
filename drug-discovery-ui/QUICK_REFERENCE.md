# Quick Design System Reference

## Import Components

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, Textarea, Select } from '@/components/ui/Form'
import { Alert } from '@/components/ui/Alert'
```

## Common Patterns

### Hero Section
```tsx
<section className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 p-12 text-white">
  <h1 className="text-5xl font-bold mb-4">Title</h1>
  <p className="text-lg text-white/90 mb-8">Description</p>
  <Button size="lg" className="bg-white text-primary-600">Action</Button>
</section>
```

### Feature Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((f) => (
    <Card key={f.id} hover>
      <div className={`h-32 bg-gradient-to-br ${f.gradient}`} />
      <CardHeader>
        <CardTitle>{f.title}</CardTitle>
      </CardHeader>
      <CardContent>{f.desc}</CardContent>
    </Card>
  ))}
</div>
```

### Form Layout
```tsx
<Card>
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input label="Field" />
    <Textarea label="Message" />
    <Select label="Choose" options={opts} />
    <Button>Submit</Button>
  </CardContent>
</Card>
```

### Status Badge
```tsx
<div className="flex items-center gap-2">
  <span>Status:</span>
  <Badge variant={status === 'active' ? 'success' : 'warning'}>
    {status}
  </Badge>
</div>
```

### Data Table Row
```tsx
<Card className="p-4 flex justify-between items-center">
  <div>
    <h4 className="font-bold text-slate-900">Item Name</h4>
    <p className="text-sm text-slate-600">Item description</p>
  </div>
  <div className="flex gap-2">
    <Badge variant="primary">Active</Badge>
    <Button size="sm" variant="outline">Edit</Button>
  </div>
</Card>
```

## Color Usage Guide

| Color | Usage | Example |
|-------|-------|---------|
| Primary Blue | Main actions, links, focus states | Buttons, links, primary CTAs |
| Secondary Purple | Secondary actions, highlights | Secondary buttons, accents |
| Cyan | Data, interactive elements | Charts, highlights |
| Emerald | Success, positive states | Success badges, checkmarks |
| Rose | Errors, critical actions | Delete buttons, error states |
| Amber | Warnings, caution | Warning badges, alerts |
| Fuchsia | Special features, highlights | Featured items, promotions |
| Indigo | Secondary interactive | Secondary links, alternatives |

## Spacing Guide

```tsx
// Use Tailwind spacing classes
gap-2    // 8px gaps between items
p-4      // 16px padding
mb-8     // 32px margin bottom
py-6     // 24px vertical padding
```

## Text Styles

```tsx
<h1 className="text-5xl font-bold">Hero heading</h1>
<h2 className="text-3xl font-bold">Section heading</h2>
<h3 className="text-xl font-semibold">Card title</h3>
<p className="text-slate-600">Body text</p>
<span className="text-sm text-slate-500">Small text</span>
```

## Interactive States

### Hover Effects
```tsx
<Card className="hover:shadow-lg hover:border-primary-300">
<Button className="hover:brightness-110">
<Link className="hover:text-primary-600">
```

### Focus States
```tsx
className="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
```

### Disabled State
```tsx
<Button disabled>Disabled</Button>
<Input disabled />
```

### Loading State
```tsx
<Button isLoading>Processing...</Button>
```

## Responsive Design

```tsx
// Mobile first
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

## Common Utility Combinations

### Center Content
```tsx
<div className="flex items-center justify-center min-h-screen">
```

### Full Width Card
```tsx
<Card className="w-full">
```

### Gradient Text
```tsx
<h1 className="text-gradient">
  Gradient Text
</h1>
```

### With Icon
```tsx
<Button className="flex items-center gap-2">
  <Sparkles className="h-4 w-4" />
  Action
</Button>
```

## Dark Mode Support

```tsx
// Works automatically in dark mode
<Button className="bg-white text-primary-600">
// And light mode. Just works! ✨
```

## Animation Classes

```tsx
animate-pulse-glow    // Pulsing glow
animate-float         // Floating motion
skeleton              // Loading shimmer
```

## Shadow Classes

```tsx
shadow-md           // Medium shadow
shadow-lg           // Large shadow
shadow-neon-blue    // Blue glow
shadow-neon-purple  // Purple glow
shadow-glow         // Default glow
```

## Common Patterns by Feature

### Feature Showcase
```tsx
<section className="space-y-12">
  <h2 className="text-4xl font-bold">Features</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {items.map(item => (
      <Card key={item.id} hover>
        <CardContent className="space-y-4">
          <Icon className="h-12 w-12 text-primary-600" />
          <h3 className="font-bold text-slate-900">{item.title}</h3>
          <p className="text-slate-600 text-sm">{item.desc}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

### Stats Display
```tsx
<Card className="p-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {stats.map(stat => (
      <div key={stat.id}>
        <p className="text-3xl font-bold">{stat.value}</p>
        <p className="text-white/80 text-sm">{stat.label}</p>
      </div>
    ))}
  </div>
</Card>
```

### Action Card
```tsx
<Card className="p-8 border-2 border-dashed border-primary-300">
  <h3 className="text-lg font-bold mb-4">Call to Action</h3>
  <p className="text-slate-600 mb-6">Description here</p>
  <Button variant="primary">Take Action</Button>
</Card>
```

## Tips & Tricks

### Quick Gradient Background
```tsx
className="bg-gradient-to-r from-primary-500 to-secondary-500"
```

### Smooth Transition
```tsx
className="transition-all duration-300 ease-out"
```

### Professional Card Stack
```tsx
className="bg-white rounded-xl shadow-md hover:shadow-lg border border-slate-200 transition-all"
```

### Mobile-Friendly Button
```tsx
className="btn btn-lg md:btn-md sm:py-3 sm:px-4"
```

### Loading State
```tsx
<Button isLoading disabled>
  {isLoading ? 'Processing...' : 'Save'}
</Button>
```

## Accessibility Checklist

- [ ] All interactive elements have focus states
- [ ] Color is not the only way to convey information
- [ ] Text has sufficient contrast ratio (4.5:1)
- [ ] Buttons and links have descriptive text
- [ ] Form inputs have associated labels
- [ ] Images have alt text
- [ ] No flashing/strobing effects
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

## Performance Tips

1. Use CSS utilities instead of custom CSS
2. Keep animations under 300ms
3. Use `transform` and `opacity` for animations (GPU accelerated)
4. Lazy load heavy components
5. Minimize custom styles
6. Use dynamic classes wisely
7. Keep component props focused

## Browser Compatibility

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ iOS Safari 12+
✅ Chrome Android
❌ Internet Explorer

---

**Quick Tip:** Always check `DESIGN_SYSTEM.md` for detailed documentation and `UIShowcase.tsx` for live component examples!
