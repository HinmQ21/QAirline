export const MiniPage = ({children, className = ""}) => (
  <div className={`bg-gray-100 shadow-2xl rounded-4xl mx-30 ${className}`}>
    {children}
  </div>
);

export const MiniPageH2 = ({children, className = ""}) => (
  <h2 className={`inter-semibold text-gray-800 text-4xl ${className}`}>{children}</h2>
);

export const MiniPageH4 = ({children, className = ""}) => (
  <h2 className={`poppins-semibold text-gray-800 text-xl ${className}`}>{children}</h2>
);

export const MiniPageP = ({children, className = ""}) => (
  <p className={`text-gray-500 mt-2 ${className}`}>{children}</p>
);