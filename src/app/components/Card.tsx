import { motion } from 'framer-motion';

const Card = ({ children, className }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
    transition={{ type: 'spring', stiffness: 300 }}
    className={`p-4 border rounded-lg shadow-md bg-white ${className}`}
  >
    {children}
  </motion.div>
);
export default Card;
