# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Ant Design X 是一个专为 AI 驱动界面设计的 React 组件库，基于 RICH 交互范式，提供企业级 AI 对话场景的原子组件。项目支持中英文双语开发和文档。

## 开发命令

### 构建和打包

- `npm run compile` - 编译组件库代码，使用 father 构建工具
- `npm run dist` - 构建用于发布的文件 (需先运行版本更新和 token 统计)
- `npm run clean` - 清理构建产物 (es, lib, coverage, locale, dist 等目录)

### 开发环境

- `npm start` - 启动开发服务器 (端口 8001)，会自动运行版本更新、token 统计和 changelog 检查
- `npm run site` - 构建静态站点到 \_site 目录，用于部署

### 代码质量和检查

- `npm run lint` - 运行所有 lint 检查 (脚本、Markdown、样式、changelog)
- `npm run lint:script` - 使用 biome 检查代码规范
- `npm run lint:md` - 使用 remark 检查 Markdown 文件
- `npm run lint:style` - 检查 CSS-in-JS 样式
- `npm run format` - 使用 biome 格式化代码
- `npm run tsc` - 运行 TypeScript 类型检查

### 测试

- `npm test` - 运行完整测试套件，包含覆盖率收集
- `npm run test:node` - 运行 Node.js 环境测试
- `npm run test:site` - 运行站点相关测试
- `npm run test:dekko` - 运行构建产物检查
- `npm run test:visual-regression` - 运行视觉回归测试

## 代码架构

### 组件结构

项目采用标准的组件库架构，每个组件都包含：

- `index.tsx` - 组件主文件
- `index.zh-CN.md` / `index.en-US.md` - 中英文文档
- `demo/` - 示例代码目录
- `__tests__/` - 测试文件
- `style/` - 组件样式文件

### 核心组件分类

**UI 交互组件:**

- `Actions` - 操作按钮组件
- `Sender` - 消息发送组件，支持文本输入、语音识别、附件上传
- `Bubble` - 消息气泡组件和消息列表
- `Attachments` - 附件处理组件

**对话管理组件:**

- `Conversations` - 对话列表管理
- `Prompts` - 提示词组件
- `Suggestion` - 建议回复组件
- `ThoughtChain` - 思维链展示组件

**系统组件:**

- `Welcome` - 欢迎页面组件
- `XProvider` - 全局配置提供者

**数据流和集成工具:**

- `useXChat` - 对话数据流管理 Hook
- `useXAgent` - AI Agent 集成 Hook
- `XRequest` - HTTP 请求工具
- `XStream` - 流式数据处理工具

### 技术栈

- **构建工具**: father (基于 Rollup)，支持 ES modules 和 CommonJS
- **文档系统**: dumi v2，支持中英文双语
- **样式方案**: CSS-in-JS，基于 @ant-design/cssinjs
- **测试框架**: Jest + @testing-library/react + happy-dom
- **代码规范**: Biome (替代 ESLint + Prettier)
- **类型检查**: TypeScript 5.9

### 主题和样式

- 使用 CSS-in-JS 方案，支持主题定制
- 通过 `components/theme/` 管理主题系统
- Token 系统与 Ant Design 保持一致

### 国际化

- 支持中英文双语文档和示例
- 路由自动处理语言切换 (`-cn` 后缀)
- 文档结构: `*.en-US.md` 和 `*.zh-CN.md`

## 开发注意事项

### 文件命名约定

- 组件文件使用 PascalCase: `MyComponent.tsx`
- Hook 文件使用 camelCase 带前缀: `useXChat.ts`
- 样式文件使用 kebab-case: `bubble.ts`
- 测试文件后缀: `*.test.tsx`

### 组件开发模式

- 每个组件都应提供 TypeScript 类型定义
- 使用 `components/index.ts` 作为统一导出入口
- 支持按需加载和 Tree shaking

### 测试要求

- 组件测试使用 @testing-library/react
- 快照测试用于回归检测
- Demo 代码自动转换为测试用例

### 发布流程

项目使用版本自动生成脚本，在开发前会自动运行：

- `npm run version` - 生成版本信息
- `npm run token:statistic` - 统计 Token 使用
- `npm run token:meta` - 生成 Token 元数据
