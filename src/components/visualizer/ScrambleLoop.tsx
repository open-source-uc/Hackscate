'use client';

import { useState, useEffect, useRef } from 'react';
import { TextScramble, type TextScrambleProps } from '@/components/ui/text-scramble';

type ScrambleLoopProps = Omit<TextScrambleProps, 'trigger' | 'onScrambleComplete'> & {
  interval?: number; // in milliseconds
};

export function ScrambleLoop({ interval = 15000, ...props }: ScrambleLoopProps) {
  const [trigger, setTrigger] = useState<boolean | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleScrambleComplete = () => {
    // Schedule next scramble after interval
    timeoutRef.current = setTimeout(() => {
      setTrigger((prev) => (prev === undefined ? true : !prev));
    }, interval);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return <TextScramble {...props} trigger={trigger} onScrambleComplete={handleScrambleComplete} />;
}
