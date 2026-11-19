// The original "orbiting space" logo from the first version of the site:
// an outer ring, a looping infinity-style knot, and three small orbiting dots on a thin trail.
// Colors switch with the light/dark theme through Tailwind's dark: variant.
export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} drop-shadow-md`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" className="text-orange-800/80 dark:text-orange-500/80" />
      <path
        d="M30 50 C30 35, 50 40, 50 50 C50 60, 70 65, 70 50 C70 35, 50 40, 50 50 C50 60, 30 65, 30 50 Z"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-orange-900 dark:text-orange-300"
      />
      <circle cx="85" cy="30" r="4" fill="currentColor" className="text-orange-700 dark:text-orange-200" />
      <circle cx="20" cy="75" r="3" fill="currentColor" className="text-orange-700 dark:text-orange-200" />
      <circle cx="15" cy="45" r="2" fill="currentColor" className="text-orange-700 dark:text-orange-200" />
      <path d="M 20 75 Q 10 50 30 25" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-orange-700 dark:text-orange-200" />
    </svg>
  );
}
