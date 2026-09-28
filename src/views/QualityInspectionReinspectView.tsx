import React, { useState } from 'react';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';
import { ArrivalInspectionItem, ArrivalInspectionSpareItem } from '../types';

interface QualityInspectionReinspectViewProps {
  inspection: ArrivalInspectionItem | null;
  onSave: (updated: ArrivalInspectionItem) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const QualityInspectionReinspectView: React.FC<QualityInspectionReinspectViewProps> = ({
  inspection,
  onSave,
  onCancel,
  showToast,
}) => {
  if (!inspection) return null;

  const [items, setItems] = useState<ArrivalInspectionSpareItem[]>(
    inspection.items && inspection.items.length > 0
      ? inspection.items
      : [
          {
            id: 're-1',
            spareName: '三相异步电机',
            spareCode: 'M08801',
            category: '电气类/电机/异步电机',
            spec: 'Y2-132S-4',
            brand: '皖南电机',
            unit: '台',
            supplier: '安徽电机制造厂',
            expectedQty: 10,
            expectedAmount: 25000,
            unitPrice: 2500,
            qualifiedQty: 8,
            qualifiedAmount: 20000,
            unqualifiedQty: 2,
            unqualifiedAmount: 5000,
          },
          {
            id: 're-2',
            spareName: '光电开关',
            spareCode: 'E08802',
            category: '电气类/传感器/光电传感器',
            spec: 'E3Z-D62',
            brand: '欧姆龙',
            unit: '个',
            supplier: '苏州自动化仪表厂',
            expectedQty: 50,
            expectedAmount: 6000,
            unitPrice: 120,
            qualifiedQty: 50,
            qualifiedAmount: 6000,
            unqualifiedQty: 0,
            unqualifiedAmount: 0,
          },
          {
            id: 're-3',
            spareName: '气动节流阀',
            spareCode: 'V08803',
            category: '气动类/阀/控制阀',
            spec: 'ASC1102F-04',
            brand: '亚德客',
            unit: '个',
            supplier: '宁波气动元件厂',
            expectedQty: 100,
            expectedAmount: 1500,
            unitPrice: 15,
            qualifiedQty: 95,
            qualifiedAmount: 1425,
            unqualifiedQty: 5,
            unqualifiedAmount: 75,
          },
          {
            id: 're-4',
            spareName: '深沟球轴承',
            spareCode: 'A08804',
            category: '机械类/轴承/滚动轴承',
            spec: '6205-2RS',
            brand: '人本轴承',
            unit: '个',
            supplier: '杭州轴承厂',
            expectedQty: 200,
            expectedAmount: 5000,
            unitPrice: 25,
            qualifiedQty: 180,
            qualifiedAmount: 4500,
            unqualifiedQty: 20,
            unqualifiedAmount: 500,
          },
          {
            id: 're-5',
            spareName: '工业接触器',
            spareCode: 'C08805',
            category: '电气类/控制/接触器',
            spec: 'LC1-D25',
            brand: '施耐德电气',
            unit: '个',
            supplier: '无锡低压电器厂',
            expectedQty: 30,
            expectedAmount: 3600,
            unitPrice: 120,
            qualifiedQty: 28,
            qualifiedAmount: 3360,
            unqualifiedQty: 2,
            unqualifiedAmount: 240,
          },
        ]
  );

  const [expandedHistories, setExpandedHistories] = useState<string[]>(['his-1']);

  const toggleHistory = (id: string) => {
    setExpandedHistories((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handleUpdateQualifiedQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const qualifiedQty = Math.max(0, qty);
          const qualifiedAmount = qualifiedQty * it.unitPrice;
          const totalQty = it.actualQty ?? it.expectedQty ?? 0;
          const unqualifiedQty = Math.max(0, totalQty - qualifiedQty);
          const unqualifiedAmount = unqualifiedQty * it.unitPrice;
          return {
            ...it,
            qualifiedQty,
            qualifiedAmount,
            unqualifiedQty,
            unqualifiedAmount,
          };
        }
        return it;
      })
    );
  };

  const handleSave = () => {
    const totalQualifiedQty = items.reduce((acc, cur) => acc + (cur.qualifiedQty || 0), 0);
    const totalQualifiedAmount = items.reduce((acc, cur) => acc + (cur.qualifiedAmount || 0), 0);
    const totalUnqualifiedQty = items.reduce((acc, cur) => acc + (cur.unqualifiedQty || 0), 0);
    const totalUnqualifiedAmount = items.reduce((acc, cur) => acc + (cur.unqualifiedAmount || 0), 0);
    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

    const updated: ArrivalInspectionItem = {
      ...inspection,
      qualifiedQty: totalQualifiedQty,
      qualifiedAmount: totalQualifiedAmount,
      unqualifiedQty: totalUnqualifiedQty,
      unqualifiedAmount: totalUnqualifiedAmount,
      inspectTime: nowStr,
      inboundStatus: '审批通过',
      items,
    };

    onSave(updated);
    showToast(`重新质检单 ${inspection.arrivalNo} 质检结果已更新并重新提交`, 'success');
  };

  return (
    <div className="space-y-4 pb-16 text-xs text-slate-700">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">重新质检</h3>
          <button
            onClick={onCancel}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 基础信息 (Screenshot 16) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center">
              <span className="w-24 text-slate-400">到货单号:</span>
              <span className="font-mono font-bold text-slate-900">{inspection.arrivalNo}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-400">预计到货时间:</span>
              <span className="font-mono text-slate-800 font-semibold">{inspection.expectedArrivalTime}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-400">采购人:</span>
              <span className="font-bold text-slate-900">{inspection.buyer}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-400">采购部门:</span>
              <span className="text-slate-800">{inspection.buyerDepartment}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-400">供应商名称:</span>
              <span className="text-slate-800 font-medium">{inspection.supplier}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-400">创建时间:</span>
              <span className="font-mono text-slate-600">{inspection.createTime}</span>
            </div>
          </div>

          {/* 质检计划表格 (Screenshot 16) */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
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
                  <th className="px-3 py-3">预计到货数量</th>
                  <th className="px-3 py-3">预计到货金额 (元)</th>
                  <th className="px-3 py-3">单价 (元)</th>
                  <th className="px-3 py-3">
                    <span className="text-rose-500 mr-0.5">*</span>质检合格数量
                  </th>
                  <th className="px-3 py-3">质检合格金额 (元)</th>
                  <th className="px-3 py-3">质检不合格数量</th>
                  <th className="px-3 py-3">质检不合格金额 (元)</th>
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
                    <td className="px-3 py-3 text-slate-800 font-medium">{row.brand}</td>
                    <td className="px-3 py-3 text-slate-600">{row.unit}</td>
                    <td className="px-3 py-3 text-slate-700 max-w-xs truncate">{row.supplier}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">{row.expectedQty ?? 0}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      {(row.expectedAmount ?? ((row.expectedQty ?? 0) * row.unitPrice)).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-700">{row.unitPrice}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={row.qualifiedQty ?? ''}
                        onChange={(e) => handleUpdateQualifiedQty(row.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-hidden focus:border-blue-500 font-mono font-bold text-emerald-600"
                      />
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-emerald-600">
                      {(row.qualifiedAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-rose-600">{row.unqualifiedQty ?? 0}</td>
                    <td className="px-3 py-3 font-mono font-bold text-rose-600">
                      {(row.unqualifiedAmount ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons (Screenshot 16) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
            >
              取消
            </button>
          </div>

          {/* 质检历史展开 (Screenshot 16 / 17 / 18) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                  <span>质检历史 - 入库审批单号:</span>
                  <span className="font-mono text-blue-600">SP28122131231290</span>
                </h5>
                <button
                  type="button"
                  onClick={() => toggleHistory('his-1')}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <span>{expandedHistories.includes('his-1') ? '收起' : '展开'}</span>
                  {expandedHistories.includes('his-1') ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {expandedHistories.includes('his-1') && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 p-3 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center">
                      <span className="w-24 text-slate-400">到货单号:</span>
                      <span className="font-mono font-bold text-slate-900">XQ202510150001</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-slate-400">采购人:</span>
                      <span className="font-bold text-slate-900">张晤</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-slate-400">采购部门:</span>
                      <span className="text-slate-800">设备管理部</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-slate-400">供应商名称:</span>
                      <span className="text-slate-800 font-medium">广东奥峰紧固件有限公司</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-slate-400">质检完成时间:</span>
                      <span className="font-mono text-slate-800 font-semibold">2026-09-12 09:30</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-slate-400">入库状态:</span>
                      <span className="inline-flex items-center font-bold text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500"></span>
                        入库拒绝
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/40 flex items-center justify-between">
              <h5 className="font-bold text-slate-800 flex items-center gap-2">
                <span>质检历史 - 入库审批单号:</span>
                <span className="font-mono text-blue-600">SP38593583958034</span>
              </h5>
              <button
                type="button"
                onClick={() => showToast('已展开审批历史记录', 'info')}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                展开
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
