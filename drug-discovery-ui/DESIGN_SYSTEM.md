# AIDiscover Design System

## Overview

A comprehensive, modern design system for the AIDiscover drug discovery platform. Built with Tailwind CSS, emphasizing beautiful gradients, smooth animations, and an elegant UI/UX experience.

## Color Palette

### Primary Colors
- **Primary Blue**: `#0ea5e9` (rgb-500)
- **Dark Blue**: `#0284c7` (rgb-600)
- **Secondary Purple**: `#8b5cf6` (rgb-500)
- **Dark Purple**: `#7c3aed` (rgb-600)

### Accent Colors
- **Cyan**: `#06b6d4` - Data visualization, interactive elements
- **Emerald**: `#10b981` - Success states, positive actions
- **Rose**: `#f43f5e` - Alerts, errors, warnings
- **Amber**: `#f59e0b` - Warnings, important actions
- **Fuchsia**: `#d946ef` - Highlights, featured elements
- **Indigo**: `#6366f1` - Secondary interactive elements

### Neutral Colors
- **Slate 50-900**: Full grayscale palette for text, borders, backgrounds

## Typography

### Headings
- **H1**: 48px (3rem) - Hero sections
- **H2**: 36px (2.25rem) - Section titles
- **H3**: 24px (1.5rem) - Subsections
- **H4**: 20px (1.25rem) - Card titles
- **H5**: 16px (1rem) - Small titles
- **H6**: 14px (0.875rem) - Labels

### Body Text
- **Large**: 18px (1.125rem) - Hero descriptions
- **Base**: 16px (1rem) - Default body text
- **Small**: 14px (0.875rem) - Secondary text, captions
- **Xs**: 12px (0.75rem) - Labels, badges, hints

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasis
- **Semibold**: 600 - Subheadings, strong emphasis
- **Bold**: 700 - Headings
- **Extrabold**: 800 - Hero headings

## Components

### Buttons

#### Primary Button
```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

#### Primary Gradient Button
```tsx
<button className="btn btn-primary-gradient">
  Start Discovering
</button>
```

#### Secondary Button
```tsx
<Button variant="secondary">
  Learn More
</Button>
```

#### Outline Button
```tsx
<Button variant="outline">
  Cancel
</Button>
```

#### Ghost Button
```tsx
<Button variant="ghost">
  View Details
</Button>
```

### Cards

#### Default Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

#### Gradient Card
```tsx
<Card variant="gradient">
  Gradient background with subtle design
</Card>
```

#### Glass Card
```tsx
<Card variant="glass">
  Frosted glass effect
</Card>
```

#### Neon Card
```tsx
<Card variant="neon">
  Glowing blue shadow effect
</Card>
```

### Badges

```tsx
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
```

### Form Elements

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email format"
  helperText="Must be a valid email address"
/>
```

#### Textarea
```tsx
<Textarea
  label="Description"
  placeholder="Enter description"
  rows={5}
/>
```

#### Select
```tsx
<Select
  label="Choose option"
  options={[
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ]}
/>
```

### Alerts

```tsx
<Alert variant="success" title="Success">
  Your changes have been saved successfully
</Alert>

<Alert variant="error" title="Error" closeable>
  Something went wrong. Please try again.
</Alert>

<Alert variant="warning" title="Warning">
  This action cannot be undone
</Alert>

<Alert variant="info">
  This is informational content
</Alert>
```

## Spacing Scale

- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## Border Radius Scale

- **sm**: 0.5rem (8px)
- **md**: 0.75rem (12px)
- **lg**: 1rem (16px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)

## Shadows

### Shadow Scale
- **sm**: Small, subtle shadow
- **md**: Medium shadow for elevated elements
- **lg**: Large shadow for modals/popovers
- **xl**: Extra large shadow for floating elements

### Glow Effects
- **glow**: Primary cyan glow effect
- **neon-blue**: Neon blue glow
- **neon-purple**: Neon purple glow
- **neon-pink**: Neon pink glow

## Animations

### Built-in Animations
- **pulse-glow**: Pulsing glow effect
- **float**: Floating motion animation
- **shimmer**: Shimmer loading effect

### Usage
```tsx
<div className="animate-pulse-glow">Glowing element</div>
<div className="animate-float">Floating element</div>
<div className="skeleton">Loading skeleton</div>
```

## Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-first Approach
```tsx
// Hidden on mobile, visible on md and up
<nav className="hidden md:flex">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Utility Classes

### Text Gradient
```tsx
<h1 className="text-gradient">
  Colorful text
</h1>
```

### Border Gradient
```tsx
<div className="border-gradient">
  Gradient border effect
</div>
```

### Glassmorphism
```tsx
<div className="glassmorphism">
  Frosted glass effect
</div>
```

### Glow Effect
```tsx
<div className="glow-effect">
  Glowing halo effect
</div>
```

### Flexbox Utilities
```tsx
<div className="flex-center">Center content</div>
<div className="flex-between">Space between</div>
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for body text)
- Focus states are clearly visible with ring indicators
- Error messages use clear color combinations

### Motion
- Respects `prefers-reduced-motion` for accessibility
- Smooth transitions without overstimulation

### Semantic HTML
- Proper heading hierarchy
- Form labels properly associated
- ARIA attributes where needed

## Dark Mode Support

The design system includes automatic dark mode support:

```tsx
// Automatically adjusts in dark mode
<button className="btn btn-primary">
  Works in both light and dark modes
</button>
```

## Usage Examples

### Hero Section
```tsx
<section className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 p-12">
  <h1 className="text-white text-5xl font-bold mb-6">
    Accelerate Discovery
  </h1>
  <p className="text-white/90 text-xl mb-8">
    Comprehensive drug discovery platform
  </p>
  <button className="btn btn-lg bg-white text-primary-600">
    Get Started
  </button>
</section>
```

### Feature Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature) => (
    <Card key={feature.id} variant="gradient">
      <CardHeader>
        <CardTitle>{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {feature.description}
      </CardContent>
    </Card>
  ))}
</div>
```

### Data Display Card
```tsx
<Card variant="glass" className="backdrop-blur-lg">
  <CardHeader>
    <CardTitle>Analytics</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>Molecules Analyzed</span>
        <Badge variant="primary">1,234</Badge>
      </div>
    </div>
  </CardContent>
</Card>
```

## Best Practices

1. **Consistency**: Use the same components across the app
2. **Hierarchy**: Maintain clear visual hierarchy with colors and sizes
3. **Whitespace**: Use spacing utilities for clean layouts
4. **Interactions**: Provide clear hover/focus states
5. **Performance**: Use CSS utilities instead of custom CSS
6. **Accessibility**: Always include labels and ARIA attributes
7. **Mobile First**: Design for mobile, enhance for larger screens
8. **Naming**: Use descriptive class names for clarity

## File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Form.tsx
│   │   ├── Alert.tsx
│   │   ├── Tooltip.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── TopNav.tsx
│   │   └── Sidebar.tsx
│   └── ...
├── styles/
│   └── index.css
├── tailwind.config.ts
└── ...
```

## Theme Extension

To extend the design system, modify `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Add new colors
        'custom': '#FF6B9D',
      },
      spacing: {
        // Add new spacing
        '18': '4.5rem',
      },
    },
  },
}
```

## Performance Considerations

- Uses Tailwind CSS for minimal bundle size
- Optimized animations with hardware acceleration
- Lazy-loaded components where applicable
- Responsive images and media queries
- Minimal custom CSS (mostly utilities)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android
- IE: Not supported

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
