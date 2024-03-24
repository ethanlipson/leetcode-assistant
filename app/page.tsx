'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [isTeacher, setIsTeacher] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function upload() {
    const input = document.querySelector('input')!;
    if (!input.files) return;

    const file = input.files[0];
    const text = await file.text();

    fetch('http://192.168.1.122:3001/upload_question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: text,
    });
  }

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
        {/* <div className="flex flex-col items-center justify-center text-lg">
          <Link href="Two_Sum">
            <h2>Get Started</h2>
          </Link>
        </div> */}
        <div className="flex flex-col items-center justify-center text-lg">
          <h2>Stats</h2>
        </div>
        <div className="flex flex-col items-center justify-center text-lg">
          <h2>Feedback</h2>
        </div>
      </div>
      <div className="flex flex-col p-12 grow-[8]">
        <div className="flex items-center justify-center text-5xl">
          <h2>Interview Assistant</h2>
        </div>
        <div className="flex items-center justify-center text-lg mt-4">
          <h2>
            An enhanced LeetCode environment with live AI feedback, emulating an
            interview situation
          </h2>
        </div>
        <div className="flex flex-row gap-4 items-center justify-center text-lg mt-4">
          {!isTeacher && (
            <>
              <Link href="/Two_Sum">
                <button className="p-4 bg-green-600 hover:bg-green-700 active:bg-green-800 mt-8 rounded text-white">
                  I'm a Student
                </button>
              </Link>
              <button
                className="p-4 bg-green-600 hover:bg-green-700 active:bg-green-800 mt-8 rounded text-white"
                onClick={() => setIsTeacher(true)}
              >
                I'm a Teacher
              </button>
            </>
          )}
        </div>
        <div style={{ display: isTeacher ? 'block' : 'none' }}>
          <div className="flex items-center justify-center text-lg mt-4">
            <h2>
              Please upload a problem statement and test cases for the student.
              See{' '}
              <a
                href="/example.json"
                download="example.json"
                className="underline text-green-600"
              >
                this example
              </a>{' '}
              for a template.
            </h2>
          </div>
          <div className="flex items-center justify-center mt-4">
            <input type="file" />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="p-4 bg-green-600 hover:bg-green-700 active:bg-green-800 mt-4 rounded text-white"
              onClick={() => upload()}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
