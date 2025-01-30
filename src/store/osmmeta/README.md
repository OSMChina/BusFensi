# OSM Map Store 使用说明

## 极简 Note

对外的函数统称 Action, Action 默认会保存 state 到 zundo ，允许撤销重做。管这叫 commit。

而有些需要连续修改的行为，比如移动点，需要手动控制保存粒度。

函数名以 NC 结尾的不会保存。需要在调用对应的函数之前调用 commit。因为 zundo 的历史记录行为是，当前状态和上一个状态不同时，将上个状态放入 pastStates, 撤销行为则是退回上一个 state。那么如果不先 commit 掉（上一个状态），撤下次销会跟着上个更改一起撤销。