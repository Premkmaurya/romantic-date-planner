import React from "react";
import { motion } from "framer-motion";
import { Award, Clock, Download, Heart } from "lucide-react";

export default function CelebrationStep({
  countdown,
  selectedDate,
  selectedTime,
  selectedMeal,
  getMealEmoji,
  getMealTitle,
  handleDownloadCertificate,
}) {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500" />

      <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center mb-5 border border-rose-200">
        <Award className="text-rose-500 fill-rose-500/10" size={32} />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-rose-600 dark:text-rose-400 mb-2 leading-tight">
        🎉 მოლოცვები!
      </h1>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        თქვენ ოფიციალურად დათანხმდით შესახვედრებლად ❤️
      </h2>

      {!countdown.isPast && selectedDate && (
        <div className="mb-6 py-3 px-4 rounded-2xl bg-rose-500/5 dark:bg-rose-900/10 border border-rose-500/10 inline-flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-500/80 mb-1 flex items-center gap-1">
            <Clock size={10} />
            <span>გაკრონოლებითი დრო შეხვედრამდე</span>
          </span>
          <div className="flex gap-3 text-center">
            <div>
              <span className="font-extrabold text-lg text-rose-600 dark:text-rose-400">
                {countdown.days}
              </span>
              <span className="text-[9px] block text-gray-500">დღეები</span>
            </div>
            <span className="font-bold text-gray-400">:</span>
            <div>
              <span className="font-extrabold text-lg text-rose-600 dark:text-rose-400">
                {countdown.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-[9px] block text-gray-500">სთ</span>
            </div>
            <span className="font-bold text-gray-400">:</span>
            <div>
              <span className="font-extrabold text-lg text-rose-600 dark:text-rose-400">
                {countdown.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-[9px] block text-gray-500">წთ</span>
            </div>
            <span className="font-bold text-gray-400">:</span>
            <div>
              <span className="font-extrabold text-lg text-rose-600 dark:text-rose-400">
                {countdown.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-[9px] block text-gray-500">წმ</span>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card border border-rose-500/10 rounded-2xl p-5 mb-6 text-left space-y-4 shadow-sm bg-white/30 dark:bg-gray-950/20">
        <h3 className="font-extrabold text-sm uppercase tracking-wide text-rose-500/90 pl-0.5 flex items-center gap-1.5">
          <Heart size={14} className="fill-current" />
          <span>მონაცემების დეტალები</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-white/40 dark:bg-gray-950/30 border border-gray-100 dark:border-gray-900">
            <CalendarIcon />
            <div>
              <span className="text-[10px] text-gray-500 block font-medium">
                თარიღი
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {selectedDate
                  ? selectedDate.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "TBD"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-white/40 dark:bg-gray-950/30 border border-gray-100 dark:border-gray-900">
            <Clock size={18} className="text-rose-500 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-500 block font-medium">
                დრო
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {selectedTime || "საღამო"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-white/40 dark:bg-gray-950/30 border border-gray-100 dark:border-gray-900">
            <span className="text-xl shrink-0">
              {getMealEmoji(selectedMeal)}
            </span>
            <div>
              <span className="text-[10px] text-gray-500 block font-medium">
                არჩევანი
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[90px]">
                {selectedMeal === "custom"
                  ? typeof selectedMeal === "string"
                    ? selectedMeal
                    : "Custom"
                  : getMealTitle(selectedMeal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          onClick={handleDownloadCertificate}
          className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold bg-white/70 dark:bg-gray-950/30 hover:bg-rose-500/10 border border-rose-500/20 text-rose-500 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-sm active:scale-[0.98]"
        >
          <Download size={16} />
          <span>დააინსტალირეთ მოწვევა</span>
        </button>
      </div>

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 text-rose-500 font-serif font-extrabold text-lg block tracking-wide"
      >
        აღარ მღერია ❤️
      </motion.div>
    </motion.div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-rose-500 shrink-0"
    >
      <path
        d="M7 11H9"
        stroke="#BE123C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="#BE123C"
        strokeWidth="1.5"
      />
    </svg>
  );
}
