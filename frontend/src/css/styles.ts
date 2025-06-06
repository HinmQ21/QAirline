export class css {
  static readonly headerText = "inter-semibold text-gray-800 text-4xl";

  static readonly offstage = {
    on: "transition-all duration-500 opacity-0 blur-[5px] scale-75 z-10",
    off: "transition-all duration-500 opacity-100 blur-[0px] scale-100 z-20",
  } as const;

  static readonly minipage = {
    xl: "bg-gray-100 shadow-2xl rounded-4xl",
    lg: "bg-gray-100 shadow-2xl rounded-3xl",
    md: "bg-gray-100 shadow-xl rounded-2xl",
    sm: "bg-gray-100 shadow-xl rounded-xl",
  } as const;

  static readonly minipagemx = "xl:mx-30 lg:mx-20 md:mx-10 sm:mx-5 mx-2";

  static readonly homepageGgGradient = "bg-gradient-to-r from-gray-900 to-pink-950";
}
