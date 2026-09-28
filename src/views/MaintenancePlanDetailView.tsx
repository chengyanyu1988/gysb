import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { MaintenancePlan } from '../types';
import { DEFAULT_MAINTENANCE_PLAN_DETAIL_STANDARDS } from '../data/mockData';

interface MaintenancePlanDetailViewProps {
  plan: MaintenancePlan;
  onBack: () => void;
}

export const MaintenancePlanDetailView: React.FC<MaintenancePlanDetailViewProps> = ({
  plan,
  onBack,
}) => {
  const standardsList =
    plan.standards && plan.standards.length > 0
      ? plan.standards.map((s, idx) => ({
          orderNo: idx + 1,
          name: s.name,
          standard: s.standard,
        }))
      : DEFAULT_MAINTENANCE_PLAN_DETAIL_STANDARDS;

  return (
    <div className="space-y-4 pb-16">
      {/* Header with Return button */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-800">保养计划详情</h2>
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
        >
          返回
        </button>
      </div>

      {/* Section 1: 基本信息 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3 mb-2">
          <h3 className="text-sm font-bold text-gray-800">基本信息</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-xs">
          <div className="flex items-center">
            <span className="w-24 text-gray-500">计划编码:</span>
            <span className="font-mono text-gray-800 font-medium">
              {plan.planCode || 'DJJH202609150002'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">所属部门:</span>
            <span className="text-gray-800">{plan.department || '动力车间'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">保养班组:</span>
            <span className="text-gray-800">{plan.maintenanceGroup || '机修二班'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">执行人选:</span>
            <span className="text-gray-800 font-medium">{plan.executor || '陈伟'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">开始时间:</span>
            <span className="font-mono text-gray-800">{plan.startTime || '2026-09-15 08:30'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">结束时间:</span>
            <span className="font-mono text-gray-800">
              {plan.isForever ? '永久' : plan.endTime || '2026-09-15 12:00'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">周期:</span>
            <span className="text-gray-800">{plan.cycle || '15天'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">任务发布时间:</span>
            <span className="font-mono text-gray-800">
              {plan.startTime ? `${plan.startTime.split(' ')[0]} 16:00` : '2026-09-14 16:00'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">任务超时时间:</span>
            <span className="font-mono text-gray-800">
              {plan.endTime && plan.endTime !== '永久'
                ? plan.endTime
                : '2026-09-15 12:00'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">是否启用:</span>
            <span className="text-gray-800 font-medium">{plan.enabled ? '是' : '否'}</span>
          </div>
        </div>
      </div>

      {/* Section 2: 基本内容 (Table) */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
          <h3 className="text-sm font-bold text-gray-800">基本内容</h3>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-16 text-center">序号</th>
                <th className="py-3 px-6 w-60">保养项目</th>
                <th className="py-3 px-6">保养标准</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {standardsList.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  <td className="py-3 px-4 text-center text-gray-500">{item.orderNo}</td>
                  <td className="py-3 px-6 font-medium text-gray-800">{item.name}</td>
                  <td className="py-3 px-6 text-gray-600 leading-relaxed">{item.standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
