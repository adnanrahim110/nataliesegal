"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

const Popup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const delay = Math.floor(1000 + Math.random() * 1000);
    const id = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(id);
  }, []);

  const close = () => setShow(false);

  const handleBuyNow = () => {
    try {
      window.open("https://amazon.com/dp/B0FTTHB1D2", "_blank");
    } catch (e) {
      window.location.href = "https://amazon.com/dp/B0FTTHB1D2";
    }
    close();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="h-screen w-full fixed inset-0 bg-black/50 backdrop-blur-sm z-1000"
          onClick={close}
        >
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-[90%] md:w-4/5 lg:w-1/2 h-auto max-lg:max-h-[90vh] overflow-hidden rounded-xl flex items-center justify-center flex-col bg-black gap-5 pb-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-3 right-3 flex items-center justify-center rounded-full text-white/80 cursor-pointer border-2 border-white/60 p-1 shadow-[0_0_20px_10px] shadow-black/80 hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
              >
                <X />
              </button>
              <Image
                src="/imgs/poster.png"
                alt="Poster"
                width={1920}
                height={1080}
                className="w-full h-auto"
                loading="lazy"
              />
              <div>
                <Button tone="light" onClick={handleBuyNow}>
                  Buy Now on Amazon
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
