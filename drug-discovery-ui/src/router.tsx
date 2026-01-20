import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './features/home/Home'
import React from 'react'
import MoleculeInputPage from './features/molecule-input/MoleculeInputPage'
import OpenAITestPage from './features/openai-test/OpenAITestPage'
import PropertyPredictorPage from './features/property-predictor/PropertyPredictorPage'
import DrugInteractionPage from './features/drug-interactions/DrugInteractionPage'
import DrugGeneratorPage from './features/drug-generator/DrugGeneratorPage'
import DockingPage from './features/docking/DockingPage'
import AdmetPage from './features/admet/AdmetPage'
import RetroPlannerPage from './features/retrosynthesis/RetroPlannerPage'
import HelpPage from './features/help/HelpPage'
import SettingsPage from './features/settings/SettingsPage'
import AboutPage from './features/about/AboutPage'
import ExampleWorkflows from './features/workflows/ExampleWorkflows'
import FAQPage from './features/help/FAQPage'
import GlossaryPage from './features/help/GlossaryPage'
import VideoTutorials from './features/help/VideoTutorials'
import RecorderGuide from './features/help/RecorderGuide'
import FeedbackForm from './features/help/FeedbackForm'

function PlaceholderView({ name }: { name: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
      <h1 className="text-xl font-semibold">{name}</h1>
      <p className="mt-2 text-slate-300">Feature coming soon.</p>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'molecule-input', element: <MoleculeInputPage /> },
      { path: 'property-predictor', element: <PropertyPredictorPage /> },
      { path: 'drug-interactions', element: <DrugInteractionPage /> },
      { path: 'drug-generator', element: <DrugGeneratorPage /> },
      { path: 'docking', element: <DockingPage /> },
      { path: 'admet', element: <AdmetPage /> },
      { path: 'retrosynthesis', element: <RetroPlannerPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'help/faq', element: <FAQPage /> },
      { path: 'help/glossary', element: <GlossaryPage /> },
      { path: 'help/tutorials', element: <VideoTutorials /> },
      { path: 'help/tutorials/recorder', element: <RecorderGuide /> },
      { path: 'help/feedback', element: <FeedbackForm /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'workflows', element: <ExampleWorkflows /> },
      { path: 'openai-test', element: <OpenAITestPage /> },
      { path: 'feature1', element: <PlaceholderView name="Target Prediction" /> },
      { path: 'feature2', element: <PlaceholderView name="Molecule Generation" /> },
      { path: 'feature3', element: <PlaceholderView name="Property Screening" /> },
      { path: 'feature4', element: <PlaceholderView name="ADMET" /> },
      { path: 'feature5', element: <PlaceholderView name="3D Visualizer" /> },
      { path: 'feature6', element: <PlaceholderView name="Datasets" /> },
      { path: 'feature7', element: <PlaceholderView name="Pipelines" /> },
    ],
  },
])
