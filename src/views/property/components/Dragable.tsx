import { ElementType, HTMLAttributes, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    <Element ref={setNodeRef} style={style} {...listeners} {...attributes} {...rest}>
      {children}
    </Element>
  );
}

export default Draggable;