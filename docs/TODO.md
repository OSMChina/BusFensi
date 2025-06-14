# TODO

### Code Organization / 代码组织

This time, I want similar logic to be grouped together while introducing a "dependency" concept. Some folders should be independent and not rely on logic from other folders to avoid spaghetti-like entanglement. Temporarily calling this "root logic" (marked with R). Utils can be referenced by root modules (marked with U).

这次我希望让类似的逻辑都放在一起，同时引入类似“依赖”的概念，也就是说有些文件夹应该独立，不依赖别的文件夹里面的逻辑，这样可以避免意大利面条式的交错。暂时管这个叫 root 逻辑？用 R 来标记好了。utils 可以被 root 模块引用，叫 U 好了

The current code organization is messy. I’ve decided to restructure the files as follows:

代码现在的组织很乱。我决定重新调整文件结构。暂时订成这个

```
src
├── api        # (R) 封装的，与 OSM v0.6 后端请求的函数 / (R) Functions wrapping requests to the OSM v0.6 backend
├── app        # 最终的 UI，各个部分在这里组成完整程序 / The final UI where all parts come together to form the complete application
├── components # (R) 公共的，可复用的 UI 组件，原则上应该作为 VDOM 的叶子 / (R) Public, reusable UI components, ideally serving as leaves in the VDOM
├── views      # 应用的视图组件，如 Map, Property 等。每个子文件夹相互独立 / The view components of the application, such as Map, Property, etc. Each subfolder is independent
├── store      # (R) 用于状态管理的 zustand store / (R) Zustand store for state management
├── utils      # (U) 通用的工具函数 / (U) General utility functions
├── config     # （待实现）应用的配置文件，包含客户端环境变量与服务端环境变量 / (To be implemented) Application configuration files, including client-side and server-side environment variables
├── const      # （待实现）用于定义常量，如 action 类型、路由名等 / (To be implemented) Definitions for constants, such as action types, route names, etc.
├── hooks      # （待实现）全应用复用自定义的工具 Hooks / (To be implemented) Custom hooks for general use across the application
├── locales    # （待实现）国际化的语言文件 / (To be implemented) Internationalization language files
└── types      #  TypeScript 的类型定义文件 / TypeScript type definition files```

```

## Goals of next stage

上阶段的 TODO 已经[归档](./archive/todo/TODO-25-06-14-archive.md)，已经完成的内容在此 TODO 中移除。

The previous stage's TODO has been [archived](./archive/todo/TODO-25-06-14-archive.md), and completed items have been removed from this TODO.

下一阶段的目标将在这里更新。

Goals for the next stage will be updated here.

除了上阶段遗留下的 Known issue 一些优化，新阶段的主要的工作有：

In addition to optimizing some known issues carried over from the previous stage, the main tasks for the new stage include:

- 接入 OSRM 的自动路径计算。
  Integrate OSRM's automatic route calculation.
  
- 接入 OSM OAuth 提交数据。
  Implement OSM OAuth for data submission.

由于 OSRM 使用在线的 OSM 数据，而不是本地编辑的数据。因此需要在目前的工作流上进行一些小修高，尽量不鼓励修改已有的道路连接，仅仅专注于公交 route 即可。

Since OSRM uses online OSM data rather than locally edited data, some minor workflow adjustments are needed. We should discourage modifications to existing road connections and focus primarily on bus routes.

对 Auth, 抽象出新的 API，并编写上传逻辑。

For authentication, abstract a new API. Then implememt upload logic.

实现细节正在设计中。

The implememtion details are being designed.

## Other Improvements / 其他优化

These features are planned to be introduced, but the design for their integration is not finalized yet.  
这些功能准备引入，但是没有设计好怎么加入。

- [ ] Add a JOSM data import feature.  
      加入 JOSM 导入数据功能
- [X] Add a button to toggle slide-loading on/off.  
      添加一个开启/关闭滑动加载的按钮
      zoom 和 lon/lat 的数值修改
- [X] Add a button to clear all local data.  
      清除本地所有数据的按钮
- [ ] **Batch operations** on `outline` elements, such as selecting and deleting.  
      **批量操作** `outline` 的元素，比如选择、删除
- [ ] Refactor `view/map` by moving its business logic to `app/map` as the current implementation is too convoluted.  
      重构 `view/map` 将其业务逻辑转到 `app/map`，目前的实现杂糅严重
- [ ] Import JOSM’s Preset from <https://wiki.openstreetmap.org/wiki/Preset>:  
      导入 JOSM 的 Preset：<https://wiki.openstreetmap.org/wiki/Preset>
  - [ ] Define TS types.  
        TS Type
  - [ ] Integrate fast XML.  
        fast XML
  - [ ] Import the preset.  
        导入
- [ ] Auto completion: Automatically suggest possible values for keys in Input.  
      在 Input 中自动补全可能的 key 的 value 的值。
- [ ] URL settings: allow override default settings by URL params, same like iD editor.
- [X] Zoom to pointer position: zoom behavier like iD editor instead of zoom to middle of map.
- [ ] (massive work)Refactor the implementation of the StateMachine to store the current state in Zustand as well. Perform state transitions based on the state stored in Zustand, making it easier to restore the state. This may require modifying the implementation of related components.  
      (大量工作)重构 StateMachine 的实现，将当前的 state 也存进 zustand, 根据 zustand 中存储的状态进行状态的运算，方便恢复状态。可能需要修改相关组件的实现。
- [ ] Adjust the numeric values for zoom and longitude/latitude.  
- [ ] Configure the console log level.  
      console log level
- [ ] Solve all Known issue

---

## Known Issue / 已知问题

- [X] <s>**(HIGH)** The map becomes very laggy when dragging, sometimes not responding at all regardless of element display. Need to determine whether it’s a React or PIXI event issue.</s>  
      <s>**(HIGH)** 拖动地图的时候很卡，具体表现为有时候拖不动，不管有没有元素显示都一样。需要搞清楚是 react 还是 pixi 事件问题。</s>  
  **Current status:** It was determined to be a debounce issue; debounce has been disabled for now, with further investigation planned.  
  **当前说明：** 已确定为 debounce 的问题，先关闭 debounce，后续再研究。

- [X] <s>**(MEDIUM)** Computed properties had performance issues that needed optimization.</s>  
      <s>**(MEDIUM)** computed 属性性能较差，需要优化。</s>  
  **Current status:** Removed the collection logic in the computed middleware; performance tests show acceptable results.  
  **当前状态：** 已移除 computed middleware 中 collection 的逻辑，实际测试性能合格。

- [ ] **(MEDIUM)** The full state history in zundo consumes a lot of memory, and the provided diff interface assumes a delta state—only handling a flat state and not supporting incremental changes for nested states. Also, there is no merge interface provided, so you either have to manually fork and extend zundo or use a separate middleware to inject a set function for deepMerge.  
      **(MEDIUM)** zundo 的全量状态历史记录非常耗内存，而且提供的 diff 接口假设 delta state，只能处理单层 state，对 nested state 不支持增量。并且没有提供 merge 接口，所以需要手动 fork 并扩展 zundo，或者使用独立的中间件注入 set 函数来实现 deepMerge。在使用 indexedDB 重构持久化之后进行修复。

- [X] **(HIGH)** There was one instance where hover was entered but not exited, resulting in the entire screen being in hover state. (Update) It’s known to be due to localStorage issues; the logic needs to be refactored, separating @_localState.(Update Again) plan to use IndexedDB to refactor.   
      **(HIGH)** 出现过一次只进 hover 不退出 hover，导致全屏都是 hover，但没有复现。（更新）已知是 localStorage 爆了的原因，需要将逻辑重新拆分，把 @_localState 拆出来。(再次更新)：使用 indexedDB 进行持久化存储。
      **Current status:** Use IndexedDB for persistent storage to avoid limitation of localStorage.      
      **当前状态：** 使用 IndexedDB 进行持久化存储以避免 localStorage 的限制。

- [ ] **(LOW)** Member list connectivity works incorrectly with way order. The current logic is not strict enough when nodes in a way are reversed. Two ways should be considered connected if they share endpoints.  
      **(LOW)** 成员列表的连接性判断有误，有时候 way 里面的 node 会反过来，然后当前的判断逻辑就不够严谨了。应该认为两个 way 连在一起就算联通
- [ ] **(MEDIUM)** Cannot click the same element consecutively - must hover out and then hover in again. Need to allow transition from idle state to component mouse down state directly.  
      **(MEDIUM)** 无法连续点击同一元素，只能先 hover out 再 hover in。需要允许 idle 状态切到 component mouse down 状态
