import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Draggable(props: any) {
    const Element = props.element || 'div';
    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: props.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };

    return (
        <Element ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </Element>
    );
}

export default Draggable