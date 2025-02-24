import { useEffect, useState } from 'react';
import SplitterView from '../../components/layout/SplitView';
import { MapView } from '../../views/map';
import OutlineView from '../../views/outline';
import PropertyView from '../../views/property';

export function Layout() {
    const [{ width, height }, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
    useEffect(() => {
        const resize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    })

    return (
        <div className="wrapper h-screen w-screen overflow-hidden" style={{ width: width }}>
            <SplitterView width={width} height={height} axis='x' initial={width / 4 * 3}>
                {(props) => <MapView  {...props} />}
                {(props) => <SplitterView {...props} axis='y'>
                    {(props) => <OutlineView {...props} />}
                    {(props) => <PropertyView {...props} />}
                </SplitterView>}
            </SplitterView>
        </div>
    )
}