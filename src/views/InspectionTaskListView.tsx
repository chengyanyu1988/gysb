import React, { useState, useMemo } from 'react';
import { InspectionTask, InspectionTaskStatus, InspectionCheckStatus } from '../types';
import {
  Search,
  RotateCcw,
  Plus,
  RefreshCw,
  Settings2,
  Calendar,
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Play,
  X,
} from 'lucide-react';
import { MainTab } from '../components/Sidebar';

interface InspectionTaskListViewProps {
  tasks: InspectionTask[];
  onNavigate: (tab: MainTab, params?: { task?: InspectionTask }) => void;
  onAddTask?: (task: InspectionTask) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const InspectionTaskListView: React.FC<InspectionTaskListViewProps> = ({
  tasks,
  onNavigate,
  onAddTask,
  showToast,
}) => {
  // Filters state
  const [filterTaskCode, setFilterTaskCode] = useState('');
  const [filterEquipmentName, setFilterEquipmentName] = useState('');
  const [filterEquipmentCode, setFilterEquipmentCode] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPlannedTime, setFilterPlannedTime] = useState('');
  const [filterExecutor, setFilterExecutor] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('1');

  // Sort state (default: descending by time)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Quick Task Modal
  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
  const [quickTaskForm, setQuickTaskForm] = useState({
    equipmentName: '螺杆式空压机-3#',
    equipmentCode: 'KY-2026-A03',
    executor: '张建国',
    plannedTime: '2026-09-27 20:45',
    department: '动力车间',
  });

  // Unique executors for dropdown
  const executorOptions = useMemo(() => {
    const list = Array.from(new Set(tasks.map((t) => t.executor))).filter(Boolean);
    return ['张建国', '刘志强', '李敏', '王强', '赵丽', '孙伟', '周丽', '钱刚', '吴秀英', '郑洁', ...list];
  }, [tasks]);

  // Reset filter
  const handleReset = () => {
    setFilterTaskCode('');
    setFilterEquipmentName('');
    setFilterEquipmentCode('');
    setFilterStatus('');
    setFilterPlannedTime('');
    setFilterExecutor('');
    setCurrentPage(1);
    showToast('已重置筛选条件', 'info');
  };

  // Filter and sort tasks (Latest time descending)
  const filteredTasks = useMemo(() => {
    const result = tasks.filter((t) => {
      const matchCode = filterTaskCode
        ? (t.taskCode || '').toLowerCase().includes(filterTaskCode.toLowerCase()) ||
          (t.planCode || '').toLowerCase().includes(filterTaskCode.toLowerCase())
        : true;
      const matchEqName = filterEquipmentName
        ? (t.equipmentName || '').toLowerCase().includes(filterEquipmentName.toLowerCase())
        : true;
      const matchEqCode = filterEquipmentCode
        ? (t.equipmentCode || '').toLowerCase().includes(filterEquipmentCode.toLowerCase())
        : true;
      const matchStatus = filterStatus ? t.status === filterStatus : true;
      const matchTime = filterPlannedTime
        ? (t.plannedTime || '').includes(filterPlannedTime)
        : true;
      const matchExecutor = filterExecutor ? t.executor === filterExecutor : true;

      return matchCode && matchEqName && matchEqCode && matchStatus && matchTime && matchExecutor;
    });

    // Sort descending by time
    return result.sort((a, b) => {
      const timeA = new Date(a.plannedTime.replace(/\//g, '-')).getTime() || 0;
      const timeB = new Date(b.plannedTime.replace(/\//g, '-')).getTime() || 0;
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [
    tasks,
    filterTaskCode,
    filterEquipmentName,
    filterEquipmentCode,
    filterStatus,
    filterPlannedTime,
    filterExecutor,
    sortOrder,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage, pageSize]);

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

  // Status renderer
  const renderTaskStatus = (status: InspectionTaskStatus) => {
    switch (status) {
      case '已超时':
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            已超时
          </span>
        );
      case '待执行':
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            待执行
          </span>
        );
      case '点检中':
        return (
          <span className="inline-flex items-center gap-1.5 text-blue-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            点检中
          </span>
        );
      case '已完成':
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            已完成
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const renderCheckStatus = (checkStatus: InspectionCheckStatus) => {
    switch (checkStatus) {
      case '未检查':
        return (
          <span className="inline-flex items-center gap-1 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            未检查
          </span>
        );
      case '正常':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            正常
          </span>
        );
      case '异常':
        return (
          <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            异常
          </span>
        );
      default:
        return <span>{checkStatus}</span>;
    }
  };

  // Create Quick Task Submit
  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: InspectionTask = {
      id: `task-${Date.now()}`,
      taskCode: `DJJH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`,
      planCode: `DJJH20260917${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentName: quickTaskForm.equipmentName,
      equipmentCode: quickTaskForm.equipmentCode,
      executor: quickTaskForm.executor,
      checkStatus: '未检查',
      plannedTime: quickTaskForm.plannedTime.replace('T', ' '),
      checkedItemsCount: 0,
      totalItemsCount: 8,
      status: '待执行',
      department: quickTaskForm.department,
      items: [],
      attachments: [],
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    if (onAddTask) {
      onAddTask(newTask);
    }
    setIsQuickTaskModalOpen(false);
    showToast(`已生成快速点检任务: ${newTask.taskCode}`, 'success');
  };

  return (
    <div className="space-y-3 pb-12">
      {/* 2. Top Filter Form Box (Screenshot 1) */}
      <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* 任务编码 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              任务编码:
            </label>
            <input
              type="text"
              placeholder="请输入任务编码"
              value={filterTaskCode}
              onChange={(e) => setFilterTaskCode(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 设备名称 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              设备名称:
            </label>
            <input
              type="text"
              placeholder="请输入设备名称"
              value={filterEquipmentName}
              onChange={(e) => setFilterEquipmentName(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 设备编码 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              设备编码:
            </label>
            <input
              type="text"
              placeholder="请输入设备编码"
              value={filterEquipmentCode}
              onChange={(e) => setFilterEquipmentCode(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 任务状态 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              任务状态:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:border-blue-500 text-slate-700"
            >
              <option value="">选择任务执行状态</option>
              <option value="待执行">待执行</option>
              <option value="点检中">点检中</option>
              <option value="已超时">已超时</option>
              <option value="已完成">已完成</option>
            </select>
          </div>

          {/* 计划点检时间 */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap w-16 text-right">
              计划点检时间:
            </label>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="请选择时间"
                value={filterPlannedTime}
                onChange={(e) => setFilterPlannedTime(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded pl-7 focus:outline-hidden focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
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

          {/* Action Buttons (Right aligned) */}
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setCurrentPage(1);
                showToast(`已完成查询，共匹配 ${filteredTasks.length} 条点检任务`, 'info');
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

      {/* 3. Main Task Table Card (Screenshot 1) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              点检任务列表
            </h3>
            <span className="text-[11px] text-slate-400">
              (共 {filteredTasks.length} 条，最新时间置顶显示)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuickTaskModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-600 rounded text-xs font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              快速任务
            </button>
            <button
              onClick={() => showToast('已刷新点检任务列表', 'info')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => showToast('已应用默认视图列配置', 'info')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
              title="列配置"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="px-3 py-2.5 w-12 text-center">序号</th>
                <th className="px-3 py-2.5">计划编码</th>
                <th className="px-3 py-2.5">设备名称</th>
                <th className="px-3 py-2.5">设备编码</th>
                <th className="px-3 py-2.5">执行人选</th>
                <th className="px-3 py-2.5">设备检查状态</th>
                <th
                  className="px-3 py-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors"
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  title="点击切换时间排序"
                >
                  <div className="flex items-center gap-1">
                    <span>计划点检时间</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2.5 text-center">已检查项目数</th>
                <th className="px-3 py-2.5">任务状态</th>
                <th className="px-3 py-2.5 text-center w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-400 text-xs">
                    暂无符合条件的点检任务数据
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task, index) => {
                  const seqNo = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      {/* 序号 */}
                      <td className="px-3 py-2.5 text-center text-slate-500 font-mono">
                        {seqNo}
                      </td>

                      {/* 计划编码 */}
                      <td className="px-3 py-2.5 font-mono text-slate-800 font-medium whitespace-nowrap">
                        {task.taskCode || task.planCode}
                      </td>

                      {/* 设备名称 */}
                      <td className="px-3 py-2.5 text-slate-800 whitespace-nowrap font-medium">
                        {task.equipmentName}
                      </td>

                      {/* 设备编码 */}
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {task.equipmentCode}
                      </td>

                      {/* 执行人选 */}
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {task.executor}
                      </td>

                      {/* 设备检查状态 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {renderCheckStatus(task.checkStatus)}
                      </td>

                      {/* 计划点检时间 (降序显示) */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {task.plannedTime}
                      </td>

                      {/* 已检查项目数 (如 5/5, 8/8, 0/4) */}
                      <td className="px-3 py-2.5 text-center font-mono text-slate-700 whitespace-nowrap">
                        {task.checkedItemsCount}/{task.totalItemsCount}
                      </td>

                      {/* 任务状态 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {renderTaskStatus(task.status)}
                      </td>

                      {/* 操作 (执行 - Screenshot 1) */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => onNavigate('inspection-task-execute', { task })}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                        >
                          <Play className="w-3 h-3" />
                          执行
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination (Screenshot 1 Bottom) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            显示第 {filteredTasks.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} 至{' '}
            {Math.min(currentPage * pageSize, filteredTasks.length)} 条，共 {filteredTasks.length} 条
          </div>

          <div className="flex items-center gap-2">
            {/* Page Buttons */}
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

      {/* Quick Task Modal */}
      {isQuickTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                新建快速点检任务
              </h3>
              <button
                onClick={() => setIsQuickTaskModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickTaskSubmit} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  目标设备名称 *
                </label>
                <input
                  type="text"
                  required
                  value={quickTaskForm.equipmentName}
                  onChange={(e) =>
                    setQuickTaskForm({ ...quickTaskForm, equipmentName: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  设备编码 *
                </label>
                <input
                  type="text"
                  required
                  value={quickTaskForm.equipmentCode}
                  onChange={(e) =>
                    setQuickTaskForm({ ...quickTaskForm, equipmentCode: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    执行人 *
                  </label>
                  <select
                    value={quickTaskForm.executor}
                    onChange={(e) =>
                      setQuickTaskForm({ ...quickTaskForm, executor: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:border-blue-500 focus:outline-hidden"
                  >
                    {Array.from(new Set(executorOptions)).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    所属部门
                  </label>
                  <input
                    type="text"
                    value={quickTaskForm.department}
                    onChange={(e) =>
                      setQuickTaskForm({ ...quickTaskForm, department: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  计划点检时间 *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={quickTaskForm.plannedTime}
                  onChange={(e) =>
                    setQuickTaskForm({ ...quickTaskForm, plannedTime: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickTaskModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors shadow-xs"
                >
                  立即生成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
