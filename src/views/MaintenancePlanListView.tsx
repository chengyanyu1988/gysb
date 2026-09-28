import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Download,
  ArrowUpDown,
  Home,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { MaintenancePlan } from '../types';

interface MaintenancePlanListViewProps {
  plans: MaintenancePlan[];
  onAddPlan: () => void;
  onEditPlan: (plan: MaintenancePlan) => void;
  onViewPlanDetail: (plan: MaintenancePlan) => void;
  onDeletePlan: (id: string) => void;
  onBatchDeletePlans: (ids: string[]) => void;
  onTogglePlanStatus: (id: string, enabled: boolean) => void;
}

export const MaintenancePlanListView: React.FC<MaintenancePlanListViewProps> = ({
  plans,
  onAddPlan,
  onEditPlan,
  onViewPlanDetail,
  onDeletePlan,
  onBatchDeletePlans,
  onTogglePlanStatus,
}) => {
  // Search state
  const [planCode, setPlanCode] = useState('');
  const [planName, setPlanName] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [maintenanceGroup, setMaintenanceGroup] = useState('');
  const [executor, setExecutor] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [department, setDepartment] = useState('');

  // Selected checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Time sort direction (default desc)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered & Sorted
  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan) => {
        if (planCode && !plan.planCode.toLowerCase().includes(planCode.toLowerCase())) return false;
        if (planName && !plan.planName.toLowerCase().includes(planName.toLowerCase())) return false;
        if (approvalStatus && plan.approvalStatus !== approvalStatus) return false;
        if (maintenanceGroup && !plan.maintenanceGroup.includes(maintenanceGroup)) return false;
        if (executor && !plan.executor.includes(executor)) return false;
        if (department && !plan.department.includes(department)) return false;
        if (startTime && !plan.startTime.includes(startTime)) return false;
        if (endTime && !plan.endTime.includes(endTime)) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.startTime.replace(/-/g, '/')).getTime();
        const timeB = new Date(b.startTime.replace(/-/g, '/')).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [plans, planCode, planName, approvalStatus, maintenanceGroup, executor, department, startTime, endTime, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / pageSize));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, currentPage]);

  const handleReset = () => {
    setPlanCode('');
    setPlanName('');
    setApprovalStatus('');
    setMaintenanceGroup('');
    setExecutor('');
    setStartTime('');
    setEndTime('');
    setDepartment('');
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentData.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定要批量删除选中的 ${selectedIds.length} 项保养计划吗？`)) {
      onBatchDeletePlans(selectedIds);
      setSelectedIds([]);
    }
  };

  const renderApprovalStatusBadge = (status: string) => {
    switch (status) {
      case '无需审批':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            无需审批
          </span>
        );
      case '审批中':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            审批中
          </span>
        );
      case '审批通过':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            审批通过
          </span>
        );
      case '审批驳回':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            审批驳回
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Filter Card */}
      <div className="bg-white rounded-lg p-5 border border-gray-200/80 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">计划编码:</span>
            <input
              type="text"
              placeholder="请输入计划编码"
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">计划名称:</span>
            <input
              type="text"
              placeholder="请输入计划名称"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">审批状态:</span>
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="">选择审批状态</option>
              <option value="无需审批">无需审批</option>
              <option value="审批中">审批中</option>
              <option value="审批通过">审批通过</option>
              <option value="审批驳回">审批驳回</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">保养班组:</span>
            <select
              value={maintenanceGroup}
              onChange={(e) => setMaintenanceGroup(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="">选择保养班组</option>
              <option value="机修一班">机修一班</option>
              <option value="机修二班">机修二班</option>
              <option value="起重班组">起重班组</option>
              <option value="高压电工班">高压电工班</option>
              <option value="电工班">电工班</option>
              <option value="仪表班组">仪表班组</option>
              <option value="维修一组">维修一组</option>
              <option value="维修二组">维修二组</option>
              <option value="管工班组">管工班组</option>
              <option value="暖通班组">暖通班组</option>
              <option value="车辆维修组">车辆维修组</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">执行人选:</span>
            <select
              value={executor}
              onChange={(e) => setExecutor(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="">选择执行人选</option>
              <option value="张建国">张建国</option>
              <option value="李强">李强</option>
              <option value="王军">王军</option>
              <option value="赵刚">赵刚</option>
              <option value="陈静">陈静</option>
              <option value="刘洋">刘洋</option>
              <option value="张伟">张伟</option>
              <option value="孙丽">孙丽</option>
              <option value="周杰">周杰</option>
              <option value="吴刚">吴刚</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">计划开时间:</span>
            <input
              type="text"
              placeholder="请选择时间"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">计划结时间:</span>
            <input
              type="text"
              placeholder="请选择时间"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">使用部门:</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="">选择使用部门</option>
              <option value="动力车间">动力车间</option>
              <option value="生产运行部">生产运行部</option>
              <option value="环保部">环保部</option>
              <option value="设备管理部">设备管理部</option>
              <option value="成品车间">成品车间</option>
              <option value="公用工程部">公用工程部</option>
              <option value="合成车间">合成车间</option>
              <option value="安全环保部">安全环保部</option>
              <option value="行政部">行政部</option>
              <option value="仓储物流部">仓储物流部</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            查询
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-xs font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置
          </button>
        </div>
      </div>

      {/* Main List Table Card */}
      <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">保养计划列表</h3>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onAddPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
            <button
              onClick={() => alert('已成功导出保养计划报表 (Excel)')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-medium transition ${
                selectedIds.length > 0
                  ? 'border-red-400 text-red-600 hover:bg-red-50'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              批量删除
            </button>
            <button
              onClick={() => handleReset()}
              title="刷新"
              className="p-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              title="列设置"
              className="p-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 select-none">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={currentData.length > 0 && selectedIds.length === currentData.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-2 w-12 text-center font-medium">序号</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">计划编码</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">计划名称</th>
                <th
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="py-3 px-3 font-medium whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>计划开始时间</span>
                    <ArrowUpDown className="w-3 h-3 text-blue-600" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">计划结束时间</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">审批状态</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">所属部门</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">保养班组</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">保养周期</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">执行人</th>
                <th className="py-3 px-3 font-medium text-center whitespace-nowrap">状态</th>
                <th className="py-3 px-4 font-medium text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-gray-400">
                    暂无符合条件的保养计划数据
                  </td>
                </tr>
              ) : (
                currentData.map((plan, index) => {
                  const isSelected = selectedIds.includes(plan.id);
                  const serialNo = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={plan.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(plan.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2 text-center text-gray-500 font-medium">
                        {serialNo}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {plan.planCode}
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">
                        {plan.planName}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {plan.startTime}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {plan.endTime}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {renderApprovalStatusBadge(plan.approvalStatus)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{plan.department}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{plan.maintenanceGroup}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-gray-600">{plan.cycle}</td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-gray-800">
                        {plan.executor}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {/* Switch toggle matching screenshots */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.enabled}
                            onChange={(e) => onTogglePlanStatus(plan.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => onEditPlan(plan)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => onViewPlanDetail(plan)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                          >
                            查看
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`确定要删除计划 ${plan.planName} 吗？`)) {
                                onDeletePlan(plan.id);
                              }
                            }}
                            className="text-blue-600 hover:text-red-600 font-medium hover:underline text-xs"
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

        {/* Pagination matching screenshots */}
        <div className="flex flex-wrap items-center justify-end px-6 py-3.5 bg-gray-50/60 border-t border-gray-200 text-xs text-gray-600 gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(9, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>

          <select
            value={pageSize}
            onChange={() => {}}
            className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 text-xs focus:outline-none"
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>

          <div className="flex items-center gap-1">
            <span>跳至</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt((e.target as HTMLInputElement).value, 10);
                  if (val >= 1 && val <= totalPages) setCurrentPage(val);
                }
              }}
              className="w-10 px-1 py-1 border border-gray-300 rounded text-center bg-white"
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};
