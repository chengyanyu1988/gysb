import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  Download,
  ArrowUpDown,
  Home,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
} from 'lucide-react';
import { FaultReportItem } from '../types';

interface FaultReportListViewProps {
  reports: FaultReportItem[];
  onAddReport: () => void;
  onProcessReport: (report: FaultReportItem) => void;
  onViewDetail?: (report: FaultReportItem) => void;
  onViewReportDetail?: (report: FaultReportItem) => void;
  onDeleteReports?: (ids: string[]) => void;
  onBatchDeleteReports?: (ids: string[]) => void;
}

export const FaultReportListView: React.FC<FaultReportListViewProps> = ({
  reports,
  onAddReport,
  onProcessReport,
  onViewDetail,
  onViewReportDetail,
  onDeleteReports,
  onBatchDeleteReports,
}) => {
  const handleView = onViewDetail || onViewReportDetail || (() => {});
  const handleDelete = onDeleteReports || onBatchDeleteReports || (() => {});
  // Filters
  const [reportNo, setReportNo] = useState('');
  const [status, setStatus] = useState('');
  const [reporter, setReporter] = useState('');
  const [faultType, setFaultType] = useState('');
  const [handleType, setHandleType] = useState('');
  const [relatedOrderNo, setRelatedOrderNo] = useState('');
  const [handler, setHandler] = useState('');

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Time sort (default desc)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered and sorted
  const filteredReports = useMemo(() => {
    return reports
      .filter((item) => {
        if (reportNo && !item.reportNo.toLowerCase().includes(reportNo.toLowerCase())) return false;
        if (status && item.status !== status) return false;
        if (reporter && !(item.reporter || item.reportUser || '').includes(reporter)) return false;
        if (faultType && item.faultType !== faultType) return false;
        if (handleType && item.handleType !== handleType) return false;
        if (relatedOrderNo && !item.relatedOrderNo?.includes(relatedOrderNo)) return false;
        if (handler && !(item.handler || '').includes(handler)) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.reportTime.replace(/-/g, '/')).getTime();
        const timeB = new Date(b.reportTime.replace(/-/g, '/')).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [reports, reportNo, status, reporter, faultType, handleType, relatedOrderNo, handler, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage]);

  const handleReset = () => {
    setReportNo('');
    setStatus('');
    setReporter('');
    setFaultType('');
    setHandleType('');
    setRelatedOrderNo('');
    setHandler('');
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentData.map((r) => r.id));
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
    if (window.confirm(`确定要批量删除选中的 ${selectedIds.length} 项报修单吗？`)) {
      handleDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Filter Form Card */}
      <div className="bg-white rounded-lg p-5 border border-gray-200/80 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">报修单号:</span>
            <input
              type="text"
              placeholder="请输入报修单号"
              value={reportNo}
              onChange={(e) => setReportNo(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">状态:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择状态</option>
              <option value="待处理">待处理</option>
              <option value="维修中">维修中</option>
              <option value="验收完成">验收完成</option>
              <option value="已撤销">已撤销</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">报修人:</span>
            <select
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择报修人</option>
              <option value="张伟">张伟</option>
              <option value="王芳">王芳</option>
              <option value="刘军">刘军</option>
              <option value="孙丽">孙丽</option>
              <option value="周涛">周涛</option>
              <option value="吴刚">吴刚</option>
              <option value="郑华">郑华</option>
              <option value="冯雪">冯雪</option>
              <option value="钱进">钱进</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">故障类型:</span>
            <select
              value={faultType}
              onChange={(e) => setFaultType(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择故障类型</option>
              <option value="电气故障">电气故障</option>
              <option value="机械故障">机械故障</option>
              <option value="仪表故障">仪表故障</option>
              <option value="外观破损">外观破损</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">处理结果:</span>
            <select
              value={handleType}
              onChange={(e) => setHandleType(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择处理结果</option>
              <option value="内修">内修</option>
              <option value="委外维修">委外维修</option>
              <option value="自主微修">自主微修</option>
              <option value="转工单">转工单</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">关联单号:</span>
            <input
              type="text"
              placeholder="请输入关联单号"
              value={relatedOrderNo}
              onChange={(e) => setRelatedOrderNo(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap w-18 text-right">处理人:</span>
            <select
              value={handler}
              onChange={(e) => setHandler(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="">选择处理人</option>
              <option value="李强">李强</option>
              <option value="陈刚">陈刚</option>
              <option value="赵敏">赵敏</option>
              <option value="王军">王军</option>
              <option value="张建国">张建国</option>
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
          <h3 className="text-sm font-semibold text-gray-800">故障报修列表</h3>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onAddReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
            <button
              onClick={() => alert('已成功导出故障报修台账 (Excel)')}
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

        {/* Table */}
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
                <th className="py-3 px-3 font-medium whitespace-nowrap">报修单号</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">设备名称</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">设备编码</th>
                <th
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="py-3 px-3 font-medium whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>报修时间</span>
                    <ArrowUpDown className="w-3 h-3 text-blue-600" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">报修人</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">故障类型</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap max-w-xs">故障描述</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">故障时间</th>
                <th className="py-3 px-3 font-medium whitespace-nowrap">处理</th>
                <th className="py-3 px-4 font-medium text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-400">
                    暂无符合条件的故障报修数据
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => {
                  const isSelected = selectedIds.includes(item.id);
                  const serialNo = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2 text-center text-gray-500 font-medium">{serialNo}</td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {item.reportNo}
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">
                        {item.equipmentName}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {item.equipmentCode}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {item.reportTime}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-gray-800">
                        {item.reporter}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-gray-600">{item.faultType}</td>
                      <td className="py-3 px-3 text-gray-600 max-w-xs truncate" title={item.faultDescription}>
                        {item.faultDescription}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {item.faultTime}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-gray-700 font-medium">
                        {item.handler}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => onProcessReport(item)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                          >
                            处理
                          </button>
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                          >
                            查看
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

        {/* Pagination */}
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
