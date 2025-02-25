export default function InfoLayer({ width }: { width: number }) {
    return <div className="slot-bottom absolute inset-x-0 bottom-0 flex flex-row align-middle justify-center" style={{ width }}>
        <span className="text-base-content bg-base-300 px-2 rounded">data©openstreetmap contributor</span>
    </div>
}