import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { ArrivalInspectionItem, ArrivalInspectionSpareItem } from '../types';

interface ArrivalConfirmViewProps {
  inspection: ArrivalInspectionItem | null;
  onSave: (updated: ArrivalInspectionItem) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ArrivalConfirmView: React.FC<ArrivalConfirmViewProps> = ({
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
            id: 'item-1',
            spareName: '深沟球轴承',
            spareCode: 'B07650',
            category: '机械类/轴承类/滚动轴承',
            spec: '6203ZZ',
            brand: '人本轴承',
            unit: '套',
            supplier: '北方精密机械配件厂',
            expectedQty: 50,
            expectedAmount: 1500,
            unitPrice: 30,
            actualQty: 45,
            actualAmount: 1350,
            unreceivedQty: 5,
            unreceivedAmount: 150,
          },
          {
            id: 'item-2',
            spareName: '高压液压滤芯',
            spareCode: 'F08804',
            category: '液压类/过滤/高压滤芯',
            spec: 'HC9600F',
            brand: '贺德克',
            unit: '件',
            supplier: '广州白云过滤技术有限公司',
            expectedQty: 20,
            expectedAmount: 4000,
            unitPrice: 200,
            actualQty: 20,
            actualAmount: 4000,
            unreceivedQty: 0,
            unreceivedAmount: 0,
          },
          {
            id: 'item-3',
            spareName: '光电开关',
            spareCode: 'E08802',
            category: '电气类/传感器/光电开关',
            spec: 'E3Z-D62',
            brand: '欧姆龙',
            unit: '个',
            supplier: '苏州自动化仪表厂',
            expectedQty: 100,
            expectedAmount: 3000,
            unitPrice: 30,
            actualQty: 98,
            actualAmount: 2940,
            unreceivedQty: 2,
            unreceivedAmount: 60,
          },
          {
            id: 'item-4',
            spareName: '单级离心泵',
            spareCode: 'P202605',
            category: '机械类/流体输送/离心泵',
            spec: 'IS65-50-160',
            brand: '南方泵业',
            unit: '台',
            supplier: '杭州南方泵业制造厂',
            expectedQty: 5,
            expectedAmount: 12500,
            unitPrice: 2500,
            actualQty: 3,
            actualAmount: 7500,
            unreceivedQty: 2,
            unreceivedAmount: 5000,
          },
          {
            id: 'item-5',
            spareName: '氟橡胶密封圈',
            spareCode: 'S10088',
            category: '橡胶类/密封件/静密封',
            spec: 'O型 20x2.4',
            brand: '中鼎密封',
            unit: '件',
            supplier: '安徽中鼎密封件厂',
            expectedQty: 200,
            expectedAmount: 1000,
            unitPrice: 5,
            actualQty: 180,
            actualAmount: 900,
            unreceivedQty: 20,
            unreceivedAmount: 100,
          },
        ]
  );

  const handleUpdateActualQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const actualQty = Math.max(0, qty);
          const actualAmount = actualQty * it.unitPrice;
          const expQty = it.expectedQty ?? 0;
          const unreceivedQty = Math.max(0, expQty - actualQty);
          const unreceivedAmount = unreceivedQty * it.unitPrice;
          return {
            ...it,
            actualQty,
            actualAmount,
            unreceivedQty,
            unreceivedAmount,
          };
        }
        return it;
      })
    );
  };

  const handleSave = () => {
    const totalActualQty = items.reduce((acc, cur) => acc + (cur.actualQty || 0), 0);
    const totalActualAmount = items.reduce((acc, cur) => acc + (cur.actualAmount || 0), 0);
    const updated: ArrivalInspectionItem = {
      ...inspection,
      arrivalStatus: '已到货',
      actualQty: totalActualQty,
      actualAmount: totalActualAmount,
      items,
    };
    onSave(updated);
    showToast(`到货单 ${inspection.arrivalNo} 确认到货成功，流转至待质检`, 'success');
  };

  return (
    <div className="space-y-4 pb-16 text-xs text-slate-700">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header */}
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
          {/* 基础信息 (Screenshot 10) */}
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

          {/* 到货计划 (Screenshot 10) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h4 className="font-bold text-xs text-slate-800">到货计划</h4>
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
                      <span className="text-rose-500 mr-0.5">*</span>实际到货数量
                    </th>
                    <th className="px-3 py-3">实际到货金额 (元)</th>
                    <th className="px-3 py-3">未到货数量</th>
                    <th className="px-3 py-3">未到货金额 (元)</th>
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
                          value={row.actualQty ?? 0}
                          onChange={(e) => handleUpdateActualQty(row.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-hidden focus:border-blue-500 font-mono font-bold text-blue-600"
                        />
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-900">
                        {(row.actualAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-rose-600">{row.unreceivedQty ?? 0}</td>
                      <td className="px-3 py-3 font-mono font-bold text-rose-600">
                        {(row.unreceivedAmount ?? 0).toLocaleString()}
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
