"use client";

import { AnimatedCard } from "@/components/ui/AnimatedSection";
import { ArrowLeft, CheckCircle2, Terminal, Play, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CourseViewerPage() {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-[var(--color-navy)] font-bold flex items-center gap-2 hover:underline">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <div className="bg-[var(--color-navy)] text-white px-4 py-2 rounded-full font-bold text-sm comic-border border-[2px]">
          Module 1 of 5
        </div>
      </div>

      <div className="bg-[#E5F9E0] comic-border rounded-2xl p-8 border-[4px]">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[var(--color-navy)] flex items-center gap-4">
          <Terminal size={40} /> Neural Networks 101
        </h1>
        <p className="text-xl font-bold text-gray-700">Learn how we train AI models using data sets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lesson Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatedCard className="comic-card bg-white p-8 border-[4px] space-y-6">
            <h2 className="text-2xl font-black">1. What is a Perceptron?</h2>
            <p className="text-lg font-medium text-gray-700 leading-relaxed">
              A perceptron is like a tiny digital brain cell. Just like your brain cells fire signals to each other to help you think, a perceptron takes in "inputs" (like numbers), does some quick math, and spits out an "output" (like a decision).
            </p>
            
            <div className="bg-[#FFF3B0] p-6 rounded-xl border-[3px] border-[var(--color-navy)] font-mono text-sm font-bold text-gray-800 shadow-inner">
              {'// A simple perceptron in pseudocode'}<br/>
              {'function decide(inputs, weights) {'}<br/>
              &nbsp;&nbsp;{'let sum = 0;'}<br/>
              &nbsp;&nbsp;{'for(i in inputs) {'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;{'sum += inputs[i] * weights[i];'}<br/>
              &nbsp;&nbsp;{'}'}<br/>
              &nbsp;&nbsp;{'return sum > threshold ? "YES" : "NO";'}<br/>
              {'}'}
            </div>

            <p className="text-lg font-medium text-gray-700 leading-relaxed">
              If the final number (the sum) is big enough, the perceptron fires! This is how an AI decides if a picture is a dog or a cat.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="comic-card bg-white p-8 border-[4px] flex flex-col items-center text-center space-y-4">
            <h3 className="text-2xl font-black">Ready to earn your XP?</h3>
            <p className="font-bold text-gray-500">Complete the quick quiz to finish this module.</p>
            
            {!completed ? (
              <button 
                onClick={() => setCompleted(true)}
                className="comic-button bg-[var(--color-primary)] text-xl py-3 px-8 flex items-center gap-3 mt-4"
              >
                <CheckCircle2 size={24} /> Complete Module (+150 XP)
              </button>
            ) : (
              <div className="bg-[#E5F9E0] text-green-800 border-[3px] border-green-600 font-black text-xl py-4 px-8 rounded-xl comic-border animate-bounce mt-4">
                🎉 +150 XP Earned! Great job!
              </div>
            )}
          </AnimatedCard>
        </div>

        {/* Sidebar Sidebar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight">Syllabus</h2>
          
          <div className="comic-card bg-white p-2 border-[4px]">
            <ul className="divide-y-2 divide-gray-100">
              <li className="p-4 bg-indigo-50 font-bold flex items-center gap-3 text-indigo-700">
                <PlayCircle size={20} className="fill-indigo-200" />
                1. What is a Perceptron?
              </li>
              <li className="p-4 font-bold flex items-center gap-3 text-gray-500 opacity-50">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                2. Weights and Biases
              </li>
              <li className="p-4 font-bold flex items-center gap-3 text-gray-500 opacity-50">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                3. The Activation Function
              </li>
              <li className="p-4 font-bold flex items-center gap-3 text-gray-500 opacity-50">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                4. Final Challenge
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
