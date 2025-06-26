# Backspace 智能删除 Demo

这是一个智能文本编辑demo，参考了[Tab预测下文](https://kaichen61.github.io/tab/)的设计理念，但专注于智能删除和文本修正功能。

## 功能特性

- **智能拼写检查**: 自动识别并建议修正拼写错误
- **语法错误检测**: 检测语法错误并提供修正建议
- **冗余表达识别**: 识别冗余词汇并提供简化建议
- **实时分析**: 在用户输入时实时分析文本
- **一键应用**: 点击"应用"按钮快速修正错误
- **示例输入**: 提供预设的示例文本进行演示

## 使用方法

1. 打开 `index.html` 文件
2. 点击"示例输入"按钮查看预设的示例文本
3. 系统会自动分析文本并显示修正建议
4. 点击建议旁边的"应用"按钮来应用修正
5. 也可以手动输入文本，系统会实时分析并提供建议

## 示例文本

点击"示例输入"按钮会输入以下文本：
```
We kindly request that you provide the update project timelane by the end of this week.
```

系统会识别出以下问题：
- **拼写错误**: "timelane" → "timeline"
- **语法错误**: "update project" → "updated project"
- **冗余表达**: "kindly request" → "request"

## 技术实现

- **HTML5**: 语义化标签和现代HTML结构
- **CSS3**: 渐变背景、动画效果和响应式设计
- **JavaScript**: 实时文本分析和交互功能

## 文件结构

```
backspace/
├── index.html      # 主页面
├── styles.css      # 样式文件
├── script.js       # JavaScript逻辑
└── README.md       # 说明文档
```

## 浏览器兼容性

支持所有现代浏览器，包括：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 本地运行

直接在浏览器中打开 `index.html` 文件即可运行demo。 