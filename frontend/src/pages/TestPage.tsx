import { useState } from "react";

const NavButton = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <button
    className="w-10 h-10 bg-red-400 flex items-center justify-center rounded-4xl"
    onClick={onClick}
  >
    {label}
  </button>
);

export const TestPage = () => {
  const [tab, setTab] = useState<number>(0);

  return (
    <div className="flex flex-row h-screen">
      <div className="w-16 flex flex-col items-center justify-center h-full gap-y-3">
        <NavButton label="0" onClick={() => setTab(0)} />
        <NavButton label="1" onClick={() => setTab(1)} />
        <NavButton label="2" onClick={() => setTab(2)} />
      </div>
      <div className="flex-1 flex">
        {tab === 0 && <Experiment0 />}
        {tab === 1 && <Experiment1 />}
        {/* {tab === 2 && <Experiment2 />} */}
      </div>
    </div>
  );
}

const Experiment0 = () => (
  <div className="m-auto">
    <div className="w-[120px] p-[5px] overflow-hidden bg-green-400">
        <p className="truncate">
          helo worrrrrrrrrrrlllllllllllllldddddddddddddd
        </p>
    </div>
  </div>
)

const Experiment1 = () => (
  <div className="w-1/2 m-auto h-50 bg-green-400 overflow-hidden">
    <p className="truncate">
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaskkkkkkkkkkkkkmcmmmmmmmmmmmmmmmmmmmmooooooooooooooozzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    </p>
  </div>
)