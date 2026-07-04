import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { motion as m } from 'framer-motion';

export default function ProposalStep({ name, handleProposalAccept, noBtnRef, isNoBtnMoved, noBtnPos, handleNoButtonEscape, tooltipText }) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full max-w-md glass-card rounded-3xl p-8 text-center relative"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 rounded-t-3xl" />

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mb-6 border border-rose-100/50 dark:border-rose-950/40"
      >
        <Heart className="text-rose-500 fill-rose-500" size={42} />
      </motion.div>

      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-gray-900 dark:text-white mb-3 tracking-wide leading-tight">
        Can you go on a date with Abhi? ❤️
      </h1>
      <p className="text-gray-600 dark:text-gray-400 font-medium mb-8">
        I have something special planned for us.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[60px]">
        <button
          onClick={handleProposalAccept}
          className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/20 hover:shadow-xl active:scale-[0.98] hover:scale-[1.03] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group text-base"
        >
          <Heart size={18} className="fill-current group-hover:scale-125 transition-transform" />
          <span>Yes ❤️</span>
        </button>

        <motion.button
          ref={noBtnRef}
          onTouchStart={(e) => { e.preventDefault(); handleNoButtonEscape(e); }}
          animate={isNoBtnMoved ? { x: noBtnPos.x, y: noBtnPos.y } : { x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className={`w-full sm:w-auto px-10 py-4 rounded-full font-bold transition-all duration-300 border focus:outline-none ${
            isNoBtnMoved
            ? 'fixed z-50 bg-white/90 dark:bg-gray-900/90 text-rose-500 border-rose-400/40 shadow-xl backdrop-blur-md px-6 py-2.5 text-sm'
            : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-base'
          }`}
          style={{ touchAction: 'none' }}
        >
          {isNoBtnMoved ? tooltipText : "No 😅"}
        </motion.button>
      </div>
    </motion.div>
  );
}
