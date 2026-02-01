# Fuderation Character Editor

一个独立的纯前端角色编辑器，用于编辑和管理 Fuderation 项目的角色卡。支持 IndexedDB 本地存储，无需后端服务器。

## 功能特性

### 📦 数据管理
- ✅ **IndexedDB 本地存储** - 所有数据保存在浏览器本地，无需服务器
- ✅ **角色列表管理** - 导入的角色自动保存到列表
- ✅ **自动保存** - 编辑时自动保存，防止数据丢失
- ✅ **导入/导出** - 支持 JSON 格式角色卡的导入和导出

### 🎨 角色编辑
- ✅ 编辑角色基本信息（名称、描述、头像、标签等）
- ✅ 管理多个故事线
- ✅ 编辑故事线详细设置（人格、场景、开场白等）
- ✅ 世界书（Lorebook）编辑器
- ✅ 正则脚本编辑器
- ✅ 快捷回复编辑器
- ✅ 故事线排序和复制
- ✅ 导出故事线预设

### 🎯 用户体验
- ✅ 美观的现代化界面设计
- ✅ Font Awesome 图标
- ✅ 响应式布局，支持移动端
- ✅ 毛玻璃效果和渐变设计
- ✅ 流畅的动画效果

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Font Awesome 6
- IndexedDB API

## 安装和运行

### 安装依赖

```bash
cd CharacterEditor
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

## 使用说明

### 1. 导入角色卡

1. 点击顶部的"导入角色卡"按钮
2. 选择从 Fuderation 导出的 JSON 文件
3. 角色卡将自动保存到 IndexedDB 并显示在列表中
4. 自动进入编辑模式

### 2. 角色列表

- **查看列表**：首页显示所有已导入的角色
- **选择角色**：点击角色卡片进入编辑模式
- **导出角色**：点击角色卡片上的导出按钮
- **删除角色**：点击角色卡片上的删除按钮

### 3. 编辑角色

- **基本信息**：编辑角色名称、描述、头像、标签等
- **故事线**：添加、编辑、删除、排序故事线
- **世界书**：为每个故事线配置世界书条目
- **正则脚本**：添加文本替换规则
- **快捷回复**：配置快捷回复按钮
- **自动保存**：编辑时自动保存到 IndexedDB

### 4. 保存和返回

- **返回列表**：点击"返回列表"按钮，自动保存当前编辑
- **保存并返回**：点击"保存并返回"按钮，手动保存并返回列表

### 5. 导出角色卡

- **从列表导出**：在角色列表中点击导出按钮
- **从编辑器导出**：在编辑模式下点击顶部的"导出角色卡"按钮

## 数据存储

### IndexedDB 结构

- **数据库名称**：`FuderationCharacterEditor`
- **版本**：1
- **对象存储**：`characters`
- **索引**：
  - `updatedAt` - 更新时间（用于排序）
  - `createdAt` - 创建时间

### 数据记录格式

```typescript
interface CharacterRecord {
  id: string;              // 唯一标识符
  character: Character;    // 角色数据
  createdAt: number;       // 创建时间戳
  updatedAt: number;       // 更新时间戳
}
```

### 数据持久化

- 所有数据保存在浏览器的 IndexedDB 中
- 数据不会过期，除非手动删除或清除浏览器数据
- 支持离线使用
- 不同浏览器的数据相互独立

## 数据格式

编辑器完全兼容 Fuderation 的角色卡格式，包括：

- 角色基本信息
- 多个故事线
- 世界书配置和条目
- 正则脚本
- 快捷回复
- 视觉小说模式设置
- BGM 列表

## 项目结构

```
CharacterEditor/
├── src/
│   ├── components/          # React 组件
│   │   ├── CharacterEditor.tsx
│   │   ├── CharacterBasicInfo.tsx
│   │   ├── CharacterList.tsx      # 角色列表组件
│   │   ├── StorylineList.tsx
│   │   ├── StorylineEditor.tsx
│   │   ├── LorebookEditor.tsx
│   │   ├── RegexScriptEditor.tsx
│   │   └── QuickReplyEditor.tsx
│   ├── types/              # TypeScript 类型定义
│   │   └── character.ts
│   ├── utils/              # 工具函数
│   │   ├── fileHandler.ts  # 文件导入导出
│   │   └── indexedDB.ts    # IndexedDB 封装
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 需要支持 IndexedDB API

## 注意事项

1. **数据备份**：建议定期导出角色卡作为备份
2. **浏览器数据**：清除浏览器数据会删除所有角色
3. **跨浏览器**：不同浏览器的数据不共享
4. **隐私模式**：隐私/无痕模式下数据可能不会持久化

## 许可证

与 Fuderation 主项目保持一致。
