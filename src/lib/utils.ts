
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add custom CSS classes for animations and effects
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
    
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
    
    .hover\\:scale-102:hover {
      transform: scale(1.02);
    }
    
    .active\\:scale-98:active {
      transform: scale(0.98);
    }
    
    .skeleton {
      background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
      background-size: 200px 100%;
      animation: shimmer 1.5s infinite;
    }
  `;
  document.head.appendChild(style);
}
