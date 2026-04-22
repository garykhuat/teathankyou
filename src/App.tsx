/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Heart, Leaf as LeafIcon, Send } from 'lucide-react';

interface Wish {
  id: string;
  text: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
  createdAt: number;
}

const LEAF_COLORS = [
  'bg-leaf-pink',
  'bg-leaf-green',
  'bg-leaf-yellow',
  'bg-leaf-blue',
];

export default function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [input, setInput] = useState('');
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [isInputOpen, setIsInputOpen] = useState(false);

  // Initialize with some example wishes
  useEffect(() => {
    const initialWishes: Wish[] = [
      {
        id: '1',
        text: 'I am grateful for the quiet moments in the morning and the steam rising from my coffee.',
        x: 48,
        y: 40,
        rotate: 15,
        scale: 1,
        color: LEAF_COLORS[0],
        createdAt: Date.now(),
      },
      {
        id: '2',
        text: 'Grateful for the morning sun.',
        x: 55,
        y: 45,
        rotate: -10,
        scale: 0.9,
        color: LEAF_COLORS[1],
        createdAt: Date.now(),
      },
      {
        id: '3',
        text: 'Hope for a beautiful spring.',
        x: 42,
        y: 52,
        rotate: 25,
        scale: 1.1,
        color: LEAF_COLORS[2],
        createdAt: Date.now(),
      },
    ];
    setWishes(initialWishes);
  }, []);

  const addWish = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Constrain leaves to branch areas
    const x = 35 + Math.random() * 30;
    const y = 35 + Math.random() * 35;
    
    const newWish: Wish = {
      id: Math.random().toString(36).substring(7),
      text: input,
      x,
      y,
      rotate: Math.random() * 40 - 20,
      scale: 1,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      createdAt: Date.now(),
    };

    setWishes((prev) => [...prev, newWish]);
    setInput('');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col p-12 overflow-hidden selection:bg-artistic-brown/20 bg-artistic-bg">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="z-10 space-y-2"
      >
        <h1 className="text-6xl font-serif italic tracking-tight text-gray-800">Tea Thank You</h1>
        <p className="text-sm uppercase tracking-[0.2em] opacity-60">Khối Nguồn nhân lực</p>
      </motion.header>

      {/* The Tree & Leaves Container */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
        <div className="relative w-full max-w-4xl h-[70vh] mb-0 tree-container-artistic left-1/2 -translate-x-1/2">
          {/* Stylized Tree SVG */}
          <svg 
            viewBox="0 0 500 500" 
            className="w-full h-full pointer-events-none"
          >
            <path d="M250 480C250 480 250 350 250 300C250 250 210 200 180 180M250 300C250 300 300 240 330 210" stroke="#8D7D77" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M250 350C250 350 200 320 160 330M250 400C250 400 310 370 360 380" stroke="#8D7D77" strokeWidth="8" strokeLinecap="round" opacity="0.6" fill="none" />
            <circle cx="250" cy="500" r="80" fill="#EAECEB"/>
          </svg>

          {/* Leaves */}
          <div className="absolute inset-0 pointer-events-auto">
            {wishes.map((wish) => (
              <motion.button
                key={wish.id}
                id={`leaf-${wish.id}`}
                layoutId={`leaf-${wish.id}`}
                onClick={() => setSelectedWish(wish)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: wish.rotate }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className={`absolute w-12 h-12 flex items-center justify-center leaf-shape cursor-pointer ${wish.color}`}
                style={{ 
                  left: `${wish.x}%`, 
                  top: `${wish.y}%`,
                }}
              >
                <span className="text-[10px] opacity-40">✨</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full flex justify-center px-4">
        <form onSubmit={addWish} className="artistic-input-bar">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Viết lời cảm ơn tại đây..."
            className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder-gray-300 italic text-lg"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="artistic-btn disabled:opacity-50"
          >
            Gửi đi
          </button>
        </form>
      </div>

      {/* Selected Wish Popup */}
      <AnimatePresence>
        {selectedWish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:items-start sm:justify-end sm:pt-32 sm:pr-16 lg:pr-32 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWish(null)}
              className="absolute inset-0 bg-artistic-ink/5 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              layoutId={`leaf-${selectedWish.id}`}
              className="artistic-popup max-w-xs w-full pointer-events-auto"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${selectedWish.color} opacity-60`} />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Lời nhắn mới</span>
              </div>
              <p className="font-serif italic text-lg text-gray-700 leading-relaxed">
                "{selectedWish.text}"
              </p>
              <div className="mt-4 text-[11px] opacity-40 uppercase tracking-wider">
                Gửi từ đồng nghiệp
              </div>
              <button 
                onClick={() => setSelectedWish(null)}
                className="mt-6 w-full py-2 text-[10px] uppercase tracking-[0.2em] border-t border-gray-100 hover:text-artistic-brown transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

