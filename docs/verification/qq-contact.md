# QQ 咨询验收

来源：docs/specs/qq-contact.md；用户确认 QQ 3315466882。

| 要求 | 执行证据 | 结果 |
| --- | --- | --- |
| Q1 模块与号码 | JSX 测试定位打开 QQ 链接，解析目标 uin 等于用户号码；本地首页 HTTP 200 | pass |
| Q2 用户点击选择链接 | 模拟 Windows、Android、iPhone、iPad 桌面模式四种环境，确认 tencent/mqqwpa 目标及号码、无消息内容参数 | pass |
| Q3 复制及失败状态 | 模拟剪贴板成功/拒绝，分别验证号码及成功/手动复制提示 | pass |
| Q4 回归与构建 | node --test tests/portfolio.test.cjs：6 passed；tsc 无错误；build:pages 成功；diff --check 无错误 | pass |
| QQ 客户端最终聊天界面 | 未在已安装并登录 QQ 的手机/电脑上执行外部应用跳转 | unverifiable |

网页实现完成；端到端验收 not done，需真实 QQ 设备点击确认。浏览器、QQ 版本和临时会话权限可能阻止唤起/聊天，模块明确提供复制号码手动搜索备用方案。没有发送消息或添加好友。
