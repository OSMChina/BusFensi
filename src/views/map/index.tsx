import { useMemo, useState } from "react";
import CommonEditApp from "./mode/common";
import { HeaderBar } from "./components/HeaderBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons/faMap";
import { faRoute } from "@fortawesome/free-solid-svg-icons/faRoute";
import { cn } from "../../utils/helper/object";
export function MapView({ width, height }: { width: number; height: number }) {
  const HEADERBAR_HEIGHT = 48;
  const tabs = useMemo(() => [
    {
      title: <FontAwesomeIcon icon={faMap} />,
      tooltip: "Map edit mode",
      component: () => <CommonEditApp width={width} height={height - HEADERBAR_HEIGHT} />,
    },
    {
      title: <FontAwesomeIcon icon={faRoute} />,
      tooltip: "Public transport edit mode",
      component: () => <div className="p-4">其他编辑内容</div>,
    },
  ], [width, height]);

  const [active, setActive] = useState(0);

  return (
    <div style={{ width, height, position: "relative" }}>
      <HeaderBar height={HEADERBAR_HEIGHT} leftSlot={<>
        {tabs.map((tab, index) => (
          <div className="tooltip tooltip-right" data-tip={tab.tooltip}
            key={index} onClick={() => setActive(index)}>
            <button className={cn("btn btn-ghost text-lg", active === index && "btn-active")}>{tab.title}</button>
          </div>
        ))}
      </>}
      />
      {/* 主组件内容 */}
      <div className="relative">
        {tabs[active].component()}
      </div>
    </div>
  );
}
