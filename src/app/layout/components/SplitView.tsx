import { CSSProperties, FC, ReactElement } from "react";
import { useResizable, UseResizableProps } from "react-resizable-layout";
import Splitter from "./Splitter";
import { ViewFCProps } from "../../../type/view/props";

// View 组件的 props 类型，要求 children 为一个包含两个函数的元组，这两个函数分别接收 ViewChildProps 并返回 React 元素
type ViewProps = UseResizableProps & ViewFCProps & {
    children: [
        (props: ViewFCProps) => ReactElement,
        (props: ViewFCProps) => ReactElement
    ];
}

const SplitterView: FC<ViewProps> = ({ width, height, children, ...props }) => {
    // 根据分割方向设置初始位置（各占一半）
    const { axis } = props;
    const initialPosition = props.initial || axis === "x" ? width / 2 : height / 2;

    // 调用 useResizable 获取当前分割位置和分隔条属性
    const { position, separatorProps } = useResizable({
        ...props,
        initial: initialPosition,
    });

    // 根据轴向计算两部分的尺寸
    let firstStyle: CSSProperties = {};
    let secondStyle: CSSProperties = {};
    if (axis === "x") {
        firstStyle = { width: position, height };
        secondStyle = { width: width - position, height };
    } else {
        firstStyle = { width, height: position };
        secondStyle = { width, height: height - position };
    }

    return (
        <div
            style={{
                width,
                height,
                display: "flex",
                flexDirection: axis === "x" ? "row" : "column",
                position: "relative",
            }}
        >
            {/* 渲染第一个子组件，并将计算后的宽高作为参数传入 */}
            <div style={firstStyle}>
                {children[0]({
                    width: firstStyle.width as number,
                    height: firstStyle.height as number,
                })}
            </div>

            {/* 分隔条，根据 axis 决定传递给 Splitter 的方向 */}
            <Splitter
                {...separatorProps}
                dir={axis === "x" ? "vertical" : "horizontal"}
                isDragging={false}
            />

            {/* 渲染第二个子组件 */}
            <div style={secondStyle}>
                {children[1]({
                    width: secondStyle.width as number,
                    height: secondStyle.height as number,
                })}
            </div>
        </div>
    );
};

export default SplitterView;
