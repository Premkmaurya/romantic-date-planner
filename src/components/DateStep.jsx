import React from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function DateStep({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, handleDateContinue, handleBtnClick }) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full max-w-md glass-card rounded-3xl p-7 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500" />

      <div className="mx-auto w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center mb-4">
        <Calendar className="text-rose-500" size={24} />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 dark:text-white mb-2 leading-tight">
        Planning our date ❤️
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Choose a suitable day and time.
      </p>

      <div className="space-y-5 text-left">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 pl-1">
            <Calendar size={16} className="text-rose-500" />
            <span>Choose date</span>
          </label>
          <div className="relative w-full flex justify-center">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => { handleBtnClick(); setSelectedDate(date); }}
              minDate={new Date()}
              inline
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 pl-1">
            <Clock size={16} className="text-rose-500" />
            <span>Choose time</span>
          </label>

          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              { time: '11:30', label: 'Brunch 🥐' },
              { time: '14:00', label: 'Coffee & Chill ☕' },
              { time: '18:00', label: 'Sunset Walk 🌅' },
              { time: '19:30', label: 'Romantic Dinner 🕯️' },
            ].map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => { handleBtnClick(); setSelectedTime(slot.time); }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  selectedTime === slot.time
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
                  : 'bg-white/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                {slot.label} ({slot.time})
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full py-3 px-4 rounded-xl text-sm glass-input text-gray-900 dark:text-white font-medium"
              aria-label="Custom date time picker"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleDateContinue}
        disabled={!selectedDate || !selectedTime}
        className="w-full mt-7 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md hover:shadow-lg shadow-rose-500/20 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-800 dark:disabled:to-gray-950 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group text-base"
      >
        <span>Continue</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
