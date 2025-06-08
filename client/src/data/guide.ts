import { BookOpen, Calendar, HelpCircle, Lightbulb, Sparkles, Zap } from 'lucide-react';

export const navigationItems = [
  {
    title: 'Get Started',
    items: [
      { id: 'introduction', label: 'Introduction', icon: BookOpen },
      { id: 'quick-start', label: 'Quick Start', icon: Zap },
    ],
  },
  {
    title: 'Core Features',
    items: [
      { id: 'features', label: 'Features', icon: Sparkles },
      { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { id: 'tips', label: 'Pro Tips', icon: Lightbulb },
      { id: 'support', label: 'Support', icon: HelpCircle },
    ],
  },
];

export const tableOfContents = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'features', label: 'Features' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'tips', label: 'Pro Tips' },
  { id: 'support', label: 'Support' },
];

export const guideContent = {
  intro: {
    title: 'Welcome to SocialNest',
    content:
      'SocialNest is your all-in-one social media management platform designed to streamline your content creation, scheduling, and analytics across multiple social networks.',
  },
  features: {
    title: 'Key Features',
    content: [
      'Multi-platform posting to Twitter, LinkedIn, Instagram, and Threads',
      'Advanced scheduling with optimal timing suggestions',
      'Real-time analytics and performance tracking',
      'AI-powered content suggestions and hashtag recommendations',
      'Enhance your captions and generate stunning images with AI assistance',
      'Content calendar with drag-and-drop functionality',
    ],
  },
  scheduling: {
    title: 'How to Schedule Posts',
    steps: [
      "Click the 'Create Post' button in your dashboard",
      'Write your content and add media files',
      'Select the social platforms you want to post to',
      'Choose your posting time or use our optimal timing feature',
      'Review your post preview for each platform',
      "Click 'Schedule' to add it to your content calendar",
    ],
  },
  tips: {
    title: 'Pro Tips',
    content: [
      'Use our analytics to identify your best-performing content types',
      "Schedule posts during your audience's most active hours",
      'Maintain consistent branding across all platforms',
      'Engage with your audience by responding to comments promptly',
      "Use relevant hashtags to increase your content's discoverability",
      'Plan your content calendar at least a week in advance',
    ],
  },
  support: {
    title: 'Need Help?',
    content: 'Our support team is here to help you succeed with SocialNest.',
  },
};
