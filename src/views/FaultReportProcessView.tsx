import React, { useState } from 'react';
import {
  Home,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Clock,
  Wrench,
  Sparkles,
  ArrowRight,
  Calendar,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { FaultReportItem, FaultExperienceItem } from '../types';
import { INITIAL_FAULT_EXPERIENCES } from '../data/mockData';

interface FaultReportProcessViewProps {
  report: FaultReportItem | null;
  onConfirmProcess: (
    reportId: string,
    processData: {
      action: 'transfer_repair' | 'direct_resolve' | 'reject';
      assignedTeam?: string;
      assignee?: string;
      priority?: string;
      remark: string;
      linkedExperienceCode?: string;
    }
  ) => void;
  onBack: () => void;
}

export const FaultReportProcessView: React.FC<FaultReportProcessViewProps> = ({
  report,
  onConfirmProcess,
  onBack,
}) => {
  // If no report passed, fallback to standard demo report
  const activeReport: FaultReportItem = report || {
    id: 'fr-demo',
    reportNo: 'BX20260927001',
    equipmentName: '2#螺杆空压机',
    equipmentCode: 'SB-2026-KYJ-002',
    equipmentCategory: '动力设备/空压机',
    specification: 'Atlas Copco GA75+',
    faultType: '机械故障',
    faultTime: '2026-09-27 09:45:00',
    faultLevel: '中度故障',
    reportUser: '张建国',
    reportTime: '2026-09-27 10:20:15',
    status: '待处理',
    description: '主电机运转伴有刺耳异响，随后变频器报警停机，温度显示过高(98℃)',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'],
  };

  const [processType, setProcessType] = useState<'transfer_repair' | 'direct_resolve' | 'reject'>('transfer_repair');
  const [assignedTeam, setAssignedTeam] = useState('机修一组');
  const [assignee, setAssignee] = useState('王力');
  const [priority, setPriority] = useState('紧急');
  const [remark, setRemark] = useState('');
  const [selectedExp, setSelectedExp] = useState<FaultExperienceItem | null>(
    INITIAL_FAULT_EXPERIENCES[0] || null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmProcess(activeReport.id, {
      action: processType,
      assignedTeam: processType === 'transfer_repair' ? assignedTeam : undefined,
      assignee: processType === 'transfer_repair' ? assignee : undefined,
      priority: processType === 'transfer_repair' ? priority : undefined,
      remark: remark || (processType === 'transfer_repair' ? '已转维修工单并派发负责人' : '直接处理完成'),
      linkedExperienceCode: selectedExp?.expCode,
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Form Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">故障处理</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              单号: <span className="font-mono font-medium text-slate-700">{activeReport.reportNo}</span> | 
              当前状态: <span className="inline-block ml-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">{activeReport.status}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              取消返回
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>确认处理</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* SECTION 1: 设备信息 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">设备信息</h3>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">设备名称</span>
                <span className="font-semibold text-slate-800 text-sm">{activeReport.equipmentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">设备编码</span>
                <span className="font-mono text-slate-700 font-medium">{activeReport.equipmentCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">设备分类</span>
                <span className="text-slate-700">{activeReport.equipmentCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">规格型号</span>
                <span className="text-slate-700">{activeReport.specification || 'GA75+ / 75kW'}</span>
              </div>
            </div>
          </section>

          {/* SECTION 2: 故障内容 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">故障内容</h3>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">序号</th>
                    <th className="py-2.5 px-3">报修单号</th>
                    <th className="py-2.5 px-3 text-center">状态</th>
                    <th className="py-2.5 px-3">报修时间</th>
                    <th className="py-2.5 px-3">报修人</th>
                    <th className="py-2.5 px-3">故障类型</th>
                    <th className="py-2.5 px-3">故障发生时间</th>
                    <th className="py-2.5 px-3 text-center">故障等级</th>
                    <th className="py-2.5 px-3 min-w-[200px]">故障描述</th>
                    <th className="py-2.5 px-3 text-center">现场照片</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-center text-slate-400">1</td>
                    <td className="py-3 px-3 font-mono font-medium text-blue-600">{activeReport.reportNo}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        {activeReport.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{activeReport.reportTime}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{activeReport.reportUser}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                        {activeReport.faultType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{activeReport.faultTime}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          activeReport.faultLevel === '严重故障' || activeReport.faultLevel === '特大故障'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : activeReport.faultLevel === '中度故障'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {activeReport.faultLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{activeReport.description}</td>
                    <td className="py-3 px-3 text-center">
                      {activeReport.images && activeReport.images.length > 0 ? (
                        <div className="inline-flex items-center gap-1.5">
                          <img
                            src={activeReport.images[0]}
                            alt="Fault Scene"
                            className="w-9 h-9 rounded object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(activeReport.images![0], '_blank')}
                          />
                        </div>
                      ) : (
                        <span className="text-slate-400">无</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 3: 处理内容 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">处理内容</h3>
            </div>

            {/* Radio Selection for Process Type */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 w-20">处理方式:</span>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-2 rounded border border-slate-200 shadow-sm hover:border-blue-300">
                    <input
                      type="radio"
                      name="processType"
                      value="transfer_repair"
                      checked={processType === 'transfer_repair'}
                      onChange={() => setProcessType('transfer_repair')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">转维修工单 (推荐)</span>
                    <span className="text-[11px] text-slate-500">派发机修班组现场抢修</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-2 rounded border border-slate-200 shadow-sm hover:border-blue-300">
                    <input
                      type="radio"
                      name="processType"
                      value="direct_resolve"
                      checked={processType === 'direct_resolve'}
                      onChange={() => setProcessType('direct_resolve')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">现场自行解决</span>
                    <span className="text-[11px] text-slate-500">已由值班人员当场恢复</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-2 rounded border border-slate-200 shadow-sm hover:border-blue-300">
                    <input
                      type="radio"
                      name="processType"
                      value="reject"
                      checked={processType === 'reject'}
                      onChange={() => setProcessType('reject')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">驳回申请</span>
                    <span className="text-[11px] text-slate-500">误报或不符合报修标准</span>
                  </label>
                </div>
              </div>

              {/* Conditional Dispatch fields */}
              {processType === 'transfer_repair' && (
                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      指派维修班组 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={assignedTeam}
                      onChange={(e) => setAssignedTeam(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="机修一组">机修一组</option>
                      <option value="机修二组">机修二组</option>
                      <option value="电气维护班">电气维护班</option>
                      <option value="综合维保组">综合维保组</option>
                      <option value="动力车间机修班">动力车间机修班</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      主修负责人 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="王力">王力 (高级机修技师)</option>
                      <option value="李强">李强 (电气技师)</option>
                      <option value="赵峰">赵峰 (设备工程师)</option>
                      <option value="刘洋">刘洋 (维保技师)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      维修优先级 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="紧急">🔴 紧急 (2小时内响应并开工)</option>
                      <option value="高">🟠 高 (4小时内响应)</option>
                      <option value="中">🟡 中 (当日处理)</option>
                      <option value="低">🟢 低 (计划性处理)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Linked Knowledge base / fault experience */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    智能关联故障排查经验:
                  </span>
                  <span className="text-[11px] text-slate-400">系统已自动匹配同型号设备历史处理方案</span>
                </div>
                <div className="p-3 bg-blue-50/60 rounded border border-blue-200 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-blue-900">
                      [{selectedExp?.expCode || 'JY20260901001'}] {selectedExp?.category || '动力设备/空压机'} - {selectedExp?.description || '轴承磨损与过温保护排查方案'}
                    </div>
                    <div className="text-slate-600 mt-1 line-clamp-2">
                      <span className="font-medium text-slate-700">推荐方案：</span>
                      {selectedExp?.solution || '1. 停机断电并锁定；2. 拆卸防护罩检查皮带张紧度；3. 测量轴承温升与振动频谱；4. 清理油路冷却器并加注指定润滑脂。'}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium shrink-0">
                    推荐匹配度 96%
                  </span>
                </div>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  处理说明 / 派工要求:
                </label>
                <textarea
                  rows={3}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="请输入故障处理说明、派工要求、安全注意事项或直接解决时的处理经过..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
