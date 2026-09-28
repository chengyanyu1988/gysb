import React, { useState } from 'react';
import {
  Home,
  Search,
  RotateCcw,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  ArrowDown,
  ArrowUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Boxes,
  Layers,
  Settings,
  X,
  Check,
} from 'lucide-react';

interface CommonViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export { InboundReceiptView } from './InboundReceiptView';
export { OutboundPickingView } from './OutboundPickingView';
export { ReturnGoodsManagementView as ReturnGoodsView } from './ReturnGoodsManagementView';
export { ReturnGoodsListView } from './ReturnGoodsListView';
export { ReturnGoodsAddView } from './ReturnGoodsAddView';
export { ReturnGoodsDetailView } from './ReturnGoodsDetailView';
export { ReturnGoodsSelectModal } from './ReturnGoodsSelectModal';

// 4. 通用配置管理视图 (Configuration Views)
interface ConfigViewProps {
  title?: string;
  categoryType?: string;
  type?: 'basic' | 'equipment' | 'spare' | 'approval';
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const GenericConfigView: React.FC<ConfigViewProps> = ({ title, categoryType, type, showToast }) => {
  const resolvedTitle = title || (
    type === 'basic' ? '基础配置' :
    type === 'equipment' ? '设备配置' :
    type === 'spare' ? '备件配置' :
    type === 'approval' ? '审批流配置' : '系统配置'
  );
  const resolvedCategory = categoryType || resolvedTitle;

  const [items, setItems] = useState([
    { id: 'c-1', name: `${resolvedCategory} - A类主力级`, code: 'CFG-001', remark: '系统默认基础配置项', updateTime: '2026-09-27 18:00:00' },
    { id: 'c-2', name: `${resolvedCategory} - B类通用级`, code: 'CFG-002', remark: '辅助配套标准', updateTime: '2026-09-26 15:30:00' },
    { id: 'c-3', name: `${resolvedCategory} - C类特殊专用`, code: 'CFG-003', remark: '定制化技术参数要求', updateTime: '2026-09-25 10:20:00' },
  ]);

  return (
    <div className="space-y-4 pb-16 text-xs">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">{resolvedTitle}列表</h3>
          </div>
          <button
            onClick={() => {
              const newItem = {
                id: `c-${Date.now()}`,
                name: `新增${resolvedCategory}项`,
                code: `CFG-${Math.floor(100 + Math.random() * 900)}`,
                remark: '自定义配置项',
                updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
              };
              setItems([newItem, ...items]);
              showToast(`已新增${resolvedTitle}项目`, 'success');
            }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增{resolvedTitle}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3 w-12 text-center">序号</th>
                <th className="p-3">名称</th>
                <th className="p-3">编码</th>
                <th className="p-3">说明备注</th>
                <th className="p-3">更新时间 (最新降序)</th>
                <th className="p-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it, idx) => (
                <tr key={it.id} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{it.name}</td>
                  <td className="p-3 font-mono text-slate-700">{it.code}</td>
                  <td className="p-3 text-slate-600">{it.remark}</td>
                  <td className="p-3 font-mono text-slate-600 font-semibold">{it.updateTime}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => showToast(`已编辑配置项 ${it.name}`, 'info')}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline mr-2"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        setItems(items.filter((x) => x.id !== it.id));
                        showToast(`已删除配置项 ${it.name}`, 'info');
                      }}
                      className="text-rose-600 hover:text-rose-800 font-medium hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
