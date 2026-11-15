// Brand vector emblems and logos for Keyboard Atlas

type LogoProps = {
  brand: string;
  size?: number;
  className?: string;
};

export default function BrandLogo({ brand, size = 32, className = '' }: LogoProps) {
  const b = brand.toLowerCase();

  if (b.includes('aula')) {
    return (
      <svg width={size * 1.5} height={size} viewBox="0 0 72 32" fill="none" className={className} aria-label="Aula logo">
        <path d="M6 24L18 8L30 24H23L18 16L13 24H6Z" fill="currentColor" />
        <path d="M34 8V20C34 22.2 35.8 24 38 24H42C44.2 24 46 22.2 46 20V8H41V19H39V8H34Z" fill="currentColor" />
        <path d="M50 8V24H64V20H55V8H50Z" fill="currentColor" />
      </svg>
    );
  }

  if (b.includes('keychron')) {
    return (
      <svg width={size * 1.6} height={size} viewBox="0 0 80 32" fill="none" className={className} aria-label="Keychron logo">
        <circle cx="14" cy="16" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M14 9V16L18 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <text x="30" y="21" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="currentColor" letterSpacing="0.05em">
          KEYCHRON
        </text>
      </svg>
    );
  }

  if (b.includes('razer')) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-label="Razer logo">
        <path
          d="M16 4C10 7 7 13 8 19C9 25 15 28 16 28C17 28 23 25 24 19C25 13 22 7 16 4Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M11 12C14 15 18 15 21 12M13 18C15 20 17 20 19 18M16 11V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (b.includes('logitech')) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-label="Logitech logo">
        <path d="M7 16A9 9 0 0 1 25 16A9 9 0 0 1 7 16" fill="currentColor" />
        <circle cx="23" cy="9" r="3" fill="var(--retro-red, #c93b2b)" />
      </svg>
    );
  }

  if (b.includes('corsair')) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-label="Corsair logo">
        <path d="M6 24C12 20 18 16 22 8C19 16 17 22 17 24H6Z" fill="currentColor" />
        <path d="M19 24C22 19 25 14 27 10C26 16 24 21 24 24H19Z" fill="currentColor" />
      </svg>
    );
  }

  if (b.includes('ducky')) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-label="Ducky logo">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" />
        <circle cx="13" cy="14" r="2" fill="currentColor" />
        <path d="M18 15C21 15 24 16 23 18C21 19 18 18 17 17" fill="var(--retro-red, #c93b2b)" />
        <path d="M9 19C12 23 20 23 23 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (b.includes('wooting')) {
    return (
      <svg width={size * 1.2} height={size} viewBox="0 0 40 32" fill="none" className={className} aria-label="Wooting logo">
        <path d="M8 9L12 23L16 13L20 23L24 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="31" cy="16" r="4.5" stroke="var(--retro-red, #c93b2b)" strokeWidth="2" />
      </svg>
    );
  }

  if (b.includes('nuphy')) {
    return (
      <svg width={size * 1.3} height={size} viewBox="0 0 48 32" fill="none" className={className} aria-label="NuPhy logo">
        <rect x="6" y="8" width="36" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="16" r="3" fill="var(--retro-red, #c93b2b)" />
        <circle cx="24" cy="16" r="3" fill="currentColor" />
        <circle cx="33" cy="16" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (b.includes('hhkb') || b.includes('pfu')) {
    return (
      <svg width={size * 1.4} height={size} viewBox="0 0 54 32" fill="none" className={className} aria-label="HHKB logo">
        <rect x="4" y="7" width="46" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        <text x="10" y="20" fontFamily="monospace" fontSize="11" fontWeight="700" fill="currentColor" letterSpacing="0.08em">
          HHKB
        </text>
      </svg>
    );
  }

  if (b.includes('mode')) {
    return (
      <svg width={size * 1.2} height={size} viewBox="0 0 42 32" fill="none" className={className} aria-label="Mode logo">
        <rect x="6" y="9" width="13" height="14" fill="currentColor" />
        <circle cx="29" cy="16" r="7" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // Fallback emblem for other makers
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-label={`${brand} emblem`}>
      <rect x="4" y="6" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <text x="16" y="19" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="700" fill="currentColor">
        {brand.slice(0, 3).toUpperCase()}
      </text>
    </svg>
  );
}
