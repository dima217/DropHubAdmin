"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export function FadeIn({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
