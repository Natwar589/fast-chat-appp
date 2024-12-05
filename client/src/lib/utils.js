import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from '@/assets/lottie1'
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData
}