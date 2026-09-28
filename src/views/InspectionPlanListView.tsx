import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowDown,
  ArrowUp,
  Calendar,
  Eye,
  Edit,
  SlidersHorizontal
} from 'lucide-react';
import { InspectionPlan, InspectionApprovalStatus } from '../types';

interface InspectionPlanListViewProps {
  plans: InspectionPlan[];
  onNavigate: (tab: any, params?: any) => void;
  onDeletePlan: (id: string) => void;
  onBatchDeletePlans: (ids: string[]) => void;
  onTogglePlanStatus: (id: string) => void;
  onExportPlans: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const InspectionPlanListView: React.FC<InspectionPlanListViewProps> = ({
  plans,
  onNavigate,
  onDeletePlan,
  onBatchDeletePlans,
  onTogglePlanStatus,
  onExportPlans,
  showToast,
}) => {
  // Search state matching Screenshot 1
  const [filterPlanCode, setFilterPlanCode] = useState('');
  const [filterEquipmentName, setFilterEquipmentName] = useState('');
  const [filterEquipmentCode, setFilterEquipmentCode] = useState('');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState<string>('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterExecutor, setFilterExecutor] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');

  // Sorting strictly descending by time
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Selected for batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('5');

  const departmentOptions = [
    '选择所属部门',
    '全部',
    '动力车间',
    '生产一部',
    '生产二部',
    '设备管理部',
    '机加工车间',
    '物流仓储部',
    '污水处理站',
    '包装车间',
    '储运部',
    '维修班组',
  ];

  const executorOptions = ['选择执行人', '全部', '赵工坊', '张建国', '李敏', '王强', '赵工'];

  // Filtered & Sorted Plans
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const matchPlanCode =
        !filterPlanCode.trim() || p.planCode.toLowerCase().includes(filterPlanCode.toLowerCase());
      const matchEqName =
        !filterEquipmentName.trim() ||
        p.equipmentName.toLowerCase().includes(filterEquipmentName.toLowerCase());
      const matchEqCode =
        !filterEquipmentCode.trim() ||
        p.equipmentCode.toLowerCase().includes(filterEquipmentCode.toLowerCase());
      const matchApproval =
        !filterApprovalStatus ||
        filterApprovalStatus === '选择审批状态' ||
        filterApprovalStatus === '全部' ||
        p.approvalStatus === filterApprovalStatus;
      const matchDept =
        !filterDepartment ||
        filterDepartment === '选择所属部门' ||
        filterDepartment === '全部' ||
        p.department === filterDepartment;
      const matchExec =
        !filterExecutor ||
        filterExecutor === '选择执行人' ||
        filterExecutor === '全部' ||
        p.executor === filterExecutor;

      return (
        matchPlanCode &&
        matchEqName &&
        matchEqCode &&
        matchApproval &&
        matchDept &&
        matchExec
      );
    }).sort((a, b) => {
      const timeA = new Date(a.updateTime || a.createTime).getTime();
      const timeB = new Date(b.updateTime || b.createTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [
    plans,
    filterPlanCode,
    filterEquipmentName,
    filterEquipmentCode,
    filterApprovalStatus,
    filterDepartment,
    filterExecutor,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredPlans.length / pageSize) || 1;
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, currentPage, pageSize]);

  // Select all
  const isAllSelected =
    paginatedPlans.length > 0 && paginatedPlans.every((p) => selectedIds.includes(p.id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentIds = paginatedPlans.map((p) => p.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentIds])));
    } else {
      const currentIds = new Set(paginatedPlans.map((p) => p.id));
      setSelectedIds(selectedIds.filter((id) => !currentIds.has(id)));
    }
  };

  const handleReset = () => {
    setFilterPlanCode('');
    setFilterEquipmentName('');
    setFilterEquipmentCode('');
    setFilterApprovalStatus('');
    setFilterStartTime('');
    setFilterDepartment('');
    setFilterExecutor('');
    setFilterEndTime('');
    setCurrentPage(1);
    showToast('查询条件已重置', 'info');
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先选择要删除的点检计划', 'error');
      return;
    }
    if (confirm(`确定要批量删除已选中的 ${selectedIds.length} 个点检计划吗？`)) {
      onBatchDeletePlans(selectedIds);
      setSelectedIds([]);
      showToast(`已成功删除 ${selectedIds.length} 个点检计划`, 'success');
    }
  };

  const handleJump = () => {
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    } else {
      showToast(`请输入 1 到 ${totalPages} 之间的有效页码`, 'error');
    }
  };

  // Status Badge Renderer
  const renderApprovalStatus = (status: InspectionApprovalStatus) => {
    switch (status) {
      case '无需审批':
        return (
          <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            无需审批
          </span>
        );
      case '审批中':
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            审批中
          </span>
        );
      case '审批通过':
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            审批通过
          </span>
        );
      case '审批驳回':
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            审批驳回
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Search Query Box (Screenshot 1 Top) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 计划编码 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">计划编码:</span>
            <input
              type="text"
              value={filterPlanCode}
              onChange={(e) => setFilterPlanCode(e.target.value)}
              placeholder="请输入计划编码"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          {/* 设备名称 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备名称:</span>
            <input
              type="text"
              value={filterEquipmentName}
              onChange={(e) => setFilterEquipmentName(e.target.value)}
              placeholder="请输入设备名称"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          {/* 设备编码 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备编码:</span>
            <input
              type="text"
              value={filterEquipmentCode}
              onChange={(e) => setFilterEquipmentCode(e.target.value)}
              placeholder="请输入设备编码"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          {/* 审批状态 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">审批状态:</span>
            <select
              value={filterApprovalStatus}
              onChange={(e) => setFilterApprovalStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors text-slate-700"
            >
              <option value="">选择审批状态</option>
              <option value="全部">全部</option>
              <option value="无需审批">无需审批</option>
              <option value="审批中">审批中</option>
              <option value="审批通过">审批通过</option>
              <option value="审批驳回">审批驳回</option>
            </select>
          </div>

          {/* 计划开时间 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">计划开时间:</span>
            <div className="relative flex-1">
              <input
                type="date"
                value={filterStartTime}
                onChange={(e) => setFilterStartTime(e.target.value)}
                placeholder="请选择时间"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors text-slate-700 text-xs"
              />
            </div>
          </div>

          {/* 所属部门 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">所属部门:</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors text-slate-700"
            >
              {departmentOptions.map((d) => (
                <option key={d} value={d === '选择所属部门' ? '' : d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 执行人选 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">执行人选:</span>
            <select
              value={filterExecutor}
              onChange={(e) => setFilterExecutor(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors text-slate-700"
            >
              {executorOptions.map((ex) => (
                <option key={ex} value={ex === '选择执行人' ? '' : ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>

          {/* 计划结时间 & Action Buttons */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">计划结时间:</span>
            <input
              type="date"
              value={filterEndTime}
              onChange={(e) => setFilterEndTime(e.target.value)}
              placeholder="请选择时间"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors text-slate-700 text-xs"
            />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 2. Table Section (Screenshot 1 & Screenshot 2) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">点检计划列表</h3>
            <span className="text-xs text-slate-500">
              共 <span className="font-bold text-blue-600">{filteredPlans.length}</span> 条计划
            </span>
            {/* Sort indicator strictly descending by time */}
            <button
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700 transition-colors border border-slate-200"
              title="切换时间排序"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>更新时间: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('inspection-plan-add')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            <button
              onClick={onExportPlans}
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className={`px-3.5 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors border ${
                selectedIds.length > 0
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 cursor-pointer'
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除 {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
            </button>

            <button
              onClick={() => showToast('已刷新最新点检计划数据', 'info')}
              className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => showToast('表格列配置已就绪', 'info')}
              className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md transition-colors"
              title="表格列配置"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Table matching Screenshot 1 & 2 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[1200px]">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="w-12 px-2 py-3 text-center font-medium">序号</th>
                <th className="px-3 py-3 font-medium">计划编码</th>
                <th className="px-3 py-3 font-medium">设备名称</th>
                <th className="px-3 py-3 font-medium">设备编码</th>
                <th className="px-3 py-3 font-medium">执行日期时间</th>
                <th className="px-3 py-3 font-medium">审批状态</th>
                <th className="px-3 py-3 font-medium">所属部门</th>
                <th className="px-3 py-3 font-medium">周期</th>
                <th className="px-3 py-3 font-medium">上次执行时间</th>
                <th className="px-3 py-3 font-medium">下次执行时间</th>
                <th className="px-3 py-3 font-medium">执行人选</th>
                <th className="w-20 px-3 py-3 font-medium text-center">状态</th>
                <th className="w-28 px-3 py-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPlans.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    暂无匹配的点检计划数据
                  </td>
                </tr>
              ) : (
                paginatedPlans.map((plan, idx) => {
                  const isSelected = selectedIds.includes(plan.id);
                  const serialNo = (currentPage - 1) * pageSize + idx + 1;

                  return (
                    <tr
                      key={plan.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/60' : idx % 2 === 1 ? 'bg-slate-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, plan.id]);
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== plan.id));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* 序号 */}
                      <td className="px-2 py-2.5 text-center font-mono text-slate-500">
                        {serialNo}
                      </td>

                      {/* 计划编码 */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {plan.planCode}
                      </td>

                      {/* 设备名称 */}
                      <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                        {plan.equipmentName}
                      </td>

                      {/* 设备编码 */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {plan.equipmentCode}
                      </td>

                      {/* 执行日期时间 */}
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
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
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {plan.lastExecutionTime}
                      </td>

                      {/* 下次执行时间 */}
                      <td className="px-3 py-2.5 font-mono text-slate-400 whitespace-nowrap">
                        {plan.nextExecutionTime || '----'}
                      </td>

                      {/* 执行人选 */}
                      <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                        {plan.executor}
                      </td>

                      {/* 状态 Toggle Switch (Screenshot 2) */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onTogglePlanStatus(plan.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            plan.enabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              plan.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* 操作 (编辑 查看 删除) */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <button
                            onClick={() => onNavigate('inspection-plan-edit', { plan })}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => onNavigate('inspection-plan-detail', { plan })}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            查看
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`确定要删除点检计划 "${plan.planCode}" 吗？`)) {
                                onDeletePlan(plan.id);
                                showToast(`已删除点检计划: ${plan.planCode}`, 'success');
                              }
                            }}
                            className="text-blue-600 hover:text-rose-600 hover:underline"
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

        {/* 3. Pagination Footer (Screenshot 1 & 2 Bottom) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            显示第 {filteredPlans.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} 至{' '}
            {Math.min(currentPage * pageSize, filteredPlans.length)} 条，共 {filteredPlans.length} 条
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 9) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-700 focus:outline-hidden"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
            </select>

            <div className="flex items-center gap-1">
              <span>跳至</span>
              <input
                type="text"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJump()}
                className="w-10 px-1 py-1 text-center border border-slate-200 rounded bg-white"
              />
              <span>页</span>
              <button
                onClick={handleJump}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
