import React from 'react';
import { motion } from 'framer-motion';
import { User, Heart, ArrowRight } from 'lucide-react';

export default function NameEntry({ enteredName, setEnteredName, handleNameSubmit }) {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full max-w-md glass-card rounded-3xl p-8 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500" />

      <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center mb-6">
        <User className="text-rose-500" size={30} />
      </div>

      <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-2 leading-tight">
        შექმენით თარიღის შეთავაზება
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
        მოირგეთ ეს ინტერაქტიული მოთხოვნა ვინმესთვის სპეციალური, ან შეიყვანეთ სახელი საკუთარ გამოცდაზე!
      </p>

      <form onSubmit={handleNameSubmit} className="space-y-5">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
            <Heart size={18} className="fill-current" />
          </span>
          <input
            type="text"
            required
            value={enteredName}
            onChange={(e) => setEnteredName(e.target.value)}
            placeholder="მისი სახელი (მაგ. ჯულიეტა)"
            className="w-full py-3.5 pl-11 pr-4 rounded-xl text-base glass-input text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium"
            aria-label="Special someone's name"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md hover:shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group text-base"
        >
          <span>ჩაიყალეთ შეთავაზება</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
}
