import React, { useState, useEffect, useRef } from 'react';
import { usePerformance } from '../../config/performance';

interface CounterAnimationProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const CounterAnimation: React.FC<CounterAnimationProps> = ({
  end,
  duration,
  suffix = '',
  prefix = '',
  decimals = 0
}) => {
  const { config } = usePerformance();
  const actualDuration = duration || config.ANIMATION.COUNTER_DURATION;

  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: config.ANIMATION.INTERSECTION_THRESHOLD,
        rootMargin: config.ANIMATION.INTERSECTION_ROOT_MARGIN
      }
    );

    const currentRef = counterRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let animationId: number;
    let startTime: number;
    const startValue = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / actualDuration, 1);

      // Improved easing function for smoother animation
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentValue = startValue + (end - startValue) * easedProgress;

      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        animationId = requestAnimationFrame(updateCount);
      }
    };

    animationId = requestAnimationFrame(updateCount);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible, end, actualDuration, decimals]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString('en-US');
  };

  return (
    <span ref={counterRef} className="font-bold">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CounterAnimation;
