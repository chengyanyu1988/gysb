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
  X,
  Clock,
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { ArrivalInspectionItem } from '../types';
import { INITIAL_DELIVERY_ORDERS_FOR_MODAL } from '../data/mockData';

interface ArrivalInspectionListViewProps {
  inspections: ArrivalInspectionItem[];
  onGoToConfirmArrival: (item: ArrivalInspectionItem) => void;
  onGoToInspect: (item: ArrivalInspectionItem) => void;
  onGoToDetail: (item: ArrivalInspectionItem) => void;
  onGoToReinspect: (item: ArrivalInspectionItem) => void;
  onAddNewInspection: (deliveryNo: string) => void;
  onDeleteInspections: (ids: string[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ArrivalInspectionListView: React.FC<ArrivalInspectionListViewProps> = ({
  inspections,
  onGoToConfirmArrival,
  onGoToInspect,
  onGoToDetail,
  onGoToReinspect,
  onAddNewInspection,
  onDeleteInspections,
  showToast,
}) => {
  // Tab State: 待质检 / 已质检 (Screenshot 8 vs 12)
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'inspected'>('pending');

  // Filters (Screenshot 8 / 12)
  const [filterArrivalNo, setFilterArrivalNo] = useState('');
  const [filterArrivalStatus, setFilterArrivalStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Selected row checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State for 【+ 新增】 (Screenshot 11)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalDeliveryNo, setModalDeliveryNo] = useState('');
  const [modalBuyer, setModalBuyer] = useState('');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>('do-1');

  // Filtered and Sorted
  const filteredList = useMemo(() => {
    return inspections
      .filter((item) => {
        // Tab partition
        if (activeSubTab === 'pending') {
          // 待质检 tab includes items not yet finished or in quality check
          if (item.inboundStatus === '入库完成' || item.inboundStatus === '审批拒绝' || item.inboundStatus === '无需入库') {
            return false;
          }
        } else {
          // 已质检 tab
          if (!item.inspectTime && !item.inboundStatus) {
            return false;
          }
        }

        if (filterArrivalNo && !item.arrivalNo.toLowerCase().includes(filterArrivalNo.trim().toLowerCase())) return false;
        if (filterArrivalStatus && item.arrivalStatus !== filterArrivalStatus) return false;
        if (filterDepartment && item.buyerDepartment !== filterDepartment) return false;
        if (filterSupplier && !item.supplier.includes(filterSupplier.trim())) return false;
        if (filterTime && !((item.expectedArrivalTime || '').includes(filterTime)) && !(item.createTime || '').includes(filterTime)) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.inspectTime || a.expectedArrivalTime || a.createTime).getTime();
        const timeB = new Date(b.inspectTime || b.expectedArrivalTime || b.createTime).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [inspections, activeSubTab, filterArrivalNo, filterArrivalStatus, filterDepartment, filterSupplier, filterTime, sortOrder]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`已复制: ${text}`, 'success');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateFromDeliveryModal = () => {
    const found = INITIAL_DELIVERY_ORDERS_FOR_MODAL.find((d) => d.id === selectedDeliveryId);
    if (!found) return;
    onAddNewInspection(found.deliveryNo);
    setIsNewModalOpen(false);
    showToast(`成功关联送货单 ${found.deliveryNo} 并创建到货质检单（最新时间置顶）`, 'success');
  };

  return (
    <div className="space-y-4 pb-16 text-xs">
      {/* Query Filters (Screenshot 8) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* 到货单号 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">到货单号:</span>
            <input
              type="text"
              value={filterArrivalNo}
              onChange={(e) => setFilterArrivalNo(e.target.value)}
              placeholder="请输入到货单号"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 到货状态 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">到货状态:</span>
            <select
              value={filterArrivalStatus}
              onChange={(e) => setFilterArrivalStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 bg-white"
            >
              <option value="">选择到货状态</option>
              <option value="已到货">已到货</option>
              <option value="未到货">未到货</option>
            </select>
          </div>

          {/* 采购部门 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">采购部门:</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 bg-white"
            >
              <option value="">选择采购部门</option>
              <option value="生产运行部">生产运行部</option>
              <option value="设备管理部">设备管理部</option>
              <option value="采购部">采购部</option>
            </select>
          </div>

          {/* 申请时间 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">申请时间:</span>
            <div className="flex-1 relative">
              <input
                type="text"
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                placeholder="请选择时间"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 pr-7"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 供货商 */}
          <div className="flex items-center gap-2 md:col-span-2">
            <span className="w-18 text-slate-600 text-right shrink-0">供货商:</span>
            <input
              type="text"
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              placeholder="请输入供货商"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs pt-3 border-t border-slate-100">
          <button
            onClick={() => showToast(`查询完成，共找到 ${filteredList.length} 条记录`, 'info')}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={() => {
              setFilterArrivalNo('');
              setFilterArrivalStatus('');
              setFilterDepartment('');
              setFilterSupplier('');
              setFilterTime('');
              showToast('筛选已清空', 'info');
            }}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* SubTab Bar & Actions (Screenshot 8 / 12) */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-slate-800">到货质检列表</h3>

            {/* 双Tab: 待质检 / 已质检 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveSubTab('pending')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeSubTab === 'pending'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                待质检
              </button>
              <button
                onClick={() => setActiveSubTab('inspected')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeSubTab === 'inspected'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                已质检
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 时间降序切换 */}
            <button
              onClick={() => {
                const next = sortOrder === 'desc' ? 'asc' : 'desc';
                setSortOrder(next);
                showToast(`已切换为${next === 'desc' ? '最新时间降序' : '时间升序'}`, 'info');
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>时间: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>

            {/* + 新增 */}
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            {/* 导出 */}
            <button
              onClick={() => showToast('正在导出到货质检台账...', 'success')}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span>导出</span>
            </button>

            {/* 批量删除 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  showToast('请选择要删除的项目', 'error');
                  return;
                }
                onDeleteInspections(selectedIds);
                setSelectedIds([]);
                showToast(`已删除 ${selectedIds.length} 项记录`, 'success');
              }}
              className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除</span>
            </button>

            <button
              onClick={() => showToast('数据已刷新，已按最新时间降序排列', 'success')}
              className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50"
              title="刷新"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('列设置已保存', 'info')}
              className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50"
              title="表格设置"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {activeSubTab === 'pending' ? (
            /* 待质检 表格 (Screenshot 8) */
            <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-3 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === filteredList.length && filteredList.length > 0}
                      className="rounded border-slate-300 text-blue-600"
                    />
                  </th>
                  <th className="px-3 py-3 w-12 text-center">序号</th>
                  <th className="px-3 py-3">到货单号</th>
                  <th className="px-3 py-3">采购人</th>
                  <th className="px-3 py-3">采购部门</th>
                  <th className="px-3 py-3">供应商名称</th>
                  <th className="px-3 py-3">预计到货数量</th>
                  <th className="px-3 py-3">预计到货金额 (元)</th>
                  <th className="px-3 py-3">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    >
                      <span>预计到货时间</span>
                      {sortOrder === 'desc' ? (
                        <ArrowDown className="w-3 h-3 text-blue-600" />
                      ) : (
                        <ArrowUp className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-center">到货状态</th>
                  <th className="px-3 py-3">实际到货数量</th>
                  <th className="px-3 py-3">实际到货金额 (元)</th>
                  <th className="px-3 py-3">创建时间</th>
                  <th className="px-3 py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      selectedIds.includes(item.id) ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{item.arrivalNo}</span>
                        <button
                          onClick={() => handleCopy(item.arrivalNo)}
                          className="text-slate-400 hover:text-blue-600"
                          title="复制单号"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-800">{item.buyer}</td>
                    <td className="px-3 py-3 text-slate-600">{item.buyerDepartment}</td>
                    <td className="px-3 py-3 text-slate-700 max-w-xs truncate">{item.supplier}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">{item.expectedQty ?? 0}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      {(item.expectedAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-600 font-semibold">{item.expectedArrivalTime}</td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold ${
                          item.arrivalStatus === '已到货' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            item.arrivalStatus === '已到货' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        ></span>
                        {item.arrivalStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-700">{item.actualQty ?? '-'}</td>
                    <td className="px-3 py-3 font-mono text-slate-700">
                      {item.actualAmount ? item.actualAmount.toLocaleString() : '-'}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-500">{item.createTime}</td>
                    <td className="px-3 py-3 text-center">
                      {item.arrivalStatus === '已到货' ? (
                        <button
                          onClick={() => onGoToInspect(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          质检
                        </button>
                      ) : (
                        <button
                          onClick={() => onGoToConfirmArrival(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          确认到货
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* 已质检 表格 (Screenshot 12 / 13) */
            <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-3 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === filteredList.length && filteredList.length > 0}
                      className="rounded border-slate-300 text-blue-600"
                    />
                  </th>
                  <th className="px-3 py-3 w-12 text-center">序号</th>
                  <th className="px-3 py-3">到货单号</th>
                  <th className="px-3 py-3">货数量</th>
                  <th className="px-3 py-3">到货金额 (元)</th>
                  <th className="px-3 py-3">采购人</th>
                  <th className="px-3 py-3">采购部门</th>
                  <th className="px-3 py-3">供应商名称</th>
                  <th className="px-3 py-3">质检合格数量</th>
                  <th className="px-3 py-3">质检合格金额 (元)</th>
                  <th className="px-3 py-3">质检不合格数量</th>
                  <th className="px-3 py-3">质检不合格金额 (元)</th>
                  <th className="px-3 py-3">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    >
                      <span>质检完成时间</span>
                      {sortOrder === 'desc' ? (
                        <ArrowDown className="w-3 h-3 text-blue-600" />
                      ) : (
                        <ArrowUp className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-center">入库状态</th>
                  <th className="px-3 py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{item.arrivalNo}</span>
                        <button
                          onClick={() => handleCopy(item.arrivalNo)}
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">{item.actualQty ?? item.expectedQty ?? 0}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      {(item.actualAmount ?? item.expectedAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-slate-800">{item.buyer}</td>
                    <td className="px-3 py-3 text-slate-600">{item.buyerDepartment}</td>
                    <td className="px-3 py-3 text-slate-700 max-w-xs truncate">{item.supplier}</td>
                    <td className="px-3 py-3 font-mono font-bold text-emerald-600">
                      {item.qualifiedQty ?? item.expectedQty ?? 0}
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-emerald-600">
                      {(item.qualifiedAmount ?? item.expectedAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-rose-600">
                      {item.unqualifiedQty ?? 0}
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-rose-600">
                      {(item.unqualifiedAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-600 font-semibold">
                      {item.inspectTime || '2026-09-17 11:00:00'}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold ${
                          item.inboundStatus === '审批通过' || item.inboundStatus === '入库完成'
                            ? 'text-emerald-600'
                            : item.inboundStatus === '审批拒绝'
                            ? 'text-rose-600'
                            : item.inboundStatus === '审批中'
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            item.inboundStatus === '审批通过' || item.inboundStatus === '入库完成'
                              ? 'bg-emerald-500'
                              : item.inboundStatus === '审批拒绝'
                              ? 'bg-rose-500'
                              : item.inboundStatus === '审批中'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        ></span>
                        {item.inboundStatus || '审批通过'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onGoToDetail(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => onGoToReinspect(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          重新质检
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
          <div>共 {filteredList.length} 条数据</div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-400 disabled:opacity-50" disabled>
              &lt;
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded text-xs font-medium flex items-center justify-center ${
                  p === 1
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-600">
              &gt;
            </button>
            <span className="ml-2">10条/页</span>
            <span className="ml-2">跳至</span>
            <input
              type="number"
              defaultValue={5}
              className="w-10 px-1 py-0.5 border border-slate-200 rounded text-center"
            />
            <span>页</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 新增送货单质检弹窗 (Screenshot 11 精准还原) */}
      {/* ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">新增</h3>
              <button onClick={() => setIsNewModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {/* Filter */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-16 text-slate-600 text-right">送货单号:</span>
                <input
                  type="text"
                  value={modalDeliveryNo}
                  onChange={(e) => setModalDeliveryNo(e.target.value)}
                  placeholder="请输入送货单号"
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-md"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-16 text-slate-600 text-right">采购人:</span>
                <input
                  type="text"
                  value={modalBuyer}
                  onChange={(e) => setModalBuyer(e.target.value)}
                  placeholder="请输入采购人"
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-md"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('查询完成', 'info')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-bold flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>查询</span>
                </button>
                <button
                  onClick={() => {
                    setModalDeliveryNo('');
                    setModalBuyer('');
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>
              </div>
            </div>

            {/* Table (Screenshot 11) */}
            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-10 text-center">选择</th>
                    <th className="p-2.5 w-12 text-center">序号</th>
                    <th className="p-2.5">送货单号</th>
                    <th className="p-2.5">采购人</th>
                    <th className="p-2.5">采购部门</th>
                    <th className="p-2.5">供应商</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_DELIVERY_ORDERS_FOR_MODAL.filter(
                    (d) =>
                      (!modalDeliveryNo || d.deliveryNo.includes(modalDeliveryNo)) &&
                      (!modalBuyer || d.buyer.includes(modalBuyer))
                  ).map((d, i) => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDeliveryId(d.id)}
                      className={`cursor-pointer hover:bg-slate-50 ${
                        selectedDeliveryId === d.id ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="p-2.5 text-center">
                        <input
                          type="radio"
                          name="deliverySelect"
                          checked={selectedDeliveryId === d.id}
                          onChange={() => setSelectedDeliveryId(d.id)}
                          className="text-blue-600"
                        />
                      </td>
                      <td className="p-2.5 text-center font-mono text-slate-400">{i + 1}</td>
                      <td className="p-2.5 font-mono font-bold text-blue-600">{d.deliveryNo}</td>
                      <td className="p-2.5 text-slate-800 font-medium">{d.buyer}</td>
                      <td className="p-2.5 text-slate-600">{d.department}</td>
                      <td className="p-2.5 text-slate-700">{d.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-slate-500">
                当前已选 <span className="font-bold text-rose-500">1</span> 项数据 / 共计{' '}
                <span className="font-bold text-rose-500">{INITIAL_DELIVERY_ORDERS_FOR_MODAL.length}</span> 项数据
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleCreateFromDeliveryModal}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
