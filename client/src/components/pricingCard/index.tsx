'use client';
import { motion } from 'motion/react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  planId: string;
  className?: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  cta,
  // planId,
  className,
}: PricingCardProps) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card className={`${className} rounded-3xl h-full flex flex-col justify-between`}>
        <CardHeader>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-xl font-semibold"
          >
            {title}
          </motion.h1>
        </CardHeader>

        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 flex flex-col items-start justify-center"
          >
            <div>
              <h1 className="text-4xl  font-bold pb-4 ">{price === 0 ? 'FREE' : `${price}$`}</h1>
            </div>
            <p className="text-xs text-secondary-foreground/90">{description}</p>
          </motion.div>
          <motion.ul className="space-y-1">
            {features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex gap-2 text-sm"
              >
                <Image height={24} width={24} src="/pricingTick.svg" alt="tick" />
                {feature}
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>

        <CardFooter>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button variant={'default'}>{cta}</Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
