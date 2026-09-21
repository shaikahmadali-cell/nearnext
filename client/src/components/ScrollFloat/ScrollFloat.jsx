import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  as: Component = 'h2',
  ...restProps
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    if (typeof children !== 'string') {
      return children;
    }

    const words = children.split(' ');
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="scroll-float-word">
        {word.split('').map((char, charIndex) => (
          <span className="char" key={charIndex}>
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className="scroll-float-space">&nbsp;</span>}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const charElements = el.querySelectorAll('.char');
    if (!charElements.length) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set(charElements, { opacity: 1, y: 0, scaleY: 1, scaleX: 1 });
        return;
      }

      gsap.from(charElements, {
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
        opacity: 0,
        y: 40,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%',
        duration: animationDuration,
        ease: ease,
        stagger: stagger,
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, children]);

  return (
    <Component
      ref={containerRef}
      className={`scroll-float ${containerClassName}`.trim()}
      {...restProps}
    >
      <span className={`scroll-float-text ${textClassName}`.trim()}>
        {splitText}
      </span>
    </Component>
  );
};

export default ScrollFloat;
