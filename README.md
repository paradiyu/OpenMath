# Open大观园

> 帕拉迪宇大观园开源版本 - 考研数学在线刷题系统

一个纯前端的考研数学在线刷题系统，支持按知识点分类浏览题目，提供详细的解题步骤和答案解析。

## ✨ 功能特点

- 📚 按章节和知识点分类
- 🎯 难度分级（基础/强化/压轴/竞赛）
- 📝 答案和解析查看（默认隐藏）
- 🔢 数学公式完美渲染（KaTeX）
- 🎨 现代化UI设计
- 📱 响应式布局

## 🚀 快速开始

### 在线访问

访问 GitHub Pages 部署的在线版本：`https://your-username.github.io/mathhub`

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/your-username/mathhub.git
cd mathhub

# 启动本地服务器
python -m http.server 8000

# 访问 http://localhost:8000
```

## 📖 开源协议

本项目采用 **MIT License** 开源协议，欢迎自由使用、修改和分发。

## 🤝 贡献指南

我们非常欢迎大家贡献题目！贡献方式非常简单：

### 如何贡献题目

1. Fork 本仓库
2. 编辑 `data/questions.json` 文件
3. 按照以下格式添加题目：

```json
{
  "id": 8,
  "chapter": "高等数学",
  "section": "导数与微分",
  "source": "真题/模拟题来源",
  "difficulty": "基础",
  "content": "题目内容（支持 LaTeX 公式）",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "answer": "A",
  "solution": "详细解析过程"
}
```

4. 提交 Pull Request

### 题目格式说明

- **id**: 题目编号（递增）
- **chapter**: 章节名称（如：高等数学、线性代数、概率论）
- **section**: 小节名称（如：极限、导数、积分）
- **source**: 题目来源（如：李林880、张宇1000题、真题）
- **difficulty**: 难度等级（基础/强化/压轴/竞赛）
- **content**: 题目内容，支持 LaTeX 数学公式
- **options**: 选项数组（选择题必填，证明题可省略）
- **answer**: 答案
- **solution**: 详细解析

### LaTeX 公式语法

- 行内公式：`$公式$`
- 独立公式：`$$公式$$`

示例：
```
行内：设函数 $f(x) = x^2$
独立：$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$
```

## 🛠️ 技术栈

- Vue 3 - 渐进式JavaScript框架
- KaTeX - 数学公式渲染
- 纯前端实现，无需后端服务器

## 📂 项目结构

```
mathhub/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # Vue应用逻辑
├── data/
│   ├── questions.json  # 题目数据
│   └── images/         # 题目图片
└── README.md           # 项目说明
```

## 🌟 Star History

如果这个项目对你有帮助，欢迎给个 Star ⭐️

## 📧 联系方式

如有问题或建议，欢迎提 Issue 或 Pull Request。

---

**Open大观园** - 让考研数学学习更高效 🎓
