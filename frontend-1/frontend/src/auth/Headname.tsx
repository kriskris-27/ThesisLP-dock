"use client"

import { motion } from "framer-motion"

interface HeadnameProps {
    title: string;
}

export default function Component({ title }: HeadnameProps) {
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <motion.h2
        className="text-4xl font-bold text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{
          scale: 1.05,
          color: "#3b82f6",
        }}
      >
        {title}
      </motion.h2>
    </div>
  )
}
