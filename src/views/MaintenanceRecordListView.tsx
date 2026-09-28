import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  RefreshCw,
  SlidersHorizontal,
  Download,
  ArrowUpDown,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { MaintenanceRecordItem } from '../types';

interface MaintenanceRecordListViewProps {
  records: MaintenanceRecordItem[];
  onViewRecordDetail: (record: MaintenanceRecordItem) => void;
}

export const MaintenanceRecordListView: React.FC<MaintenanceRecordListViewProps> = ({
  records,
  onViewRecordDetail,
}) => {
  // Search Filters
  const [taskCode, setTaskCode] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentCode, setEquipmentCode] = useState('');
  const [maintenanceGroup, setMaintenanceGroup] = useState('');
  const [planTime, setPlanTime] = useState('');

  // Time sort direction (default desc)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered & Sorted
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        if (taskCode && !rec.taskCode.toLowerCase().includes(taskCode.toLowerCase())) return false;
        if (equipmentName && !rec.equipmentName.includes(equipmentName)) return false;
        if (equipmentCode && !rec.equipmentCode.toLowerCase().includes(equipmentCode.toLowerCase()))
          return false;
        if (maintenanceGroup && !rec.maintenanceGroup.includes(maintenanceGroup)) return false;
        if (planTime && !rec.planTime.includes(planTime)) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.planTime.replace(/-/g, '/')).getTime();
        const timeB = new Date(b.planTime.replace(/-/g, '/')).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [records, taskCode, equipmentName, equipmentCode, maintenanceGroup, planTime, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const handleReset = () => {
    setTaskCode('');
    setEquipmentName('');
    setEquipmentCode('');
    setMaintenanceGroup('');
    setPlanTime('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Filter Card */}
      <div className="bg-white rounded-lg p-5 border border-gray-200/80 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">任务编码:</span>
            <input
              type="text"
              placeholder="请输入任务编码"
              value={taskCode}
              onChange={(e) => setTaskCode(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">设备名称:</span>
            <input
              type="text"
              placeholder="请输入设备名称"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">设备编码:</span>
            <input
              type="text"
              placeholder="请输入设备编码"
              value={equipmentCode}
              onChange={(e) => setEquipmentCode(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">保养班组:</span>
            <select
              value={maintenanceGroup}
              onChange={(e) => setMaintenanceGroup(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择保养班组</option>
              <option value="动力车间维修班">动力车间维修班</option>
              <option value="自动化班组">自动化班组</option>
              <option value="机修二班">机修二班</option>
              <option value="安环部消防班">安环部消防班</option>
              <option value="高压电工班">高压电工班</option>
              <option value="仓储物流组">仓储物流组</option>
              <option value="反应车间班组">反应车间班组</option>
              <option value="环保运维班">环保运维班</option>
              <option value="机修一班">机修一班</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-20 text-right">计划点时间:</span>
            <input
              type="text"
              placeholder="请选择时间"
              value={planTime}
              onChange={(e) => setPlanTime(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
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
          <h3 className="text-sm font-semibold text-gray-800">保养记录列表</h3>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => alert('已成功导出保养记录台账 (Excel)')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              导出
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
                <th className="py-3 px-3 font-medium whitespace-nowrap">任务编码</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">计划编码</th>
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
                <th className="py-3 px-3 font-medium whitespace-nowrap">实际保养时间</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">任务状态</th>
                <th className="py-3 px-4 font-medium text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">
                    暂无符合条件的保养记录数据
                  </td>
                </tr>
              ) : (
                currentData.map((rec, index) => {
                  const serialNo = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-2 text-center text-gray-500 font-medium">
                        {serialNo}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {rec.taskCode}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {rec.planCode}
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">
                        {rec.equipmentName}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {rec.equipmentCode}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{rec.maintenanceGroup}</td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-gray-800">
                        {rec.executor}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {rec.planTime}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {rec.actualTime}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onViewRecordDetail(rec)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                        >
                          详情
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
    </div>
  );
};
