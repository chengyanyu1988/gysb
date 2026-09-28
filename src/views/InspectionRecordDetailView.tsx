import React from 'react';
import { SAMPLE_COMPLETED_TASK_ITEMS } from '../data/mockData';
import { ArrowLeft, Home, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { InspectionRecordTableItem } from './InspectionRecordListView';

interface InspectionRecordDetailViewProps {
  record?: InspectionRecordTableItem | null;
  onBack: () => void;
}

export const InspectionRecordDetailView: React.FC<InspectionRecordDetailViewProps> = ({
  record,
  onBack,
}) => {
  // Current record fallback (Screenshot 7)
  const currentRecord = record || {
    id: 'default-record',
    planCode: 'DJJH202408020002',
    equipmentName: '硝基苯成品泵-1#-P26421A',
    equipmentCode: 'KY-2026-A02',
    executor: '张建国',
    checkStatus: '正常' as const,
    plannedTime: '2026-09-15 08:00',
    actualTime: '2026-09-15 08:15',
    checkedItems: '1/1',
    status: '已完成' as const,
    department: '动力车间',
    updateTime: '2026-09-27 20:30:00',
  };

  const inspectionItems = SAMPLE_COMPLETED_TASK_ITEMS;

  return (
    <div className="space-y-4 pb-12">
      {/* 2. Page Header & Back Button (Screenshot 7) */}
      <div className="bg-white rounded border border-slate-200 p-4 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight">
            点检记录详情
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            查看历史点检执行结果详情、参数测定记录及上传附件
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

      {/* 3. Section 1: 基本信息 (Screenshot 7) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-semibold text-slate-800">基本信息</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-slate-700">
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">计划编码:</span>
            <span className="font-mono text-slate-800 font-medium">{currentRecord.planCode}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备名称:</span>
            <span className="text-slate-800 font-medium">{currentRecord.equipmentName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备编码:</span>
            <span className="font-mono text-slate-800">{currentRecord.equipmentCode}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">计划点检时间:</span>
            <span className="font-mono text-slate-800">{currentRecord.plannedTime}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">实际点检时间:</span>
            <span className="font-mono text-slate-800">{currentRecord.actualTime}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">实际执行人:</span>
            <span className="text-slate-800 font-medium">{currentRecord.executor}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备检查状态:</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentRecord.checkStatus === '异常' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
              <span
                className={
                  currentRecord.checkStatus === '异常' ? 'text-rose-600' : 'text-emerald-600'
                }
              >
                {currentRecord.checkStatus}
              </span>
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">任务状态:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              已完成
            </span>
          </div>
        </div>
      </div>

      {/* 4. Section 2: 点检内容 (Screenshot 7 & 8) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
            <h2 className="text-xs font-semibold text-slate-800">点检内容</h2>
          </div>
          <span className="text-xs text-slate-500">
            共 <span className="font-semibold text-blue-600">{inspectionItems.length}</span> 个点检判定项
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <th className="px-4 py-2.5 w-16 text-center">序号</th>
                <th className="px-4 py-2.5 w-48">项目名称</th>
                <th className="px-4 py-2.5 w-64">检查项</th>
                <th className="px-4 py-2.5 w-32 text-center">检查结果</th>
                <th className="px-4 py-2.5">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspectionItems.map((item, index) => (
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
                  <td className="px-4 py-2.5 text-slate-700">
                    {item.checkItem}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    {item.result === '不合格' ? (
                      <span className="text-rose-600 font-semibold">不合格</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">合格</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {item.remarks || '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Section 3: 附件 (Screenshot 8) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden p-4">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-semibold text-slate-800">附件</h2>
        </div>

        {/* 6 Attachment Photo Placeholders / Cards (Screenshot 8) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="aspect-square rounded border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-3 text-slate-400 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-2">
                现场凭证 {num}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
