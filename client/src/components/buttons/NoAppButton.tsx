'use client';

import React from 'react';
import { GlowingButton } from './GlowingButton';

export default function NoAppButton() {
  return (
    <div className="select-none h-96 w-full flex items-center justify-center">
      <p className="font-ClashDisplayMedium bg-neutral-400/10 rounded-2xl space-x-4 leading-none border border-secondary pl-3 pr-2 py-2 md:text-sm text-xs text-neutral-400">
        <span className="">No Connected Apps Available</span>
        <GlowingButton href="/dashboard" color="emerald">
          Connect App?
        </GlowingButton>
      </p>
    </div>
  );
}
