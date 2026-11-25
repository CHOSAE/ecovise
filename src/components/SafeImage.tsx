import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function SafeImage({ src, alt, className = '' }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high text-on-surface-variant p-2 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Leaf className="w-5 h-5 text-secondary mb-1" />
        <span className="text-[10px] font-medium leading-tight line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
