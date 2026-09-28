import React, { useState, useMemo } from 'react';
import { InspectionRecord } from '../types';
import {
  Search,
  RotateCcw,
  Download,
  RefreshCw,
  Settings2,
  Calendar,
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { MainTab } from '../components/Sidebar';

export interface InspectionRecordTableItem {
  id: string;
  planCode: string;
  equipmentName: string;
  equipmentCode: string;
  executor: string;
  checkStatus: '正常' | '异常';
  plannedTime: string;
  actualTime: string;
  checkedItems: string;
  status: '已完成';
  department?: string;
  updateTime: string;
}

interface InspectionRecordListViewProps {
  records?: InspectionRecordTableItem[];
  onNavigate: (tab: MainTab, params?: { record?: InspectionRecordTableItem }) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

// 10 Records matching Screenshots 5 & 6 (Sorted descending by time)
export const DEFAULT_INSPECTION_RECORD_LIST: InspectionRecordTableItem[] = [
  {
    id: 'rec-1',
    planCode: 'DJJH202609170086',
    equipmentName: '螺杆式空压机-2#',
    equipmentCode: 'KY-2026-A02',
    executor: '张建国',
    checkStatus: '异常',
    plannedTime: '2026/9/17 8:00',
    actualTime: '2026/9/17 8:15',
    checkedItems: '1/1',
    status: '已完成',
    department: '动力车间',
    updateTime: '2026-09-27 20:30:00',
  },
  {
    id: 'rec-2',
    planCode: 'DJJH202609170042',
    equipmentName: '离心式冷水机组-1#',
    equipmentCode: 'LQ-2026-C01',
    executor: '刘志强',
    checkStatus: '正常',
    plannedTime: '2026/9/17 9:00',
    actualTime: '2026/9/17 9:20',
    checkedItems: '1/1',
    status: '已完成',
    department: '动力车间',
    updateTime: '2026-09-27 20:20:00',
  },
  {
    id: 'rec-3',
    planCode: 'DJJH202609160015',
    equipmentName: '卧式储气罐-3#',
    equipmentCode: 'CQ-2026-B03',
    executor: '李敏',
    checkStatus: '正常',
    plannedTime: '2026/9/16 14:00',
    actualTime: '2026/9/16 14:10',
    checkedItems: '1/1',
    status: '已完成',
    department: '生产二部',
    updateTime: '2026-09-27 20:10:00',
  },
  {
    id: 'rec-4',
    planCode: 'DJJH202609150099',
    equipmentName: '变频提升机-A线',
    equipmentCode: 'TS-2026-C08',
    executor: '王强',
    checkStatus: '正常',
    plannedTime: '2026/9/15 10:00',
    actualTime: '2026/9/15 10:05',
    checkedItems: '1/1',
    status: '已完成',
    department: '仓储物流部',
    updateTime: '2026-09-27 19:40:00',
  },
  {
    id: 'rec-5',
    planCode: 'DJJH202609140021',
    equipmentName: '螺杆式空压机-1#',
    equipmentCode: 'KY-2026-A01',
    executor: '张建国',
    checkStatus: '正常',
    plannedTime: '2026/9/14 8:00',
    actualTime: '2026/9/14 8:12',
    checkedItems: '1/1',
    status: '已完成',
    department: '动力车间',
    updateTime: '2026-09-27 19:00:00',
  },
  {
    id: 'rec-6',
    planCode: 'DJJH202609130056',
    equipmentName: '工业冷却塔-北',
    equipmentCode: 'LT-2026-D02',
    executor: '赵丽',
    checkStatus: '正常',
    plannedTime: '2026/9/13 15:00',
    actualTime: '2026/9/13 15:30',
    checkedItems: '1/1',
    status: '已完成',
    department: '安环部',
    updateTime: '2026-09-27 18:20:00',
  },
  {
    id: 'rec-7',
    planCode: 'DJJH202609120033',
    equipmentName: '不锈钢反应釜-5#',
    equipmentCode: 'FY-2026-E12',
    executor: '陈伟',
    checkStatus: '异常',
    plannedTime: '2026/9/12 9:00',
    actualTime: '2026/9/12 9:18',
    checkedItems: '1/1',
    status: '已完成',
    department: '生产一部',
    updateTime: '2026-09-27 17:30:00',
  },
  {
    id: 'rec-8',
    planCode: 'DJJH202609110078',
    equipmentName: '离心式冷水机组-2#',
    equipmentCode: 'LQ-2026-C02',
    executor: '刘志强',
    checkStatus: '异常',
    plannedTime: '2026/9/11 9:00',
    actualTime: '2026/9/11 9:25',
    checkedItems: '1/1',
    status: '已完成',
    department: '动力车间',
    updateTime: '2026-09-27 16:40:00',
  },
  {
    id: 'rec-9',
    planCode: 'DJJH202609100012',
    equipmentName: '卧式储气罐-1#',
    equipmentCode: 'CQ-2026-B01',
    executor: '李敏',
    checkStatus: '正常',
    plannedTime: '2026/9/10 14:00',
    actualTime: '2026/9/10 14:08',
    checkedItems: '1/1',
    status: '已完成',
    department: '生产二部',
    updateTime: '2026-09-27 15:10:00',
  },
  {
    id: 'rec-10',
    planCode: 'DJJH202609090045',
    equipmentName: '变频提升机-B线',
    equipmentCode: 'TS-2026-C09',
    executor: '王强',
    checkStatus: '正常',
    plannedTime: '2026/9/9 10:00',
    actualTime: '2026/9/9 10:06',
    checkedItems: '1/1',
    status: '已完成',
    department: '仓储物流部',
    updateTime: '2026-09-27 14:00:00',
  },
];

export const InspectionRecordListView: React.FC<InspectionRecordListViewProps> = ({
  records = DEFAULT_INSPECTION_RECORD_LIST,
  onNavigate,
  showToast,
}) => {
  // Filters
  const [filterTaskCode, setFilterTaskCode] = useState('');
  const [filterEquipmentName, setFilterEquipmentName] = useState('');
  const [filterEquipmentCode, setFilterEquipmentCode] = useState('');
  const [filterExecutor, setFilterExecutor] = useState('');
  const [filterPlannedTime, setFilterPlannedTime] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('1');

  // Sort
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Executors options
  const executorOptions = useMemo(() => {
    const list = Array.from(new Set(records.map((r) => r.executor))).filter(Boolean);
    return ['张建国', '刘志强', '李敏', '王强', '赵丽', '陈伟', '孙伟', '周丽', '钱刚', ...list];
  }, [records]);

  // Reset
  const handleReset = () => {
    setFilterTaskCode('');
    setFilterEquipmentName('');
    setFilterEquipmentCode('');
    setFilterExecutor('');
    setFilterPlannedTime('');
    setCurrentPage(1);
    showToast('已重置筛选条件', 'info');
  };

  // Filter and sort (Latest descending)
  const filteredRecords = useMemo(() => {
    const res = records.filter((r) => {
      const matchCode = filterTaskCode
        ? r.planCode.toLowerCase().includes(filterTaskCode.toLowerCase())
        : true;
      const matchName = filterEquipmentName
        ? r.equipmentName.toLowerCase().includes(filterEquipmentName.toLowerCase())
        : true;
      const matchEqCode = filterEquipmentCode
        ? r.equipmentCode.toLowerCase().includes(filterEquipmentCode.toLowerCase())
        : true;
      const matchExec = filterExecutor ? r.executor === filterExecutor : true;
      const matchTime = filterPlannedTime
        ? r.plannedTime.includes(filterPlannedTime)
        : true;

      return matchCode && matchName && matchEqCode && matchExec && matchTime;
    });

    return res.sort((a, b) => {
      const timeA = new Date(a.plannedTime.replace(/\//g, '-')).getTime() || 0;
      const timeB = new Date(b.plannedTime.replace(/\//g, '-')).getTime() || 0;
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [
    records,
    filterTaskCode,
    filterEquipmentName,
    filterEquipmentCode,
    filterExecutor,
    filterPlannedTime,
    sortOrder,
  ]);

  // Pagination slice
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

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

  // Export CSV (Screenshot 5)
  const handleExportCSV = () => {
    const headers = '序号,计划编码,设备名称,设备编码,执行人选,设备检查状态,计划点检时间,实际点检时间,已检查项目数,任务状态\n';
    const rows = filteredRecords
      .map(
        (r, idx) =>
          `"${idx + 1}","${r.planCode}","${r.equipmentName}","${r.equipmentCode}","${r.executor}","${r.checkStatus}","${r.plannedTime}","${r.actualTime}","${r.checkedItems}","${r.status}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `点检记录清单_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('点检记录数据已成功导出', 'success');
  };

  return (
    <div className="space-y-3 pb-12">
      {/* 2. Top Filter Box (Screenshot 5) */}
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

          {/* Query & Reset Buttons (Right aligned) */}
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setCurrentPage(1);
                showToast(`已完成查询，共匹配 ${filteredRecords.length} 条记录`, 'info');
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

      {/* 3. Record Table Card (Screenshot 5 & 6) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              点检记录列表
            </h3>
            <span className="text-[11px] text-slate-400">
              (共 {filteredRecords.length} 条，最新时间置顶显示)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 导出 (Orange Button - Screenshot 5) */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-orange-50 text-orange-600 border border-orange-400 rounded text-xs font-medium transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
            <button
              onClick={() => showToast('已刷新点检记录列表', 'info')}
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
                <th className="px-3 py-2.5">实际点检时间</th>
                <th className="px-3 py-2.5 text-center">已检查项目数</th>
                <th className="px-3 py-2.5">任务状态</th>
                <th className="px-3 py-2.5 text-center w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-400 text-xs">
                    暂无符合条件的点检记录
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => {
                  const seqNo = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={record.id}
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
                        {record.planCode}
                      </td>

                      {/* 设备名称 */}
                      <td className="px-3 py-2.5 text-slate-800 whitespace-nowrap font-medium">
                        {record.equipmentName}
                      </td>

                      {/* 设备编码 */}
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {record.equipmentCode}
                      </td>

                      {/* 执行人选 */}
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {record.executor}
                      </td>

                      {/* 设备检查状态 (• 异常 / • 正常 - Screenshot 5) */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {record.checkStatus === '异常' ? (
                          <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            异常
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            正常
                          </span>
                        )}
                      </td>

                      {/* 计划点检时间 (降序显示) */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {record.plannedTime}
                      </td>

                      {/* 实际点检时间 */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {record.actualTime}
                      </td>

                      {/* 已检查项目数 (如 1/1, 8/8) */}
                      <td className="px-3 py-2.5 text-center font-mono text-emerald-700 whitespace-nowrap font-medium">
                        {record.checkedItems}
                      </td>

                      {/* 任务状态 (• 已完成 - Screenshot 5) */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          已完成
                        </span>
                      </td>

                      {/* 操作 (• 详情 - Screenshot 5) */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => onNavigate('inspection-record-detail', { record })}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <span className="w-1 h-1 rounded-full bg-blue-600" />
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

        {/* 4. Pagination (Screenshot 5 Bottom) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            显示第 {filteredRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} 至{' '}
            {Math.min(currentPage * pageSize, filteredRecords.length)} 条，共 {filteredRecords.length} 条
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
