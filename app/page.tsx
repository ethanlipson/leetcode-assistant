'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-svh flex flex-row bg-gray-200 text-sm">
      <div className="flex flex-col grow bg-white gap-8 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-lg">
          <Image
            src="https://unsplash.it/200/200"
            alt=""
            width={48}
            height={48}
            className="rounded-full"
          />
          <h2>Profile</h2>
        </div>
        <div className="flex flex-col items-center justify-center text-lg">
          <Link href="Two_Sum">
            <h2>Get Started</h2>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center text-lg">
          <h2>Stats</h2>
        </div>
        <div className="flex flex-col items-center justify-center text-lg">
          <h2>Feedback</h2>
        </div>
      </div>
      <div className="flex flex-col p-12 grow-[8]">
        <div className="flex items-center justify-center text-5xl">
          <h2>LeetCode Assistant</h2>
        </div>
        <div className="flex items-center justify-center text-lg mt-4">
          <h2>
            An enhanced LeetCode environment with live AI feedback, emulating an
            interview situation
          </h2>
        </div>
        <div className="flex items-center justify-center text-lg mt-4">
          <Link href="/Two_Sum">
            <button className="p-4 bg-green-600 hover:bg-green-700 active:bg-green-800 mt-8 rounded text-white">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
