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
import { Plus, X, Heart, Leaf as LeafIcon, Send, Trash2 } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  getDocFromServer 
} from 'firebase/firestore';
import { db } from './firebase';

interface Wish {
  id: string;
  text: string;
  sender: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
  createdAt: any;
}

const LEAF_COLORS = [
  'bg-leaf-green',
];

export default function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [input, setInput] = useState('');
  const [senderName, setSenderName] = useState('');
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  // Connection check
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Real-time fetch from Firestore
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishData: Wish[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Wish));
      setWishes(wishData);
    });

    return () => unsubscribe();
  }, []);

  const addWish = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !senderName.trim()) return;

    // Constrain leaves to branch areas
    const x = 35 + Math.random() * 30;
    const y = 35 + Math.random() * 35;
    
    try {
      await addDoc(collection(db, 'wishes'), {
        text: input,
        sender: senderName,
        x,
        y,
        rotate: Math.random() * 40 - 20,
        scale: 1,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        createdAt: serverTimestamp(),
      });
      setInput('');
      setSenderName('');
    } catch (error) {
      console.error("Error adding wish: ", error);
    }
  };

  const deleteWish = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lời cảm ơn này không?")) return;
    try {
      await deleteDoc(doc(db, 'wishes', id));
      setSelectedWish(null);
    } catch (error) {
      console.error("Error deleting wish: ", error);
    }
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
                className={`absolute w-12 h-12 flex items-center justify-center leaf-shape cursor-pointer bg-leaf-green`}
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
        <form onSubmit={addWish} className="artistic-input-bar !max-w-[700px] gap-4">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Tên của bạn..."
            className="w-32 bg-transparent border-r border-[#EAECEB] text-gray-600 placeholder-gray-300 italic text-base outline-none"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Viết lời cảm ơn tại đây..."
            className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder-gray-300 italic text-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || !senderName.trim()}
            className="artistic-btn disabled:opacity-50"
          >
            Gửi đi
          </button>
        </form>
      </div>

      {/* Selected Wish Popup */}
      <AnimatePresence>
        {selectedWish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWish(null)}
              className="absolute inset-0 bg-artistic-ink/40 backdrop-blur-md pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="artistic-popup max-w-sm w-full pointer-events-auto relative z-10 text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-leaf-green flex items-center justify-center shadow-inner`}>
                  <span className="text-xl">✨</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-artistic-brown opacity-70">Lời nhắn từ đồng nghiệp</span>
                  <div className="h-[1px] w-12 bg-artistic-brown/20 mx-auto" />
                </div>

                <p className="font-serif italic text-xl text-gray-800 leading-relaxed py-4 px-2">
                  "{selectedWish.text}"
                </p>

                <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-medium text-artistic-ink uppercase tracking-wider">
                      {selectedWish.sender}
                    </p>
                    <p className="text-[9px] opacity-40 uppercase tracking-[0.2em] mt-1">
                      Trân trọng cảm ơn
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => deleteWish(selectedWish.id)}
                    className="flex items-center justify-center gap-2 text-rose-400 hover:text-rose-500 transition-colors text-[10px] uppercase tracking-widest font-medium group"
                  >
                    <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    Xóa lời nhắn này
                  </button>
                </div>

                <button 
                  onClick={() => setSelectedWish(null)}
                  className="mt-4 px-8 py-2 text-[10px] uppercase tracking-[0.2em] bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

