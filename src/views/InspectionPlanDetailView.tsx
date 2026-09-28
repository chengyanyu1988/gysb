import React from 'react';
import { InspectionPlan } from '../types';
import { INITIAL_PLAN_DETAIL_ITEMS } from '../data/mockData';
import { ArrowLeft, Home, ChevronRight, CheckCircle2 } from 'lucide-react';

interface InspectionPlanDetailViewProps {
  plan?: InspectionPlan | null;
  onBack: () => void;
}

export const InspectionPlanDetailView: React.FC<InspectionPlanDetailViewProps> = ({
  plan,
  onBack,
}) => {
  // Fallback default matching Screenshot 9
  const currentPlan = plan || {
    id: 'default-plan',
    planCode: 'DJJH202609170086',
    equipmentName: '螺杆式空压机-2#',
    equipmentCode: 'P26421A',
    executionTimeRange: '2026-09-17 08:00 - 2026-09-24 17:00',
    approvalStatus: '无需审批',
    department: '工坊科技',
    period: '1 天',
    lastExecutionTime: '2026-09-17 09:15',
    nextExecutionTime: '2026-09-18 08:00',
    executor: 'HM47318017',
    group: '点巡检组',
    enabled: true,
    createTime: '2026-09-17 08:00:00',
    updateTime: '2026-09-27 20:30:00',
  };

  const detailItems = INITIAL_PLAN_DETAIL_ITEMS;

  return (
    <div className="space-y-4 pb-12">
      {/* 2. Top Header Title & Action (Screenshot 9) */}
      <div className="bg-white rounded border border-slate-200 p-4 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight">
            点检计划详情
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            查看点检计划的基本属性配置与关联点检内容清单
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          返回
        </button>
      </div>

      {/* 3. Section 1: 基本信息 (Screenshot 9) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-semibold text-slate-800">基本信息</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-slate-700">
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">计划编码:</span>
            <span className="font-mono text-slate-800 font-medium">{currentPlan.planCode}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备名称:</span>
            <span className="text-slate-800 font-medium">{currentPlan.equipmentName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备编码:</span>
            <span className="font-mono text-slate-800">{currentPlan.equipmentCode}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">执行日期时间:</span>
            <span className="font-mono text-slate-800">
              {currentPlan.executionTimeRange || '2026-09-17 08:00 - 2026-09-24 17:00'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">点检班组:</span>
            <span className="text-slate-800">{currentPlan.group || '点巡检组'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">所属部门:</span>
            <span className="text-slate-800">{currentPlan.department || '工坊科技'}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">周期:</span>
            <span className="text-slate-800">{currentPlan.period || '1 天'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">任务发布时间:</span>
            <span className="text-slate-800">2 小时前</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">任务超时时间:</span>
            <span className="font-mono text-slate-800">2026-09-18 08:30</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">执行人选:</span>
            <span className="text-slate-800 font-medium">{currentPlan.executor || 'HM47318017'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">上次执行时间:</span>
            <span className="font-mono text-slate-800">{currentPlan.lastExecutionTime || '2026-09-17 09:15'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">下次执行时间:</span>
            <span className="font-mono text-slate-800">{currentPlan.nextExecutionTime || '2026-09-18 08:00'}</span>
          </div>
        </div>
      </div>

      {/* 4. Section 2: 基本内容 (Screenshot 9) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
            <h2 className="text-xs font-semibold text-slate-800">基本内容</h2>
          </div>
          <span className="text-xs text-slate-500">
            共 <span className="font-semibold text-blue-600">{detailItems.length}</span> 个检查项目
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <th className="px-4 py-2.5 w-16 text-center">序号</th>
                <th className="px-4 py-2.5">项目名称</th>
                <th className="px-4 py-2.5">设备分类</th>
                <th className="px-4 py-2.5 text-center w-36">检查事项总数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detailItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  <td className="px-4 py-2.5 text-center text-slate-500 font-mono">
                    {item.orderNo}
                  </td>
                  <td className="px-4 py-2.5 text-slate-800 font-medium">
                    {item.projectName}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {item.category}
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-700">
                    <span className="inline-flex items-center gap-1 text-slate-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      {item.totalCheckPoints}
                    </span>
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
