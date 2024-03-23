'use client';

import Image from 'next/image';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
// const { highlight, languages } = require('prismjs/components/prism-core');
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import { useEffect, useState } from 'react';

export default function Home() {
  const [code, setCode] = useState(`for i in range(5):\n    print(i)`);
  const [problemStatement, setProblemStatement] = useState(
    'Implement a matrix multiplication algorithm running in O(n^2) time'
  );
  const [gptAdvice, setGptAdvice] = useState(
    'Try starting with an O(n^3) algorithm and then optimizing it'
  );
  const [gptAdviceDisplayedLength, setGptAdviceDisplayedLength] = useState(0);

  useEffect(() => {
    function revealAdvice() {
      if (gptAdviceDisplayedLength < gptAdvice.length) {
        setGptAdviceDisplayedLength(gptAdviceDisplayedLength =>
          Math.min(
            gptAdviceDisplayedLength + Math.floor(Math.random() * 10),
            gptAdvice.length
          )
        );
      } else if (gptAdviceDisplayedLength > gptAdvice.length) {
        setGptAdviceDisplayedLength(gptAdvice.length);
      }

      setTimeout(() => {
        revealAdvice();
      }, Math.random() * 300);
    }

    revealAdvice();
  }, []);

  useEffect(() => {
    fetch('http://192.168.1.122:3000/test_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language: 'python3' }),
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }, []);

  return (
    <main className="p-8 h-svh flex flex-row gap-4 bg-gray-200 text-sm">
      <div className="grow-[3] basis-0 flex flex-col gap-4">
        <div className="grow-[3] basis-0">
          <p>{problemStatement}</p>
        </div>
        <div className="grow-[12] basis-0">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.python)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              backgroundColor: 'white',
              fontSize: 12,
              height: '100%',
              borderRadius: '.25em',
            }}
          />
        </div>
        <div className="grow basis-0 flex flex-row gap-4">
          <button className="h-full w-24 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded text-white">
            Test
          </button>
          <button className="h-full w-24 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 rounded text-white">
            Submit
          </button>
          <div className="grow" />
          <button className="h-full w-24 text-red-400">Error!</button>
        </div>
      </div>
      <div className="grow-[2] basis-0">
        <p className="bg-white rounded p-4 h-full">
          {gptAdvice.slice(0, gptAdviceDisplayedLength)}
        </p>
      </div>
    </main>
  );
}
