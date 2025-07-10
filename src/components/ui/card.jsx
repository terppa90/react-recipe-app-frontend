export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white text-gray-900 shadow-md dark:bg-gray-800 dark:text-white dark:shadow-lg rounded-2xl p-4 transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-4 dark:text-white">{children}</div>;
}
