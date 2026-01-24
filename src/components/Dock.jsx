import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useRef, useState } from 'react';

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - rect.width / 2;
  });

  // Smooth size transition based on mouse distance
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`cursor-target relative inline-flex items-center justify-center rounded-full bg-[#1B1B1B] border-[#3A3A3A] border-2 shadow-lg hover:shadow-xl transition-shadow ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-12 left-1/2 w-fit whitespace-pre rounded-md border border-[#3A3A3A] bg-[#1B1B1B] px-3 py-1.5 text-sm text-white shadow-lg`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '' }) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification: defaultMagnification = 70,
  distance = 140,
  panelHeight: defaultPanelHeight = 68,
  baseItemSize: defaultBaseItemSize = 50
}) {
  const mouseX = useMotionValue(Infinity);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Responsive sizing based on screen width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scale down sizes for smaller screens
  const getResponsiveSizes = () => {
    if (windowWidth < 480) {
      return { baseItemSize: 36, magnification: 50, panelHeight: 52, gap: 'gap-2', padding: 'px-3' };
    } else if (windowWidth < 768) {
      return { baseItemSize: 42, magnification: 58, panelHeight: 58, gap: 'gap-3', padding: 'px-4' };
    } else {
      return { baseItemSize: defaultBaseItemSize, magnification: defaultMagnification, panelHeight: defaultPanelHeight, gap: 'gap-4', padding: 'px-5' };
    }
  };

  const { baseItemSize, magnification, panelHeight, gap, padding } = getResponsiveSizes();

  return (
    <motion.div
      onMouseMove={({ pageX }) => {
        mouseX.set(pageX);
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
      style={{ height: panelHeight }}
      className={`${className} fixed bottom-4 sm:bottom-6 md:bottom-[30px] left-1/2 transform -translate-x-1/2 flex items-end w-fit ${gap} rounded-xl sm:rounded-2xl border-[#3A3A3A] border-2 bg-[#141414]/90 backdrop-blur-md ${padding} pb-2 shadow-2xl z-50`}
      role="toolbar"
      aria-label="Social links dock"
    >
      {items.map((item, index) => (
        <DockItem
          key={index}
          onClick={item.onClick}
          className={item.className}
          mouseX={mouseX}
          spring={spring}
          distance={distance}
          magnification={magnification}
          baseItemSize={baseItemSize}
        >
          <DockIcon>{item.icon}</DockIcon>
          <DockLabel>{item.label}</DockLabel>
        </DockItem>
      ))}
    </motion.div>
  );
}
