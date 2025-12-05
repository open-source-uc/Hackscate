'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface Props {
  text: string;
  className?: string;
  interval?: number; // Total interval in seconds
  [key: string]: any;
}

export function AnimatedTitle({ text, className = '', interval = 300, ...props }: Props) {
  const [italicCount, setItalicCount] = useState(0);
  const textLength = text.length;
  const letterIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const restartTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const runAnimation = () => {
      let currentCount = 0;

      // Clear any existing intervals
      if (letterIntervalRef.current) {
        clearInterval(letterIntervalRef.current);
      }

      // Animate letters one by one
      letterIntervalRef.current = setInterval(() => {
        currentCount++;
        setItalicCount(currentCount);

        // When animation completes, schedule next cycle
        if (currentCount >= textLength) {
          if (letterIntervalRef.current) {
            clearInterval(letterIntervalRef.current);
          }

          // Wait for interval, then reset and restart
          restartTimeoutRef.current = setTimeout(() => {
            setItalicCount(0);
            runAnimation();
          }, interval * 1000);
        }
      }, 1000); // Each letter becomes italic after 1 second
    };

    // Start the first animation
    runAnimation();

    return () => {
      if (letterIntervalRef.current) {
        clearInterval(letterIntervalRef.current);
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [textLength, interval]);

  return (
    <h1 className={className} {...props}>
      {text.split('').map((char, index) => {
        const isItalic = index < italicCount;
        return (
          <motion.span
            key={index}
            className={isItalic ? 'italic' : ''}
            animate={{
              scale: isItalic ? 1.1 : 1,
              rotateZ: isItalic ? -5 : 0,
              color: isItalic ? 'rgb(255, 255, 255)' : 'inherit',
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            style={{
              display: 'inline-block',
              transformOrigin: 'center bottom',
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </h1>
  );
}
