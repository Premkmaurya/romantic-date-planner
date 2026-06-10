import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Heart } from 'lucide-react';

export default function MealStep({ selectedMeal, setSelectedMeal, customMealText, setCustomMealText, handleMealSelect, handleMealContinue, handleBtnClick, getMealTitle, isSendingEmail, emailSendError }) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full max-w-lg glass-card rounded-3xl p-7 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500" />

      <div className="mx-auto w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center mb-4">
        <ChefHat className="text-rose-500" size={24} />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 dark:text-white mb-2 leading-tight">
        რა ვჭამოთ? 🍽️
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        აირჩიეთ თქვენი საყვარელი ტიპის საჭმელი.
      </p>

      <div className="grid grid-cols-2 gap-3.5 text-left mb-5">
        {[
          { id: 'pizza', icon: '🍕', desc: 'ჩიზი' },
          { id: 'burger', icon: '🍔', desc: 'კლასიკა' },
          { id: 'pasta', icon: '🍝', desc: 'იტალიური' },
          { id: 'sushi', icon: '🍣', desc: 'ფრეში' },
          { id: 'dessert', icon: '☕🍰', desc: 'ტკბილეული' },
          { id: 'custom', icon: '❓', desc: 'კასტომი' }
        ].map((item) => (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { handleBtnClick(); handleMealSelect(item.id); }}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 relative overflow-hidden transition-all cursor-pointer ${
              selectedMeal === item.id
              ? 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/25'
              : 'bg-white/45 dark:bg-gray-950/15 border-gray-200 dark:border-gray-800 hover:border-rose-400 hover:bg-rose-50/20'
            }`}
          >
            <span className="text-3xl mb-2">{item.icon}</span>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                {getMealTitle(item.id)}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {item.desc}
              </p>
            </div>

            {selectedMeal === item.id && (
              <span className="absolute top-3 right-3 text-rose-500 animate-pulse">
                <Heart className="fill-current" size={14} />
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {selectedMeal === 'custom' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
          <input
            type="text"
            required
            value={customMealText}
            onChange={(e) => setCustomMealText(e.target.value)}
            placeholder="რას გელით? (მაგ. მექსიკური ტაკოები 🌮)"
            className="w-full py-3.5 px-4 rounded-xl text-sm glass-input text-gray-900 dark:text-white font-medium"
            aria-label="Custom meal choice"
          />
        </motion.div>
      )}

      <button
        onClick={handleMealContinue}
        disabled={!selectedMeal || (selectedMeal === 'custom' && !customMealText.trim()) || isSendingEmail}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md hover:shadow-lg shadow-rose-500/20 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-800 dark:disabled:to-gray-950 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group text-base"
      >
        <span>{isSendingEmail ? 'Sending...' : 'გაგრძელება'}</span>
      </button>
      {emailSendError && (
        <p className="mt-3 text-sm text-red-500">{emailSendError}</p>
      )}
    </motion.div>
  );
}
