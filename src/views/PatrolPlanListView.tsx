import React, { useState, useMemo } from 'react';
import { PatrolPlan, InspectionApprovalStatus } from '../types';
import {
  Search,
  RotateCcw,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  Settings2,
  Calendar,
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Edit,
  Eye,
} from 'lucide-react';
import { MainTab } from '../components/Sidebar';

interface PatrolPlanListViewProps {
  plans: PatrolPlan[];
  onNavigate: (tab: MainTab, params?: { patrolPlan?: PatrolPlan }) => void;
  onDeletePlan: (id: string) => void;
  onBatchDeletePlans: (ids: string[]) => void;
  onTogglePlanStatus: (id: string) => void;
  onExportPlans: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PatrolPlanListView: React.FC<PatrolPlanListViewProps> = ({
  plans,
  onNavigate,
  onDeletePlan,
  onBatchDeletePlans,
  onTogglePlanStatus,
  onExportPlans,
  showToast,
}) => {
  // Filters state (Screenshot 1)
  const [filterPlanCode, setFilterPlanCode] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterExecutor, setFilterExecutor] = useState('');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState<string>('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');

  // Selected Row IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('5');

  // Sort state (Latest time descending by default)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Dropdown options
  const departmentOptions = useMemo(() => {
    const list = Array.from(new Set(plans.map((p) => p.department))).filter(Boolean);
    return ['生产运行部', '动力车间', '环保科', '储运部', '仪表车间', '成品车间', '安全部', '电气车间', ...list];
  }, [plans]);

  const executorOptions = useMemo(() => {
    const list = Array.from(new Set(plans.map((p) => p.executor))).filter(Boolean);
    return ['张建国', '刘志强', '李敏', '王强', '陈伟', '赵刚', '孙丽', '周杰', '吴秀兰', '郑凯', ...list];
  }, [plans]);

  // Reset filter
  const handleReset = () => {
    setFilterPlanCode('');
    setFilterDepartment('');
    setFilterExecutor('');
    setFilterApprovalStatus('');
    setFilterStartTime('');
    setFilterEndTime('');
    setCurrentPage(1);
    setSelectedIds([]);
    showToast('已重置筛选条件', 'info');
  };

  // Filter and sort plans (Descending by execution/update time)
  const filteredPlans = useMemo(() => {
    const res = plans.filter((p) => {
      const matchCode = filterPlanCode
        ? p.planCode.toLowerCase().includes(filterPlanCode.toLowerCase())
        : true;
      const matchDept = filterDepartment ? p.department === filterDepartment : true;
      const matchExec = filterExecutor ? p.executor === filterExecutor : true;
      const matchApproval = filterApprovalStatus
        ? p.approvalStatus === filterApprovalStatus
        : true;
      const matchStart = filterStartTime
        ? (p.startTime || p.executionTimeRange).includes(filterStartTime)
        : true;
      const matchEnd = filterEndTime
        ? (p.endTime || p.executionTimeRange).includes(filterEndTime)
        : true;

      return matchCode && matchDept && matchExec && matchApproval && matchStart && matchEnd;
    });

    return res.sort((a, b) => {
      const timeA = new Date(a.updateTime || a.startTime || '2026-09-01').getTime();
      const timeB = new Date(b.updateTime || b.startTime || '2026-09-01').getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [
    plans,
    filterPlanCode,
    filterDepartment,
    filterExecutor,
    filterApprovalStatus,
    filterStartTime,
    filterEndTime,
    sortOrder,
  ]);

  // Pagination slice
  const totalPages = Math.ceil(filteredPlans.length / pageSize) || 1;
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, currentPage, pageSize]);

  // Select all current page
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedPlans.map((p) => p.id);
      const combined = Array.from(new Set([...selectedIds, ...pageIds]));
      setSelectedIds(combined);
    } else {
      const pageIdSet = new Set(paginatedPlans.map((p) => p.id));
      setSelectedIds(selectedIds.filter((id) => !pageIdSet.has(id)));
    }
  };

  const isAllSelected =
    paginatedPlans.length > 0 &&
    paginatedPlans.every((p) => selectedIds.includes(p.id));

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量删除的巡检计划', 'warning');
      return;
    }
    if (confirm(`确定要批量删除选中的 ${selectedIds.length} 项巡检计划吗？`)) {
      onBatchDeletePlans(selectedIds);
      setSelectedIds([]);
      showToast(`已成功删除 ${selectedIds.length} 项巡检计划`, 'success');
    }
  };

  const handleDeleteSingle = (plan: PatrolPlan) => {
    if (confirm(`确定要删除巡检计划: ${plan.planCode} (${plan.patrolArea}) 吗？`)) {
      onDeletePlan(plan.id);
      setSelectedIds(selectedIds.filter((id) => id !== plan.id));
      showToast(`已删除巡检计划: ${plan.planCode}`, 'success');
    }
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput(String(p));
    }
  };

  const handleJumpPage = () => {
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    } else {
      setJumpPageInput(String(currentPage));
    }
  };

  // Render Approval Status Tag (Screenshot 1 & 2)
  const renderApprovalStatus = (status: InspectionApprovalStatus) => {
    switch (status) {
      case '无需审批':
        return (
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            无需审批
          </span>
        );
      case '审批中':
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            审批中
          </span>
        );
      case '审批通过':
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            审批通过
          </span>
        );
      case '审批驳回':
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            审批驳回
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-3 pb-12">
      {/* 2. Top Filter Box (Screenshot 1) */}
      <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* 计划编码 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              计划编码:
            </label>
            <input
              type="text"
              placeholder="请输入计划编码"
              value={filterPlanCode}
              onChange={(e) => setFilterPlanCode(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 所属部门 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              所属部门:
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:border-blue-500 text-slate-700"
            >
              <option value="">选择所属部门</option>
              {Array.from(new Set(departmentOptions)).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* 执行人选 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              执行人选:
            </label>
            <select
              value={filterExecutor}
              onChange={(e) => setFilterExecutor(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:border-blue-500 text-slate-700"
            >
              <option value="">选择执行人</option>
              {Array.from(new Set(executorOptions)).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* 审批状态 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              审批状态:
            </label>
            <select
              value={filterApprovalStatus}
              onChange={(e) => setFilterApprovalStatus(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:border-blue-500 text-slate-700"
            >
              <option value="">选择审批状态</option>
              <option value="无需审批">无需审批</option>
              <option value="审批中">审批中</option>
              <option value="审批通过">审批通过</option>
              <option value="审批驳回">审批驳回</option>
            </select>
          </div>

          {/* 计划开时间 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              计划开时间:
            </label>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="请选择时间"
                value={filterStartTime}
                onChange={(e) => setFilterStartTime(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded pl-7 focus:outline-hidden focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* 计划结时间 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              计划结时间:
            </label>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="请选择时间"
                value={filterEndTime}
                onChange={(e) => setFilterEndTime(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded pl-7 focus:outline-hidden focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* Action Buttons (Right aligned) */}
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setCurrentPage(1);
                showToast(`已完成查询，共匹配 ${filteredPlans.length} 条巡检计划`, 'info');
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              查询
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Patrol Plan Table Card (Screenshot 1 & 2) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              巡检计划列表
            </h3>
            {selectedIds.length > 0 && (
              <span className="text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                已选中 {selectedIds.length} 项
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* + 新增 (Screenshot 1: Blue button) */}
            <button
              onClick={() => onNavigate('patrol-plan-add')}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>

            {/* 导出 (Screenshot 1: Orange border button) */}
            <button
              onClick={onExportPlans}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-orange-50 text-orange-600 border border-orange-400 rounded text-xs font-medium transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              导出
            </button>

            {/* 批量删除 (Screenshot 1: Red border button) */}
            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-500 border border-rose-300 disabled:opacity-40 disabled:hover:bg-white rounded text-xs font-medium transition-colors shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              批量删除
            </button>

            {/* Refresh */}
            <button
              onClick={() => showToast('已刷新巡检计划数据', 'info')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Column settings */}
            <button
              onClick={() => showToast('已应用默认表格视图配置', 'info')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
              title="列配置"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table container with horizontal scroll (Screenshot 1 & 2) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="px-3 py-2.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2.5 w-12 text-center">序号</th>
                <th className="px-3 py-2.5">计划编码</th>
                <th className="px-3 py-2.5">巡检区域</th>
                <th
                  className="px-3 py-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  title="点击切换时间排序"
                >
                  <div className="flex items-center gap-1">
                    <span>执行日期时间</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2.5">审批状态</th>
                <th className="px-3 py-2.5">所属部门</th>
                <th className="px-3 py-2.5">周期</th>
                <th className="px-3 py-2.5">上次执行时间</th>
                <th className="px-3 py-2.5">下次执行时间</th>
                <th className="px-3 py-2.5">执行人选</th>
                <th className="px-3 py-2.5 text-center">状态</th>
                <th className="px-3 py-2.5 text-center w-28 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPlans.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-slate-400 text-xs">
                    暂无符合条件的巡检计划数据
                  </td>
                </tr>
              ) : (
                paginatedPlans.map((plan, index) => {
                  const seqNo = (currentPage - 1) * pageSize + index + 1;
                  const isChecked = selectedIds.includes(plan.id);

                  return (
                    <tr
                      key={plan.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(plan.id, e.target.checked)}
                          className="rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* 序号 */}
                      <td className="px-3 py-2.5 text-center text-slate-500 font-mono">
                        {seqNo}
                      </td>

                      {/* 计划编码 */}
                      <td className="px-3 py-2.5 font-mono text-slate-800 font-medium whitespace-nowrap">
                        {plan.planCode}
                      </td>

                      {/* 巡检区域 */}
                      <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                        {plan.patrolArea}
                      </td>

                      {/* 执行日期时间 */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {plan.executionTimeRange}
                      </td>

                      {/* 审批状态 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {renderApprovalStatus(plan.approvalStatus)}
                      </td>

                      {/* 所属部门 */}
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {plan.department}
                      </td>

                      {/* 周期 */}
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {plan.period}
                      </td>

                      {/* 上次执行时间 */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {plan.lastExecutionTime}
                      </td>

                      {/* 下次执行时间 */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {plan.nextExecutionTime}
                      </td>

                      {/* 执行人选 */}
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {plan.executor}
                      </td>

                      {/* 状态 (Switch Toggle - Screenshot 2) */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onTogglePlanStatus(plan.id)}
                          className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            plan.enabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              plan.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* 操作 (编辑 查看 删除 - Screenshot 1 & 2) */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <button
                            onClick={() => onNavigate('patrol-plan-edit', { patrolPlan: plan })}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => onNavigate('patrol-plan-detail', { patrolPlan: plan })}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            查看
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(plan)}
                            className="text-blue-600 hover:text-rose-600 font-medium hover:underline"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination (Screenshot 1 & 2 Bottom) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            显示第 {filteredPlans.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} 至{' '}
            {Math.min(currentPage * pageSize, filteredPlans.length)} 条，共 {filteredPlans.length} 条
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-1 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                title="首页"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                title="上一页"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-6 h-6 px-1.5 text-xs rounded border transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600 font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return (
                    <span key={pageNum} className="text-slate-400 px-0.5">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                title="下一页"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                title="末页"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-200 rounded text-xs bg-white text-slate-700 focus:outline-hidden"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
            </select>

            {/* Jump Page */}
            <div className="flex items-center gap-1">
              <span>跳至</span>
              <input
                type="text"
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJumpPage()}
                className="w-10 px-1 py-0.5 border border-slate-200 rounded text-center text-xs focus:outline-hidden"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
