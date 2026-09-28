import React from 'react';
import { Home } from 'lucide-react';
import { RequirementPlanItem } from '../types';

interface RequirementPlanDetailViewProps {
  plan: RequirementPlanItem | null;
  onBack: () => void;
}

export const RequirementPlanDetailView: React.FC<RequirementPlanDetailViewProps> = ({
  plan,
  onBack,
}) => {
  if (!plan) return null;

  const totalQty = (plan.items || []).reduce((acc, cur) => acc + (cur.requiredQty || 0), 0);
  const totalBudget = (plan.items || []).reduce((acc, cur) => acc + (cur.budgetAmount || 0), 0);

  return (
    <div className="space-y-4 pb-16 text-xs text-slate-700">
      {/* Main Detail Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">需求计划详情</h3>
          <button
            onClick={onBack}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 基础信息 (Screenshot 7) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h4 className="font-bold text-xs text-slate-800">基础信息</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center">
                <span className="w-20 text-slate-400">需求单号:</span>
                <span className="font-mono font-bold text-slate-900">{plan.planNo}</span>
              </div>

              <div className="flex items-center">
                <span className="w-20 text-slate-400">审批状态:</span>
                <span
                  className={`inline-flex items-center font-bold ${
                    plan.status === '审批通过'
                      ? 'text-emerald-600'
                      : plan.status === '审批中'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      plan.status === '审批通过'
                        ? 'bg-emerald-500'
                        : plan.status === '审批中'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  ></span>
                  {plan.status}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-20 text-slate-400">申请人:</span>
                <span className="font-bold text-slate-900">{plan.applicant}</span>
              </div>

              <div className="flex items-center">
                <span className="w-20 text-slate-400">申请部门:</span>
                <span className="text-slate-800">{plan.department}</span>
              </div>

              <div className="flex items-center col-span-2">
                <span className="w-20 text-slate-400">申请时间:</span>
                <span className="font-mono text-slate-800 font-semibold">{plan.applyTime}</span>
              </div>
            </div>
          </div>

          {/* 需求计划清单 (Screenshot 7) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h4 className="font-bold text-xs text-slate-800">需求计划</h4>
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
                    <th className="px-3 py-3">
                      <span className="text-rose-500 mr-0.5">*</span>需求数量
                    </th>
                    <th className="px-3 py-3">
                      <span className="text-rose-500 mr-0.5">*</span>预算金额 (元)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(plan.items && plan.items.length > 0 ? plan.items : [
                    {
                      id: 'def-1',
                      spareName: '三相异步电机',
                      spareCode: 'D202601',
                      category: '电气类/电机/三相电机',
                      spec: 'Y2-160M-4',
                      brand: '佳木斯电机',
                      unit: '台',
                      supplier: '上海精工机械厂',
                      requiredQty: 5,
                      budgetAmount: 15000,
                    },
                    {
                      id: 'def-2',
                      spareName: '光电传感器',
                      spareCode: 'S202603',
                      category: '电气类/传感器/光电开关',
                      spec: 'E3Z-D62',
                      brand: '欧姆龙',
                      unit: '个',
                      supplier: '苏州自动化仪表表',
                      requiredQty: 100,
                      budgetAmount: 5000,
                    },
                    {
                      id: 'def-3',
                      spareName: '高压液压滤芯',
                      spareCode: 'F202605',
                      category: '液压类/过滤/高压滤芯',
                      spec: 'HYX-0160',
                      brand: '贺德克',
                      unit: '个',
                      supplier: '宁波气动元件厂',
                      requiredQty: 20,
                      budgetAmount: 20000,
                    },
                    {
                      id: 'def-4',
                      spareName: '精密深沟球轴承',
                      spareCode: 'B202609',
                      category: '机械类/轴承/深沟球轴承',
                      spec: '6305-2RS',
                      brand: '人本轴承',
                      unit: '套',
                      supplier: '北京精密轴承',
                      requiredQty: 50,
                      budgetAmount: 2500,
                    },
                    {
                      id: 'def-5',
                      spareName: '阻燃控制线缆',
                      spareCode: 'C202610',
                      category: '电气类/线缆/控制线缆',
                      spec: 'RVVP 10*1.5',
                      brand: '远东电缆',
                      unit: '米',
                      supplier: '广州白云电气',
                      requiredQty: 200,
                      budgetAmount: 8000,
                    },
                  ]).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="px-3 py-3 font-bold text-slate-900">{row.spareName}</td>
                      <td className="px-3 py-3 font-mono text-slate-700">{row.spareCode}</td>
                      <td className="px-3 py-3 text-slate-600">{row.category}</td>
                      <td className="px-3 py-3 font-mono text-slate-700">{row.spec}</td>
                      <td className="px-3 py-3 text-slate-800 font-medium">{row.brand}</td>
                      <td className="px-3 py-3 text-slate-600">{row.unit}</td>
                      <td className="px-3 py-3 text-slate-700">{row.supplier}</td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-900">{row.requiredQty}</td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-900">
                        {row.budgetAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {/* 合计 (Screenshot 7) */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200">
                    <td className="px-3 py-3 text-slate-800" colSpan={8}>
                      合计
                    </td>
                    <td className="px-3 py-3 font-mono text-rose-600 text-sm font-black">
                      {totalQty || 375}
                    </td>
                    <td className="px-3 py-3 font-mono text-rose-600 text-sm font-black">
                      {(totalBudget || 50500).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
