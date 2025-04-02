# TODO

### Implementation Goals / 实现目标

1. [ ] Create new bus routes. Required operations: / 新建公交线路。需要的操作为：

    - [X] Manually select or create stops to generate a stop-only bus route.  
    手动选择或者新建一些站点，得到纯站点公交线路。
    - [X] Manually select paths in order to generate a bus route. This may involve drawing operations, such as specifying control points with the mouse for flexible selection. May need to handle: bidirectional routes.  
    手动按顺序选择一定的路径，得到公交线路。这里可能需要用到一些绘制的操作，即通过鼠标指定控制点等方式灵活选择。可能需要处理：双向公交。
    - [ ] Automatically generate bus routes based on stops. Implementation method still undecided.  
自动按照站点生成公交线路。暂时还没想好怎么实现。
    - [X] Modify route metadata, including name, operating unit, etc.  
    对线路元信息的修改，包括名字，运营单位等等。

2. [X] Edit existing bus routes.  
    编辑公交线路。即对于已经存在的公交进行编辑。

    - [X] Add, delete, or reorder stops.  
    对站点进行新增，删除，重新排序。
    - [X] Extend, shrink, delete, or reconnect paths.  
    对路径进行拓展，收缩，删除和重新连接。
    - [X] Modify route metadata, including name, operating unit, etc.  
    对线路元信息的修改，包括名字，运营单位等等。

3. [X] Delete bus routes.  
    删除公交线路。

    - [X] Direct deletion. May consider route splicing in the future.  
    直接删除即可，后续可能会考虑拼接线路的需求。

The above applies to single routes.

以上对于单条线路而言的。

Additionally, we need to conveniently retrieve route information. The current outline is acceptable and can be retained.

同时，我们还需要方便地检索线路信息。目前的大纲还算还行，可以保留。

After completing the core functionalities, we must ensure that the editor theoretically supports full OSM editing without leaving the editor. We can retain the existing features as a "mode," even if they are abstract and difficult to use, as they cover 80% of the Happy Path cases. However, if users have to switch editors for the remaining 20%, it would be frustrating. <s>I’d probably get roasted</s>

在以上的本职工作完成了之后，我们还得保证这个编辑器理论上拥有可以不离开编辑器就能进行完备的 OSM 编辑功能。这里我们可以把现有的功能作为一个“模式”保留，虽然很难用很抽象，但是起码功能是完备的，毕竟 Happy Path 可能可以 cover 80% 以上的需求，但是剩下的如果用到要去别的编辑器倒来倒去那就很难绷了<s>我估计会被喷死</s>。

The initial idea is to introduce an "editing mode" abstraction, replacing the existing logic with a fallback mode. New and improved features will then be built on top of this new mode. The goal is to move beyond the awkward "half-finished" state and achieve productivity—at least reaching the level of JOSM. 

初步的构思是新增“编辑模式”的抽象，把现有的逻辑全部干掉变成 fallback 的一个模式。再在新的模式上面写新的好的功能。希望可以彻底摆脱半成品的尴尬地位，至少可以达到生产力的需求——至少也要达到 JOSM 的水平，吧。

### Technical Approach / 技术路线

I am not entirely satisfied with the current technical implementation, so I will list many areas for improvement.

目前的技术实现我不是很满意，所以我会列出很多需要改进的地方。

After some consideration, I decided to rewrite some of the original implementations. If the previous technical approach is not mentioned here, it generally means it has been "optimized" away. This can be considered a relatively complete technical roadmap.

经过了一番思考我决定吧原来的一些写法推翻重写，所以原先的技术实现如果在这里没有提及，一般来说就是被“优化”掉了。这里可以看作是一个相对完整的技术路线。

#### View Abstraction / 视图的抽象

This time, Outline and Property will be standardized as "views"—a set of adaptive-length standardized elements with fixed functionality but theoretically openable anywhere. This abstraction will facilitate right-click menus.

这次会将 Outline 和 Property 规范为“视图”，就是一组自适应长度的规范的元素，功能一定，但是理论上可以在任何地方打开。这里可以方便为右键菜单做同一个抽象形式。

Considering React's Functional Components, we only need to ensure their props share the same Type.

考虑到 React 的 Functianal Component, 只需要规定他们的 props 相同 Type 即可。

- [X] Define a View specification  
    定义一个 View 规范
- [X] Migrate Outline and Property to View  
    将 Outline 和 Property 迁移到 View

##### Right-Click Menu / 右键菜单

The right-click menu should be a view in essence, but it can behave like a modal-positioned component, appearing at specified pixel coordinates. The caller can pass a view as a child, similar to a utility class. It can be a sub-utility of Map View.

右键菜单的本体应该是视图，不过它表现上可以作为一个类似 modal 定位的 component,可以在制定的 px 下面显示出来。调用者给他一个视图作为 child 就行，类似一个工具类吧。可以作为 Map View 的子 util。

- [X] Complete Right Click Modal  
    完成 Right Click Modal

##### Outline View / Outline 视图

The view should include a mode for listing and quickly retrieving all current metadata. Requirements:  
视图当中应该有一个可以用来列出和快速检索当前的所有 metadata 的一个模式，需求：

- [X] Retrieve all current data, including Relation, Way, and Node  
    能够完整得到当前获取的数据，包括 Relation, Way, Node
- [X] Filter for specific data of interest, such as public transport data  
    能够得到我们关心的某一类数据，比如公共交通数据
- [X] Access data under editing, such as Selected elements  
    能够得到我们编辑中的数据，比如 Selected

This can be implemented using Tabs, with corresponding Click Buttons (e.g., Select) for actions.  
这里我们可以用 Tabs 来实现。然后在对应的 Click Button （比如 Select ）里面去做。

##### Property View / Property 视图

- [X] Display the current Active element. Selected elements can be multiple, but Active is unique among them.  
    显示当前的 Active 元素。Select 元素可以有多个， Active 属于 Select 且唯一。
- [X] Split into three tabs: Info, Tags, and Members  
    拆出三个 tab 一个 info 一个 tags 和一个 members
- [ ] Style of title, insert member batch selection.  

#### 重构 Zustand 状态管理

- [X] 首先修复 persist state
- [X] 其次，需要拆分 state 了，完全不同的状态需要不同的 slice, 比如 zoom 和 lat lon 可以用 URL store 中间件，而编辑数据需要存在 zundo 中间件。最后在这些 middleware 暴露的接口上面组成一个完整的全局 store 以供使用。

#### Editing Mode Abstraction / 编辑模式的抽象

The editing mode is a newly introduced abstraction, belonging to the map view as a sub-mode.

编辑模式是新引入的一个抽象，属于地图视图，是地图视图的子模式。

The mode needs to display and edit data. Data display uses a set of layers (Layer) to render components. The outermost JSX of a layer is a PIXI Container, which draws various graphics based on data state.

模式需要展示数据和编辑数据，数据的展示拥有一组图层（Layer）来显示组件。图层的 JSX 最外层就是一个 PIXI Container, 在 Container 里面根据数据状态绘制各种图像。

For editing functionality, a Controller is required to accept user input and manipulate data. Since the data is provided by Zustand as a local global state, it naturally decouples from data display.

对于编辑功能需要一个 Controller, 接受用户的输入，对数据进行操作。由于数据是 Zustand 提供的本地全局状态，因此可以自动和数据展示解耦。

The Controller implementation will be complex, so a state machine (stateMachine) will be used to abstract and generalize how user behavior affects data in specific states. This can be understood as the output of state transitions in the state machine.

Controller 的实现会比较复杂，所以会给 Controller 一个状态机（stateMachine）来做抽象，归纳用户行为在对应状态下对数据的影响，可以理解成状态机状态转换的输出。

- [X] Define Mode Component, using a Tabs-like switching mechanism  
定义 Mode Component，使用类似 Tabs 的切换方式
- [X] Integrate existing code into Mode Component  
将现有代码装进 Mode Component
- [X] Define Controller(StateMachine) to accept events and execute actions  
定义 Controller(StateMachine), 接受各种事件，并且执行行为

##### State Machine Implementation / State Machine 实现

The current State Machine implementation lacks modularity. While advanced abstractions like behavior trees aren't necessary (though functionally similar, mainly differing in peripheral functions), substate abstraction is feasible. This allows for abstractions like "draw a point after pressing a button."

现在有 State Machine 的实现，就是不够模块化。虽然不需要搞出行为树这种高级抽象（虽然已本质上没啥差别，主要体现在外围 function 上面），搞点 substate 的抽象还是可以的，这样就可以写类似“按下按钮之后画一个点”这样的抽象。

Modularity requires runtime instantiation (e.g., `new`) to avoid conflicts between substates (especially for future extensions). Existing code needs a thorough refactor.

因为需要模块化，就需要在运行时 new 一些 instance 出来，这样就不会出现不同的 substate 打架的可能性（如果后续拓展的话）。现有的代码都需要一次彻底的重构。

Treating state machine data operations as outputs is understandable since data remains unidirectional. The Zustand interface can be seen as a composite of edit system, data model, and view model, with flexibility for future customization.

以及，将状态机操作数据看作一种输出，应该也算能够理解的行为，毕竟至少数据还是单向流动的。所以暂时不对这个部分开到，毕竟可以将 zustand 提供的接口视为 edit system， data model 和 view model 的复合，至少在目前还没有局限，后续根据 zustand 的灵活性也能定制拓展。

- [X] Create a State Class to standardize instantiation, connections, and transition functions (e.g., `appendTransform` after `new`)  
新建一个 State 的 Class, 规范化 State 的实例化和连接，以及状态转移函数。比如 new 之后 appendTransform
- [X] Refactor State Machine: remove `retain`, unify event interfaces, allow chaining with `appendNext`  
重构 State Machine，取消 retain, 取消对每个事件的接口，统一抽象。允许 State Machine 之间相互拼接， 使用 appendNext
- [X] Connect Controller to State Machine  
将 Controller 接入 State Machine

#### Public Transport Business Logic / 新建公交相关业务逻辑编写

With the new abstraction, we can now implement business logic.

现在有了新的抽象，就可以对这个抽象去写出新业务了。

##### Create Empty Bus Route / 新建空公交线路

Click the "New Bus" button to create an empty route and enter bus editing mode.

按下新建公交按钮，新建空线路，进入公交编辑模式。

This creates a new Relation and requires a metadata editing guide (using Property View). The Property View implementation can be deferred for later adjustments based on needs.

这里就新建一个 Relation，并且需要一个编辑 metadata 的引导：使用 property view 。那么这个 property view 的实现暂时放着，我们后续根据需求重新调整抽象。

Names and other fields need prompts, but advanced relation editing (e.g., direct tag addition) is also supported.

总之，名字什么的还是需要提示的，但是也支持高级的关系编辑直接加 tags

- [X] Add a Mode-switching button column in Map View (e.g., top-left corner)  
    在 Map View 当中添加切换 Mode 的一列按钮。可以放在左上角。

##### Create and Add Stops / 新建和添加站点

This could be a sub-editing mode. Since it's controlled by the State Machine, coupling within the Mode abstraction is acceptable.

这个应该算一个子编辑模式？反正是由 State Machine 控制的，属于 Mode 抽象内部的私事，耦合就耦合吧。

Three actions are supported:  
在这里可以做三件事：

- [X] Click "New Simple Stop" to draw a point and auto-add to stops  
    按下新建简易站，绘制一个点，自动添加到站点中
- [X] Create a stop position on the route  
    在线路上新建一个停车位置
- [X] Right-click a stop to open a menu and add it to the relation  
    选择一个公交站，右键，打开菜单，将其加入关系。

Stop order can also be adjusted in Property View.

然后还可以在 property view 里面给站点的顺序进行调整。

##### Manual Route Creation / 手动新建线路

This introduces complex business logic. Refer to handwritten notes for details. Essentially, control points are specified, and a simple shortest-path algorithm plans the route. For real-time editing, local computation is prioritized (even if pathfinding is imperfect, control points can be added per intersection).

具体参考我的手稿，大体就是通过指定控制点，通过简单的最短路算法计算并且规划线路。这个为了编辑实时性得本地计算，暂时写个简单的抽象进去。就算寻路全烂了，大不了每过一个路口打一个控制点。

- [X] Complete state machine definition for editing behavior  
    完成编辑行为的状态机定义
- [ ] Implement pathfinding and related functions  
    完成寻路等功能的函数实现
- [X] Integrate editing functionality  
    接入编辑功能

##### Automatic Route Creation / 自动新建线路

Research OSRM's API for route planning and directly delegate to it.

研究 OSRM 的 API, 看看他们怎么规划，然后直接无脑丢。

#### Edit Bus Routes / 编辑公交线路

Requirements are similar to above, introducing an editing workflow.

需求类似上方，引入一个编辑线路流程

##### Select Route / 选择线路

Needed to display existing routes on the map for right-click editing. Outline View should also support entry.

这个确实需要。就是说地图上要有一个显示已有线路的样子，然后可以右键线路进入编辑。然后呢，还有一个 Outline View 应该也可以点进去

##### Partial Redraw / 局部重绘

Redraw a segment between a start and end point on an existing route, following prior logic.

在已有线路上确定一个开始点和一个结束点，参考之前的逻辑

##### Full Restart / 全部重开

Same as above.  

同前

##### Manually Specify Relation Path / 手动指定关系的路径

This requires coordination with Property View. Inspired by Blender, a "picker" could select elements, but the abstraction is unclear. May introduce technical debt.

这个得和 property 里面搞配合了。我想到的是 blender 的行为，就是把关系编辑器搞个吸管去 select，但是不清楚怎么抽象好。可能会开洞。

Temporarily deferred; manual mode is sufficient.

暂时不做也行，相信纯手工模式

#### Fallback Manual Mode / fallback 纯手动

We can package all the remaining unimplemented features into a purely manual mode. Sounds great.

这个我们可以把剩下的功能没做进去的全部打包成一个纯手工模式，嗯，非常好。

#### Cross-View Relationship Management / 一些跨 View 的关系管理

This is important. For example, how to handle the classic "select" functionality. Specifically, how to implement features that require "drilling holes" (cross-view interactions).

这很重要，比如典中典 select 应该怎么处理。就是说一些需要开洞实现的功能怎么操作。

How can I switch the state of the Map View when the eyedropper in the Property View is clicked, ensuring that only compatible parts of the currently displayed entities are selectable? This requires further thought and may overturn the current draft design.

我怎么做到按下 Property View 中的吸管的时候把 Map View 的状态给切了去 select, 而且能 select 到的是当前显示的实体中可以兼容的部分。这个还需要思考，可能还会推翻现在的草稿设计。

### Code Organization / 代码组织

My personal code organization is quite casual, so I’m facing backlash here. One issue is overly deep folder hierarchies, and another is that shared functionality isn’t prominent enough.

我个人的代码组织是比较随意的，所以这里吃回旋镖了。一个是文件夹层级过深，另一个是公共功能不够明显。

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

所以现在需要实现：

- [X] `components`: Split into `pixi` and `common` folders. Leave common empty for now. Move PIXI components in, ensuring they rely on props rather than store hooks. Export each component via index.tsx.  
    `components`: 分成 `pixi` 和 `common` 两个文件夹好了。暂时让 common 空着。接下来把 pixi 的组件移进去。需要注意的是这里的 pixi component 需要改成一个完整的依赖 props 的渲染，而不是依赖 store hooks。每个组件分别用 index.tsx 导出
- [X] store: Follow this standard: <https://github.com/lobehub/lobe-chat/wiki/State-Management-Intro>. Split into `osmmeta` and `settings` (one complex, one simple). Each subfolder exports a Zustand hook via index.ts.  
`store`: 按照这个标准来写 <https://github.com/lobehub/lobe-chat/wiki/State-Management-Intro.zh-CN>。暂时分成 `osmmeta` 和 `settings` 两个部分，一个复杂，一个简单。每个子文件夹 `index.ts` 导出一个 zustand 的 hook
- [X] `views`: 每个二级文件夹代表一个完整的 view。暂定 `outline` `property` `map`，每个分别一个 `index.tsx` 导出即可  
Each subfolder represents a complete view. Tentatively, include `outline`, `property`, and `map`, with each exporting via an `index.tsx`.  
- [X] `app` 组装成整个 APP。里面包含 layout 等逻辑。这里的逻辑很可能会比较乱，比较杂，但是无所谓，乱到一定程度就拆组件。/ Assemble the entire application here. It will contain layout logic and more. Although the logic might get messy, that’s acceptable—if it becomes too convoluted, it can be split into components later.  

## Goals Sorted by Date  
按时间排序目标

### Before March 10, 2025  
2025 年 3 月 10 日之前

- Complete all tasks for editing bus stops  
完成公交站点编辑的所有内容
  - [X] Show a selection box, using a dashed brown line (implemented with a semi-transparent rectangle).  
显示选择框，就用虚线配一个棕色（用半透明矩形了）
  - [X] Introduce `selected` in the outline.  
在 `outline` 中引入 `selected`
  - [X] Complete the abstract member picker that allows internal members to be dragged individually, and external members to be selected from features. Support batch operations.  
完成抽象的 member picker，允许内部成员单项拖拉拽，外部从选择的 feature 当中引入。允许批量操作
  - [X] Refactor `CreateFeatureTag` into `CreateFeature`, allowing members to be included during creation.  
重构 `CreateFeatureTag`，将其变为 `CreateFeature`，允许在创建时引入 member
  - [X] Implement `New Stop Area`.  
写出 `New Stop Area`
  - [X] The PIXI Point should display a name.  
PIXI 的 Point 将会显示 Name
  - [X] The member list elements in `Property` should now use the same rendering method as the outline.  
`Property` 中的 member 列表元素现在会使用与 `outline` 相同的渲染方式
  - [ ] (Optional) Display the `Stop Area` on the map.  
（可选）让 `Stop Area` 在地图上显示出来

## Before March 22, 2025  
2025 年 3 月 22 日前

- Complete the feature for associating bus stops with bus routes  
    完成公交线路引入公交站点的内容
  - [X] Select or create a bus route.  
    选择或新建线路
  - [X] Step 1: Bus Stops  
    第一步：公交站点
    - [X] <s>Display the bus stop relationships of the route by highlighting all current bus stops,</s> then show the order of the current stops at the corresponding positions.  
     <s>显示线路公交站点关系，将当前所有公交站点用 highlight 属性标出，</s>然后在对应位置显示当前站点排序
    - [X] Insert bus stops, allowing right-click to add them to the current route.  
    插入公交站点，允许右键添加到当前线路中
    - [X] Delete bus stops, either via <s>right-click (option removed)</s> or manually.  
    删除公交站点，<s>允许右键，</s>也可以手动
  - [ ] Step 2: Route  
    第二步：线路
    - [ ] Click on a point on the path and highlight it. Store the sequence of this point along with the way order in the bus slice.  
    点击路径上的点，用 highlight 属性标出。将这个点的顺序和 way 顺序存入 bus slice 中。
    - [X] The above requirement is temporarily on hold; the current implementation refers to the bus stops.  
    上述需求暂时冻结，目前实现参考公交站点

# Other Improvements / 其他优化

These features are planned to be introduced, but the design for their integration is not finalized yet.  
这些功能准备引入，但是没有设计好怎么加入。

- [ ] Add a JOSM data import feature.  
      加入 JOSM 导入数据功能
- [X] Add a button to toggle slide-loading on/off.  
      添加一个开启/关闭滑动加载的按钮
- [ ] Fractional zoom scaling.  
      分数 zoom 缩放
- [ ] **(Important)** Implement zoom scaling beyond 19, referring to the fractional zoom implementation.  
      **（重要）** 超出 19 的 zoom 缩放，参考分数缩放实现
- [ ] Adjust the numeric values for zoom and longitude/latitude.  
      zoom 和 lon/lat 的数值修改
- [ ] Configure the console log level.  
      console log level
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

---

# Known Issue / 已知问题

- [X] <s>**(HIGH)** The map becomes very laggy when dragging, sometimes not responding at all regardless of element display. Need to determine whether it’s a React or PIXI event issue.</s>  
      <s>**(HIGH)** 拖动地图的时候很卡，具体表现为有时候拖不动，不管有没有元素显示都一样。需要搞清楚是 react 还是 pixi 事件问题。</s>  
  **Current status:** It was determined to be a debounce issue; debounce has been disabled for now, with further investigation planned.  
  **当前说明：** 已确定为 debounce 的问题，先关闭 debounce，后续再研究。

- [X] <s>**(HIGH)** The drag implementation in Property was incorrect—if a way and a node share the same id, editing errors occurred. The following commits fixed this.</s>  
      <s>**(HIGH)** Property 的 drag 实现是错的，如果有 way 和 node 撞 id 就会编辑出错。下面几个 commit 就修复</s>  
  **Current status:** Fixed.  
  **当前状态：** Fixed.

- [X] <s>**(MEDIUM)** Computed properties had performance issues that needed optimization.</s>  
      <s>**(MEDIUM)** computed 属性性能较差，需要优化。</s>  
  **Current status:** Removed the collection logic in the computed middleware; performance tests show acceptable results.  
  **当前状态：** 已移除 computed middleware 中 collection 的逻辑，实际测试性能合格。

- [X] <s>**(MEDIUM)** After dragging, the select dash line would not disappear. Fix it when possible.</s>  
      <s>**(MEDIUM)** 拖动后 select dash line 并不会消失。哪天顺手修一个</s>  
  **Current status:** Fixed  
  **当前状态：** Fixed

- [ ] **(MEDIUM)** The full state history in zundo consumes a lot of memory, and the provided diff interface assumes a delta state—only handling a flat state and not supporting incremental changes for nested states. Also, there is no merge interface provided, so you either have to manually fork and extend zundo or use a separate middleware to inject a set function for deepMerge.  
      **(MEDIUM)** zundo 的全量状态历史记录非常耗内存，而且提供的 diff 接口假设 delta state，只能处理单层 state，对 nested state 不支持增量。并且没有提供 merge 接口，所以需要手动 fork 并扩展 zundo，或者使用独立的中间件注入 set 函数来实现 deepMerge。

- [ ] **(HIGH)** There was one instance where hover was entered but not exited, resulting in the entire screen being in hover state. (Update) It’s known to be due to localStorage issues; the logic needs to be refactored, separating @_localState.  
      **(HIGH)** 出现过一次只进 hover 不退出 hover，导致全屏都是 hover，但没有复现。（更新）已知是 localStorage 爆了的原因，需要将逻辑重新拆分，把 @_localState 拆出来。

- [X] **(MEDIUM)** There is no logic defined for repeatedly adding multiple bus stops. Consider using shift + right click.  
      **(MEDIUM)** 没有定义多个公交站反复加入的逻辑。可以使用 shift + right click
- [X] **(HIGH)** Create Stop Area and create route won't init tags
- [X] **(HIGH)** Export JOSM format incorrect

