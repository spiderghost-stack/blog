"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  {
    src: "/images/benin1.png",
    alt: "Cotonou Cityscape",
    title: "Cotonou en pleine croissance",
    subtitle: "Développement urbain",
  },
  {
    src: "/images/tech.png",
    alt: "Tech Innovation",
    title: "Le futur de la technologie",
    subtitle: "Innovation numérique",
  },
  {
    src: "/images/benin2.png",
    alt: "Marché traditionnel",
    title: "Au cœur des marchés locaux",
    subtitle: "Culture et commerce",
  },
  {
    src: "/images/design.png",
    alt: "Design Workspace",
    title: "L'art du design moderne",
    subtitle: "Créativité & UI/UX",
  },
  {
    src: "/images/benin3.png",
    alt: "Monument Amazone",
    title: "L'esplanade de l'Amazone",
    subtitle: "Histoire et tourisme",
  },
  {
    src: "/images/nature.png",
    alt: "Nature in Benin",
    title: "La richesse de notre nature",
    subtitle: "Évasion & Découverte",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-[2rem] shadow-xl shadow-zinc-950/10">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-1 text-sm font-medium tracking-wider text-indigo-300 uppercase">
              {images[currentIndex].subtitle}
            </p>
            <h3 className="text-2xl font-bold leading-tight sm:text-3xl">
              {images[currentIndex].title}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-6 bg-indigo-500" : "w-2 bg-white/50"
            }`}
            aria-label={`Aller à l'image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
