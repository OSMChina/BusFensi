import { useShallow } from "zustand/react/shallow"
import useBearStoreWithUndo from "../../../logic/model/store"
import { useEffect, useState } from "react";
import { InsertHandeler } from "../type";

function InsertMember({ handelInsertTop, handelIntertBottom, handelInsertAtActive }: {
    handelInsertTop: InsertHandeler,
    handelIntertBottom: InsertHandeler,
    handelInsertAtActive: InsertHandeler
}) {
    const selectedComponent = useBearStoreWithUndo(useShallow(state => state.selectedComponent));
    const id2type = useBearStoreWithUndo(useShallow(state => state.renderedOSMFeatureMeta.id2type))
    const [localSel, setlocalSel] = useState<string[]>([])

    const handelClick = (id: string) => (
        localSel.includes(id) ?
            setlocalSel(localSel.filter(i => i !== id))
            :
            setlocalSel([id, ...localSel])
    )
    const getSelected = () => selectedComponent.filter(id => localSel.includes(id)).map(id => ({ id: id, type: id2type[id] }))
    useEffect(() => {
        setlocalSel(localSel => localSel.filter(i => selectedComponent.includes(i)))
    }, [selectedComponent])
    return <div className="flex flex-row justify-center max-h-96 bg-base-100 p-2 rounded-md ">
        <ul className="menu bg-base-200 menu-xs     -box max-h-full overflow-scroll">
            {selectedComponent.map((id) => {
                let text = ""
                if (id2type[id] === "node") {
                    text = `Node-${id}`
                } else if (id2type[id] === "way") {
                    text = `Way-${id}`
                } else {
                    text = `Relation-${id}`
                }
                return (<li key={id}>
                    <span onClick={() => handelClick(id)} className={`${localSel.includes(id) && 'active'}`}>
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