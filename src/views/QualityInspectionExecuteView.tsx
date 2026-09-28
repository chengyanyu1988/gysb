import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { ArrivalInspectionItem, ArrivalInspectionSpareItem } from '../types';

interface QualityInspectionExecuteViewProps {
  inspection: ArrivalInspectionItem | null;
  onSave: (updated: ArrivalInspectionItem) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const QualityInspectionExecuteView: React.FC<QualityInspectionExecuteViewProps> = ({
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
            id: 'dis-1',
            spareName: '三相异步电机',
            spareCode: 'M202601',
            category: '电气类/电机/异步电机',
            spec: 'Y2-132S-4',
            brand: '皖南电机',
            unit: '台',
            supplier: '上海精工机械厂',
            expectedQty: 10,
            expectedAmount: 25000,
            unitPrice: 2500,
            qualifiedQty: 10,
            qualifiedAmount: 25000,
            unqualifiedQty: 0,
            unqualifiedAmount: 0,
          },
          {
            id: 'dis-2',
            spareName: '光电传感器',
            spareCode: 'E202602',
            category: '电气类/传感器/光电开关',
            spec: 'E3Z-D62',
            brand: '欧姆龙',
            unit: '个',
            supplier: '苏州自动化仪表厂',
            expectedQty: 50,
            expectedAmount: 6000,
            unitPrice: 120,
            qualifiedQty: 48,
            qualifiedAmount: 5760,
            unqualifiedQty: 2,
            unqualifiedAmount: 240,
          },
          {
            id: 'dis-3',
            spareName: '气动节流阀',
            spareCode: 'V202603',
            category: '气动类/阀/控制阀',
            spec: 'ASC1102F-04',
            brand: '亚德客',
            unit: '个',
            supplier: '宁波气动元件厂',
            expectedQty: 100,
            expectedAmount: 1500,
            unitPrice: 15,
            qualifiedQty: 100,
            qualifiedAmount: 1500,
            unqualifiedQty: 0,
            unqualifiedAmount: 0,
          },
          {
            id: 'dis-4',
            spareName: '液压高压滤芯',
            spareCode: 'F202604',
            category: '液压类/过滤/高压滤芯',
            spec: 'HC9600FKS13H',
            brand: '贺德克',
            unit: '件',
            supplier: '广州白云电气集团',
            expectedQty: 20,
            expectedAmount: 4000,
            unitPrice: 200,
            qualifiedQty: 20,
            qualifiedAmount: 4000,
            unqualifiedQty: 0,
            unqualifiedAmount: 0,
          },
          {
            id: 'dis-5',
            spareName: '深沟球轴承',
            spareCode: 'B202605',
            category: '机械类/轴承/滚动轴承',
            spec: '6205-2RS',
            brand: '人本轴承',
            unit: '套',
            supplier: '杭州轴承厂',
            expectedQty: 200,
            expectedAmount: 2000,
            unitPrice: 10,
            qualifiedQty: 195,
            qualifiedAmount: 1950,
            unqualifiedQty: 5,
            unqualifiedAmount: 50,
          },
        ]
  );

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
      inboundStatus: totalUnqualifiedQty > 0 ? '审批中' : '审批通过',
      items,
    };

    onSave(updated);
    showToast(`到货质检单 ${inspection.arrivalNo} 质检完成，已归档至已质检（最新时间置顶）`, 'success');
  };

  return (
    <div className="space-y-4 pb-16 text-xs text-slate-700">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header (Screenshot 9) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">确认到货</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-5 py-1.5 border border-slate-300 rounded-md font-bold text-slate-700 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-colors shadow-xs"
            >
              保存
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 基础信息 (Screenshot 9) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h4 className="font-bold text-xs text-slate-800">基础信息</h4>
            </div>

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
          </div>

          {/* 质检计划 (Screenshot 9) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h4 className="font-bold text-xs text-slate-800">质检计划</h4>
            </div>

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
                          placeholder="请输入"
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
          </div>
        </div>
      </div>
    </div>
  );
};
