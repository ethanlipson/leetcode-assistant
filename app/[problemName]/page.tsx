'use client';

import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
// const { highlight, languages } = require('prismjs/components/prism-core');
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type SubmissionResponse = {
  'Overall Success': boolean;
  'Test Results': {
    Error: string;
    'Test Case': string;
    Output: string;
    'Expected Output': string;
    Success: boolean;
  }[];
};

export default function IDE() {
  const params = useParams();

  const [code, setCode] =
    useState(`def twoSum(nums: list[int], target: int) -> list[int]:
  hashmap = {}
  for index, num in enumerate(nums):
      find = target - num
      if find in hashmap:
          return [hashmap[find], index]
      hashmap[num] = index`);
  const [problemStatement, setProblemStatement] = useState();
  const [gptAdvice, setGptAdvice] = useState(
    'Try starting with an O(n^3) algorithm and then optimizing it'
  );
  const [gptAdviceDisplayedLength, setGptAdviceDisplayedLength] = useState(0);
  const [submissionResponse, setSubmissionResponse] =
    useState<SubmissionResponse | null>(null);
  const [audioChunks, setAudioChunks] = useState([] as Blob[]);

  function testCode() {
    fetch('http://192.168.0.61:3001/test_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language: 'python3',
        problem: params.problemName,
      }),
    })
      .then(response => response.json())
      .then(data => setSubmissionResponse(data));
  }

  function submitCode() {
    const blob = new Blob(audioChunks, { type: 'audio/m4a' });

    // submit audio blob and code
    const formData = new FormData();
    formData.append('file', blob, 'audio.m4a');
    formData.append('code', code);

    fetch('http://192.168.0.61:3001/submit', {
      method: 'POST',
      body: formData,
    });
  }

  useEffect(() => {
    fetch(`http://192.168.0.61:3001/get_question_${params.problemName}`)
      .then(response => response.json())
      .then(data => setProblemStatement(data));

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = e => {
        setAudioChunks(chunks => [...chunks, e.data]);
      };
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetch('http://192.168.0.61:3001/cycle_help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: params.problemName,
          code,
        }),
      })
        .then(response => response.json())
        .then(data =>
          setGptAdvice(
            current => `${current}

${data.response}`
          )
        );
    }, 10000);
  }, [gptAdvice]);

  useEffect(() => {
    setTimeout(() => {
      if (gptAdviceDisplayedLength < gptAdvice.length) {
        setGptAdviceDisplayedLength(gptAdviceDisplayedLength =>
          Math.min(
            gptAdviceDisplayedLength + Math.floor(1 + Math.random() * 9),
            gptAdvice.length
          )
        );
      } else if (gptAdviceDisplayedLength > gptAdvice.length) {
        setGptAdviceDisplayedLength(gptAdvice.length);
      }
    }, Math.random() * 300);
  }, [gptAdvice, gptAdviceDisplayedLength]);

  const overallSuccess = submissionResponse?.['Overall Success'];
  const badTest = submissionResponse?.['Test Results'].find(
    test => !test.Success
  );

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
          <button
            className="h-full w-24 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded text-white"
            onClick={testCode}
          >
            Test
          </button>
          <button
            className="h-full w-24 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 rounded text-white"
            onClick={submitCode}
          >
            Submit
          </button>
          <div className="grow" />
          {overallSuccess === undefined ? undefined : overallSuccess ? (
            <div className="h-full w-24 text-green-600 flex items-center justify-center">
              Success!
            </div>
          ) : (
            <div className="h-full text-red-400 flex items-center justify-center">
              Error! On input&nbsp;
              <span className="text-black">{badTest!['Test Case']}</span>
              &nbsp;expected&nbsp;
              <span className="text-black">{badTest!['Expected Output']}</span>
              &nbsp;but got&nbsp;
              <span className="text-black">{badTest!.Output}</span>
            </div>
          )}
        </div>
      </div>
      <div className="grow-[2] basis-0">
        <p className="bg-white rounded p-4 h-full whitespace-pre-wrap">
          {gptAdvice.slice(0, gptAdviceDisplayedLength)}
        </p>
      </div>
    </main>
  );
}
