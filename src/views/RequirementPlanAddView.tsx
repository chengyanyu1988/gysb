import React, { useState } from 'react';
import {
  Home,
  Plus,
  Trash2,
  X,
  Check,
  Search,
} from 'lucide-react';
import { RequirementPlanItem, RequirementPlanSpareItem, SparePartItem } from '../types';
import { INITIAL_ALL_SPARE_PARTS } from '../data/mockData';

interface RequirementPlanAddViewProps {
  onSave: (newPlan: RequirementPlanItem) => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const RequirementPlanAddView: React.FC<RequirementPlanAddViewProps> = ({
  onSave,
  onBack,
  showToast,
}) => {
  const [items, setItems] = useState<RequirementPlanSpareItem[]>([
    {
      id: 'item-1',
      spareName: '三相异步电机',
      spareCode: 'A07650',
      category: '电气类/电机/三相电机',
      spec: 'Y2-160M-4',
      brand: '佳木斯电机',
      unit: '个',
      supplier: '上海精工机械厂',
      requiredQty: 22,
      budgetAmount: 2200,
      price: 100,
    },
  ]);

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedSpareIds, setSelectedSpareIds] = useState<string[]>([]);

  // Calculate totals
  const totalQty = items.reduce((acc, cur) => acc + (Number(cur.requiredQty) || 0), 0);
  const totalBudget = items.reduce((acc, cur) => acc + (Number(cur.budgetAmount) || 0), 0);

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast('已移除该备件行', 'info');
  };

  const handleUpdateItem = (id: string, field: 'requiredQty' | 'budgetAmount', val: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === 'requiredQty') {
            updated.budgetAmount = val * (item.price || 100);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddSelectedSpares = () => {
    const selected = INITIAL_ALL_SPARE_PARTS.filter((sp) => selectedSpareIds.includes(sp.id));
    const newRows: RequirementPlanSpareItem[] = selected.map((sp) => ({
      id: `rpsi-${Date.now()}-${sp.id}`,
      spareName: sp.name,
      spareCode: sp.code,
      category: sp.category,
      spec: sp.spec,
      brand: sp.brand,
      unit: sp.unit,
      supplier: sp.supplier,
      requiredQty: 10,
      budgetAmount: 10 * (sp.price || 100),
      price: sp.price || 100,
    }));

    setItems((prev) => [...prev, ...newRows]);
    setIsSelectModalOpen(false);
    setSelectedSpareIds([]);
    showToast(`已添加 ${selected.length} 项备件`, 'success');
  };

  const handleSavePlan = () => {
    if (items.length === 0) {
      showToast('请至少添加一项需求备件', 'error');
      return;
    }

    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    const planNo = `XQ${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;
    const approvalNo = `XQJH${planNo.slice(2)}`;

    const newPlan: RequirementPlanItem = {
      id: `xq-${Date.now()}`,
      planNo,
      approvalNo,
      applicant: '陈建国',
      department: '设备管理部',
      status: '审批中',
      totalQty,
      totalBudget,
      applyTime: nowStr,
      items,
    };

    onSave(newPlan);
    showToast(`需求计划 ${planNo} 已创建并提交审批（最新时间置顶）`, 'success');
  };

  return (
    <div className="space-y-4 pb-16 text-xs">
      {/* Main Form Card (Screenshot 6) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">新增需求计划</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePlan}
              className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-colors shadow-xs"
            >
              保存
            </button>
            <button
              onClick={onBack}
              className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-colors shadow-xs"
            >
              返回
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* + 添加备品备件 按钮 */}
          <div>
            <button
              type="button"
              onClick={() => setIsSelectModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>添加备品备件</span>
            </button>
          </div>

          {/* Table (Screenshot 6 精准还原) */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 w-12 text-center">序号</th>
                  <th className="px-3 py-3">备件名称</th>
                  <th className="px-3 py-3">备件编码</th>
                  <th className="px-3 py-3">备件分类</th>
                  <th className="px-3 py-3">规格型号</th>
                  <th className="px-3 py-3">品牌</th>
                  <th className="px-3 py-3">单位</th>
                  <th className="px-3 py-3">供应商</th>
                  <th className="px-3 py-3">
                    <span className="text-rose-500 mr-0.5">*</span>需求数量
                  </th>
                  <th className="px-3 py-3">
                    <span className="text-rose-500 mr-0.5">*</span>预算金额 (元)
                  </th>
                  <th className="px-3 py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-3 font-bold text-slate-900">{row.spareName}</td>
                    <td className="px-3 py-3 font-mono text-slate-700">{row.spareCode}</td>
                    <td className="px-3 py-3 text-slate-600">{row.category}</td>
                    <td className="px-3 py-3 font-mono text-slate-700">{row.spec}</td>
                    <td className="px-3 py-3 text-slate-800">{row.brand}</td>
                    <td className="px-3 py-3 text-slate-600">{row.unit}</td>
                    <td className="px-3 py-3 text-slate-700">{row.supplier}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="1"
                        value={row.requiredQty}
                        onChange={(e) => handleUpdateItem(row.id, 'requiredQty', Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-hidden focus:border-blue-500 font-mono font-bold"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={row.budgetAmount}
                        onChange={(e) => handleUpdateItem(row.id, 'budgetAmount', Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-slate-200 rounded focus:outline-hidden focus:border-blue-500 font-mono font-bold"
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(row.id)}
                        className="text-blue-600 hover:text-rose-600 font-medium hover:underline"
                      >
                        移除
                      </button>
                    </td>
                  </tr>
                ))}

                {/* 合计行 (Screenshot 6) */}
                <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
                  <td className="px-3 py-3 text-slate-800" colSpan={8}>
                    合计
                  </td>
                  <td className="px-3 py-3 font-mono text-rose-600 text-sm font-black">{totalQty}</td>
                  <td className="px-3 py-3 font-mono text-rose-600 text-sm font-black">{totalBudget}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 选择备件弹窗 */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">选择备品备件</h3>
              <button onClick={() => setIsSelectModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="请输入备件名称或编码进行搜索..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg pr-8"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-10 text-center">选择</th>
                    <th className="p-2.5">备件名称</th>
                    <th className="p-2.5">编码</th>
                    <th className="p-2.5">规格型号</th>
                    <th className="p-2.5">品牌</th>
                    <th className="p-2.5">参考单价</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_ALL_SPARE_PARTS.filter(
                    (p) => !modalSearch || p.name.includes(modalSearch) || p.code.includes(modalSearch)
                  ).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedSpareIds.includes(p.id)}
                          onChange={() => {
                            setSelectedSpareIds((prev) =>
                              prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                            );
                          }}
                          className="rounded border-slate-300 text-blue-600"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                      <td className="p-2.5 font-mono text-slate-600">{p.code}</td>
                      <td className="p-2.5 text-slate-600">{p.spec}</td>
                      <td className="p-2.5 text-slate-800">{p.brand}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-800">¥{p.price || 100}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-slate-500">已选择 {selectedSpareIds.length} 项</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSelectModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddSelectedSpares}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  确定添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
