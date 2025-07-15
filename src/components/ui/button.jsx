export function Button({
  children,
  onClick,
  // size = 'base',
  // variant = 'default',
}) {
  // const base = 'px-4 py-2 rounded-2xl font-medium transition-colors';
  // const sizes = {
  //   base: 'text-base',
  //   sm: 'text-sm py-1 px-3',
  // };
  // const variants = {
  //   default: 'bg-blue-600 text-white hover:bg-blue-700',
  //   destructive: 'bg-red-600 text-white hover:bg-red-700',
  // };

  return (
    <button
      onClick={onClick}
      // className={${base} ${sizes[size]} ${variants[variant]}}
      className="px-4 py-2 rounded-2xl font-medium transition-colors text-base bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
    >
      {children}
    </button>
  );
}
