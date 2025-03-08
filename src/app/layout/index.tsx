import { useEffect, useState } from 'react';
import { MapView } from '../../views/map';

export default function Layout() {
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
            <MapView {...{ width, height }} />
        </div>
    )
}