export class css {
  static readonly headerText = "inter-semibold text-gray-800 text-4xl";

  static readonly offstage = {
    on: "transition-all duration-500 opacity-0 blur-[5px] scale-75",
    off: "transition-all duration-500 opacity-100 blur-[0px] scale-100",
  } as const;

  static readonly minipage = {
    xl: "bg-gray-100 shadow-2xl rounded-4xl",
    lg: "bg-gray-100 shadow-xl rounded-2xl",
    md: "bg-gray-100 shadow-xl rounded-xl",
    sm: "bg-gray-100 shadow-lg rounded-lg",
  } as const;
}
