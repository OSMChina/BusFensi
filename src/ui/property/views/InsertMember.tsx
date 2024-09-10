import { useShallow } from "zustand/react/shallow"
import useBearStoreWithUndo from "../../../logic/model/store"
import { useEffect, useState } from "react";
import { InsertHandeler } from "../type";
import { ItemRefObj } from "../../../logic/model/type";

function InsertMember({ handelInsertTop, handelIntertBottom, handelInsertAtActive }: {
    handelInsertTop: InsertHandeler,
    handelIntertBottom: InsertHandeler,
    handelInsertAtActive: InsertHandeler
}) {
    const selectedComponent = useBearStoreWithUndo(useShallow(state => state.selectedComponent));
    const [localSel, setlocalSel] = useState<ItemRefObj[]>([])

    const handelClick = ({ id, type }: ItemRefObj) => (
        localSel.some(item => item.id === id && item.type === type) ?
            setlocalSel(localSel.filter(item => !(item.id === id && item.type === type)))
            :
            setlocalSel([{ id: id, type: type }, ...localSel])
    )
    const getSelected = () => selectedComponent.filter(id => localSel.some(item => item.id === id.id && item.type === id.type))
    useEffect(() => {
        setlocalSel(localSel => localSel.filter(i => selectedComponent.includes(i)))
    }, [selectedComponent])
    return <div className="flex flex-row justify-center max-h-96 bg-base-100 p-2 rounded-md ">
        <ul className="menu bg-base-200 menu-xs max-h-full overflow-scroll">
            {selectedComponent.map((item) => {
                let text = ""
                if (item.type === "node") {
                    text = `Node-${item.id}`
                } else if (item.type === "way") {
                    text = `Way-${item.id}`
                } else {
                    text = `Relation-${item.id}`
                }
                return (<li key={`${item.type}-${item.id}`}>
                    <span onClick={() => handelClick(item)} className={`${localSel.some(i => i.id === item.id && i.type === item.type) && 'active'}`}>
                        {text}
                    </span>
                </li>)
            })}
        </ul>
        <div className="divider divider-horizontal"></div>
        <div className="join join-vertical">
            <button
                className="btn join-item"
                onClick={() => { handelInsertTop(getSelected()); setlocalSel([]) }}
            >
                InsTop
            </button>
            <button
                className="btn join-item"
                onClick={() => { handelInsertAtActive(getSelected()); setlocalSel([]) }}
            >
                InsAct
            </button>
            <button
                className="btn join-item"
                onClick={() => { handelIntertBottom(getSelected()); setlocalSel([]) }}
            >
                InsBtm
            </button>
        </div>
    </div>
}

export default InsertMember;