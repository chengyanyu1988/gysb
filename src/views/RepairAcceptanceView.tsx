import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  RotateCcw,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Clock,
  Star,
  FileCheck,
  Upload,
  Eye,
  ArrowDown,
  ArrowUp,
  Filter,
  Check,
  ClipboardCheck,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { RepairAcceptanceItem, RepairOrder, RepairSpareConsumptionItem } from '../types';

interface RepairAcceptanceViewProps {
  acceptances: RepairAcceptanceItem[];
  repairOrders: RepairOrder[];
  onAcceptSubmit: (item: RepairAcceptanceItem) => void;
  onQuickCreateAcceptance?: (item: Partial<RepairAcceptanceItem>) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const RepairAcceptanceView: React.FC<RepairAcceptanceViewProps> = ({
  acceptances,
  repairOrders,
  onAcceptSubmit,
  onQuickCreateAcceptance,
  showToast,
}) => {
  // Query Filter States
  const [filterReportNo, setFilterReportNo] = useState('');
  const [filterAcceptanceNo, setFilterAcceptanceNo] = useState('');
  const [filterAcceptor, setFilterAcceptor] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Drawer / Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewAcceptanceModalOpen, setIsNewAcceptanceModalOpen] = useState(false);
  const [currentAcceptance, setCurrentAcceptance] = useState<RepairAcceptanceItem | null>(null);

  // Form State for Drawer
  const [drawerForm, setDrawerForm] = useState<{
    status: '验收通过' | '验收不通过';
    rating: number;
    ratingRemark: string;
    trialRunStatus: string;
    acceptor: string;
    acceptTime: string;
    acceptanceOpinion: string;
    attachments: string[];
  }>({
    status: '验收通过',
    rating: 5,
    ratingRemark: '非常满意',
    trialRunStatus: '带载试运行30分钟无漏气无异响，排气温度与压力平稳',
    acceptor: '王主管 (质检部)',
    acceptTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    acceptanceOpinion: '设备试运行指标恢复正常，各项传感器数值稳定，现场清理整洁，准予恢复生产投用。',
    attachments: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    ],
  });

  // New Acceptance form
  const [newOrderSelect, setNewOrderSelect] = useState<string>('');

  // Filtered and Sorted Data (降序排列 - 最新的排在最前面)
  const filteredList = useMemo(() => {
    return acceptances
      .filter((item) => {
        if (filterReportNo && !item.reportNo.toLowerCase().includes(filterReportNo.trim().toLowerCase())) {
          return false;
        }
        if (filterAcceptanceNo && !item.acceptanceNo.toLowerCase().includes(filterAcceptanceNo.trim().toLowerCase())) {
          return false;
        }
        if (filterAcceptor && !(item.acceptor || '').toLowerCase().includes(filterAcceptor.trim().toLowerCase())) {
          return false;
        }
        if (filterStatus !== 'all' && item.status !== filterStatus) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.acceptTime || a.repairFinishTime || a.createTime).getTime();
        const timeB = new Date(b.acceptTime || b.repairFinishTime || b.createTime).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [acceptances, filterReportNo, filterAcceptanceNo, filterAcceptor, filterStatus, sortOrder]);

  // Handle Reset Filters
  const handleReset = () => {
    setFilterReportNo('');
    setFilterAcceptanceNo('');
    setFilterAcceptor('');
    setFilterStatus('all');
    showToast('筛选项已重置', 'info');
  };

  // Open Acceptance Drawer
  const handleOpenAcceptDrawer = (item: RepairAcceptanceItem) => {
    setCurrentAcceptance(item);
    setDrawerForm({
      status: item.status === '待验收' ? '验收通过' : item.status,
      rating: item.rating || 5,
      ratingRemark: item.ratingRemark || '非常满意',
      trialRunStatus: item.trialRunStatus || '带载试运行30分钟无漏气无异响，排气温度与压力平稳',
      acceptor: item.acceptor || '王主管 (质检部)',
      acceptTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      acceptanceOpinion: item.acceptanceOpinion || '设备试运行指标恢复正常，各项传感器数值稳定，现场清理整洁，准予恢复生产投用。',
      attachments: item.attachments && item.attachments.length > 0 ? item.attachments : [
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
      ],
    });
    setIsDrawerOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (item: RepairAcceptanceItem) => {
    setCurrentAcceptance(item);
    setIsDetailModalOpen(true);
  };

  // Submit Acceptance from Drawer
  const handleSubmitDrawer = () => {
    if (!currentAcceptance) return;
    const updated: RepairAcceptanceItem = {
      ...currentAcceptance,
      status: drawerForm.status,
      rating: drawerForm.rating,
      ratingRemark: drawerForm.ratingRemark,
      trialRunStatus: drawerForm.trialRunStatus,
      acceptor: drawerForm.acceptor,
      acceptTime: drawerForm.acceptTime,
      acceptanceOpinion: drawerForm.acceptanceOpinion,
      attachments: drawerForm.attachments,
    };
    onAcceptSubmit(updated);
    setIsDrawerOpen(false);
    showToast(`验收单 ${currentAcceptance.acceptanceNo} 评定完成，结果：${drawerForm.status}`, 'success');
  };

  // Quick Create from Done Repair Order
  const handleCreateAcceptanceFromOrder = () => {
    if (!newOrderSelect) {
      showToast('请选择待验收的维修工单', 'error');
      return;
    }
    const order = repairOrders.find((o) => o.id === newOrderSelect || o.orderNo === newOrderSelect);
    if (!order) return;

    const newAcceptanceNo = `YS${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(acceptances.length + 1).padStart(3, '0')}`;
    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

    const newItem: RepairAcceptanceItem = {
      id: `ya-${Date.now()}`,
      acceptanceNo: newAcceptanceNo,
      reportNo: order.faultReportNo || `BX-${order.orderNo.substring(2)}`,
      orderNo: order.orderNo,
      equipmentName: order.equipmentName,
      equipmentCode: order.equipmentCode,
      equipmentCategory: order.equipmentCategory || '通用生产设备',
      equipmentSpec: order.equipmentSpec || '标准型',
      equipmentLevel: order.equipmentLevel || 'A类',
      installArea: order.installArea || '生产车间',
      reporter: order.reporter || '现场操作员',
      repairman: order.repairman || '维修主管',
      repairGroup: order.repairGroup || '机修组',
      repairFinishTime: order.finishTime || order.handleTime || nowStr,
      acceptor: '王主管',
      acceptTime: nowStr,
      status: '待验收',
      rating: 5,
      ratingRemark: '非常满意',
      trialRunStatus: '试机运转平稳，待复核',
      repairSummary: order.repairSolutionDescription || order.handleRemarks || '已完成机械与电气部件检修，参数恢复正常。',
      acceptanceOpinion: '',
      sparesCount: (order.sparesConsumed || []).length,
      sparesCost: (order.sparesConsumed || []).reduce((acc, cur) => acc + cur.consumedQuantity * 150, 0),
      sparesConsumed: order.sparesConsumed || [],
      attachments: order.repairImages || [],
      createTime: nowStr,
    };

    if (onQuickCreateAcceptance) {
      onQuickCreateAcceptance(newItem);
    } else {
      onAcceptSubmit(newItem);
    }
    setIsNewAcceptanceModalOpen(false);
    setNewOrderSelect('');
    showToast(`成功创建验收任务 ${newAcceptanceNo}`, 'success');
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Query Filter Area (精准匹配 Screenshot 1) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* 报修单号 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">报修单号:</span>
            <input
              type="text"
              value={filterReportNo}
              onChange={(e) => setFilterReportNo(e.target.value)}
              placeholder="请输入报修单号"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 验收单号 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">验收单号:</span>
            <input
              type="text"
              value={filterAcceptanceNo}
              onChange={(e) => setFilterAcceptanceNo(e.target.value)}
              placeholder="请输入验收单号"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 验收人 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">验收人:</span>
            <input
              type="text"
              value={filterAcceptor}
              onChange={(e) => setFilterAcceptor(e.target.value)}
              placeholder="请输入验收人姓名"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 验收状态 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">验收状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 bg-white"
            >
              <option value="all">全部</option>
              <option value="待验收">待验收</option>
              <option value="验收通过">验收通过</option>
              <option value="验收不通过">验收不通过</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs pt-3 border-t border-slate-100">
          <button
            onClick={() => showToast(`查询完成，共找到 ${filteredList.length} 条记录`, 'info')}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Action Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">设备验收记录</h3>
            <span className="text-xs text-slate-500">
              共 <span className="font-bold text-blue-600">{filteredList.length}</span> 条验收单
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* 降序切换 */}
            <button
              onClick={() => {
                const nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
                setSortOrder(nextOrder);
                showToast(`已切换为${nextOrder === 'desc' ? '最新时间降序' : '时间升序'}`, 'info');
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>时间排序: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>

            {/* 新建验收单登记 */}
            <button
              onClick={() => setIsNewAcceptanceModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建验收单</span>
            </button>

            <button
              onClick={() => showToast('数据已刷新，已按最新时间降序加载', 'success')}
              className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50"
              title="刷新"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-3 py-3 w-12 text-center">序号</th>
                <th className="px-3 py-3">验收单号</th>
                <th className="px-3 py-3">关联报修单号</th>
                <th className="px-3 py-3">关联维修工单</th>
                <th className="px-3 py-3">设备名称</th>
                <th className="px-3 py-3">设备编码</th>
                <th className="px-3 py-3">报修人</th>
                <th className="px-3 py-3">维修负责人</th>
                <th className="px-3 py-3">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                    <span>维修完成时间</span>
                    {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-blue-600" /> : <ArrowUp className="w-3 h-3 text-blue-600" />}
                  </div>
                </th>
                <th className="px-3 py-3">验收人</th>
                <th className="px-3 py-3">验收时间</th>
                <th className="px-3 py-3 text-center">验收状态</th>
                <th className="px-3 py-3 text-center">验收评价</th>
                <th className="px-3 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-12 text-center text-slate-400">
                    <FileCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p>暂无符合条件的验收记录</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-3 py-3 text-center text-slate-400">{index + 1}</td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => handleOpenDetailModal(item)}
                        className="font-mono text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      >
                        {item.acceptanceNo}
                      </button>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-700">{item.reportNo}</td>
                    <td className="px-3 py-3 font-mono text-slate-700">{item.orderNo}</td>
                    <td className="px-3 py-3 font-medium text-slate-900">{item.equipmentName}</td>
                    <td className="px-3 py-3 font-mono text-slate-600">{item.equipmentCode}</td>
                    <td className="px-3 py-3 text-slate-800">{item.reporter}</td>
                    <td className="px-3 py-3 text-slate-800">
                      <span className="font-medium text-slate-900">{item.repairman}</span>
                      {item.repairGroup && <span className="text-slate-400 text-[11px] ml-1">({item.repairGroup})</span>}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-600 font-semibold">{item.repairFinishTime}</td>
                    <td className="px-3 py-3 text-slate-800 font-medium">{item.acceptor || '-'}</td>
                    <td className="px-3 py-3 font-mono text-slate-600">{item.acceptTime || '-'}</td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === '验收通过'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === '验收不通过'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status === '验收通过' && <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />}
                        {item.status === '待验收' && <Clock className="w-3 h-3 mr-1 text-amber-600" />}
                        {item.status === '验收不通过' && <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {item.rating ? (
                        <div className="flex items-center justify-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (item.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[11px] text-slate-600 font-bold">{item.rating}星</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenAcceptDrawer(item)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium transition-colors"
                        >
                          验收
                        </button>
                        <button
                          onClick={() => handleOpenDetailModal(item)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors"
                        >
                          详情
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
          <div>
            共 <span className="font-bold text-slate-800">{filteredList.length}</span> 条数据，当前显示第 1-
            {filteredList.length} 条
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-400 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 侧边滑出抽屉：设备验收 (Screenshot 2 精准还原) */}
      {/* ========================================================================= */}
      {isDrawerOpen && currentAcceptance && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="text-base font-bold text-slate-800">设备验收</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-blue-100 text-blue-800 font-semibold">
                  {currentAcceptance.acceptanceNo}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* 关联信息卡片 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-blue-600" />
                  <span>维修基础信息</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="text-slate-400">设备名称：</span>
                    <span className="font-bold text-slate-900 ml-1">{currentAcceptance.equipmentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">设备编码：</span>
                    <span className="font-mono text-slate-800 ml-1">{currentAcceptance.equipmentCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">关联维修工单：</span>
                    <span className="font-mono text-blue-600 font-bold ml-1">{currentAcceptance.orderNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">关联报修单：</span>
                    <span className="font-mono text-slate-800 ml-1">{currentAcceptance.reportNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">维修班组/责任人：</span>
                    <span className="font-medium text-slate-800 ml-1">
                      {currentAcceptance.repairGroup} - {currentAcceptance.repairman}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">维修完成时间：</span>
                    <span className="font-mono text-slate-800 font-semibold ml-1">
                      {currentAcceptance.repairFinishTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* 维修结果与总结 */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>维修实施总结</span>
                </h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {currentAcceptance.repairSummary || '已更换磨损密封部件并完成各项性能调试，符合设计指标要求。'}
                </p>

                {/* 备件消耗明细 */}
                {currentAcceptance.sparesConsumed && currentAcceptance.sparesConsumed.length > 0 && (
                  <div className="mt-3">
                    <span className="text-slate-500 font-medium block mb-1.5">
                      本次维修消耗备件 ({currentAcceptance.sparesConsumed.length} 项)：
                    </span>
                    <div className="space-y-1.5">
                      {currentAcceptance.sparesConsumed.map((sp) => (
                        <div
                          key={sp.id}
                          className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{sp.spareName}</span>
                            <span className="font-mono text-slate-500 text-[11px]">{sp.spareCode}</span>
                            <span className="text-slate-400 text-[11px]">{sp.spec}</span>
                          </div>
                          <span className="font-bold text-blue-600">
                            消耗: {sp.consumedQuantity} {sp.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 验收评定表单 */}
              <div className="bg-white border border-blue-100 rounded-xl p-4 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>现场验收结论评定</span>
                </h4>

                {/* 验收结果单选 */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-rose-500 mr-0.5">*</span>验收判定结果:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDrawerForm({ ...drawerForm, status: '验收通过' })}
                      className={`p-3 rounded-xl border flex items-center gap-2 font-bold transition-all ${
                        drawerForm.status === '验收通过'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          drawerForm.status === '验收通过' ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span>验收通过 (合格恢复生产)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDrawerForm({ ...drawerForm, status: '验收不通过' })}
                      className={`p-3 rounded-xl border flex items-center gap-2 font-bold transition-all ${
                        drawerForm.status === '验收不通过'
                          ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 ${
                          drawerForm.status === '验收不通过' ? 'text-rose-600' : 'text-slate-300'
                        }`}
                      />
                      <span>验收不通过 (返工重修)</span>
                    </button>
                  </div>
                </div>

                {/* 试机运行状态 */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">试运转状态:</label>
                  <input
                    type="text"
                    value={drawerForm.trialRunStatus}
                    onChange={(e) => setDrawerForm({ ...drawerForm, trialRunStatus: e.target.value })}
                    placeholder="如：带载试运行30分钟无异常，参数达标"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* 验收打分 */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">维修质量综合评价:</label>
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setDrawerForm({
                              ...drawerForm,
                              rating: star,
                              ratingRemark:
                                star === 5
                                  ? '非常满意'
                                  : star === 4
                                  ? '满意'
                                  : star === 3
                                  ? '一般'
                                  : '不满意',
                            })
                          }
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= drawerForm.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="font-bold text-amber-700 ml-2">
                      {drawerForm.rating} 星 ({drawerForm.ratingRemark})
                    </span>
                  </div>
                </div>

                {/* 验收人与验收时间 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">验收负责人:</label>
                    <input
                      type="text"
                      value={drawerForm.acceptor}
                      onChange={(e) => setDrawerForm({ ...drawerForm, acceptor: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">验收时间 (最新):</label>
                    <input
                      type="text"
                      value={drawerForm.acceptTime}
                      onChange={(e) => setDrawerForm({ ...drawerForm, acceptTime: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* 验收意见 */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">验收核查说明 / 现场意见:</label>
                  <textarea
                    rows={3}
                    value={drawerForm.acceptanceOpinion}
                    onChange={(e) => setDrawerForm({ ...drawerForm, acceptanceOpinion: e.target.value })}
                    placeholder="请输入现场验收结论，如设备运转、参数、安全防护及5S清洁核验情况"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* 现场核验图片 */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">现场核验照片/记录:</label>
                  <div className="flex items-center gap-3">
                    {drawerForm.attachments.map((img, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 relative group">
                        <img src={img} alt="验收现场" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => showToast('已模拟上传现场验收图片', 'info')}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-[10px] mt-1">上传照片</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-medium transition-colors text-xs"
              >
                取消
              </button>
              <button
                onClick={() => {
                  showToast('验收草稿已暂存', 'info');
                  setIsDrawerOpen(false);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors text-xs"
              >
                暂存草稿
              </button>
              <button
                onClick={handleSubmitDrawer}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>确认提交验收</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 详情模态框：验收全生命周期详情 */}
      {/* ========================================================================= */}
      {isDetailModalOpen && currentAcceptance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="text-base font-bold text-slate-800">验收详情单</h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {currentAcceptance.acceptanceNo}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    currentAcceptance.status === '验收通过'
                      ? 'bg-emerald-100 text-emerald-800'
                      : currentAcceptance.status === '验收不通过'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {currentAcceptance.status}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* 设备与工单 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">设备名称</span>
                  <span className="font-bold text-slate-900">{currentAcceptance.equipmentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">设备编码</span>
                  <span className="font-mono font-semibold text-slate-800">{currentAcceptance.equipmentCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">规格型号</span>
                  <span className="text-slate-800">{currentAcceptance.equipmentSpec || '标准规格'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">安装区域</span>
                  <span className="text-slate-800">{currentAcceptance.installArea || '生产主车间'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">关联维修工单</span>
                  <span className="font-mono font-bold text-blue-600">{currentAcceptance.orderNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">关联报修单号</span>
                  <span className="font-mono text-slate-800">{currentAcceptance.reportNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">维修负责人</span>
                  <span className="font-semibold text-slate-800">{currentAcceptance.repairman}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">维修完成时间</span>
                  <span className="font-mono font-semibold text-slate-800">{currentAcceptance.repairFinishTime}</span>
                </div>
              </div>

              {/* 验收核定结论 */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
                <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>验收评定与现场打分</span>
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block mb-0.5">验收人:</span>
                    <span className="font-bold text-slate-900">{currentAcceptance.acceptor || '待定'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">验收时间 (最新):</span>
                    <span className="font-mono font-bold text-slate-900">{currentAcceptance.acceptTime || '待验收'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">综合评分:</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (currentAcceptance.rating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="font-bold text-amber-700 ml-1">
                        {currentAcceptance.rating || 0}星 ({currentAcceptance.ratingRemark || '-'})
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">试机运转状况:</span>
                  <p className="p-2.5 rounded bg-white border border-slate-200 text-slate-800">
                    {currentAcceptance.trialRunStatus || '正常'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">验收意见说明:</span>
                  <p className="p-2.5 rounded bg-white border border-slate-200 text-slate-800">
                    {currentAcceptance.acceptanceOpinion || '设备试运行指标正常，准予恢复生产投用。'}
                  </p>
                </div>
              </div>

              {/* 耗材与照片 */}
              {currentAcceptance.sparesConsumed && currentAcceptance.sparesConsumed.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-2">备件消耗记录</h4>
                  <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium">
                      <tr>
                        <th className="p-2">备件名称</th>
                        <th className="p-2">编码</th>
                        <th className="p-2">规格</th>
                        <th className="p-2">消耗数量</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentAcceptance.sparesConsumed.map((s) => (
                        <tr key={s.id}>
                          <td className="p-2 font-bold text-slate-900">{s.spareName}</td>
                          <td className="p-2 font-mono text-slate-600">{s.spareCode}</td>
                          <td className="p-2 text-slate-600">{s.spec}</td>
                          <td className="p-2 font-bold text-blue-600">{s.consumedQuantity} {s.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 新建验收单登记弹窗 */}
      {/* ========================================================================= */}
      {isNewAcceptanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>新建设备验收单</span>
              </h3>
              <button onClick={() => setIsNewAcceptanceModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>选择已完成待验收的维修工单:
                </label>
                <select
                  value={newOrderSelect}
                  onChange={(e) => setNewOrderSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white"
                >
                  <option value="">-- 请选择工单 --</option>
                  {repairOrders.map((ord) => (
                    <option key={ord.id} value={ord.orderNo}>
                      {ord.orderNo} - {ord.equipmentName} ({ord.repairman || '已完成'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 space-y-1">
                <p>💡 提示：选择已完工的维修工单后，系统将自动汇总维修方案、耗材清单并生成验收单号。</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsNewAcceptanceModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleCreateAcceptanceFromOrder}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                确定创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
