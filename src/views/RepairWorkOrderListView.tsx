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
  Wrench,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { RepairOrder } from '../types';

interface RepairWorkOrderListViewProps {
  orders: RepairOrder[];
  onExecuteRepair: (order: RepairOrder) => void;
  onAssignOrder: (orderId: string, assignedGroup: string) => void;
  onQuickCreateTask?: () => void;
}

export const RepairWorkOrderListView: React.FC<RepairWorkOrderListViewProps> = ({
  orders,
  onExecuteRepair,
  onAssignOrder,
  onQuickCreateTask,
}) => {
  // Query Filters
  const [orderNo, setOrderNo] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentCode, setEquipmentCode] = useState('');
  const [status, setStatus] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [repairGroup, setRepairGroup] = useState('');
  const [urgency, setUrgency] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('1');

  // Assign Drawer state (Screenshot 3)
  const [assigningOrder, setAssigningOrder] = useState<RepairOrder | null>(null);
  const [selectedGroup, setSelectedGroup] = useState('动力维修班');

  // Filtered and Sorted Data (默认时间降序排，最新的排在最前面)
  const filteredOrders = useMemo(() => {
    return orders
      .filter((item) => {
        if (orderNo && !item.orderNo.toLowerCase().includes(orderNo.toLowerCase())) return false;
        if (equipmentName && !item.equipmentName.toLowerCase().includes(equipmentName.toLowerCase())) return false;
        if (equipmentCode && !item.equipmentCode.toLowerCase().includes(equipmentCode.toLowerCase())) return false;
        if (status && item.status !== status) return false;
        if (createDate && !(item.createTime || item.reportTime || '').includes(createDate)) return false;
        if (repairGroup && item.repairGroup !== repairGroup) return false;
        if (urgency && item.urgency !== urgency) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createTime || a.reportTime || '').getTime();
        const timeB = new Date(b.createTime || b.reportTime || '').getTime();
        return timeB - timeA; // 降序：最新在最上方
      });
  }, [orders, orderNo, equipmentName, equipmentCode, status, createDate, repairGroup, urgency]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setOrderNo('');
    setEquipmentName('');
    setEquipmentCode('');
    setStatus('');
    setCreateDate('');
    setRepairGroup('');
    setUrgency('');
    setCurrentPage(1);
  };

  const handleOpenAssign = (order: RepairOrder) => {
    setAssigningOrder(order);
    setSelectedGroup(order.repairGroup || '动力维修班');
  };

  const handleConfirmAssign = () => {
    if (!assigningOrder) return;
    onAssignOrder(assigningOrder.id, selectedGroup);
    setAssigningOrder(null);
  };

  const renderStatusBadge = (itemStatus: string) => {
    switch (itemStatus) {
      case '待维修':
      case '待指派':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            待维修
          </span>
        );
      case '维修中':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            维修中
          </span>
        );
      case '待验收':
      case '已完成':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {itemStatus}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {itemStatus}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Section (Screenshot 2 Top) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-center">
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">维修单号:</span>
            <input
              type="text"
              placeholder="请输入维修单号"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备名称:</span>
            <input
              type="text"
              placeholder="请输入设备名称"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备编码:</span>
            <input
              type="text"
              placeholder="请输入设备编码"
              value={equipmentCode}
              onChange={(e) => setEquipmentCode(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">状&nbsp;&nbsp;&nbsp;&nbsp;态:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              <option value="">选择维修状态</option>
              <option value="待维修">待维修</option>
              <option value="维修中">维修中</option>
              <option value="待验收">待验收</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-center">
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">建单时间:</span>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="请选择时间"
                value={createDate}
                onChange={(e) => setCreateDate(e.target.value)}
                className="w-full px-3 py-1.5 pl-8 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">维修班组:</span>
            <select
              value={repairGroup}
              onChange={(e) => setRepairGroup(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              <option value="">选择维修班组</option>
              <option value="动力维修班">动力维修班</option>
              <option value="机修一班">机修一班</option>
              <option value="机修二班">机修二班</option>
              <option value="电气维修班">电气维修班</option>
              <option value="仪表自控班">仪表自控班</option>
              <option value="环保维修组">环保维修组</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">紧急程度:</span>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              <option value="">选择紧急程度</option>
              <option value="普通">普通</option>
              <option value="高">高</option>
              <option value="紧急">紧急</option>
              <option value="特急">特急</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="flex items-center gap-1 px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-4 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card (Screenshot 2 Middle & Bottom) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Table Title Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-800">维修工单列表</h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onQuickCreateTask}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>快速任务</span>
            </button>
            <button
              type="button"
              title="刷新"
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="列设置"
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-14 text-center">序号</th>
                <th className="py-3 px-4">维修单号</th>
                <th className="py-3 px-4">建单时间</th>
                <th className="py-3 px-4">设备名称</th>
                <th className="py-3 px-4">设备编码</th>
                <th className="py-3 px-4">维修班组</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    暂无符合条件的维修工单数据
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, idx) => {
                  const seq = (currentPage - 1) * pageSize + idx + 1;
                  const isPending = order.status === '待维修' || order.status === '待指派';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500">{seq}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">{order.orderNo}</td>
                      <td className="py-3 px-4 text-slate-600">{order.createTime || order.reportTime}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{order.equipmentName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{order.equipmentCode}</td>
                      <td className="py-3 px-4 text-slate-700">{order.repairGroup || '动力维修班'}</td>
                      <td className="py-3 px-4">{renderStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-center">
                        {isPending ? (
                          <div className="inline-flex items-center gap-3">
                            <button
                              onClick={() => handleOpenAssign(order)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                            >
                              指派
                            </button>
                            <button
                              onClick={() => onExecuteRepair(order)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                            >
                              维修
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-3">
                            <button
                              onClick={() => onExecuteRepair(order)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                            >
                              维修
                            </button>
                            <span className="text-slate-300">-</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Screenshot 2 Bottom) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-200 text-xs text-slate-500 bg-white">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: Math.min(9, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`min-w-[28px] h-7 rounded text-xs font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 border border-slate-200 rounded text-xs bg-white focus:outline-none"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
            </select>

            <div className="flex items-center gap-1 ml-2">
              <span>跳至</span>
              <input
                type="text"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const p = parseInt(jumpPage);
                    if (!isNaN(p) && p >= 1 && p <= totalPages) {
                      setCurrentPage(p);
                    }
                  }
                }}
                className="w-10 h-7 text-center border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span>页</span>
            </div>
          </div>

          <div>
            共 <span className="font-bold text-slate-700">{filteredOrders.length}</span> 条
          </div>
        </div>
      </div>

      {/* 工单指派抽屉 / 模态框 (精确匹配 Screenshot 3) */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">工单指派</h3>
              <button
                onClick={() => setAssigningOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Section 1: 工单详情 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  <h4 className="text-sm font-bold text-slate-800">工单详情</h4>
                </div>

                <div className="space-y-3 text-xs pl-3">
                  <div className="flex items-center">
                    <span className="text-slate-500 w-24 shrink-0">维修单号:</span>
                    <span className="font-mono font-medium text-slate-800">{assigningOrder.orderNo}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-500 w-24 shrink-0">状&nbsp;&nbsp;&nbsp;&nbsp;态:</span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-blue-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {assigningOrder.status}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-500 w-24 shrink-0">设备名称:</span>
                    <span className="font-medium text-slate-800">{assigningOrder.equipmentName}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-500 w-24 shrink-0">设备编码:</span>
                    <span className="font-mono text-slate-700">{assigningOrder.equipmentCode}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: 班组选择 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  <h4 className="text-sm font-bold text-slate-800">班组选择</h4>
                </div>

                <div className="pl-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> 维修班组:
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                  >
                    <option value="动力维修班">动力维修班</option>
                    <option value="机修一班">机修一班</option>
                    <option value="机修二班">机修二班</option>
                    <option value="电气维修班">电气维修班</option>
                    <option value="仪表自控班">仪表自控班</option>
                    <option value="环保维修组">环保维修组</option>
                    <option value="综合维保组">综合维保组</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setAssigningOrder(null)}
                className="px-5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                className="px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
