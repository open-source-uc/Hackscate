'use client';
import { type JSX, useEffect, useState, useRef } from 'react';
import { motion, type MotionProps } from 'motion/react';

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
  [key: string]: any;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );

  const text = children;
  const intervalRef = useRef<NodeJS.Timeout>();

  // Generate initial scrambled text
  const getScrambledText = () => {
    return text
      .split('')
      .map((char) =>
        char === ' '
          ? ' '
          : characterSet[Math.floor(Math.random() * characterSet.length)]
      )
      .join('');
  };

  const [displayText, setDisplayText] = useState(getScrambledText());

  const scramble = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const steps = duration / speed;
    let step = 0;

    intervalRef.current = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }

        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setDisplayText(text);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  useEffect(() => {
    // Run on mount if trigger is not provided
    if (trigger === undefined) {
      scramble();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Run when trigger changes
    if (trigger !== undefined) {
      // Reset to scrambled text before animating
      setDisplayText(getScrambledText());
      // Use setTimeout to ensure state update happens before animation
      setTimeout(() => scramble(), 0);
    }
  }, [trigger]);

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  );
}
