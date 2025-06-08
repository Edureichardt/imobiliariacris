import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
    transition={{ type: 'spring', stiffness: 300 }}
    className={`p-4 border rounded-lg shadow-md bg-white ${className}`}
  >
    {children}
  </motion.div>
);

export default Card;
