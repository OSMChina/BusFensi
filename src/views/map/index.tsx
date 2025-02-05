import { useState } from "react";
import CommonEditApp from "./mode/common";

export function MapView({ width, height }: { width: number; height: number }) {
  const tabs = [
    {
      title: "普通编辑",
      component: <CommonEditApp width={width} height={height} />,
    },
    {
      title: "其他编辑",
      component: <div className="p-4">其他编辑内容</div>,
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <div style={{ width, height, position: "relative" }}>
      {/* 主组件内容 */}
      {tabs[active].component}

      {/* 悬浮在左上角的导航区域 */}
      <div
        className="absolute top-0 left-0 flex flex-col items-start p-2 bg-gray-100 bg-opacity-70"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`btn btn-ghost btn-sm w-full mb-1 ${
              active === index ? "btn-active font-bold" : ""
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
    </div>
  );
}
