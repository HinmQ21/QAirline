import { ReactNode } from "react";

/* -------------------
|   Flutter Enums    |
------------------- */

const CrossAxisAlignmentList = [
  'start',
  'center',
  'end',
  'stretch'
] as const;
export type CrossAxisAlignment = (typeof CrossAxisAlignmentList)[number];

const MainAxisAlignmentList = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'space-evenly',
] as const;
export type MainAxisAlignment = (typeof MainAxisAlignmentList)[number];

const justifyClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
};

const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

/* ------------------------
|   Flutter Components    |
------------------------ */

export const Center = ({ children, vertical = false }: { children: ReactNode, vertical?: boolean }) => {
  return (
    <div className={`flex justify-center w-full ${vertical && 'items-center h-full'}`}>
      {children}
    </div>
  );
}

export const Row = ({
  children,
  crossAxisAlignment = "center",
  mainAxisAlignment = "start"
}: {
  children?: ReactNode,
  crossAxisAlignment?: CrossAxisAlignment,
  mainAxisAlignment?: MainAxisAlignment
}) => {
  return (
    <div className={`flex flex-row 
      ${justifyClass[mainAxisAlignment]} 
      ${alignClass[crossAxisAlignment]} 
      ${mainAxisAlignment !== 'start' ? 'w-full' : ''} 
      ${crossAxisAlignment !== 'start' ? 'h-full' : ''}
    `}>
      {children}
    </div>
  );
};

export const Column = ({
  children,
  crossAxisAlignment = "center",
  mainAxisAlignment = "start",
}: {
  children?: ReactNode;
  crossAxisAlignment?: keyof typeof alignClass;
  mainAxisAlignment?: keyof typeof justifyClass;
}) => {
  return (
    <div
      className={`flex flex-col
        ${justifyClass[mainAxisAlignment]}
        ${alignClass[crossAxisAlignment]}
        ${mainAxisAlignment !== "start" ? "h-full" : ""}
        ${crossAxisAlignment !== "start" ? "w-full" : ""}
      `}
    >
      {children}
    </div>
  );
};
