'use client'

import { AnimatePresence } from 'framer-motion';

export default function AnimationRoot({ childrenProp }: { childrenProp: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">{childrenProp}</AnimatePresence>
    );
  }