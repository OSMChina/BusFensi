## TODO

成员关系 排序 添加 删除 ✔

新建孤立结点 ✔

在线上新建节点 ✔

拆分线路（记得修改所有关联 relaion）✔

修复逻辑，id 只是在 node/way 内部唯一，改吧改吧！别惦记那复用了 ✔

拆分 active featyre, 不参与 select （至少不直接参与）,仅在 prop edit 里面作为 tab 供选择，不全局状态 ✔


style，目前先写 node 公交站和 stop point，变成白底黑 icon, 加上 line 方向箭头，差不多了 ✔

各种 tooltip

父元素关系的显示

合并 settings 到 state, 不用 ignore 反正 setting 撤回也很正常 ✔

### base 需求

tot ddl: This week!

需要看上去像个编辑器，拥有基础的功能，可以做到跑通编辑流程（即理论可以通过基础的编辑行为的组合完成编辑，暂且不管繁琐程度/复杂度）

还差的点:

#### Function 

ddl: Today !

很遗憾还没有补上最后的功能，包括新建 way relation， 删除 feature，导出 JOSM XML

- 新建 way （多选 node 来实现）： 就是把当前选中的 node 按顺序放进去
- 新建 relation 按一个按钮+选中： 直接加，然后丢进 select
- 删除 node way relation，加一个 action delete, 把 meta 扔进 deleted
- 哦，对了，还有个 insert member,给他安排到，嗯，fixed, 列表右边，丑点就丑点吧。哦记得 drag 列表里面有名字的换成名字
- 加一个 edit role
- 导出 JSOM XML

#### Style

ddl: Friday!

目前的红线+黑点肯定是不行的。起码得有个方向

- 加上 way 的方向渲染，嗯，顺序应该好解决，就是箭头怎么画的，抄 rapid 去
- 加上 Node 的 icon 渲染（目前只需要站台），也抄 rapid
- Node 的 Name 渲染，在 hover 的时候渲染 name 在 底下，自己 offset 一下，也许也挺快……吧？

#### Editor

ddl: Saturday!

也许，你需要看看，zundo 是不是……在正常工作？

但是什么时候撤回呢？嗯，正在编辑的时候多半不能，stateMachine 自己监听 keyboard, 然后给 Idle 传吧，仅在 Idle 的时候处理 

然后，你需要检查它的功能是否正常，记得严格一点

唉唉，以后 advance 那边一定要加上 test case 来检验各个 action 正确性

#### 周报

ddl: Sunday!

还欠两篇周报呢

### base 需求+

ddl: Next week

这些算是在“交差”和“完善”中间比较尴尬的部分，也是基础要做到的。

#### 路线

你是否还记得……那个首页挂着的，自！动！画！路线！

下周的工作就是这个了。去找找各种寻路 API, 给他们灌数据

#### 补充功能

你又忘记了 outline 的搜索，快来实现吧

改改 filter 就好咯，哦对了还有递归往上更新 active ，另一个函数，逐层向上🤓

嗯，你的 ID 显示……要不加个name再给tag限制宽度

settings 给他按进 store

#### 编辑上传

OGF 那块早就准备好的地图，来吧！

哦对了这个时候 settings 应该已经进 zustand 了。你 settings 可以通过一个按钮 + modal 来修改，反正弹一个就弹一个吧

试着用你自己的辣鸡软件来污染 OGF 吧，哦对了甚至还要借助 JOSM 来污染，哈哈

### 结项

base 肯定是完成了，base+完成不了也就先放到后面得了，提交你的 pr 和报告吧，别忘了通知下修改邮箱

### 补充需求

schedule： 10 月

必须完成 base+

写上你的右键菜单吧