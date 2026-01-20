import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap, Target, TestTube, Eye, Beaker, GitBranch, Atom, Rocket, CheckCircle } from 'lucide-react'

const features = [
  { 
    title: 'Target Prediction',
    to: '/feature1',
    desc: 'AI-powered biological target discovery',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  { 
    title: 'Molecule Design',
    to: '/molecule-input',
    desc: 'Design novel therapeutic compounds',
    icon: TestTube,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  },
  { 
    title: 'Property Screening',
    to: '/property-predictor',
    desc: 'Predict ADME & physicochemical properties',
    icon: Eye,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50'
  },
  { 
    title: 'ADMET Analysis',
    to: '/feature4',
    desc: 'Comprehensive drug-likeness assessment',
    icon: Beaker,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50'
  },
  { 
    title: '3D Visualizer',
    to: '/feature5',
    desc: 'Interactive 3D molecular visualization',
    icon: Atom,
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-50'
  },
  { 
    title: 'Drug Interactions',
    to: '/drug-interactions',
    desc: 'Analyze drug-drug safety profiles',
    icon: GitBranch,
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50'
  },
  { 
    title: 'AI Generator',
    to: '/drug-generator',
    desc: 'De novo molecule generation with GPT',
    icon: Sparkles,
    color: 'from-fuchsia-500 to-purple-500',
    bgColor: 'bg-fuchsia-50'
  },
  { 
    title: 'Docking Simulator',
    to: '/docking',
    desc: 'Protein-ligand binding prediction',
    icon: Atom,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50'
  },
  { 
    title: 'Retrosynthesis',
    to: '/retrosynthesis',
    desc: 'Plan synthesis routes intelligently',
    icon: GitBranch,
    color: 'from-lime-500 to-green-500',
    bgColor: 'bg-lime-50'
  },
]

const benefits = [
  'Accelerate drug discovery by 10x',
  'AI-powered molecular design',
  'Real-time property predictions',
  'Comprehensive ADMET analysis',
]

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-purple-600 to-cyan-500 opacity-90" />
          <div className="absolute inset-0 opacity-50">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>

          {/* Hero Content */}
          <div className="relative px-6 md:px-12 py-16 md:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-semibold text-white">Powered by Advanced AI & Chemistry</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Accelerate Drug Discovery with AI
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                A comprehensive platform combining artificial intelligence with computational chemistry to design, analyze, and optimize therapeutic candidates at unprecedented speed.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/drug-generator" className="btn btn-lg bg-white text-sky-600 hover:bg-slate-100 hover:shadow-xl font-bold flex items-center gap-2">
                  Start Discovering <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="btn btn-lg border-2 border-white text-white hover:bg-white/10 font-bold flex items-center gap-2">
                  <span>View Documentation</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Powerful Analysis Tools
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            Everything you need to design, analyze, and optimize drug candidates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Link
                key={feature.title}
                to={feature.to}
                className="group card hover:shadow-xl hover:border-sky-200 overflow-hidden"
              >
                <div className="relative overflow-hidden h-40 bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {feature.desc}
                  </p>
                  <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="rounded-2xl bg-gradient-to-r from-sky-600 to-purple-600 p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">10x</div>
            <div className="text-white/80 font-medium">Faster Discovery</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
            <div className="text-white/80 font-medium">Properties Predicted</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">1000s</div>
            <div className="text-white/80 font-medium">Candidates Analyzed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
            <div className="text-white/80 font-medium">Always Available</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative px-6 md:px-12 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Discover Your Next Drug?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join leading pharmaceutical researchers using AIDiscover to accelerate their drug discovery pipeline
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/drug-generator" className="btn btn-lg btn-primary-gradient flex items-center gap-2">
                Get Started Now <Rocket className="h-5 w-5" />
              </Link>
              <button className="btn btn-lg btn-outline">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}