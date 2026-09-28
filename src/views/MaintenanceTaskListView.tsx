import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown,
  Home,
  X,
  Play,
} from 'lucide-react';
import { MaintenanceTask } from '../types';

interface MaintenanceTaskListViewProps {
  tasks: MaintenanceTask[];
  onExecuteTask: (task: MaintenanceTask) => void;
  onAddQuickTask?: (task: Partial<MaintenanceTask>) => void;
}

export const MaintenanceTaskListView: React.FC<MaintenanceTaskListViewProps> = ({
  tasks,
  onExecuteTask,
  onAddQuickTask,
}) => {
  // Search Filters
  const [taskCode, setTaskCode] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentCode, setEquipmentCode] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [planTime, setPlanTime] = useState('');
  const [maintenanceGroup, setMaintenanceGroup] = useState('');

  // Time sort direction (default desc)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Quick Task Modal
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [quickEquipName, setQuickEquipName] = useState('');
  const [quickEquipCode, setQuickEquipCode] = useState('');
  const [quickGroup, setQuickGroup] = useState('机修一班');
  const [quickExecutor, setQuickExecutor] = useState('张建国');

  // Filtered & Sorted
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (taskCode && !task.taskCode.toLowerCase().includes(taskCode.toLowerCase())) return false;
        if (equipmentName && !task.equipmentName.includes(equipmentName)) return false;
        if (equipmentCode && !task.equipmentCode.toLowerCase().includes(equipmentCode.toLowerCase()))
          return false;
        if (taskStatus && task.status !== taskStatus) return false;
        if (planTime && !task.planTime.includes(planTime)) return false;
        if (maintenanceGroup && !task.maintenanceGroup.includes(maintenanceGroup)) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.planTime.replace(/-/g, '/')).getTime();
        const timeB = new Date(b.planTime.replace(/-/g, '/')).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [tasks, taskCode, equipmentName, equipmentCode, taskStatus, planTime, maintenanceGroup, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage]);

  const handleReset = () => {
    setTaskCode('');
    setEquipmentName('');
    setEquipmentCode('');
    setTaskStatus('');
    setPlanTime('');
    setMaintenanceGroup('');
    setCurrentPage(1);
  };

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEquipName.trim()) {
      alert('请输入设备名称');
      return;
    }
    const newTask: Partial<MaintenanceTask> = {
      taskCode: `BYRW${new Date().toISOString().slice(0, 10).replace(/-/g, '')}9999`,
      planCode: `DJJH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}8888`,
      equipmentName: quickEquipName,
      equipmentCode: quickEquipCode || 'EQ-2026-999',
      maintenanceGroup: quickGroup,
      executor: quickExecutor,
      planTime: new Date().toLocaleDateString('zh-CN') + ' 09:00',
      progress: '0/1',
      status: '待执行',
      conclusion: '正常',
    };
    if (onAddQuickTask) {
      onAddQuickTask(newTask);
    }
    setIsQuickModalOpen(false);
    setQuickEquipName('');
    setQuickEquipCode('');
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case '已超时':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            已超时
          </span>
        );
      case '待执行':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            待执行
          </span>
        );
      case '保养中':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            保养中
          </span>
        );
      case '已完成':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            已完成
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">任务编码:</span>
            <input
              type="text"
              placeholder="请输入任务编码"
              value={taskCode}
              onChange={(e) => setTaskCode(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">设备名称:</span>
            <input
              type="text"
              placeholder="请输入设备名称"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">设备编码:</span>
            <input
              type="text"
              placeholder="请输入设备编码"
              value={equipmentCode}
              onChange={(e) => setEquipmentCode(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">任务状态:</span>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择任务执行状态</option>
              <option value="待执行">待执行</option>
              <option value="保养中">保养中</option>
              <option value="已超时">已超时</option>
              <option value="已完成">已完成</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">保养时间:</span>
            <input
              type="text"
              placeholder="请选择时间"
              value={planTime}
              onChange={(e) => setPlanTime(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">保养班组:</span>
            <select
              value={maintenanceGroup}
              onChange={(e) => setMaintenanceGroup(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择保养班组</option>
              <option value="机修一班">机修一班</option>
              <option value="机修二班">机修二班</option>
              <option value="起重班组">起重班组</option>
              <option value="电工班">电工班</option>
              <option value="高压电工班">高压电工班</option>
              <option value="管道班组">管道班组</option>
              <option value="动力班组">动力班组</option>
              <option value="暖通班组">暖通班组</option>
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

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">保养任务列表</h3>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsQuickModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              快速任务
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
                <th className="py-3 px-2 w-12 text-center font-medium">序号</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">计划编码</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">任务编码</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">设备名称</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">设备编码</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">保养班组</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">执行人选</th>
                <th
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="py-3 px-3 font-medium whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>计划保养时间</span>
                    <ArrowUpDown className="w-3 h-3 text-blue-600" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium text-center whitespace-nowrap">已保养</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">任务状态</th>
                <th className="py-3 px-4 font-medium text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">
                    暂无符合条件的保养任务数据
                  </td>
                </tr>
              ) : (
                currentData.map((task, index) => {
                  const serialNo = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-2 text-center text-gray-500 font-medium">
                        {serialNo}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {task.planCode}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {task.taskCode}
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">
                        {task.equipmentName}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {task.equipmentCode}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{task.maintenanceGroup}</td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-gray-800">
                        {task.executor}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {task.planTime}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap font-medium text-gray-700">
                        {task.progress}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {renderStatusBadge(task.status)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onExecuteTask(task)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                        >
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

      {/* Quick Task Modal */}
      {isQuickModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800">快速创建保养任务</h3>
              <button
                onClick={() => setIsQuickModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuickTask} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-700 font-medium">
                  <span className="text-red-500 mr-1">*</span>设备名称:
                </label>
                <input
                  type="text"
                  placeholder="例如: 1号循环水泵临时保养"
                  value={quickEquipName}
                  onChange={(e) => setQuickEquipName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-medium">设备编码:</label>
                <input
                  type="text"
                  placeholder="例如: EQ-2026-088"
                  value={quickEquipCode}
                  onChange={(e) => setQuickEquipCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-medium">保养班组:</label>
                <select
                  value={quickGroup}
                  onChange={(e) => setQuickGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="机修一班">机修一班</option>
                  <option value="机修二班">机修二班</option>
                  <option value="电工班">电工班</option>
                  <option value="仪表班组">仪表班组</option>
                  <option value="起重班组">起重班组</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-medium">执行人:</label>
                <select
                  value={quickExecutor}
                  onChange={(e) => setQuickExecutor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="张建国">张建国</option>
                  <option value="李强">李强</option>
                  <option value="王军">王军</option>
                  <option value="赵刚">赵刚</option>
                  <option value="陈伟">陈伟</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsQuickModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm"
                >
                  确定创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
