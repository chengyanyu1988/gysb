import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  RotateCcw,
  Plus,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Eye,
  Edit,
  Clock,
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
} from 'lucide-react';
import { SparePartLedgerItem } from '../types';

interface SparePartsManagementViewProps {
  parts: SparePartLedgerItem[];
  onAddPart: (part: SparePartLedgerItem) => void;
  onUpdatePart: (part: SparePartLedgerItem) => void;
  onDeleteParts: (ids: string[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SparePartsManagementView: React.FC<SparePartsManagementViewProps> = ({
  parts,
  onAddPart,
  onUpdatePart,
  onDeleteParts,
  showToast,
}) => {
  // Query Filter States (Screenshot 1)
  const [filterName, setFilterName] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Selected Row Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer States
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [activeItem, setActiveItem] = useState<SparePartLedgerItem | null>(null);

  // Form State for Add / Edit (Screenshot 2)
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    category: string;
    spec: string;
    brand: string;
    stock: number;
    unit: string;
    supplier: string;
    description: string;
    attachments: string[];
    manager: string;
    price: number;
  }>({
    name: '',
    code: '',
    category: '泵类配件/离心泵',
    spec: '',
    brand: '',
    stock: 10,
    unit: '个',
    supplier: '',
    description: '',
    attachments: [],
    manager: '张建国',
    price: 100,
  });

  // Filtered and Sorted Data (降序排列最新在最上)
  const filteredParts = useMemo(() => {
    return parts
      .filter((p) => {
        if (filterName && !p.name.includes(filterName.trim())) return false;
        if (filterCode && !p.code.toLowerCase().includes(filterCode.trim().toLowerCase())) return false;
        if (filterSupplier && !p.supplier.includes(filterSupplier.trim())) return false;
        if (filterCategory && p.category !== filterCategory) return false;
        if (filterSpec && p.spec !== filterSpec) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.updateTime || '2026-09-27').getTime();
        const timeB = new Date(b.updateTime || '2026-09-27').getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [parts, filterName, filterCode, filterSupplier, filterCategory, filterSpec, sortOrder]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredParts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`已复制: ${text}`, 'success');
  };

  const handleOpenAddDrawer = () => {
    const nextCode = `BJ202609${String(parts.length + 1).padStart(4, '0')}`;
    setFormData({
      name: '',
      code: nextCode,
      category: '泵类配件/离心泵',
      spec: '',
      brand: '',
      stock: 10,
      unit: '个',
      supplier: '',
      description: '',
      attachments: [
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      ],
      manager: '张建国',
      price: 200,
    });
    setDrawerMode('add');
  };

  const handleOpenEditDrawer = (item: SparePartLedgerItem) => {
    setActiveItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      category: item.category,
      spec: item.spec,
      brand: item.brand,
      stock: item.stock,
      unit: item.unit,
      supplier: item.supplier,
      description: item.description || '',
      attachments: item.attachments || [],
      manager: item.manager,
      price: item.price || 150,
    });
    setDrawerMode('edit');
  };

  const handleOpenDetailDrawer = (item: SparePartLedgerItem) => {
    setActiveItem(item);
    setDrawerMode('detail');
  };

  const handleSaveDrawer = () => {
    if (!formData.name || !formData.code) {
      showToast('请填写必填项（名称、编码）', 'error');
      return;
    }
    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    if (drawerMode === 'add') {
      const newItem: SparePartLedgerItem = {
        id: `spl-${Date.now()}`,
        name: formData.name,
        code: formData.code,
        category: formData.category,
        spec: formData.spec || '通用规格',
        brand: formData.brand || '国产优质',
        stock: Number(formData.stock) || 0,
        unit: formData.unit || '个',
        supplier: formData.supplier || '未指定供应商',
        manager: formData.manager || '张建国',
        description: formData.description,
        attachments: formData.attachments,
        price: Number(formData.price) || 100,
        updateTime: nowStr,
      };
      onAddPart(newItem);
      showToast('新增备件成功，已按最新时间置顶', 'success');
    } else if (drawerMode === 'edit' && activeItem) {
      const updatedItem: SparePartLedgerItem = {
        ...activeItem,
        name: formData.name,
        code: formData.code,
        category: formData.category,
        spec: formData.spec,
        brand: formData.brand,
        stock: Number(formData.stock) || 0,
        unit: formData.unit,
        supplier: formData.supplier,
        description: formData.description,
        attachments: formData.attachments,
        price: Number(formData.price) || activeItem.price,
        updateTime: nowStr,
      };
      onUpdatePart(updatedItem);
      showToast('备件信息更新成功', 'success');
    }
    setDrawerMode(null);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast('请勾选要删除的备件', 'error');
      return;
    }
    onDeleteParts(selectedIds);
    setSelectedIds([]);
    showToast(`成功删除 ${selectedIds.length} 项备件`, 'success');
  };

  const handleSingleDelete = (id: string, name: string) => {
    onDeleteParts([id]);
    showToast(`备件 ${name} 已删除`, 'info');
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Query Filter Area (Screenshot 1) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* 备件名称 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">备件名称:</span>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="请输入备件名称"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 备件编码 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">备件编码:</span>
            <input
              type="text"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              placeholder="请输入备件编码"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 供应商 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">供应商:</span>
            <input
              type="text"
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              placeholder="请输入供应商名称"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 备件分类 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">备件分类:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 bg-white"
            >
              <option value="">选择备件类别</option>
              <option value="泵类配件/离心泵">泵类配件/离心泵</option>
              <option value="仪表仪器/传感器">仪表仪器/传感器</option>
              <option value="动力设备/电机">动力设备/电机</option>
              <option value="阀门管件/蝶阀">阀门管件/蝶阀</option>
              <option value="电气自动化/控制器">电气自动化/控制器</option>
              <option value="过滤设备/滤芯">过滤设备/滤芯</option>
              <option value="传动部件/轴承">传动部件/轴承</option>
              <option value="电气自动化/变频器">电气自动化/变频器</option>
              <option value="液压系统/阀">液压系统/阀</option>
              <option value="传动部件/减速机">传动部件/减速机</option>
            </select>
          </div>

          {/* 备件规格 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">备件规格:</span>
            <select
              value={filterSpec}
              onChange={(e) => setFilterSpec(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 bg-white"
            >
              <option value="">选择备件规格</option>
              <option value="MC-200-IMP">MC-200-IMP</option>
              <option value="PTX-1400-50Bar">PTX-1400-50Bar</option>
              <option value="YE3-132M-4 (7.5kW)">YE3-132M-4 (7.5kW)</option>
              <option value="D671X-16Q DN100">D671X-16Q DN100</option>
              <option value="S7-1200 CPU1214C">S7-1200 CPU1214C</option>
              <option value="PP-30inch-5um">PP-30inch-5um</option>
              <option value="6205-2RS1">6205-2RS1</option>
              <option value="ACS580-01-04A6-4">ACS580-01-04A6-4</option>
              <option value="4WE6D62/EG24N9K4">4WE6D62/EG24N9K4</option>
              <option value="R77-YVP3-4P-M1">R77-YVP3-4P-M1</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs pt-3 border-t border-slate-100">
          <button
            onClick={() => showToast(`查询完成，共找到 ${filteredParts.length} 条备件`, 'info')}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={() => {
              setFilterName('');
              setFilterCode('');
              setFilterSupplier('');
              setFilterCategory('');
              setFilterSpec('');
              showToast('筛选已重置', 'info');
            }}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (Screenshot 1) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Action Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">备件台账列表</h3>
            <span className="text-xs text-slate-500">
              共 <span className="font-bold text-blue-600">{filteredParts.length}</span> 条
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* 时间排序 */}
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
              onClick={handleOpenAddDrawer}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            {/* 导入 */}
            <button
              onClick={() => showToast('已打开备件导入向导', 'info')}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-orange-500" />
              <span>导入</span>
            </button>

            {/* 导出 */}
            <button
              onClick={() => showToast('正在导出备件台账 Excel 表格...', 'success')}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span>导出</span>
            </button>

            {/* 批量删除 */}
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除</span>
            </button>

            {/* 刷新 */}
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

        {/* Data Table (Screenshot 1) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-3 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredParts.length && filteredParts.length > 0}
                    className="rounded border-slate-300 text-blue-600"
                  />
                </th>
                <th className="px-3 py-3 w-12 text-center">序号</th>
                <th className="px-3 py-3">备件名称</th>
                <th className="px-3 py-3">备件编码</th>
                <th className="px-3 py-3">备件分类</th>
                <th className="px-3 py-3">规格型号</th>
                <th className="px-3 py-3">品牌</th>
                <th className="px-3 py-3">库存数量</th>
                <th className="px-3 py-3">单位</th>
                <th className="px-3 py-3">供应商</th>
                <th className="px-3 py-3">负责人</th>
                <th className="px-3 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParts.map((item, idx) => (
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
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <button
                        onClick={() => handleCopy(item.name)}
                        className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
                        title="复制名称"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span>{item.code}</span>
                      <button
                        onClick={() => handleCopy(item.code)}
                        className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
                        title="复制编码"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{item.category}</td>
                  <td className="px-3 py-3 font-mono text-slate-700">{item.spec}</td>
                  <td className="px-3 py-3 text-slate-800 font-medium">{item.brand}</td>
                  <td className="px-3 py-3">
                    <span className="font-mono font-bold text-slate-900">{item.stock}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{item.unit}</td>
                  <td className="px-3 py-3 text-slate-700 max-w-xs truncate">{item.supplier}</td>
                  <td className="px-3 py-3 text-slate-800 font-medium">{item.manager}</td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditDrawer(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleOpenDetailDrawer(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        详情
                      </button>
                      <button
                        onClick={() => handleSingleDelete(item.id, item.name)}
                        className="text-blue-600 hover:text-rose-600 font-medium hover:underline"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Screenshot 1) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
          <div>共 {filteredParts.length} 条数据</div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-400 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pg) => (
              <button
                key={pg}
                className={`w-7 h-7 rounded text-xs font-medium flex items-center justify-center ${
                  pg === 1
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                {pg}
              </button>
            ))}
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-600">
              <ChevronRight className="w-4 h-4" />
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
      {/* 编辑 / 新增 抽屉 (Screenshot 2 精准还原) */}
      {/* ========================================================================= */}
      {(drawerMode === 'add' || drawerMode === 'edit') && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {drawerMode === 'add' ? '新增备件' : '编辑备件'}
              </h3>
              <button
                onClick={() => setDrawerMode(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* 备件名称 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>备件名称:
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入备件名称"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">
                    {formData.name.length}/100
                  </span>
                </div>
              </div>

              {/* 备件编码 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>备件编码:
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="请输入备件编码"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">
                    {formData.code.length}/100
                  </span>
                </div>
              </div>

              {/* 备件分类 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>备件分类:
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white"
                >
                  <option value="泵类配件/离心泵">泵类配件/离心泵</option>
                  <option value="仪表仪器/传感器">仪表仪器/传感器</option>
                  <option value="动力设备/电机">动力设备/电机</option>
                  <option value="阀门管件/蝶阀">阀门管件/蝶阀</option>
                  <option value="电气自动化/控制器">电气自动化/控制器</option>
                  <option value="过滤设备/滤芯">过滤设备/滤芯</option>
                  <option value="传动部件/轴承">传动部件/轴承</option>
                  <option value="电气自动化/变频器">电气自动化/变频器</option>
                  <option value="液压系统/阀">液压系统/阀</option>
                  <option value="传动部件/减速机">传动部件/减速机</option>
                </select>
              </div>

              {/* 规格型号 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>规格型号:
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.spec}
                    onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                    placeholder="请输入规格型号"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">
                    {formData.spec.length}/100
                  </span>
                </div>
              </div>

              {/* 品牌 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>品牌:
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="请输入品牌"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">
                    {formData.brand.length}/100
                  </span>
                </div>
              </div>

              {/* 库存数量 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>库存数量:
                </label>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    placeholder="请输入库存数量"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">
                    {String(formData.stock).length}/100
                  </span>
                </div>
              </div>

              {/* 单位 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>单位:
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="请输入单位"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">
                    {formData.unit.length}/100
                  </span>
                </div>
              </div>

              {/* 供应商 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0">
                  <span className="text-rose-500 mr-0.5">*</span>供应商:
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="请输入供应商"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">
                    {formData.supplier.length}/100
                  </span>
                </div>
              </div>

              {/* 描述 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0 mt-2">
                  <span className="text-rose-500 mr-0.5">*</span>描述:
                </label>
                <div className="flex-1 relative">
                  <textarea
                    rows={4}
                    maxLength={200}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入描述"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2.5 bottom-2.5 text-[10px] text-slate-400">
                    {formData.description.length}/200
                  </span>
                </div>
              </div>

              {/* 上传附件 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right font-medium text-slate-700 shrink-0 mt-2">
                  <span className="text-rose-500 mr-0.5">*</span>上传附件:
                </label>
                <div className="flex-1">
                  <div
                    onClick={() => {
                      showToast('已模拟添加备件实物照片', 'info');
                      setFormData({
                        ...formData,
                        attachments: [
                          ...formData.attachments,
                          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
                        ],
                      });
                    }}
                    className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-blue-50/20"
                  >
                    <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-blue-600 font-medium">点击上传，或拖拽文件到这里上传</p>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {formData.attachments.map((url, i) => (
                        <div key={i} className="h-16 rounded-lg overflow-hidden border border-slate-200 relative group">
                          <img src={url} alt="附件" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setDrawerMode(null)}
                className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-xs transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveDrawer}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 详情 抽屉 (Screenshot 3 精准还原) */}
      {/* ========================================================================= */}
      {drawerMode === 'detail' && activeItem && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">详情</h3>
              <button
                onClick={() => setDrawerMode(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-5 text-xs text-slate-700">
              <div className="grid grid-cols-3 gap-y-5">
                <span className="text-slate-400 text-right pr-4 font-medium">备件名称:</span>
                <span className="col-span-2 font-bold text-slate-900">{activeItem.name}</span>

                <span className="text-slate-400 text-right pr-4 font-medium">备件编码:</span>
                <span className="col-span-2 font-mono font-semibold text-slate-800">{activeItem.code}</span>

                <span className="text-slate-400 text-right pr-4 font-medium">备件分类:</span>
                <span className="col-span-2 text-slate-800">{activeItem.category}</span>

                <span className="text-slate-400 text-right pr-4 font-medium">规格型号:</span>
                <span className="col-span-2 font-mono text-slate-800">{activeItem.spec}</span>

                <span className="text-slate-400 text-right pr-4 font-medium">品牌:</span>
                <span className="col-span-2 text-slate-800 font-medium">{activeItem.brand}</span>

                <span className="text-slate-400 text-right pr-4 font-medium">库存数量:</span>
                <span className="col-span-2 font-mono font-bold text-blue-600 text-sm">
                  {activeItem.stock}
                </span>

                <span className="text-slate-400 text-right pr-4 font-medium">单位:</span>
                <span className="col-span-2 text-slate-800">{activeItem.unit}</span>

                <span className="text-slate-400 text-right pr-4 font-medium">供应商:</span>
                <span className="col-span-2 text-slate-800">{activeItem.supplier}</span>

                <span className="text-slate-400 text-right pr-4 font-medium">描述:</span>
                <span className="col-span-2 text-slate-700 leading-relaxed">
                  {activeItem.description || '这是一个备品备件'}
                </span>

                <span className="text-slate-400 text-right pr-4 font-medium">附件:</span>
                <div className="col-span-2">
                  <div className="grid grid-cols-3 gap-3">
                    {(activeItem.attachments && activeItem.attachments.length > 0
                      ? activeItem.attachments
                      : [
                          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
                        ]
                    ).map((img, i) => (
                      <div key={i} className="h-20 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                        <img src={img} alt="附件预览" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setDrawerMode(null)}
                className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-xs transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setDrawerMode(null)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors shadow-xs"
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
