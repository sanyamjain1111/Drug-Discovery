import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input, Textarea, Select } from '../../components/ui/Form'
import { Alert } from '../../components/ui/Alert'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'

export default function UIShowcase() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">
          UI Component Library
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl">
          A beautiful, colorful, and elegant component library for the AIDiscover platform
        </p>
      </div>

      {/* Colors Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Color Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Primary', color: 'from-primary-500 to-primary-600', hex: '#0ea5e9' },
            { name: 'Secondary', color: 'from-secondary-500 to-secondary-600', hex: '#8b5cf6' },
            { name: 'Accent Cyan', color: 'from-cyan-500 to-cyan-600', hex: '#06b6d4' },
            { name: 'Accent Emerald', color: 'from-emerald-500 to-emerald-600', hex: '#10b981' },
            { name: 'Accent Rose', color: 'from-rose-500 to-rose-600', hex: '#f43f5e' },
            { name: 'Accent Amber', color: 'from-amber-500 to-amber-600', hex: '#f59e0b' },
          ].map((c) => (
            <div key={c.name} className="space-y-3">
              <div className={`h-32 rounded-xl bg-gradient-to-br ${c.color} shadow-lg`} />
              <div>
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-sm text-slate-600">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Buttons</h2>
        <Card>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Sizes</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small Button</Button>
                  <Button size="md">Medium Button</Button>
                  <Button size="lg">Large Button</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Normal</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" isLoading>Loading...</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary-gradient" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Started
                  </Button>
                  <Button className="flex items-center gap-2">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card with header and content</CardDescription>
            </CardHeader>
            <CardContent>
              This is a default card with clean styling and smooth shadows
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription>Card with gradient background</CardDescription>
            </CardHeader>
            <CardContent>
              This card features a subtle gradient background for visual interest
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="primary">Learn More</Button>
            </CardFooter>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>Frosted glass morphism effect</CardDescription>
            </CardHeader>
            <CardContent>
              Modern glassmorphism design with backdrop blur
            </CardContent>
            <CardFooter>
              <Button size="sm">Explore</Button>
            </CardFooter>
          </Card>

          <Card variant="neon">
            <CardHeader>
              <CardTitle>Neon Card</CardTitle>
              <CardDescription>With glowing neon effect</CardDescription>
            </CardHeader>
            <CardContent>
              Cyberpunk-inspired design with neon glow effects
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="accent">Try It</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Badges Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Badges</h2>
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Sizes</h4>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge size="sm" variant="primary">Small</Badge>
                <Badge size="md" variant="secondary">Medium</Badge>
                <Badge size="lg" variant="success">Large</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Form Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Form Elements</h2>
        <Card>
          <CardContent className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              helperText="We'll never share your email"
            />

            <Input
              label="SMILES String"
              placeholder="CC(=O)O"
              error="Invalid SMILES format"
            />

            <Textarea
              label="Description"
              placeholder="Enter detailed description..."
              rows={4}
            />

            <Select
              label="Molecule Type"
              options={[
                { label: 'Small Molecule', value: 'small' },
                { label: 'Peptide', value: 'peptide' },
                { label: 'Protein', value: 'protein' },
              ]}
            />

            <div className="pt-4 border-t">
              <Button variant="primary">Submit Form</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alerts Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Alerts</h2>
        <div className="space-y-4">
          <Alert variant="info" title="Information">
            This is an informational message to guide the user
          </Alert>

          <Alert variant="success" title="Success!">
            Your molecule has been successfully validated and saved
          </Alert>

          <Alert variant="warning" title="Warning">
            This structure contains potential toxicophores
          </Alert>

          <Alert variant="error" title="Error" closeable>
            Failed to validate SMILES. Please check your input
          </Alert>
        </div>
      </section>

      {/* Gradient Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Gradient Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-xl bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-cyan/20 border border-primary-200/50">
            <h3 className="text-lg font-bold text-gradient mb-2">Text Gradient</h3>
            <p className="text-slate-700">
              Beautiful gradient text effect for emphasis and visual appeal
            </p>
          </div>

          <div className="p-8 rounded-xl border-gradient">
            <h3 className="font-bold mb-2 text-slate-900">Border Gradient</h3>
            <p className="text-slate-600">
              Stunning gradient border effect with smooth transitions
            </p>
          </div>

          <div className="p-8 rounded-xl glassmorphism">
            <h3 className="font-bold text-white mb-2">Glassmorphism</h3>
            <p className="text-white/80">
              Modern frosted glass effect with backdrop blur
            </p>
          </div>

          <div className="p-8 rounded-xl glow-effect border border-primary-200">
            <h3 className="font-bold text-slate-900 mb-2">Glow Effect</h3>
            <p className="text-slate-600">
              Beautiful glowing halo effect with smooth animation
            </p>
          </div>
        </div>
      </section>

      {/* Animation Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <div className="pulse-glow text-center">
                <Zap className="h-12 w-12 text-primary-600 mx-auto mb-2 animate-pulse-glow" />
                <p className="text-sm font-semibold text-slate-900">Pulse Glow</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-secondary-600 mx-auto mb-2 animate-float" />
                <p className="text-sm font-semibold text-slate-900">Float</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="h-12 w-12 skeleton rounded-full mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Shimmer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-cyan p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Use These Components?
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Import components from the UI library and build beautiful interfaces
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-100">
            View Source Code
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Read Documentation
          </Button>
        </div>
      </section>
    </div>
  )
}
