export const MiniPage = ({ children, className = "" }) => (
  <div className={`bg-gray-100 shadow-2xl rounded-4xl ${className}`}>
    {children}
  </div>
);
