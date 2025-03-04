import { useMemo, useState } from "react";
import CommonEditApp from "./mode/common";
import { HeaderBar } from "./components/header/HeaderBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons/faMap";
import { cn } from "../../utils/helper/object";
import PtEditView from "./mode/ptedit";
import { faBus } from "@fortawesome/free-solid-svg-icons/faBus";
export function MapView({ width, height }: { width: number; height: number }) {
  const HEADERBAR_HEIGHT = 42;
  const tabs = useMemo(() => [
    {
      title: <FontAwesomeIcon icon={faMap} />,
      tooltip: "Map edit mode",
      component: () => <CommonEditApp width={width} height={height - HEADERBAR_HEIGHT} />,
    },
    {
      title: <FontAwesomeIcon icon={faBus} />,
      tooltip: "Public transport edit mode",
      component: () => <PtEditView width={width} height={height - HEADERBAR_HEIGHT} />,
    },
  ], [width, height]);

  const [active, setActive] = useState(0);

  return (
    <div style={{ width, height, position: "relative" }}>
      <HeaderBar height={HEADERBAR_HEIGHT} leftSlot={<>
        {tabs.map((tab, index) => (
          <div className="tooltip tooltip-right ml-1" data-tip={tab.tooltip} key={index}>
            <button onClick={() => setActive(index)} className={cn("btn btn-ghost btn-square btn-sm", active === index && "btn-active")}>{tab.title}</button>
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
