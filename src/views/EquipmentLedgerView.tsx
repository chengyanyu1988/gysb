import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Upload,
  Download,
  QrCode,
  Trash2,
  RefreshCw,
  Settings,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { Equipment, EquipmentStatus } from '../types';

interface EquipmentLedgerViewProps {
  equipments: Equipment[];
  onNavigate: (tab: any, params?: any) => void;
  onDeleteEquipment: (id: string) => void;
  onBatchDelete: (ids: string[]) => void;
  onOpenBarcodeModal: (equipment: Equipment) => void;
  onOpenImportModal: () => void;
  onExportData: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const EquipmentLedgerView: React.FC<EquipmentLedgerViewProps> = ({
  equipments,
  onNavigate,
  onDeleteEquipment,
  onBatchDelete,
  onOpenBarcodeModal,
  onOpenImportModal,
  onExportData,
  showToast,
}) => {
  // Search Filters
  const [filterName, setFilterName] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterManager, setFilterManager] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Sorting: strictly descending by updateTime by default ("时间显示最新的显示，按时间的降序来排")
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Selected items for batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('1');

  // Categories list for dropdown
  const categoryOptions = [
    '全部',
    '前处理设备/蒸馏设备',
    '泵类设备/离心泵',
    '仪表仪器/传感器',
    '动力设备/电机',
    '存储设备/储罐',
    '动力设备/压缩机',
    '包装设备/灌装机',
    '分离设备/离心机',
    '换热设备/换热器',
    '电气设备/控制柜',
    '阀门设备/调节阀',
  ];

  // Filtering and Sorting
  const filteredEquipments = useMemo(() => {
    return equipments.filter((item) => {
      const matchName = filterName.trim() === '' || item.name.toLowerCase().includes(filterName.toLowerCase());
      const matchCode = filterCode.trim() === '' || item.code.toLowerCase().includes(filterCode.toLowerCase());
      const matchManager = filterManager.trim() === '' || item.manager.toLowerCase().includes(filterManager.toLowerCase());
      const matchStatus = !filterStatus || filterStatus === '全部' || item.status === filterStatus;
      const matchCategory = !filterCategory || filterCategory === '全部' || item.category.includes(filterCategory.split('/')[0]);
      return matchName && matchCode && matchManager && matchStatus && matchCategory;
    }).sort((a, b) => {
      const timeA = new Date(a.updateTime).getTime();
      const timeB = new Date(b.updateTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [equipments, filterName, filterCode, filterManager, filterStatus, filterCategory, sortOrder]);

  // Paginated slice
  const totalPages = Math.ceil(filteredEquipments.length / pageSize) || 1;
  const paginatedEquipments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEquipments.slice(start, start + pageSize);
  }, [filteredEquipments, currentPage, pageSize]);

  // Handle Select All
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentIds = paginatedEquipments.map((i) => i.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentIds])));
    } else {
      const currentIds = new Set(paginatedEquipments.map((i) => i.id));
      setSelectedIds(selectedIds.filter((id) => !currentIds.has(id)));
    }
  };

  const isAllCurrentSelected =
    paginatedEquipments.length > 0 &&
    paginatedEquipments.every((i) => selectedIds.includes(i.id));

  // Copy code to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    showToast(`已复制${label}: ${text}`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleReset = () => {
    setFilterName('');
    setFilterCode('');
    setFilterManager('');
    setFilterStatus('');
    setFilterCategory('');
    setCurrentPage(1);
    showToast('查询条件已重置', 'info');
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先选择要删除的设备', 'error');
      return;
    }
    if (confirm(`确定要批量删除已选择的 ${selectedIds.length} 台设备吗？此操作不可逆。`)) {
      onBatchDelete(selectedIds);
      setSelectedIds([]);
      showToast(`已成功删除 ${selectedIds.length} 台设备`, 'success');
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

  // Status Badge Dot Renderer
  const renderStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case '使用中':
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            使用中
          </span>
        );
      case '闲置中':
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            闲置中
          </span>
        );
      case '维修中':
        return (
          <span className="inline-flex items-center gap-1.5 text-blue-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            维修中
          </span>
        );
      case '已停用':
        return (
          <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            已停用
          </span>
        );
      case '已报废':
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            已报废
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Filter Search Section (Screenshot 2 Top) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Filter: 设备名称 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备名称:</span>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="请输入设备名称"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          {/* Filter: 设备编码 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备编码:</span>
            <input
              type="text"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              placeholder="请输入设备编码"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          {/* Filter: 负责人 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">负责人:</span>
            <input
              type="text"
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
              placeholder="请输入负责人姓名"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          {/* Filter: 设备状态 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors text-slate-700"
            >
              <option value="">选择设备状态</option>
              <option value="全部">全部</option>
              <option value="使用中">使用中</option>
              <option value="闲置中">闲置中</option>
              <option value="维修中">维修中</option>
              <option value="已停用">已停用</option>
              <option value="已报废">已报废</option>
            </select>
          </div>

          {/* Filter: 设备类别 */}
          <div className="flex items-center gap-2 lg:col-span-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备类别:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 max-w-sm px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-colors text-slate-700"
            >
              <option value="">选择设备类别</option>
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex items-center justify-end gap-2 lg:col-span-2">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Table Action Toolbar & Data List (Screenshot 2 Main) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Top Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">设备台账列表</h3>
            <span className="text-xs text-slate-500">
              共 <span className="font-bold text-blue-600">{filteredEquipments.length}</span> 台设备
            </span>
            {/* Sort Indicator Badge */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700 transition-colors border border-slate-200"
              title="切换时间排序"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>更新时间: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>
          </div>

          {/* Action Buttons on Right */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Add Equipment */}
            <button
              onClick={() => onNavigate('equipment-add')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            {/* Import */}
            <button
              onClick={onOpenImportModal}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>导入</span>
            </button>

            {/* Export */}
            <button
              onClick={onExportData}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            {/* Print Barcode */}
            <button
              onClick={() => {
                if (selectedIds.length === 1) {
                  const target = equipments.find(e => e.id === selectedIds[0]);
                  if (target) onOpenBarcodeModal(target);
                } else if (paginatedEquipments.length > 0) {
                  onOpenBarcodeModal(paginatedEquipments[0]);
                }
              }}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>打印条码</span>
            </button>

            {/* Batch Delete */}
            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors border ${
                selectedIds.length > 0
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 cursor-pointer'
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除 {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => {
                showToast('已刷新最新设备数据', 'info');
              }}
              className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Column Setting */}
            <button
              onClick={() => {
                showToast('列显示设置已应用默认视图', 'info');
              }}
              className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md transition-colors"
              title="表格列配置"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="w-12 px-2 py-3 text-center font-medium">序号</th>
                <th className="px-3 py-3 font-medium">设备名称</th>
                <th className="px-3 py-3 font-medium">设备编码</th>
                <th className="px-3 py-3 font-medium">设备分类</th>
                <th className="px-3 py-3 font-medium">规格型号</th>
                <th className="w-16 px-2 py-3 text-center font-medium">设备等级</th>
                <th className="px-3 py-3 font-medium">安装区域</th>
                <th className="w-20 px-3 py-3 font-medium">状态</th>
                <th className="px-3 py-3 font-medium">使用部门</th>
                <th className="px-3 py-3 font-medium">负责人</th>
                <th className="px-3 py-3 font-medium text-slate-500">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                    <span>更新时间 (降序)</span>
                    {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-blue-600" /> : <ArrowUp className="w-3 h-3 text-blue-600" />}
                  </div>
                </th>
                <th className="w-36 px-3 py-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEquipments.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-slate-400">
                    暂无匹配的设备数据
                  </td>
                </tr>
              ) : (
                paginatedEquipments.map((item, index) => {
                  const serialNo = (currentPage - 1) * pageSize + index + 1;
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/60' : index % 2 === 1 ? 'bg-slate-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, item.id]);
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== item.id));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* 序号 */}
                      <td className="px-2 py-2.5 text-center font-mono text-slate-500">
                        {serialNo}
                      </td>

                      {/* 设备名称 with Copy Icon */}
                      <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 group">
                          <span>{item.name}</span>
                          <button
                            onClick={() => handleCopy(item.name, '设备名称')}
                            className="p-0.5 text-slate-400 hover:text-blue-600 transition-colors opacity-70 group-hover:opacity-100"
                            title="复制名称"
                          >
                            {copiedCode === item.name ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 设备编码 */}
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {item.code}
                      </td>

                      {/* 设备分类 */}
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {item.category}
                      </td>

                      {/* 规格型号 */}
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {item.spec}
                      </td>

                      {/* 设备等级 */}
                      <td className="px-2 py-2.5 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded font-mono font-bold text-[11px] ${
                          item.grade === 'A'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : item.grade === 'B'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {item.grade}
                        </span>
                      </td>

                      {/* 安装区域 */}
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        {item.installArea}
                      </td>

                      {/* 状态 */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* 使用部门 */}
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {item.department}
                      </td>

                      {/* 负责人 */}
                      <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                        {item.manager}
                      </td>

                      {/* 登记/更新时间 (降序) */}
                      <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {item.updateTime}
                      </td>

                      {/* 操作 (编辑 详情 备件 删除) */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <button
                            onClick={() => onNavigate('equipment-edit', { equipment: item })}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => onNavigate('equipment-detail', { equipment: item })}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            详情
                          </button>
                          <button
                            onClick={() => onNavigate('equipment-spare-parts', { equipment: item })}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            备件
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`确定要删除设备 "${item.name} (${item.code})" 吗？`)) {
                                onDeleteEquipment(item.id);
                                showToast(`已删除设备: ${item.name}`, 'success');
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

        {/* 3. Pagination Footer (Screenshot 2 Bottom) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>显示第 {filteredEquipments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} 至 {Math.min(currentPage * pageSize, filteredEquipments.length)} 条，共 {filteredEquipments.length} 条</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
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

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Page Size Dropdown */}
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

            {/* Jump To */}
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
