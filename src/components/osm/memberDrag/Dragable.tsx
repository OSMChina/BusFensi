import { ElementType, HTMLAttributes, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons/faGripVertical";

export interface DraggableProps extends HTMLAttributes<HTMLElement> {
  id: string;
  /**
   * 自定义组件标签，默认为 'div'
   */
  element?: ElementType;
  children?: ReactNode;
}

function Draggable({
  id,
  element: Element = "div",
  children,
  style: userStyle,
  ...rest
}: DraggableProps): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...userStyle,
  };

  return (
    <Element ref={setNodeRef} className="flex bg-base-200 rounded-sm border pl-1" style={style} {...rest}>
      <button {...listeners} {...attributes}><FontAwesomeIcon icon={faGripVertical} /></button>
      {children}
    </Element>
  );
}

export default Draggable;