import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  RotateCcw,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Calendar,
} from 'lucide-react';
import { ReturnGoodsOrder } from '../types';

interface ReturnGoodsListViewProps {
  orders: ReturnGoodsOrder[];
  onGoToAdd: () => void;
  onGoToDetail: (order: ReturnGoodsOrder) => void;
  onDeleteOrders?: (ids: string[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const ReturnGoodsListView: React.FC<ReturnGoodsListViewProps> = ({
  orders,
  onGoToAdd,
  onGoToDetail,
  onDeleteOrders,
  showToast,
}) => {
  // Search & Filter state
  const [returnNoFilter, setReturnNoFilter] = useState('');
  const [inboundNoFilter, setInboundNoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selected for Batch Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sorting: 核心要求 —— 默认按最新时间降序排列 (desc)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('1');

  // Filter & Sort logic
  const filteredOrders = useMemo(() => {
    let list = orders.filter((item) => {
      if (returnNoFilter && !item.returnNo.toLowerCase().includes(returnNoFilter.toLowerCase().trim())) {
        return false;
      }
      if (inboundNoFilter && !item.inboundNo.toLowerCase().includes(inboundNoFilter.toLowerCase().trim())) {
        return false;
      }
      if (statusFilter && item.returnStatus !== statusFilter) {
        return false;
      }
      if (dateFilter && !item.createTime.startsWith(dateFilter)) {
        return false;
      }
      return true;
    });

    // 默认按最新时间降序排列 (或根据 sortOrder 升/降序)
    list.sort((a, b) => {
      const timeA = new Date(a.createTime.replace(/-/g, '/')).getTime() || 0;
      const timeB = new Date(b.createTime.replace(/-/g, '/')).getTime() || 0;
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [orders, returnNoFilter, inboundNoFilter, statusFilter, dateFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPagedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleReset = () => {
    setReturnNoFilter('');
    setInboundNoFilter('');
    setStatusFilter('');
    setDateFilter('');
    setCurrentPage(1);
    setSortOrder('desc');
    showToast('查询条件已重置，已按最新时间降序呈现', 'info');
  };

  const handleSearch = () => {
    setCurrentPage(1);
    showToast(`查询完成，共找到 ${filteredOrders.length} 条记录`, 'info');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentPagedOrders.length && currentPagedOrders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentPagedOrders.map((o) => o.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量删除的退货记录', 'warning');
      return;
    }
    if (onDeleteOrders) {
      onDeleteOrders(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleExport = () => {
    showToast(`已成功导出 ${filteredOrders.length} 条退货单数据 (Excel格式)`, 'success');
  };

  const handleJump = () => {
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      showToast(`请输入 1 到 ${totalPages} 之间的有效页码`, 'warning');
    }
  };

  return (
    <div className="space-y-3 pb-16 text-xs select-none">
      {/* Filter Card */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Filter 1: 退货单号 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap w-20 text-right">退货单号:</span>
            <input
              type="text"
              value={returnNoFilter}
              onChange={(e) => setReturnNoFilter(e.target.value)}
              placeholder="请输入退货单号"
              className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Filter 2: 关联到货单号 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap w-24 text-right">关联到货单号:</span>
            <input
              type="text"
              value={inboundNoFilter}
              onChange={(e) => setInboundNoFilter(e.target.value)}
              placeholder="请输入关联到货单号"
              className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Filter 3: 退货状态 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap w-20 text-right">退货状态:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">选择退货状态</option>
              <option value="审批中">审批中</option>
              <option value="退货中">退货中</option>
              <option value="审批通过">审批通过</option>
              <option value="审批拒绝">审批拒绝</option>
              <option value="退货成功">退货成功</option>
              <option value="退货失败">退货失败</option>
            </select>
          </div>

          {/* Filter 4: 创建时间 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap w-20 text-right">创建时间:</span>
            <div className="relative flex-1">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-8 pl-3 pr-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Right Aligned */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={handleSearch}
            className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={handleReset}
            className="h-8 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        {/* Table Top Header Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800">退货列表</h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium">
              默认按最新时间降序排列 (最新置顶)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 新增 */}
            <button
              onClick={onGoToAdd}
              className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            {/* 导出 */}
            <button
              onClick={handleExport}
              className="h-8 px-3.5 bg-[#ff9800] hover:bg-[#f57c00] text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            {/* 批量删除 */}
            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className="h-8 px-3.5 border border-rose-300 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => {
                showToast('已刷新退货列表数据', 'success');
              }}
              title="刷新"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Density / Settings */}
            <button
              onClick={() => showToast('表格列自适应已更新', 'info')}
              title="密度设置"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-[#f2f6fc] text-slate-700 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      currentPagedOrders.length > 0 &&
                      selectedIds.length === currentPagedOrders.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 w-12 font-medium">序号</th>
                <th className="p-3 font-medium">退货单号</th>
                <th className="p-3 font-medium">关联入库单号</th>
                <th className="p-3 font-medium text-center">退货总数量</th>
                <th className="p-3 font-medium text-right">退货总金额 (元)</th>
                <th className="p-3 font-medium">退货原因</th>
                <th className="p-3 font-medium">申请人</th>
                <th className="p-3 font-medium">申请部门</th>
                <th className="p-3 font-medium text-center">审批状态</th>
                <th className="p-3 font-medium text-center">退货状态</th>
                <th
                  onClick={() => {
                    const nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
                    setSortOrder(nextOrder);
                    showToast(
                      `已切换时间排序为：${nextOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}`,
                      'info'
                    );
                  }}
                  className="p-3 font-medium cursor-pointer hover:bg-slate-200/60 transition-colors text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>创建时间</span>
                    {sortOrder === 'desc' ? (
                      <span className="text-blue-600 font-bold">▾ (最新)</span>
                    ) : (
                      <span className="text-blue-600 font-bold">▴</span>
                    )}
                  </div>
                </th>
                <th className="p-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPagedOrders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-10 text-center text-slate-400">
                    暂无符合条件的退货记录
                  </td>
                </tr>
              ) : (
                currentPagedOrders.map((item, index) => {
                  const isChecked = selectedIds.includes(item.id);
                  const displayIndex = (currentPage - 1) * pageSize + index + 1;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-slate-600 font-mono">{displayIndex}</td>
                      <td className="p-3 font-mono text-slate-900 font-medium">
                        {item.returnNo}
                      </td>
                      <td className="p-3 font-mono text-slate-600">{item.inboundNo}</td>
                      <td className="p-3 text-center font-mono text-slate-800 font-medium">
                        {item.totalReturnQty}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-800 font-medium">
                        {item.totalReturnAmount.toLocaleString('zh-CN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-3 text-slate-700 max-w-xs truncate" title={item.reason}>
                        {item.reason}
                      </td>
                      <td className="p-3 text-slate-800">{item.applicant}</td>
                      <td className="p-3 text-slate-700">{item.department}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-medium ${
                            item.approvalStatus === '已通过'
                              ? 'text-slate-800'
                              : item.approvalStatus === '已拒绝'
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {item.approvalStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-medium ${
                            item.returnStatus === '退货成功' || item.returnStatus === '审批通过'
                              ? 'text-emerald-700'
                              : item.returnStatus === '退货失败' || item.returnStatus === '审批拒绝'
                              ? 'text-rose-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {item.returnStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600 font-medium">
                        {item.createTime}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onGoToDetail(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
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

        {/* Pagination Section */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 bg-white">
          <div className="flex items-center gap-2">
            <span>共 {filteredOrders.length} 条记录</span>
            <span>·</span>
            <span>第 {currentPage} / {totalPages} 页</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons */}
            {Array.from({ length: Math.min(9, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 flex items-center justify-center border rounded font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 px-2 border border-slate-300 rounded bg-white text-slate-700 text-xs focus:outline-none"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
            </select>

            {/* Jump To */}
            <div className="flex items-center gap-1 ml-2">
              <span>跳至</span>
              <input
                type="text"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleJump();
                }}
                className="w-10 h-7 text-center border border-slate-300 rounded text-xs text-slate-800"
              />
              <span>页</span>
              <button
                onClick={handleJump}
                className="h-7 px-2 border border-slate-300 hover:bg-slate-50 rounded text-slate-700 text-xs"
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
