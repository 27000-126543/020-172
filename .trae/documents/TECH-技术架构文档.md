## 1. 架构设计

```mermaid
graph TD
    A["桌面应用层 (Electron)"] --> B["前端UI层 (React 18)"]
    B --> C["状态管理 (Zustand)"]
    B --> D["组件库 (自定义 + TailwindCSS)"]
    C --> E["数据服务层"]
    E --> F["本地数据存储 (SQLite/LocalStorage)"]
    E --> G["Mock数据服务"]
    D --> H["话术浮窗组件"]
    D --> I["预约列表组件"]
    D --> J["风险提示组件"]
    D --> K["复诊模板组件"]
    H --> L["打印服务 (Electron Print)"]
```

## 2. 技术描述

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：TailwindCSS 3 + CSS Modules
- **桌面容器**：Electron 28（提供桌面浮窗、系统级打印、窗口管理能力）
- **状态管理**：Zustand（轻量级，适合中小规模应用）
- **数据存储**：LocalStorage（用户配置）+ 内置JSON Mock数据（患者、话术库）
- **图标库**：Lucide React（医疗相关线性图标）
- **动画库**：Framer Motion（流畅的标签切换和浮窗动画）

## 3. 路由定义

| 路由 | 页面/组件 | 功能说明 |
|------|-----------|----------|
| / | 预约列表首页 | 展示当日预约患者列表，主界面 |
| /floating | 话术浮窗 | 独立浮窗路由，可作为子窗口弹出 |

> 注：由于是桌面浮窗应用，话术浮窗将通过 Electron 的 BrowserWindow 作为独立子窗口创建，而非传统路由跳转。

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    PATIENT {
        string id "患者ID"
        string name "姓名"
        string gender "性别"
        int age "年龄"
        string phone "电话"
        string[] riskFactors "风险因素(高血压/糖尿病/孕期/长期服药)"
        string medications "长期服药说明"
        string notes "特殊备注"
    }
    
    APPOINTMENT {
        string id "预约ID"
        string patientId "患者ID"
        string date "预约日期"
        string time "预约时间"
        string treatmentType "治疗项目"
        string status "状态(待诊/就诊中/已完成)"
        string doctorId "接诊医生ID"
    }
    
    SPEECH_TEMPLATE {
        string id "话术ID"
        string category "分类(检查前/拍片前/治疗中/结束交代)"
        string treatmentType "适用治疗类型"
        string[] contents "话术内容列表"
        int order "排序"
    }
    
    RISK_SPEECH {
        string id "风险话术ID"
        string riskType "风险类型"
        string[] questions "询问话术"
        string[] disclaimers "告知话术"
    }
    
    REVIEW_TEMPLATE {
        string id "复诊模板ID"
        string treatmentItem "治疗项目"
        string[] verbalInstructions "口头交代要点"
        string[] printedNotes "打印小票内容"
        string nextVisit "下次建议"
    }
    
    PATIENT ||--o{ APPOINTMENT : "有"
    SPEECH_TEMPLATE }o--o{ APPOINTMENT : "适用"
    RISK_SPEECH }o--o{ PATIENT : "匹配"
    REVIEW_TEMPLATE }o--o{ APPOINTMENT : "适用"
```

### 4.2 Mock数据结构示例

```typescript
// 患者数据
interface Patient {
  id: string;
  name: string;
  gender: '男' | '女';
  age: number;
  riskFactors: ('hypertension' | 'diabetes' | 'pregnancy' | 'longTermMedication')[];
  medications?: string;
  notes?: string;
}

// 预约数据
interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  date: string;
  time: string;
  treatmentType: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// 话术模板
interface SpeechTemplate {
  id: string;
  category: 'before-exam' | 'before-xray' | 'during-treatment' | 'post-treatment';
  treatmentType: string;
  contents: string[];
}

// 风险话术
interface RiskSpeech {
  riskType: string;
  questions: string[];
  disclaimers: string[];
}

// 复诊模板
interface ReviewTemplate {
  treatmentItem: string;
  verbalInstructions: string[];
  printedNotes: string[];
  nextVisitOptions: string[];
}
```

## 5. 核心模块说明

### 5.1 浮窗管理模块
- 基于 Electron BrowserWindow 创建独立子窗口
- 支持窗口拖拽、贴边、最小化、始终置顶
- 父子窗口通信（IPC）传递患者数据

### 5.2 话术匹配引擎
- 根据治疗项目类型匹配对应话术模板
- 根据患者风险因素自动注入风险提示话术
- 支持医生自定义话术收藏

### 5.3 复诊生成模块
- 基于勾选的治疗项目组合生成口头交代
- 自动排版打印小票格式（58mm热敏打印机适配）
- 支持打印预览和直接打印

### 5.4 数据层设计
- 所有话术、模板数据内置为 JSON Mock 数据
- 患者预约数据可通过配置接口对接医院HIS系统
- 本地存储用户偏好设置（窗口位置、常用话术等）

## 6. 目录结构

```
├── src/
│   ├── main/                 # Electron 主进程
│   │   ├── main.ts           # 主进程入口
│   │   ├── windowManager.ts  # 窗口管理
│   │   └── printService.ts   # 打印服务
│   ├── renderer/             # React 渲染进程
│   │   ├── components/
│   │   │   ├── AppointmentList/    # 预约列表
│   │   │   ├── FloatingWindow/     # 话术浮窗
│   │   │   ├── RiskAlert/          # 风险提示
│   │   │   ├── SpeechTabs/         # 四标签话术
│   │   │   └── ReviewTemplate/     # 复诊模板
│   │   ├── store/            # Zustand 状态管理
│   │   ├── data/             # Mock 数据
│   │   ├── types/            # TypeScript 类型定义
│   │   └── utils/            # 工具函数
```
