import { Node, Way, Relation } from "../../../type/osm/meta";
import { typedKeys } from "../../../utils/helper/object";

type Primitive = string | number;

export function Attributes({ meta }: { meta: Node | Way | Relation }) {
  // 先获取对象所有键，再过滤出以 "@_" 开头且值为 string 或 number 的键
  const validKeys = typedKeys(meta).filter(
    (key): key is keyof (Node | Way | Relation) => {
      const value = meta[key];
      return key.startsWith("@_") && (typeof value === "string" || typeof value === "number");
    }
  );

  return (
    <ul className="menu menu-xs bg-200 rounded-box">
      {validKeys.map((key) => {
        // 显式断言 meta[key] 为 string | number
        const value = meta[key] as Primitive;
        return (
          <li key={key}>
            <span>
              <span className="font-semibold">{String(key).substring(2)}</span>
              <span className="ml-auto text-base-content">{value.toString()}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default Attributes;