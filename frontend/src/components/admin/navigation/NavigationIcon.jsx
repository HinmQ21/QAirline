export const NavigationIcon = ({ icon: Icon, iconOnHover: IconOnHover, isSelected, onClick, className = "" }) => (
  <div onClick={onClick} className={`
    rounded-4xl shadow-xl cursor-pointer relative group
    flex items-center justify-center transition-all duration-300
    ${isSelected === true ? (
      "w-14 h-14 bg-indigo-500 shadow-indigo-500/60"
    ) : (
      "w-12 h-12 bg-gray-900 shadow-gray-900/60 \
      hover:w-14 hover:h-14 hover:bg-teal-600 hover:shadow-teal-600/60"
    )
    }
    ${className}
  `}>{
      (isSelected === true) ? (
        <IconOnHover size="24" className="absolute opacity-100 text-white" />
      ) : (
        <>
          <Icon size="20" className="
            absolute opacity-100 text-white
            group-hover:opacity-0 transition-opacity duration-300
          "/>
          <IconOnHover size="24" className="
            absolute opacity-0 text-white
            group-hover:opacity-100 transition-opacity duration-300
          "/>
        </>
      )
    }</div>
);