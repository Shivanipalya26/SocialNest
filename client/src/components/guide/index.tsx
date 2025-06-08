'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Home,
  ArrowLeft,
  CheckCircle,
  Rocket,
  LayoutDashboard,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { guideContent, navigationItems, tableOfContents } from '@/data/guide';

const GuidePage = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleSelectSection(id: string) {
    setActiveSection(id);
    setDrawerOpen(false);
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 pt-20">
      <div className="flex flex-col md:flex-row">
        <aside className="hidden md:block w-64 border-r border-slate-800 bg-slate-900/30 min-h-screen sticky top-16">
          <div className="p-6">
            <nav className="space-y-6">
              {navigationItems.map(section => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map(item => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-orange-500/10 text-orange-400 border-r-2 border-orange-400'
                                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/90 border-t border-slate-800">
          <button
            onClick={() => setDrawerOpen(open => !open)}
            className="w-full flex items-center justify-center gap-2 py-3 text-slate-300 hover:text-orange-400 transition-colors"
            aria-label="Toggle navigation drawer"
          >
            <BookOpen className="w-5 h-5" />
            <span>Navigation</span>
            {drawerOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-70 md:hidden"
            onClick={() => setDrawerOpen(false)}
          >
            <aside
              className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-6 max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <nav className="space-y-6">
                {navigationItems.map(section => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <ul className="space-y-1">
                      {section.items.map(item => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              onClick={() => handleSelectSection(item.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? 'bg-orange-500/10 text-orange-400 border-r-2 border-orange-400'
                                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 max-w-7xl">
          <div className="p-8">
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
              <Link href="/" className="hover:text-slate-100 flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-100">Guide</span>
            </nav>

            {activeSection === 'introduction' && (
              <section className="space-y-10">
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-3">
                    {guideContent.intro.title}
                  </h1>
                  <p className="text-lg text-slate-400">
                    Unified social media management — smarter, faster, and beautifully simple.
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg">
                  <p className="text-slate-300 leading-relaxed text-base">
                    {guideContent.intro.content}
                  </p>
                </div>

                <div className="space-y-6 text-slate-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500/10 p-2 rounded-md">
                      <Rocket className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-base">Launch in Minutes</h4>
                      <p className="text-sm text-slate-400">
                        Set up your workspace, connect accounts, and start publishing — in under 5
                        minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-500/10 p-2 rounded-md">
                      <LayoutDashboard className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-base">
                        All-in-One Dashboard
                      </h4>
                      <p className="text-sm text-slate-400">
                        Switch between accounts, schedule posts, and track performance — all from
                        one place.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500/10 p-2 rounded-md">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-base">AI-Powered Content</h4>
                      <p className="text-sm text-slate-400">
                        Generate post ideas, auto-fill hashtags, and schedule like a pro — all with
                        smart suggestions.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'features' && (
              <section className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-4">
                    {guideContent.features.title}
                  </h1>
                  <p className="text-xl text-slate-400">
                    Everything you need to manage your social media presence effectively.
                  </p>
                </div>

                <div className="grid gap-4">
                  {guideContent.features.content.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'quick-start' && (
              <section className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-4">Quick Start</h1>
                  <p className="text-xl text-slate-400">
                    Get up and running with SocialNest in minutes.
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Getting Started</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        1
                      </span>
                      <span className="text-slate-300">Create your SocialNest account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        2
                      </span>
                      <span className="text-slate-300">Connect your social media accounts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        3
                      </span>
                      <span className="text-slate-300">Create your first post</span>
                    </li>
                  </ol>
                </div>
              </section>
            )}

            {activeSection === 'scheduling' && (
              <section className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-4">
                    {guideContent.scheduling.title}
                  </h1>
                  <p className="text-xl text-slate-400">
                    Learn how to schedule your social media posts effectively.
                  </p>
                </div>

                <div className="space-y-6">
                  {guideContent.scheduling.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'tips' && (
              <section className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-4">
                    {guideContent.tips.title}
                  </h1>
                  <p className="text-xl text-slate-400">
                    Expert advice to maximize your social media impact.
                  </p>
                </div>

                <div className="grid gap-4">
                  {guideContent.tips.content.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'support' && (
              <section className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-4">
                    {guideContent.support.title}
                  </h1>
                  <p className="text-xl text-slate-400">Get help when you need it most.</p>
                </div>

                <div className="rounded-lg py-6">
                  <p className="text-slate-300 mb-4">{guideContent.support.content}</p>
                  <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="font-medium text-slate-100">Contact Support</p>
                      <a
                        href="mailto:support@socialnest.io"
                        className="text-orange-400 hover:text-orange-300 underline"
                      >
                        support@socialnest.io
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="flex items-center justify-between pt-12 mt-12 border-t border-slate-800">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="text-sm text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </main>

        <aside className="hidden md:block w-64 border-l border-slate-800 bg-slate-900/30 min-h-screen sticky top-16">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              On This Page
            </h3>
            <nav className="space-y-2">
              {tableOfContents.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`block w-full text-left px-3 py-1 text-sm rounded transition-colors ${
                    activeSection === item.id
                      ? 'text-orange-400 bg-orange-500/10'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-2">Question? Give us feedback</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-slate-400 border-slate-700 hover:bg-slate-800"
              >
                Edit this page
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GuidePage;
