'use client';

import api from '@/lib/axios';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { AuroraText } from '../ui/aurora-text';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { SparklesText } from '../ui/sparkles-text';

interface AIAssistProps {
  onGenerate: (content: string) => void;
}

const AIAssist = ({ onGenerate }: AIAssistProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await api.post('/api/v1/generate/', {
        content: prompt,
      });

      if (response.data.error) {
        toast('Failed to generate content', {
          description: response.data.error,
        });
        setIsGenerating(false);
        return;
      }

      const generatedContent = response.data.caption;
      onGenerate(generatedContent);
      setIsGenerating(false);
      setPrompt('');
    } catch (error) {
      toast('Failed to generate content', {
        description: 'An unexpected error occurred.',
      });
      console.log(error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="rounded-3xl px-3 py-1 border-[1.2px] border-neutral-300 hover:text-neutral-200 transition duration-200 text-xs group flex items-center gap-2 hover:bg-neutral-600">
          <GeminiIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
          Generate
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl border-none bg-neutral-900">
        <AlertDialogHeader className="space-y-0">
          <AlertDialogTitle className="text-2xl">
            <AuroraText>Generate Caption</AuroraText> with AI
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Describe your caption idea and let AI generate it for you.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="relative bg-neutral-800 rounded-2xl border-4 border-neutral-700">
          <Textarea
            placeholder="Describe your magical content idea..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="md:text-lg pb-20  border-none shadow-none min-h-[120px] resize-none  rounded-2xl bg-secondary focus-visible:ring-0"
          />
          <div className="flex items-center justify-end p-3 w-full gap-2">
            <Button
              variant={'outline'}
              onClick={() => {
                setPrompt('');
                setIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="disabled:opacity-100"
            >
              {isGenerating ? (
                <SparklesText
                  className="text-sm font-light"
                  sparklesCount={5}
                  text="Generating..."
                />
              ) : (
                <>
                  <GeminiIcon className="h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AIAssist;

function GeminiIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="1em" height="1em" {...props}>
      <radialGradient
        id="gemini_gradient_1"
        cx="-670.437"
        cy="617.13"
        r=".041"
        gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#1ba1e3"></stop>
        <stop offset="0" stopColor="#1ba1e3"></stop>
        <stop offset=".3" stopColor="#5489d6"></stop>
        <stop offset=".545" stopColor="#9b72cb"></stop>
        <stop offset=".825" stopColor="#d96570"></stop>
        <stop offset="1" stopColor="#f49c46"></stop>
      </radialGradient>
      <path
        fill="url(#gemini_gradient_1)"
        d="M22.882,31.557l-1.757,4.024c-0.675,1.547-2.816,1.547-3.491,0l-1.757-4.024 c-1.564-3.581-4.378-6.432-7.888-7.99l-4.836-2.147c-1.538-0.682-1.538-2.919,0-3.602l4.685-2.08 c3.601-1.598,6.465-4.554,8.002-8.258l1.78-4.288c0.66-1.591,2.859-1.591,3.52,0l1.78,4.288c1.537,3.703,4.402,6.659,8.002,8.258 l4.685,2.08c1.538,0.682,1.538,2.919,0,3.602l-4.836,2.147C27.26,25.126,24.446,27.976,22.882,31.557z"
      ></path>
      <radialGradient
        id="gemini_gradient_2"
        cx="-670.437"
        cy="617.13"
        r=".041"
        gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#1ba1e3"></stop>
        <stop offset="0" stopColor="#1ba1e3"></stop>
        <stop offset=".3" stopColor="#5489d6"></stop>
        <stop offset=".545" stopColor="#9b72cb"></stop>
        <stop offset=".825" stopColor="#d96570"></stop>
        <stop offset="1" stopColor="#f49c46"></stop>
      </radialGradient>
      <path
        fill="url(#gemini_gradient_2)"
        d="M39.21,44.246l-0.494,1.132 c-0.362,0.829-1.51,0.829-1.871,0l-0.494-1.132c-0.881-2.019-2.467-3.627-4.447-4.506l-1.522-0.676 c-0.823-0.366-0.823-1.562,0-1.928l1.437-0.639c2.03-0.902,3.645-2.569,4.511-4.657l0.507-1.224c0.354-0.853,1.533-0.853,1.886,0 l0.507,1.224c0.866,2.088,2.481,3.755,4.511,4.657l1.437,0.639c0.823,0.366,0.823,1.562,0,1.928l-1.522,0.676 C41.677,40.619,40.091,42.227,39.21,44.246z"
      ></path>
    </svg>
  );
}
