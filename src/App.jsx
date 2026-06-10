import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import confetti from "canvas-confetti";
import { audio } from "./utils/AudioSystem";
import BackgroundParticles from "./components/BackgroundParticles";
import HeartCursorTrail from "./components/HeartCursorTrail";

import HeaderActions from "./components/HeaderActions";
import NameEntry from "./components/NameEntry";
import ProposalStep from "./components/ProposalStep";
import DateStep from "./components/DateStep";
import MealStep from "./components/MealStep";
import CelebrationStep from "./components/CelebrationStep";

export default function App() {
  // --- Personalized Name Loading ---
  const [name, setName] = useState(() => {
    const queryName = new URLSearchParams(window.location.search).get("name");
    if (queryName) return queryName;
    return localStorage.getItem("proposal_name") || "levikosh";
  });

  // --- Step Loading ---
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("proposal_step");
    if (savedStep) return parseInt(savedStep, 10);
    return 1;
  });

  // --- Form & Selections State ---
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem("proposal_date");
    return saved ? new Date(saved) : null;
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    return localStorage.getItem("proposal_time") || "";
  });
  const [selectedMeal, setSelectedMeal] = useState(() => {
    return localStorage.getItem("proposal_meal") || "";
  });
  const [customMealText, setCustomMealText] = useState(() => {
    return localStorage.getItem("proposal_custom_meal") || "";
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSendError, setEmailSendError] = useState("");


  // --- UI & Controls State ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("proposal_theme") || "dark";
  });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [enteredName, setEnteredName] = useState("");

  // --- Fleeing No Button State ---
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [isNoBtnMoved, setIsNoBtnMoved] = useState(false);
  const [tooltipText, setTooltipText] = useState("არა 😅");
  const noBtnRef = useRef(null);
  const originRef = useRef(null);

  const tooltips = [
    "ნამდვილად გინდა? 😏",
    "ცადე თავიდან 😆",
    "არა ასე სწრაფად ❤️",
    "მგონი 'კი' იგულისხმე 😄",
    "არა არჩევანი არ არის! 😜",
    "გიაზრე კარგად... 🥺",
    "შეცდომა: პარამეტრი გამორთულია! 🚫",
    "სწორედ დააჭირე 'კი'! 💖",
    "კარგი მცდელობა! 😂",
    "აჰ, მომხსნა! 🏃‍♂️",
  ];

  // --- Countdown Timer State ---
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  // --- Preloader States ---
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("მაგია იხარშება... ✨");

  // --- Preloader Progress Timer ---
  useEffect(() => {
    if (loadingProgress < 100) {
      const timer = setTimeout(() => {
        setLoadingProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 2; // Increment by 2-10%
          const capped = Math.min(next, 100);
          
          if (capped < 25) {
            setLoadingText("მაგია იხარშება... ✨");
          } else if (capped < 50) {
            setLoadingText("ვარსკვლავები სწორდება... 🌟");
          } else if (capped < 75) {
            setLoadingText("გულები ემზადება... 💖");
          } else if (capped < 100) {
            setLoadingText("სიყვარული იღვრება... ❤️");
          } else {
            setLoadingText("მზად არის! 💕");
          }
          return capped;
        });
      }, 70);
      return () => clearTimeout(timer);
    } else {
      const fadeTimer = setTimeout(() => {
        setLoading(false);
      }, 600);
      return () => clearTimeout(fadeTimer);
    }
  }, [loadingProgress]);

  // --- Sync State to LocalStorage ---
  useEffect(() => {
    localStorage.setItem("proposal_name", name);
    localStorage.setItem("proposal_step", step.toString());
    if (selectedDate)
      localStorage.setItem("proposal_date", selectedDate.toISOString());
    localStorage.setItem("proposal_time", selectedTime);
    localStorage.setItem("proposal_meal", selectedMeal);
    localStorage.setItem("proposal_custom_meal", customMealText);
  }, [name, step, selectedDate, selectedTime, selectedMeal, customMealText]);

  // --- Apply Theme Class ---
  useEffect(() => {
    localStorage.setItem("proposal_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // --- Celebrate Loop for Celebration Screen (Step 4) ---
  useEffect(() => {
    let interval;
    if (step === 4) {
      audio.playSuccess();
      const end = Date.now() + 1000;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      interval = setInterval(() => {
        if (Date.now() > end) {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#f43f5e", "#ec4899", "#d946ef"],
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#f43f5e", "#ec4899", "#d946ef"],
          });
        }
      }, 250);
    }
    return () => clearInterval(interval);
  }, [step]);

  // --- Proximity Detection for No Button ---
  useEffect(() => {
    if (step !== 1) return;

    const handleMouseMove = (e) => {
      if (!noBtnRef.current) return;

      const rect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - btnCenterX, 2) +
          Math.pow(e.clientY - btnCenterY, 2),
      );

      if (distance < 120) {
        handleNoButtonEscape(e);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [step, isNoBtnMoved, noBtnPos]);

  // --- Countdown Calculator ---
  useEffect(() => {
    if (step !== 4 || !selectedDate) return;

    const updateCountdown = () => {
      const target = new Date(selectedDate);
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(":").map(Number);
        target.setHours(hours, minutes, 0, 0);
      } else {
        target.setHours(19, 0, 0, 0);
      }

      const diff = target.getTime() - Date.now();

      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
      } else {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isPast: false,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [step, selectedDate, selectedTime]);

  // --- Audio Functions ---
  const handleMusicToggle = () => {
    if (musicPlaying) {
      audio.stopMusic();
      setMusicPlaying(false);
    } else {
      audio.startMusic();
      setMusicPlaying(true);
    }
  };

  const handleBtnClick = () => {
    audio.playClick();
  };

  // --- Fleeing No Button Logic ---
  const handleNoButtonEscape = (e) => {
    audio.playNoHover();

    const btnWidth = noBtnRef.current ? noBtnRef.current.offsetWidth : 120;
    const btnHeight = noBtnRef.current ? noBtnRef.current.offsetHeight : 45;

    const cardWidth = 440;
    const cardHeight = 400;
    const cardMinX = window.innerWidth / 2 - cardWidth / 2;
    const cardMaxX = window.innerWidth / 2 + cardWidth / 2;
    const cardMinY = window.innerHeight / 2 - cardHeight / 2;
    const cardMaxY = window.innerHeight / 2 + cardHeight / 2;

    if (!isNoBtnMoved) {
      setIsNoBtnMoved(true);
    }

    if (!originRef.current && noBtnRef.current) {
      const rect = noBtnRef.current.getBoundingClientRect();
      originRef.current = { x: rect.left, y: rect.top };
    }

    const originX = originRef.current
      ? originRef.current.x
      : window.innerWidth / 2 + 60;
    const originY = originRef.current
      ? originRef.current.y
      : window.innerHeight / 2 + 80;

    const currentX = noBtnPos.x;
    const currentY = noBtnPos.y;

    let nextX = currentX;
    let nextY = currentY;
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < 30) {
      const stepDelta = Math.random() * 70 + 100;
      const angle = Math.random() * 2 * Math.PI;
      const dx = Math.cos(angle) * stepDelta;
      const dy = Math.sin(angle) * stepDelta;

      const candX = currentX + dx;
      const candY = currentY + dy;

      const absX = originX + candX;
      const absY = originY + candY;

      const inViewport =
        absX >= 30 &&
        absX <= window.innerWidth - btnWidth - 30 &&
        absY >= 30 &&
        absY <= window.innerHeight - btnHeight - 30;

      const overlapsCard =
        absX > cardMinX - 10 &&
        absX < cardMaxX + 10 &&
        absY > cardMinY - 10 &&
        absY < cardMaxY + 10;

      if (inViewport && !overlapsCard) {
        nextX = candX;
        nextY = candY;
        isValid = true;
      }
      attempts++;
    }

    if (!isValid) {
      attempts = 0;
      while (!isValid && attempts < 20) {
        const stepDelta = Math.random() * 50 + 80;
        const angle = Math.random() * 2 * Math.PI;
        const dx = Math.cos(angle) * stepDelta;
        const dy = Math.sin(angle) * stepDelta;

        const candX = currentX + dx;
        const candY = currentY + dy;

        const absX = originX + candX;
        const absY = originY + candY;

        const inViewport =
          absX >= 30 &&
          absX <= window.innerWidth - btnWidth - 30 &&
          absY >= 30 &&
          absY <= window.innerHeight - btnHeight - 30;

        if (inViewport) {
          nextX = candX;
          nextY = candY;
          isValid = true;
        }
        attempts++;
      }
    }

    if (!isValid) {
      const randX = Math.random() * (window.innerWidth - btnWidth - 60) + 30;
      const randY = Math.random() * (window.innerHeight - btnHeight - 60) + 30;
      nextX = randX - originX;
      nextY = randY - originY;
    }

    setNoBtnPos({ x: nextX, y: nextY });

    const randomIndex = Math.floor(Math.random() * tooltips.length);
    setTooltipText(tooltips[randomIndex]);
  };

  // --- Step 1: Proposal Yes Click ---
  const handleProposalAccept = () => {
    audio.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setStep(2);
  };

  // --- Step 2: Date Selection Validation & Submit ---
  const handleDateContinue = () => {
    if (!selectedDate || !selectedTime) return;
    audio.playClick();
    setStep(3);
  };

  const getMealLabel = (mealType) => {
    if (mealType === "pizza") return "Pizza 🍕";
    if (mealType === "burger") return "Burgers 🍔";
    if (mealType === "pasta") return "Pasta 🍝";
    if (mealType === "sushi") return "Sushi 🍣";
    if (mealType === "dessert") return "Coffee & Desserts ☕🍰";
    return customMealText.trim() || "Custom Meal";
  };

  const sendMealSelectionEmail = async (mealType = selectedMeal) => {
    const mealLabel = getMealLabel(mealType);
   
    try {
      setIsSendingEmail(true);
      setEmailSendError("");

      const message = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: name || "Unknown",
          meal: mealLabel,
          date: selectedDate ? selectedDate.toLocaleDateString() : "TBD",
          time: selectedTime || "TBD",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      console.log(message)
      return true;
    } catch (error) {
      console.error("Meal email send failed:", error);
      setEmailSendError(error.message || "Unable to send email.");
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleMealSelect = async (mealType) => {
    setSelectedMeal(mealType);
    await sendMealSelectionEmail(mealType);
  };

  // --- Step 3: Meal Selection Validation & Submit ---
  const handleMealContinue = () => {
    if (!selectedMeal) return;
    if (selectedMeal === "custom" && !customMealText.trim()) return;

    audio.playClick();
    setStep(4);
  };

  // --- Generate SVG Certificate and Download ---
  const handleDownloadCertificate = () => {
    audio.playClick();
    const finalName = name || "Special Guest";
    const timeStr = selectedTime ? selectedTime : "Evening";

    let mealStr = "Special Date Meal";
    if (selectedMeal === "pizza") mealStr = "Pizza 🍕";
    else if (selectedMeal === "burger") mealStr = "Burgers 🍔";
    else if (selectedMeal === "pasta") mealStr = "Pasta 🍝";
    else if (selectedMeal === "sushi") mealStr = "Sushi 🍣";
    else if (selectedMeal === "dessert") mealStr = "Coffee & Desserts ☕🍰";
    else if (selectedMeal === "custom")
      mealStr = customMealText || "Custom Selection";

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff5f6" />
            <stop offset="100%" stop-color="#fae8ff" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f43f5e" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#f43f5e" flood-opacity="0.1" />
          </filter>
        </defs>

        <rect width="800" height="600" rx="30" fill="url(#bgGlow)" />
        <rect x="25" y="25" width="750" height="550" rx="20" fill="none" stroke="url(#accentGrad)" stroke-width="4" stroke-dasharray="10 5" opacity="0.4" />
        <rect x="35" y="35" width="730" height="530" rx="16" fill="white" opacity="0.6" filter="url(#shadow)" />

        <path d="M 60 120 C 60 70, 110 60, 120 100 C 130 60, 180 70, 180 120 C 180 170, 120 200, 120 200 C 120 200, 60 170, 60 120 Z" fill="#f43f5e" opacity="0.1" transform="scale(0.4) translate(100, 100)" />
        <path d="M 60 120 C 60 70, 110 60, 120 100 C 130 60, 180 70, 180 120 C 180 170, 120 200, 120 200 C 120 200, 60 170, 60 120 Z" fill="#f43f5e" opacity="0.1" transform="scale(0.4) translate(1680, 100)" />
        <path d="M 60 120 C 60 70, 110 60, 120 100 C 130 60, 180 70, 180 120 C 180 170, 120 200, 120 200 C 120 200, 60 170, 60 120 Z" fill="#f43f5e" opacity="0.1" transform="scale(0.4) translate(100, 1180)" />
        <path d="M 60 120 C 60 70, 110 60, 120 100 C 130 60, 180 70, 180 120 C 180 170, 120 200, 120 200 C 120 200, 60 170, 60 120 Z" fill="#f43f5e" opacity="0.1" transform="scale(0.4) translate(1680, 1180)" />

        <text x="400" y="110" font-family="'Playfair Display', serif" font-weight="bold" font-size="32" fill="#be123c" text-anchor="middle">Official Date Invitation</text>
        <line x1="300" y1="130" x2="500" y2="130" stroke="url(#accentGrad)" stroke-width="2" />
        
        <path d="M 400 210 C 400 190, 420 170, 440 170 C 460 170, 475 185, 475 205 C 475 225, 455 245, 400 280 C 345 245, 325 225, 325 205 C 325 185, 340 170, 360 170 C 380 170, 400 190, 400 210 Z" fill="url(#accentGrad)" filter="url(#shadow)" />
        <text x="400" y="222" font-family="'Outfit', sans-serif" font-weight="bold" font-size="28" fill="white" text-anchor="middle">✓</text>

        <text x="400" y="325" font-family="'Outfit', sans-serif" font-size="18" fill="#4b5563" text-anchor="middle">This certifies that the beautiful</text>
        <text x="400" y="365" font-family="'Playfair Display', serif" font-weight="bold" font-size="34" fill="#e11d48" text-anchor="middle">${finalName}</text>
        <text x="400" y="405" font-family="'Outfit', sans-serif" font-size="18" fill="#4b5563" text-anchor="middle">has officially agreed to accompany me on a special date.</text>

        <rect x="150" y="440" width="500" height="80" rx="15" fill="#fff1f2" stroke="#fecdd3" stroke-width="1" />
        
        <text x="230" y="475" font-family="'Outfit', sans-serif" font-weight="bold" font-size="14" fill="#be123c" text-anchor="middle">DATE</text>
        <text x="230" y="500" font-family="'Outfit', sans-serif" font-size="13" fill="#4b5563" text-anchor="middle">${selectedDate ? selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "TBD"}</text>

        <text x="400" y="475" font-family="'Outfit', sans-serif" font-weight="bold" font-size="14" fill="#be123c" text-anchor="middle">TIME</text>
        <text x="400" y="500" font-family="'Outfit', sans-serif" font-size="13" fill="#4b5563" text-anchor="middle">${timeStr}</text>

        <text x="570" y="475" font-family="'Outfit', sans-serif" font-weight="bold" font-size="14" fill="#be123c" text-anchor="middle">MEAL</text>
        <text x="570" y="500" font-family="'Outfit', sans-serif" font-size="13" fill="#4b5563" text-anchor="middle">${mealStr.replace(/[^\w\s\&\,\.\-\:\/]/g, "").trim() || "Food"}</text>

        <line x1="150" y1="560" x2="300" y2="560" stroke="#d1d5db" stroke-width="1" />
        <text x="225" y="575" font-family="'Outfit', sans-serif" font-size="11" fill="#9ca3af" text-anchor="middle">Signature of Proposal Maker</text>
        
        <line x1="500" y1="560" x2="650" y2="560" stroke="#d1d5db" stroke-width="1" />
        <text x="575" y="575" font-family="'Outfit', sans-serif" font-size="11" fill="#9ca3af" text-anchor="middle">Signature of ${finalName}</text>
      </svg>
    `;

    const blob = new Blob([svgContent], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `date_invitation_${finalName.toLowerCase().replace(/\s+/g, "_")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- Display Meal Icon based on type ---
  const getMealEmoji = (type) => {
    switch (type) {
      case "pizza":
        return "🍕";
      case "burger":
        return "🍔";
      case "pasta":
        return "🍝";
      case "sushi":
        return "🍣";
      case "dessert":
        return "☕🍰";
      default:
        return "🍽️";
    }
  };

  const getMealTitle = (type) => {
    switch (type) {
      case "pizza":
        return "Pizza Date";
      case "burger":
        return "Burger Joint";
      case "pasta":
        return "Fancy Italian";
      case "sushi":
        return "Sushi Bar";
      case "dessert":
        return "Coffee & Dessert";
      case "custom":
        return "Something Else";
      default:
        return "Gourmet meal";
    }
  };

  return (
    <div className="min-h-screen radial-bg text-gray-800 dark:text-gray-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-500 font-sans">
      <BackgroundParticles />
      <HeartCursorTrail />

      {/* --- PRELOADER --- */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 radial-bg flex flex-col items-center justify-center text-gray-800 dark:text-gray-100"
          >
            <BackgroundParticles />
            <div className="z-10 flex flex-col items-center text-center px-4">
              {/* Pulsing Heart */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  filter: [
                    "drop-shadow(0 0 10px rgba(244, 63, 94, 0.3))",
                    "drop-shadow(0 0 25px rgba(244, 63, 94, 0.6))",
                    "drop-shadow(0 0 10px rgba(244, 63, 94, 0.3))",
                  ],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl sm:text-7xl mb-8 select-none"
              >
                ❤️
              </motion.div>

              {/* Loading Progress */}
              <h2 className="text-4xl font-extrabold font-serif mb-2 tracking-wide text-rose-500">
                {loadingProgress}%
              </h2>

              {/* Loading Bar */}
              <div className="w-48 sm:w-60 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4 border border-rose-500/10 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Status Text */}
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-semibold text-gray-500 dark:text-gray-400 min-h-[20px]"
              >
                {loadingText}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HeaderActions
        theme={theme}
        setTheme={setTheme}
        musicPlaying={musicPlaying}
        handleMusicToggle={handleMusicToggle}
        handleBtnClick={handleBtnClick}
      />

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <ProposalStep
              name={name}
              handleProposalAccept={handleProposalAccept}
              noBtnRef={noBtnRef}
              isNoBtnMoved={isNoBtnMoved}
              noBtnPos={noBtnPos}
              handleNoButtonEscape={handleNoButtonEscape}
              tooltipText={tooltipText}
            />
          )}

          {step === 2 && (
            <DateStep
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              handleDateContinue={handleDateContinue}
              handleBtnClick={handleBtnClick}
            />
          )}

          {step === 3 && (
            <MealStep
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              customMealText={customMealText}
              setCustomMealText={setCustomMealText}
              handleMealSelect={handleMealSelect}
              handleMealContinue={handleMealContinue}
              handleBtnClick={handleBtnClick}
              getMealTitle={getMealTitle}
              isSendingEmail={isSendingEmail}
              emailSendError={emailSendError}
            />
          )}

          {step === 4 && (
            <CelebrationStep
              countdown={countdown}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedMeal={selectedMeal}
              customMealText={customMealText}
              getMealEmoji={getMealEmoji}
              getMealTitle={getMealTitle}
              handleDownloadCertificate={handleDownloadCertificate}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full py-4 text-center text-[10px] text-gray-400 dark:text-gray-600 z-10 pointer-events-none select-none">
        შემუშავებულია სიყვარულით რომანტიკული წყვილებისთვის • დიზაინი:
        Glassmorphism და Framer Motion
      </footer>
    </div>
  );
}
