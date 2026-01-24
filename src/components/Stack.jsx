import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function Stack({
  cards = [],
  randomRotation = false,
  sensitivity = 200,
  sendToBackOnClick = true,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  onCardClick
}) {
  const [stack, setStack] = useState(cards.map((card, index) => ({ content: card, id: index })));
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const autoplayRef = useRef(null);

  // Shuffle cards when component mounts if randomRotation is true
  useEffect(() => {
    setStack(cards.map((card, index) => ({ content: card, id: index })));
  }, [cards]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isPaused) {
      autoplayRef.current = setInterval(() => {
        sendToBack(0);
      }, autoplayDelay);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, autoplayDelay, isPaused, stack]);

  const sendToBack = (index) => {
    setStack(prev => {
      const newStack = [...prev];
      const [removed] = newStack.splice(index, 1);
      newStack.push(removed);
      return newStack;
    });
  };

  const handleCardClick = (index, cardData) => {
    if (onCardClick) {
      onCardClick(cardData, index);
    }
    if (sendToBackOnClick) {
      sendToBack(index);
    }
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {stack.map((card, index) => (
        <StackCard
          key={card.id}
          index={index}
          totalCards={stack.length}
          randomRotation={randomRotation}
          sensitivity={sensitivity}
          onClick={() => handleCardClick(index, card)}
        >
          {card.content}
        </StackCard>
      ))}
    </div>
  );
}

function StackCard({
  children,
  index,
  totalCards,
  randomRotation,
  sensitivity,
  onClick
}) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-sensitivity, sensitivity], [15, -15]);
  const rotateY = useTransform(x, [-sensitivity, sensitivity], [-15, 15]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Calculate position in stack (0 = front, higher = further back)
  const stackPosition = index;
  const scale = 1 - stackPosition * 0.05;
  const yOffset = stackPosition * -8;
  const zIndex = totalCards - index;

  // Random rotation for each card
  const randomRot = randomRotation ? (Math.random() - 0.5) * 10 : 0;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute top-0 left-0 w-full h-full cursor-pointer"
      style={{
        zIndex,
        rotateX: index === 0 ? springRotateX : 0,
        rotateY: index === 0 ? springRotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      initial={{ scale, y: yOffset, rotate: randomRot }}
      animate={{ scale, y: yOffset, rotate: randomRot }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={index === 0 ? handleMouseMove : undefined}
      onMouseLeave={index === 0 ? handleMouseLeave : undefined}
      onClick={onClick}
      whileHover={index === 0 ? { scale: scale * 1.02 } : {}}
      whileTap={index === 0 ? { scale: scale * 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
}
