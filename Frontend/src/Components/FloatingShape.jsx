import React from 'react'
import {motion} from 'framer-motion'

function FloatingShape({color, size, left, top, delay}) {
  return (
    <motion.div 
    className={`absolute rounded-full ${color} ${size} ${delay} opacity-20 blur-xl`}
    style={{left, top}}
    animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
    }}
    transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
    }}
    aria-hidden='true'
    />
  )
}

export default FloatingShape