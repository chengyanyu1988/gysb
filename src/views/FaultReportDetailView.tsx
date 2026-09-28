import React from 'react';
import {
  Home,
  ArrowLeft,
  FileText,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Layers,
  MapPin,
  Building2,
  Tag,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { FaultReportItem } from '../types';

interface FaultReportDetailViewProps {
  report: FaultReportItem | null;
  onBack: () => void;
  onGoToProcess?: (report: FaultReportItem) => void;
}

export const FaultReportDetailView: React.FC<FaultReportDetailViewProps> = ({
  report,
  onBack,
  onGoToProcess,
}) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '待处理':
        return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">待处理</span>;
      case '维修中':
        return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">维修中</span>;
      case '已完成':
        return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">已完成</span>;
      case '已驳回':
        return <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">已驳回</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">报修详情</h2>
            {getStatusBadge(activeReport.status)}
            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              单号: {activeReport.reportNo}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {activeReport.status === '待处理' && onGoToProcess && (
              <button
                type="button"
                onClick={() => onGoToProcess(activeReport)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>去处理派工</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* SECTION 1: 设备信息 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">设备信息</h3>
            </div>

            <div className="bg-slate-50/70 p-5 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">设备名称</span>
                <span className="font-bold text-slate-800 text-sm">{activeReport.equipmentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">设备编码</span>
                <span className="font-mono text-slate-700 font-semibold">{activeReport.equipmentCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">设备分类</span>
                <span className="text-slate-700 font-medium">{activeReport.equipmentCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">规格型号</span>
                <span className="text-slate-700 font-medium">{activeReport.specification || 'GA75+ / 75kW'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">安装位置</span>
                <span className="text-slate-700">动力车间一期 动力站房 102区</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">所属部门</span>
                <span className="text-slate-700">生产技术部 / 动力车间</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">使用状态</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 在用运行
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">设备等级</span>
                <span className="text-slate-700 font-medium">A类关键生产设备</span>
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
                    <th className="py-2.5 px-3 min-w-[220px]">故障描述</th>
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
                            className="w-10 h-10 rounded object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(activeReport.images![0], '_blank')}
                          />
                        </div>
                      ) : (
                        <span className="text-slate-400">无附件</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Expanded Detailed Description & Photos */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">详细故障现象与现场状况：</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {activeReport.description}。现场已采取急停断电措施，未发生次生连带破坏。
                </p>
              </div>
              {activeReport.images && activeReport.images.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">现场拍照凭证（{activeReport.images.length}张）：</span>
                  <div className="flex flex-wrap gap-3">
                    {activeReport.images.map((imgUrl, idx) => (
                      <div key={idx} className="group relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-black/5">
                        <img src={imgUrl} alt={`现场照片 ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-medium">
                          查看大图
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 3: 流程流转记录 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">流程流转追踪</h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">1. 提交报修申请</span>
                      <span className="text-[11px] text-slate-400 font-mono">{activeReport.reportTime}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">已提交</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      报修人：<span className="font-medium text-slate-700">{activeReport.reportUser}</span> (运行一班) | 故障等级：{activeReport.faultLevel}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white ${
                    activeReport.status !== '待处理' ? 'bg-blue-600' : 'bg-slate-300'
                  }`}>
                    {activeReport.status !== '待处理' ? '✓' : '2'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">2. 故障处理与派工</span>
                      {activeReport.status !== '待处理' ? (
                        <>
                          <span className="text-[11px] text-slate-400 font-mono">2026-09-27 10:35:00</span>
                          <span className="px-2 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200">已派工</span>
                        </>
                      ) : (
                        <span className="px-2 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">等待调度处理</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {activeReport.status !== '待处理'
                        ? '处理人：系统调度员 / 王工 | 指派班组：机修一组 | 主修人：王力'
                        : '待维修班组组长或设备调度主管确认派工方案'}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white ${
                    activeReport.status === '已完成' ? 'bg-blue-600' : 'bg-slate-300'
                  }`}>
                    {activeReport.status === '已完成' ? '✓' : '3'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">3. 现场维修实施与工单流转</span>
                      <span className="text-[11px] text-slate-400">
                        {activeReport.status === '已完成' ? '维修完成' : activeReport.status === '维修中' ? '抢修进行中' : '未开始'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      对应维修工单：<span className="font-mono text-blue-600 font-medium">WX20260927001</span>
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white ${
                    activeReport.status === '已完成' ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}>
                    {activeReport.status === '已完成' ? '✓' : '4'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">4. 试机验收与结案归档</span>
                      <span className="text-[11px] text-slate-400">
                        {activeReport.status === '已完成' ? '验收合格' : '待验收'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {activeReport.status === '已完成' ? '验收人：张建国 / 生产主管 | 评定结果：合格投产' : '维修完成后由报修人或车间主管进行试机验收'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
