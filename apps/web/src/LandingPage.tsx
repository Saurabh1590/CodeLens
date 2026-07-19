import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  TrendingUp,
  Target,
  Shield,
  Download,
  X,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-extrabold text-slate-900">CodeLens</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#features" className="hidden sm:inline text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-150">
              Features
            </a>
            <a href="#privacy" className="hidden sm:inline text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-150">
              Privacy
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md transition-colors duration-150"
            >
              Install Extension
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Understand How You Code
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                AI-powered analytics for LeetCode. Identify your coding patterns, track progress, and get personalized coaching to level up your problem-solving skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-md transition-colors duration-150 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install Now
                </button>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm rounded-md transition-colors duration-150"
                >
                  View Demo
                </Link>
              </div>
            </div>
            {/* Dashboard Preview Image */}
            <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              <img
                src="/images/dashboard-preview.png"
                alt="CodeLens Dashboard Preview"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white border-b border-slate-200 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-4 text-center">
              Powerful Analytics
            </h3>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Get comprehensive insights into your coding performance with real-time tracking and intelligent analysis.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: 'Performance Tracking',
                  description:
                    'Monitor your improvement across 5+ metrics: planning time, implementation speed, debugging efficiency, and more.',
                },
                {
                  icon: Target,
                  title: 'AI-Powered Coaching',
                  description:
                    'Get personalized recommendations based on your actual coding patterns. Identify strengths and weaknesses.',
                },
                {
                  icon: Code2,
                  title: 'Session Replay',
                  description:
                    'Review your code changes step-by-step. See exactly where you went wrong and how you fixed it.',
                },
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-md flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">
              How It Works
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  num: '1',
                  title: 'Install Extension',
                  description: 'Add CodeLens to Chrome. Minimal permissions—only tracks LeetCode.',
                },
                {
                  num: '2',
                  title: 'Solve Problems',
                  description: 'Solve LeetCode problems as usual. Extension silently records your session.',
                },
                {
                  num: '3',
                  title: 'AI Analysis',
                  description: 'Session data is analyzed by AI to extract insights and patterns.',
                },
                {
                  num: '4',
                  title: 'Get Insights',
                  description: 'View detailed analytics and personalized recommendations on your dashboard.',
                },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white font-extrabold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                    {step.num}
                  </div>
                  <h4 className="font-extrabold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="bg-white border-b border-slate-200 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-6">Privacy First</h3>
                <p className="text-slate-600 mb-8">
                  Your data is yours. We never collect global browser history, and you can delete your sessions anytime. Code analysis is completely optional.
                </p>
                <ul className="space-y-3">
                  {[
                    'Only tracks supported platforms (LeetCode)',
                    'No global browser history collection',
                    'Data uploaded only after session completion',
                    'Delete sessions anytime from dashboard',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-8">
                <Shield className="w-16 h-16 text-emerald-600 mb-4" />
                <h4 className="font-extrabold text-emerald-900 mb-2">Secure & Transparent</h4>
                <p className="text-emerald-800 text-sm">
                  Built with privacy by design. Open source code audits available. Your data, your control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h3 className="text-4xl font-extrabold text-slate-900 mb-4">
              Ready to Level Up Your Coding?
            </h3>
            <p className="text-lg text-slate-600 mb-8">
              Join developers who are improving their problem-solving skills with data-driven insights.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors duration-150 inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download CodeLens Extension
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-slate-600 text-sm">
            <p>© 2026 CodeLens. Building tools for developers, by developers.</p>
          </div>
        </footer>
      </main>

      {/* Install Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-slate-900">Install CodeLens</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors duration-150"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Download Section */}
              <div>
                <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5 text-indigo-600" />
                  Step 1: Download Extension
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Download the CodeLens extension package to your computer.
                </p>
                <a
                  href="/CodeLens-Extension.zip"
                  download="CodeLens-Extension.zip"
                  className="block text-center w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-md transition-colors duration-150"
                >
                  Download CodeLens-Extension.zip
                </a>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-extrabold text-slate-900 mb-4">Step 2: Load in Chrome</h3>
                <ol className="space-y-3 text-sm text-slate-700">
                  {[
                    'Extract the downloaded ZIP file to a folder',
                    'Open Chrome and navigate to chrome://extensions/',
                    'Enable "Developer mode" (toggle in top-right)',
                    'Click "Load unpacked" button',
                    'Select the extracted extension folder',
                    'CodeLens extension should now be active ✓',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-extrabold text-indigo-600 w-6 flex-shrink-0">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-900">
                  <strong>What's next?</strong> Visit a LeetCode problem page to start tracking.
                  Your sessions are recorded locally—data is uploaded only when you complete a
                  session.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm rounded-md transition-colors duration-150"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}