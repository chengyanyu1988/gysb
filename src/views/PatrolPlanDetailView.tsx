import React from 'react';
import { PatrolPlan } from '../types';
import { PATROL_CHECKPOINT_DETAILS } from '../data/mockData';
import { ArrowLeft, Home, ChevronRight, CheckSquare } from 'lucide-react';

interface PatrolPlanDetailViewProps {
  plan?: PatrolPlan | null;
  onBack: () => void;
}

export const PatrolPlanDetailView: React.FC<PatrolPlanDetailViewProps> = ({
  plan,
  onBack,
}) => {
  // Current plan fallback matching Screenshot 5
  const currentPlan = plan || {
    id: 'default-patrol-plan',
    planCode: 'DJJH202408020002',
    patrolArea: '苯胶分厂',
    department: '生产运行部',
    executionTimeRange: '2026-09-15 08:00 - 2026-09-15 17:00',
    group: '巡检组',
    approvalStatus: '无需审批' as const,
    period: '7 天',
    lastExecutionTime: '2026-09-08 08:30',
    nextExecutionTime: '2026-09-22 08:00',
    executor: '李琳',
    enabled: true,
    createTime: '2026-09-15 08:00:00',
    updateTime: '2026-09-27 20:45:00',
  };

  const checkpointItems = PATROL_CHECKPOINT_DETAILS;

  return (
    <div className="space-y-4 pb-12">
      {/* 2. Top Header Title & Action (Screenshot 5) */}
      <div className="bg-white rounded border border-slate-200 p-4 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight">
            巡检计划详情
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            查看巡检计划的基本属性配置、巡检区域范围与检查事项细则
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

      {/* 3. Section 1: 基本信息 (Screenshot 5) */}
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
            <span className="text-slate-400 w-24 shrink-0">巡检区域:</span>
            <span className="text-slate-800 font-medium">{currentPlan.patrolArea}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">所属部门:</span>
            <span className="text-slate-800">{currentPlan.department || '生产运行部'}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">执行日期时间:</span>
            <span className="font-mono text-slate-800">{currentPlan.executionTimeRange}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">巡检班组:</span>
            <span className="text-slate-800">{currentPlan.group || '巡检组'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">任务超时时间:</span>
            <span className="font-mono text-slate-800">2026-09-15 20:00</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">周期:</span>
            <span className="text-slate-800">{currentPlan.period || '7 天'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">任务发布时间:</span>
            <span className="font-mono text-slate-800">2026-09-14 16:00</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">下次执行时间:</span>
            <span className="font-mono text-slate-800">{currentPlan.nextExecutionTime || '2026-09-22 08:00'}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">执行人选:</span>
            <span className="text-slate-800 font-medium">{currentPlan.executor || '李琳'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">上次执行时间:</span>
            <span className="font-mono text-slate-800">{currentPlan.lastExecutionTime || '2026-09-08 08:30'}</span>
          </div>
        </div>
      </div>

      {/* 4. Section 2: 基本内容 (Screenshot 5) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
            <h2 className="text-xs font-semibold text-slate-800">基本内容</h2>
          </div>
          <span className="text-xs text-slate-500">
            共 <span className="font-semibold text-blue-600">{checkpointItems.length}</span> 个巡检细则项
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <th className="px-4 py-2.5 w-16 text-center">序号</th>
                <th className="px-4 py-2.5 w-48">项目名称</th>
                <th className="px-4 py-2.5 w-36">设备分类</th>
                <th className="px-4 py-2.5 w-44">检查项</th>
                <th className="px-4 py-2.5">描述</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {checkpointItems.map((item, index) => (
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
                  <td className="px-4 py-2.5 text-blue-600 font-medium">
                    {item.checkItem}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {item.description}
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
