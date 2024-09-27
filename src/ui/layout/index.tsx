import { useResizable } from 'react-resizable-layout';
import Splitter from './components/Splitter';
import PIXIApp from '../../pixi';
import OutlineView from '../outline';
import PropertyView from '../property';
import { useEffect, useState } from 'react';
import Toolbar from '../toolbar';

export function Layout() {
    const { position: positionMapWidth, separatorProps: mapAndEditorSeparatorProps, setPosition: setPositionMapWidth } = useResizable({
        axis: 'x',
        initial: window.innerWidth / 4 * 3
    })

    const [{ width, height }, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        const resize = () => {
            setPositionMapWidth(positionMapWidth * (window.innerWidth / width))
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    })

    return (
        <div className="wrapper flex flex-row h-screen w-screen overflow-hidden" style={{ width: width }}>
            <div className="left-block h-full" >
                <PIXIApp width={positionMapWidth} height={height} />
                <div className="slot-top absolute inset-x-0 top-0 flex flex-row align-middle justify-center" style={{ width: positionMapWidth }}>
                    <Toolbar />
                </div>
                <div className="slot-bottom absolute inset-x-0 bottom-0 flex flex-row align-middle justify-center" style={{ width: positionMapWidth }}>
                    <span className="text-base-content bg-base-300 px-2 rounded">data©openstreetmap contributor</span>
                </div>
            </div>
            <Splitter {...mapAndEditorSeparatorProps} />
            <div className="right-block flex-grow h-full overflow-hidden" >
                <OutlineView />
                <PropertyView />
            </div>
        </div>
    )
}