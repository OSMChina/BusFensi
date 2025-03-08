import { Graphics } from "@pixi/react";
import { PointPixel } from "../../utils/geo/types";

interface SelectionRectProps {
    selectionRect?: {
        from: PointPixel;
        to: PointPixel;
    };
}

export default function SelectionRect({ selectionRect }: SelectionRectProps) {
    if (!selectionRect) return null;

    const { from, to } = selectionRect;
    const x = Math.min(from.x, to.x);
    const y = Math.min(from.y, to.y);
    const width = Math.abs(to.x - from.x);
    const height = Math.abs(to.y - from.y);

    return (
        <Graphics
            draw={(g) => {
                g.clear();
                g.beginFill(0xffa500, 0.5); // Orange with 50% opacity
                g.drawRect(x, y, width, height);
                g.endFill();
            }}
        />
    );
};

