"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate, useAnimationControls } from "framer-motion";
import { MoveRight, Braces, Code, Database, Search } from "lucide-react";

// --- Helper for Floating Coding Icons ---
const FloatingIcon = ({ children, delay = 0, initialX = 0, initialY = 0 }: any) => (
  <motion.div
    className="absolute text-blue-400/30 blur-[1px]"
    initial={{ x: initialX, y: initialY, opacity: 0 }}
    animate={{
      y: [initialY, initialY - 15, initialY],
      opacity: [0.1, 0.4, 0.1],
    }}
    transition={{
      delay: delay,
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

export default function ShyHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleControls = useAnimationControls();
  
  // 1. STATE TRACKING
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);

  // 2. MAPPING LOGIC
  // Define the drag limits and reveal mechanics
  const HIDDEN_OFFSET = 120; // How far he is dragged left
  const VISIBLE_OFFSET = 10; // Where he ends up (from his hidden starting point)
  const DRAG_THRESHOLD = -280; // Points before he unlocks

  // Create a specialized transform: 
  // Map the container's drag (0 to -320) to the Fox's relative offset (320 to 10)
  const foxX = useTransform(dragX, [0, -HIDDEN_OFFSET], [HIDDEN_OFFSET, VISIBLE_OFFSET]);

  // 3. EVENT HANDLING
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);

    if (info.offset.x < DRAG_THRESHOLD) {
      setIsFullyVisible(true);
      animate(dragX, -HIDDEN_OFFSET, { type: "spring", stiffness: 300, damping: 30 });
      titleControls.start({ opacity: 0, y: -10 });
    } else {
      animate(dragX, 0, { type: "spring", stiffness: 200, damping: 20 });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#0A0E17] text-white">
      {/* --- Background Floating Items --- */}
      <FloatingIcon delay={0} initialX={600} initialY={150}><Braces size={28} /></FloatingIcon>
      <FloatingIcon delay={1} initialX={750} initialY={300}><Database size={24} /></FloatingIcon>
      <FloatingIcon delay={0.5} initialX={550} initialY={450}><Code size={32} /></FloatingIcon>
      <FloatingIcon delay={1.5} initialX={850} initialY={100}><Search size={20} /></FloatingIcon>

      {/* --- Main Content Grid --- */}
      <div className="container mx-auto grid grid-cols-12 h-full items-center px-6 relative z-10">
        
        {/* --- Left Text Section --- */}
        <div className="col-span-5 flex flex-col gap-5 ml-40">
          <motion.div animate={titleControls} className="flex flex-col">
            {!isFullyVisible ? (
              <>
                <h1 className="text-6xl font-extrabold tracking-tighter uppercase leading-[0.9]">
                  DRAG HIM<br /> OUT!!
                </h1>
                <p className="text-gray-400 text-xl mt-4 font-light">
                  He’s shy at first...
                </p>
              </>
            ) : (
              <>
                {/* <h1 className="text-6xl font-extrabold tracking-tighter uppercase leading-[0.9]">
                  HI! I'M<br /> YOUR NAME
                </h1>
                <p className="text-gray-200 text-xl mt-4 font-normal">
                  Senior Developer & Architect. Let's build.
                </p> */}
              </>
            )}
          </motion.div>

          {!isFullyVisible && (
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="mt-8 flex items-center gap-2 text-yellow-400/70"
            >
              <MoveRight className="w-16 h-16 stroke-[1]" />
            </motion.div>
          )}
        </div>

        {/* --- Right Interactive Section --- */}
        <div className="col-span-7 relative h-full flex items-center justify-end">
          
          {/* 1. The Container for Dragging (The Area being interacted with) */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-end ${isFullyVisible ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
            drag={isFullyVisible ? false : "x"}
            dragConstraints={{ left: -HIDDEN_OFFSET, right: 0 }} 
            _dragX={dragX} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd} 
            style={{ x: dragX }} 
          >
            
            {/* 2. The Fox Image Container (Moves within the draggable area) */}
            <motion.div
              style={{ x: foxX }} 
              className="relative z-20 pointer-events-none w-[80vw] h-[80vh] "
            >
              {/* --- Conditional Image Logic --- */}
              {/* State 3: Finalized "Out" Image */}
              {isFullyVisible && (
                <Image 
                  src="/fox_out2.png" 
                  alt="Happy Developer Fox"
                  fill
                  className="object-contain"
                  priority
                />
              )}

              {/* State 2: Dragging Image (Active motion detection) */}
              {!isFullyVisible && isDragging && (
                 <Image 
                  src="/fox_drag2.png" 
                  alt="Dragging Developer Fox"
                  fill
                  className="object-contain"
                  priority
                />
              )}

              {/* State 1: Peeking Image (Default state) */}
              {!isFullyVisible && !isDragging && (
                 <Image 
                //   src="/fox_peeking.png" 
                  src="/fox_peek2.png" 
                  alt="Shy Developer Fox"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </motion.div>

            {/* 3. The Masking Wall */}
            {/* <div className="absolute top-0 right-0 w-[200px] h-full bg-white rounded-l-3xl shadow-[-15px_0px_30px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center p-8">
               {isFullyVisible && (
                   <div className="text-black text-center text-sm font-medium">
                       [CV LINK]
                   </div>
               )}
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}