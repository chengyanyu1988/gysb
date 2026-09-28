import React, { useState } from 'react';
import {
  PlusCircle,
  Wrench,
  ClipboardCheck,
  Package,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Search
} from 'lucide-react';
import { MTTR_MONTHLY_DATA, MTTR_WEEKLY_DATA, MTTR_YEARLY_DATA } from '../data/mockData';
import { Equipment, AlarmLog, InspectionRecord } from '../types';

interface OverviewViewProps {
  equipments: Equipment[];
  alarmLogs: AlarmLog[];
  inspectionRecords: InspectionRecord[];
  onNavigate: (tab: any, params?: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  equipments,
  alarmLogs,
  inspectionRecords,
  onNavigate,
}) => {
  const [mttrPeriod, setMttrPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; mttr: number } | null>(null);

  // Dynamic calculations based on state
  const totalEquipments = equipments.length > 0 ? equipments.length + 991 : 1001;
  const goodEquipments = equipments.filter(e => e.status === '使用中').length + 955;
  const healthRate = ((goodEquipments / totalEquipments) * 100).toFixed(1);

  const currentChartData =
    mttrPeriod === 'week'
      ? MTTR_WEEKLY_DATA
      : mttrPeriod === 'year'
      ? MTTR_YEARLY_DATA
      : MTTR_MONTHLY_DATA;

  // Chart coordinate calculation for smooth SVG curve
  const chartHeight = 160;
  const chartWidth = 580;
  const minVal = 40;
  const maxVal = 260;

  const points = currentChartData.map((item, idx) => {
    const x = 30 + (idx * (chartWidth - 60)) / (currentChartData.length - 1);
    const y = chartHeight - 25 - ((item.mttr - minVal) / (maxVal - minVal)) * (chartHeight - 45);
    return { x, y, month: item.month, mttr: item.mttr };
  });

  // Generate SVG path bezier curve
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Hero Banner with 3D Industrial Tech Graphics & System Guide */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50/90 via-sky-50 to-indigo-50/70 border border-blue-100 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
              工业设备智能管控系统
            </h1>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              设备管理基于工坊科技工业互联网技术，助力制造企业实现设备的实时监测、远程维保和故障排除，提升设备的使用效益和稳定性，降低重点资产设备的运营成本和风险。
            </p>
          </div>

          {/* 3D Tech Platform Illustration */}
          <div className="relative w-72 h-36 shrink-0 hidden md:flex items-center justify-center">
            <svg viewBox="0 0 320 160" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DBEAFE" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Base Platform (Isometric) */}
              <polygon points="160,20 280,75 160,135 40,75" fill="url(#planeGrad)" opacity="0.65" />
              <polygon points="160,135 280,75 280,88 160,148" fill="#3B82F6" opacity="0.4" />
              <polygon points="160,135 40,75 40,88 160,148" fill="#60A5FA" opacity="0.3" />

              {/* Middle Layer */}
              <polygon points="160,40 250,82 160,125 70,82" fill="url(#planeGrad)" opacity="0.9" />
              <polygon points="160,125 250,82 250,92 160,135" fill="#2563EB" opacity="0.5" />
              <polygon points="160,125 70,82 70,92 160,135" fill="#3B82F6" opacity="0.4" />

              {/* Top Cubes & Floating Cards */}
              <g transform="translate(130, 42)">
                <polygon points="30,0 60,15 30,30 0,15" fill="url(#cloudGrad)" />
                <polygon points="60,15 60,35 30,50 30,30" fill="#1D4ED8" />
                <polygon points="0,15 0,35 30,50 30,30" fill="#2563EB" />
                <text x="30" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">API</text>
              </g>

              {/* SDK Block */}
              <g transform="translate(180, 20)">
                <polygon points="25,0 50,12 25,24 0,12" fill="#38BDF8" />
                <polygon points="50,12 50,26 25,38 25,24" fill="#0284C7" />
                <polygon points="0,12 0,26 25,38 25,24" fill="#0EA5E9" />
                <text x="25" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">SDK</text>
              </g>

              {/* DATA Block */}
              <g transform="translate(70, 48)">
                <polygon points="25,0 50,12 25,24 0,12" fill="#818CF8" />
                <polygon points="50,12 50,26 25,38 25,24" fill="#4F46E5" />
                <polygon points="0,12 0,26 25,38 25,24" fill="#6366F1" />
                <text x="25" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">DATA</text>
              </g>

              {/* Floating tech nodes */}
              <circle cx="85" cy="30" r="3.5" fill="#38BDF8" />
              <circle cx="235" cy="55" r="3" fill="#60A5FA" />
              <circle cx="160" cy="15" r="2.5" fill="#818CF8" />
              <line x1="85" y1="30" x2="130" y2="50" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
              <line x1="235" y1="55" x2="190" y2="55" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* 5-Step System Guide (系统指引) */}
        <div className="mt-5 pt-4 border-t border-blue-200/60">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-xs font-bold text-blue-700">系统指引</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 relative">
            {/* Step 1 */}
            <div
              onClick={() => onNavigate('equipment-ledger')}
              className="bg-white/90 hover:bg-white hover:shadow-md cursor-pointer border border-blue-100 rounded-lg p-3 transition-all flex items-start gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                01
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>基础数据配置</span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">配置分类、班组、维保标准等基础数据</p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => onNavigate('equipment-add')}
              className="bg-white/90 hover:bg-white hover:shadow-md cursor-pointer border border-blue-100 rounded-lg p-3 transition-all flex items-start gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                02
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>台账信息录入</span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">录入设备、备件台账，设备档案完成建档</p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => onNavigate('inspection-plan')}
              className="bg-white/90 hover:bg-white hover:shadow-md cursor-pointer border border-blue-100 rounded-lg p-3 transition-all flex items-start gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                03
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>业务计划制定</span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">制定点检、保养计划，系统自动派发任务</p>
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => onNavigate('maintenance-task')}
              className="bg-white/90 hover:bg-white hover:shadow-md cursor-pointer border border-blue-100 rounded-lg p-3 transition-all flex items-start gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                04
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>业务计划生效</span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">点检、保养计划任务生效</p>
              </div>
            </div>

            {/* Step 5 */}
            <div
              onClick={() => onNavigate('repair-report')}
              className="bg-white/90 hover:bg-white hover:shadow-md cursor-pointer border border-blue-100 rounded-lg p-3 transition-all flex items-start gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                05
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>维保流程体验</span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">执行保养、点检任务，完成设备报修、维修</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 设备数据概览 (Equipment Data Overview 5 Cards) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
          <h3 className="text-sm font-bold text-slate-800">设备数据概览</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Card 1: 设备总数 */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3.5 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">设备总数</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-500 font-mono tracking-tight">{totalEquipments}</span>
              <span className="text-xs text-slate-400">台</span>
            </div>
          </div>

          {/* Card 2: 完好设备数 */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3.5 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">完好设备数</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-500 font-mono tracking-tight">{goodEquipments}</span>
              <span className="text-xs text-slate-400">台</span>
            </div>
          </div>

          {/* Card 3: 设备完好率 */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3.5 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">设备完好率</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-500 font-mono tracking-tight">{healthRate}%</span>
            </div>
          </div>

          {/* Card 4: 本月日均保养数 */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3.5 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">本月日均保养数</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-500 font-mono tracking-tight">68</span>
              <span className="text-xs text-slate-400">次/日</span>
            </div>
          </div>

          {/* Card 5: 本月日均点检数 */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3.5 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">本月日均点检数</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-500 font-mono tracking-tight">128</span>
              <span className="text-xs text-slate-400">项/日</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Lower Section: MTTR Chart & Quick Actions (Screenshot 1 Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: 平均修复时间MTTR */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          {/* Header of MTTR card */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h3 className="text-sm font-bold text-slate-800">平均修复时间MTTR</h3>
            </div>

            {/* Time Controls: 本周, 本月, 本年 & Date Range */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
                <button
                  onClick={() => setMttrPeriod('week')}
                  className={`px-2.5 py-1 rounded transition-colors font-medium ${
                    mttrPeriod === 'week' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  本周
                </button>
                <button
                  onClick={() => setMttrPeriod('month')}
                  className={`px-2.5 py-1 rounded transition-colors font-medium ${
                    mttrPeriod === 'month' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  本月
                </button>
                <button
                  onClick={() => setMttrPeriod('year')}
                  className={`px-2.5 py-1 rounded transition-colors font-medium ${
                    mttrPeriod === 'year' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  本年
                </button>
              </div>

              {/* Date range picker simulation */}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-500">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="开始日期"
                  className="w-24 text-[11px] bg-transparent outline-hidden"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="结束日期"
                  className="w-24 text-[11px] bg-transparent outline-hidden"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* MTTR Content: Metrics Sidebar + SVG Curved Chart */}
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            {/* Left MTTR stat breakdown */}
            <div className="w-full md:w-44 shrink-0 space-y-3 bg-slate-50/80 rounded-lg p-3 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-500">本周MTTR</span>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">160 min</div>
                <div className="text-[11px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  <span>🡅 2%</span>
                  <span className="text-slate-400">环比上周</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-500">本月MTTR</span>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">175 min</div>
                <div className="text-[11px] text-rose-500 flex items-center gap-0.5 mt-0.5">
                  <span>🡅 3%</span>
                  <span className="text-slate-400">环比上月</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-500">本年MTTR</span>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">181 min</div>
              </div>
            </div>

            {/* Right Interactive Curved Line Chart */}
            <div className="flex-1 relative min-h-[190px] flex flex-col justify-end">
              {/* Tooltip on hover */}
              {hoveredPoint && (
                <div className="absolute top-1 right-2 bg-slate-900/90 text-white text-[11px] px-2.5 py-1 rounded shadow-md pointer-events-none z-10 flex items-center gap-2">
                  <span className="text-slate-300">{hoveredPoint.month}:</span>
                  <span className="font-bold text-blue-400">{hoveredPoint.mttr} 分钟</span>
                </div>
              )}

              <div className="relative w-full overflow-hidden">
                {/* Y Axis Grid Lines & Labels */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
                  <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-0.5">
                    <span>240</span>
                  </div>
                  <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-0.5">
                    <span>180</span>
                  </div>
                  <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-0.5">
                    <span>120</span>
                  </div>
                  <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-0.5">
                    <span>60</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>0</span>
                  </div>
                </div>

                {/* SVG Curve Line Chart */}
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-44 overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="mttrGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Filled area under curve */}
                  {points.length > 0 && (
                    <path
                      d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - 15} L ${points[0].x} ${chartHeight - 15} Z`}
                      fill="url(#mttrGradient)"
                    />
                  )}

                  {/* Smooth line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Points with interactive hover */}
                  {points.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#FFFFFF"
                        stroke="#2563EB"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 hover:fill-blue-600 transition-all"
                        onMouseEnter={() => setHoveredPoint({ month: pt.month, mttr: pt.mttr })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* X Axis Month Labels */}
                <div className="flex justify-between px-2 pt-1 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                  {currentChartData.map((d, i) => (
                    <span key={i} className="text-center">{d.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 快捷入口 (Quick Entry Shortcuts Grid) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">快捷入口</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 flex-1">
            <button
              onClick={() => onNavigate('equipment-add')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>新增设备</span>
            </button>

            <button
              onClick={() => onNavigate('spare-parts-ledger')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>新增备件</span>
            </button>

            <button
              onClick={() => onNavigate('repair-report')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>设备报修</span>
            </button>

            <button
              onClick={() => onNavigate('maintenance-task')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>快速保养</span>
            </button>

            <button
              onClick={() => onNavigate('inspection-task')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>快速点检</span>
            </button>

            <button
              onClick={() => onNavigate('patrol-task')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>快速巡检</span>
            </button>

            <button
              onClick={() => onNavigate('spare-parts-ledger')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>备件管理</span>
            </button>

            <button
              onClick={() => onNavigate('spare-parts-ledger')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>仓库管理</span>
            </button>

            <button
              onClick={() => onNavigate('inspection-record')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>到货质检</span>
            </button>

            <button
              onClick={() => onNavigate('spare-parts-ledger')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-blue-50/80 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>收货入库</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Real-time Operation & Alarm Stream (按时间降序排列 - 最新的排在最前面) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">最新设备动态与实时告警</h3>
            <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-medium border border-blue-200">
              按发生时间降序排列（最新在首）
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            更新基准时间: 2026-09-27 20:08:54
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className="px-3 py-2.5 font-medium">触发时间 (最新降序 ▾)</th>
                <th className="px-3 py-2.5 font-medium">设备名称</th>
                <th className="px-3 py-2.5 font-medium">设备编码</th>
                <th className="px-3 py-2.5 font-medium">事件类型</th>
                <th className="px-3 py-2.5 font-medium">报警等级</th>
                <th className="px-3 py-2.5 font-medium">所在区域</th>
                <th className="px-3 py-2.5 font-medium">状态</th>
                <th className="px-3 py-2.5 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alarmLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-medium whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{log.equipmentName}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{log.equipmentCode}</td>
                  <td className="px-3 py-2.5 text-slate-700">{log.type}</td>
                  <td className="px-3 py-2.5">
                    {log.level === '高' && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-[11px] font-semibold border border-red-200">
                        高危
                      </span>
                    )}
                    {log.level === '中' && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[11px] font-semibold border border-amber-200">
                        中度
                      </span>
                    )}
                    {log.level === '低' && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-semibold border border-slate-200">
                        常规
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{log.area}</td>
                  <td className="px-3 py-2.5">
                    {log.status === '已恢复' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>已恢复
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>处理中
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => onNavigate('equipment-ledger')}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      定位设备
                    </button>
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
