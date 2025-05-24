export const MiniPage = ({ children, className = "", mx = 30 }) => (
  <div className={`bg-gray-100 shadow-2xl rounded-4xl mx-${mx} ${className}`}>
    {children}
  </div>
);

export const MiniPageH = ({ children, className = "" }) => (
  <p className={`inter-semibold text-gray-800 text-4xl ${className}`}>{children}</p>
);

export const MiniPageP = ({ children, className = "" }) => (
  <p className={`text-gray-500 mt-2 ${className}`}>{children}</p>
);