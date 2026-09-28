import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  RotateCcw,
  Plus,
  Download,
  Trash2,
  Edit,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ArrowUpDown,
  X,
  Check,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface CommonProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

// =========================================================================
// 通用分类配置项接口 (Category Tree Item Interface)
// =========================================================================
export interface CategoryTreeItem {
  id: string;
  name: string;
  codeId: string;
  status: '启用' | '禁用';
  updateTime: string; // 时间显示最新的，默认按时间降序排
  isExpanded?: boolean;
  children?: {
    id: string;
    name: string;
    codeId: string;
    status: '启用' | '禁用';
    updateTime: string;
  }[];
}

// 通用分类配置树表格渲染组件 (用于设备分类、备件分类、知识库分类、区域管理)
interface GenericCategoryConfigProps extends CommonProps {
  moduleName: string; // e.g. "设备分类", "备件分类", "知识库分类", "区域管理"
  configTitle: string; // e.g. "设备分类配置", "备件分类配置", "知识库分类配置", "区域管理配置"
  addBtnText?: string; // e.g. "添加分类 +", "默认区域 +"
  nameColumnLabel?: string; // e.g. "分类名称", "区域名称"
  idColumnLabel?: string; // e.g. "分类ID", "区域ID"
  initialData: CategoryTreeItem[];
}

export const GenericCategoryConfigView: React.FC<GenericCategoryConfigProps> = ({
  moduleName,
  configTitle,
  addBtnText = '添加分类 +',
  nameColumnLabel = '分类名称',
  idColumnLabel = '分类ID',
  initialData,
  showToast,
}) => {
  const [categories, setCategories] = useState<CategoryTreeItem[]>(
    // 默认按更新时间降序排列
    [...initialData].sort(
      (a, b) =>
        new Date(b.updateTime.replace(/-/g, '/')).getTime() -
        new Date(a.updateTime.replace(/-/g, '/')).getTime()
    )
  );

  // Top level inline add state
  const [isAddingTop, setIsAddingTop] = useState(false);
  const [topInputName, setTopInputName] = useState('');

  // Sub level inline add state
  const [addingSubParentId, setAddingSubParentId] = useState<string | null>(null);
  const [subInputName, setSubInputName] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('5');

  // Toggle category expand
  const toggleExpand = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat))
    );
  };

  // Toggle status
  const toggleStatus = (parentId: string, subId?: string) => {
    const nowStr = '2026-09-16 14:30:00';
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === parentId) {
          if (!subId) {
            const nextStatus = cat.status === '启用' ? '禁用' : '启用';
            showToast(`已切换 [${cat.name}] 状态为：${nextStatus}`, 'info');
            return { ...cat, status: nextStatus, updateTime: nowStr };
          } else if (cat.children) {
            return {
              ...cat,
              children: cat.children.map((sub) => {
                if (sub.id === subId) {
                  const nextStatus = sub.status === '启用' ? '禁用' : '启用';
                  showToast(`已切换 [${sub.name}] 状态为：${nextStatus}`, 'info');
                  return { ...sub, status: nextStatus, updateTime: nowStr };
                }
                return sub;
              }),
            };
          }
        }
        return cat;
      })
    );
  };

  // Confirm Top Add
  const handleConfirmTopAdd = () => {
    if (!topInputName.trim()) {
      showToast(`请输入${nameColumnLabel}`, 'warning');
      return;
    }
    const newId = `cat-${Date.now()}`;
    const newCode = `${10000 + categories.length + 1}`;
    const nowStr = '2026-09-16 14:50:00';

    const newItem: CategoryTreeItem = {
      id: newId,
      name: topInputName.trim(),
      codeId: newCode,
      status: '启用',
      updateTime: nowStr,
      isExpanded: true,
      children: [],
    };

    setCategories([newItem, ...categories]);
    setTopInputName('');
    setIsAddingTop(false);
    showToast(`已成功添加一级${nameColumnLabel}: ${newItem.name}`, 'success');
  };

  // Confirm Sub Add
  const handleConfirmSubAdd = (parentId: string) => {
    if (!subInputName.trim()) {
      showToast(`请输入二级${nameColumnLabel}`, 'warning');
      return;
    }
    const parent = categories.find((c) => c.id === parentId);
    if (!parent) return;

    const subCount = (parent.children?.length || 0) + 1;
    const subCode = `${parent.codeId}${String(subCount).padStart(2, '0')}`;
    const nowStr = '2026-09-16 14:52:00';

    const newSubItem = {
      id: `sub-${Date.now()}`,
      name: subInputName.trim(),
      codeId: subCode,
      status: '启用' as const,
      updateTime: nowStr,
    };

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === parentId) {
          return {
            ...cat,
            isExpanded: true,
            updateTime: nowStr,
            children: [newSubItem, ...(cat.children || [])],
          };
        }
        return cat;
      })
    );

    setSubInputName('');
    setAddingSubParentId(null);
    showToast(`已在 [${parent.name}] 下添加子项: ${newSubItem.name}`, 'success');
  };

  // Delete Item
  const handleDelete = (parentId: string, subId?: string) => {
    if (!subId) {
      const parent = categories.find((c) => c.id === parentId);
      if (confirm(`确定要删除 "${parent?.name}" 分类及其所有子分类吗？`)) {
        setCategories((prev) => prev.filter((c) => c.id !== parentId));
        showToast(`已删除分类: ${parent?.name}`, 'info');
      }
    } else {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === parentId && cat.children) {
            return {
              ...cat,
              children: cat.children.filter((s) => s.id !== subId),
            };
          }
          return cat;
        })
      );
      showToast('已删除子分类项', 'info');
    }
  };

  // Save Edit
  const handleSaveEdit = (parentId: string, subId?: string) => {
    if (!editingName.trim()) return;
    const nowStr = '2026-09-16 14:55:00';
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === parentId) {
          if (!subId) {
            return { ...cat, name: editingName.trim(), updateTime: nowStr };
          } else if (cat.children) {
            return {
              ...cat,
              children: cat.children.map((s) =>
                s.id === subId ? { ...s, name: editingName.trim(), updateTime: nowStr } : s
              ),
            };
          }
        }
        return cat;
      })
    );
    setEditingId(null);
    setEditingName('');
    showToast('分类名称已更新', 'success');
  };

  return (
    <div className="space-y-4 pb-16 text-xs select-none">
      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        {/* Title Bar with Blue Accent Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">{configTitle}</h2>
          </div>
        </div>

        {/* Tree Table Header & Inline Add Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-medium">
              <tr>
                <th className="p-3 w-72 pl-8 font-medium">{nameColumnLabel}</th>
                <th className="p-3 w-48 font-medium">{idColumnLabel}</th>
                <th className="p-3 w-36 font-medium">状态</th>
                <th className="p-3 w-56 font-medium text-slate-700">
                  <div className="flex items-center gap-1">
                    <span>更新时间</span>
                    <span className="text-blue-600 text-[11px] font-mono">▾ (最新降序)</span>
                  </div>
                </th>
                <th className="p-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Top Add Button Row (截图中的 "添加分类 +" 按钮) */}
              <tr className="bg-white border-b border-slate-100">
                <td colSpan={5} className="p-3 pl-8">
                  <button
                    onClick={() => {
                      setIsAddingTop(true);
                      setTopInputName('');
                    }}
                    className="text-slate-800 font-semibold text-xs hover:text-blue-600 flex items-center gap-1 transition-colors"
                  >
                    <span>{addBtnText}</span>
                  </button>
                </td>
              </tr>

              {/* Inline Input for Top Level Category (Screenshot 2, 4, 6) */}
              {isAddingTop && (
                <tr className="bg-emerald-50/40 border-b border-emerald-100">
                  <td colSpan={5} className="p-3 pl-8">
                    <div className="flex items-center gap-2 max-w-md">
                      <input
                        type="text"
                        autoFocus
                        value={topInputName}
                        onChange={(e) => setTopInputName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmTopAdd();
                          if (e.key === 'Escape') setIsAddingTop(false);
                        }}
                        placeholder={`请输入一级${nameColumnLabel}`}
                        className="flex-1 h-7 px-2.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                      <button
                        onClick={() => setIsAddingTop(false)}
                        className="px-3 h-7 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleConfirmTopAdd}
                        className="px-3 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
                      >
                        确定
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {categories.map((cat, catIndex) => {
                const isExpanded = cat.isExpanded ?? true;
                const hasChildren = cat.children && cat.children.length > 0;
                const isEditingParent = editingId === cat.id;
                const isParentRowGreen = catIndex % 2 === 0;

                return (
                  <React.Fragment key={cat.id}>
                    {/* Primary Parent Row */}
                    <tr
                      className={`transition-colors ${
                        isParentRowGreen ? 'bg-[#eef8f2]/90 hover:bg-[#e4f4eb]' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 pl-6 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          {hasChildren ? (
                            <button
                              onClick={() => toggleExpand(cat.id)}
                              className="p-0.5 text-slate-500 hover:text-slate-800"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="w-3.5 inline-block"></span>
                          )}

                          {isEditingParent ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-6 px-2 border border-blue-500 rounded text-xs"
                              />
                              <button
                                onClick={() => handleSaveEdit(cat.id)}
                                className="text-blue-600 font-bold px-1"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-slate-500 px-1"
                              >
                                取消
                              </button>
                            </div>
                          ) : (
                            <span className="font-normal text-slate-800">{cat.name}</span>
                          )}

                          {/* Inline Sub-add trigger `+` beside category name */}
                          <button
                            onClick={() => {
                              setAddingSubParentId(cat.id);
                              setSubInputName('');
                            }}
                            title="添加子分类"
                            className="text-blue-600 hover:text-blue-800 font-bold text-sm ml-1 px-1"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-700">{cat.codeId}</td>
                      <td className="p-3">
                        {/* Status Toggle Switch */}
                        <button
                          onClick={() => toggleStatus(cat.id)}
                          className={`relative inline-flex h-5 w-12 items-center rounded-full transition-colors focus:outline-none ${
                            cat.status === '启用' ? 'bg-[#0092ff]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`text-[10px] font-medium text-white px-1.5 ${
                              cat.status === '启用' ? 'mr-auto' : 'ml-auto'
                            }`}
                          >
                            {cat.status}
                          </span>
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              cat.status === '启用'
                                ? 'translate-x-[-2px]'
                                : 'translate-x-[-22px]'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{cat.updateTime}</td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditingName(cat.name);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          删除
                        </button>
                      </td>
                    </tr>

                    {/* Inline Sub Add Input Row */}
                    {addingSubParentId === cat.id && (
                      <tr className="bg-blue-50/50 border-b border-blue-100">
                        <td colSpan={5} className="p-3 pl-14">
                          <div className="flex items-center gap-2 max-w-md">
                            <input
                              type="text"
                              autoFocus
                              value={subInputName}
                              onChange={(e) => setSubInputName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleConfirmSubAdd(cat.id);
                                if (e.key === 'Escape') setAddingSubParentId(null);
                              }}
                              placeholder={`请输入二级${nameColumnLabel}`}
                              className="flex-1 h-7 px-2.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                            />
                            <button
                              onClick={() => setAddingSubParentId(null)}
                              className="px-3 h-7 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => handleConfirmSubAdd(cat.id)}
                              className="px-3 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
                            >
                              确定
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Sub Children Rows */}
                    {isExpanded &&
                      cat.children &&
                      cat.children.map((sub, subIdx) => {
                        const isEditingSub = editingId === sub.id;
                        const isSubRowGreen = (catIndex + subIdx) % 2 === 1;

                        return (
                          <tr
                            key={sub.id}
                            className={`transition-colors ${
                              isSubRowGreen
                                ? 'bg-[#eef8f2]/90 hover:bg-[#e4f4eb]'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <td className="p-3 pl-14 font-normal text-slate-800">
                              {isEditingSub ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="h-6 px-2 border border-blue-500 rounded text-xs"
                                  />
                                  <button
                                    onClick={() => handleSaveEdit(cat.id, sub.id)}
                                    className="text-blue-600 font-bold px-1"
                                  >
                                    保存
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-slate-500 px-1"
                                  >
                                    取消
                                  </button>
                                </div>
                              ) : (
                                <span>{sub.name}</span>
                              )}
                            </td>
                            <td className="p-3 font-mono text-slate-700">{sub.codeId}</td>
                            <td className="p-3">
                              {/* Sub Toggle Switch */}
                              <button
                                onClick={() => toggleStatus(cat.id, sub.id)}
                                className={`relative inline-flex h-5 w-12 items-center rounded-full transition-colors focus:outline-none ${
                                  sub.status === '启用' ? 'bg-[#0092ff]' : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`text-[10px] font-medium text-white px-1.5 ${
                                    sub.status === '启用' ? 'mr-auto' : 'ml-auto'
                                  }`}
                                >
                                  {sub.status}
                                </span>
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                    sub.status === '启用'
                                      ? 'translate-x-[-2px]'
                                      : 'translate-x-[-22px]'
                                  }`}
                                />
                              </button>
                            </td>
                            <td className="p-3 font-mono text-slate-600">{sub.updateTime}</td>
                            <td className="p-3 space-x-2">
                              <button
                                onClick={() => {
                                  setEditingId(sub.id);
                                  setEditingName(sub.name);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id, sub.id)}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Section (Screenshot 1, 3, 5, 7) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-600 bg-white">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 1, 2, 3, 4, 5, 6, 7, 8, 9 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 flex items-center justify-center border rounded font-medium transition-colors ${
                currentPage === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(9, p + 1))}
            disabled={currentPage === 9}
            className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
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
                if (e.key === 'Enter') {
                  const num = parseInt(jumpPage, 10);
                  if (!isNaN(num) && num >= 1 && num <= 9) setCurrentPage(num);
                }
              }}
              className="w-10 h-7 text-center border border-slate-300 rounded text-xs text-slate-800"
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 1. 设备分类配置视图 (Equipment Category Config - Screenshots 1 & 2)
// =========================================================================
const INITIAL_EQUIPMENT_CATEGORIES: CategoryTreeItem[] = [
  {
    id: 'eq-cat-1',
    name: '机械类',
    codeId: '10001',
    status: '启用',
    updateTime: '2026-09-16 14:22:40',
    isExpanded: true,
    children: [
      {
        id: 'eq-sub-1',
        name: '轴承类',
        codeId: '1000101',
        status: '启用',
        updateTime: '2026-09-16 14:25:40',
      },
      {
        id: 'eq-sub-2',
        name: '齿轮类',
        codeId: '1000102',
        status: '启用',
        updateTime: '2026-09-16 14:22:45',
      },
      {
        id: 'eq-sub-3',
        name: '联轴器类',
        codeId: '1000103',
        status: '启用',
        updateTime: '2026-09-16 14:22:50',
      },
      {
        id: 'eq-sub-4',
        name: '皮带类',
        codeId: '1000104',
        status: '启用',
        updateTime: '2026-09-16 14:23:05',
      },
      {
        id: 'eq-sub-5',
        name: '皮带类',
        codeId: '1000105',
        status: '启用',
        updateTime: '2026-09-16 14:23:15',
      },
      {
        id: 'eq-sub-6',
        name: '皮带类',
        codeId: '1000106',
        status: '启用',
        updateTime: '2026-09-16 14:23:25',
      },
    ],
  },
  {
    id: 'eq-cat-2',
    name: '电气类',
    codeId: '10002',
    status: '启用',
    updateTime: '2026-09-16 14:30:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'eq-cat-3',
    name: '液压类',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:35:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'eq-cat-4',
    name: '气动类',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:40:20',
    isExpanded: true,
    children: [],
  },
  {
    id: 'eq-cat-5',
    name: '通用类',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:48:20',
    isExpanded: true,
    children: [],
  },
];

export const EquipmentCategoryConfigView: React.FC<CommonProps> = (props) => (
  <GenericCategoryConfigView
    moduleName="设备分类"
    configTitle="设备分类配置"
    addBtnText="添加分类 +"
    nameColumnLabel="分类名称"
    idColumnLabel="分类ID"
    initialData={INITIAL_EQUIPMENT_CATEGORIES}
    {...props}
  />
);

// =========================================================================
// 2. 备件分类配置视图 (Spare Parts Category Config - Screenshots 3 & 4)
// =========================================================================
const INITIAL_SPARE_CATEGORIES: CategoryTreeItem[] = [
  {
    id: 'sp-cat-1',
    name: '机械类',
    codeId: '10001',
    status: '启用',
    updateTime: '2026-09-16 14:22:40',
    isExpanded: true,
    children: [
      {
        id: 'sp-sub-1',
        name: '轴承类',
        codeId: '1000101',
        status: '启用',
        updateTime: '2026-09-16 14:25:40',
      },
      {
        id: 'sp-sub-2',
        name: '齿轮类',
        codeId: '1000102',
        status: '启用',
        updateTime: '2026-09-16 14:22:45',
      },
      {
        id: 'sp-sub-3',
        name: '联轴器类',
        codeId: '1000103',
        status: '启用',
        updateTime: '2026-09-16 14:22:50',
      },
      {
        id: 'sp-sub-4',
        name: '皮带类',
        codeId: '1000104',
        status: '启用',
        updateTime: '2026-09-16 14:23:05',
      },
      {
        id: 'sp-sub-5',
        name: '皮带类',
        codeId: '1000105',
        status: '启用',
        updateTime: '2026-09-16 14:23:15',
      },
      {
        id: 'sp-sub-6',
        name: '皮带类',
        codeId: '1000106',
        status: '启用',
        updateTime: '2026-09-16 14:23:25',
      },
    ],
  },
  {
    id: 'sp-cat-2',
    name: '电气类',
    codeId: '10002',
    status: '启用',
    updateTime: '2026-09-16 14:30:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'sp-cat-3',
    name: '液压类',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:35:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'sp-cat-4',
    name: '气动类',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:40:20',
    isExpanded: true,
    children: [],
  },
  {
    id: 'sp-cat-5',
    name: '通用类',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:48:20',
    isExpanded: true,
    children: [],
  },
];

export const SparePartsCategoryConfigView: React.FC<CommonProps> = (props) => (
  <GenericCategoryConfigView
    moduleName="备件分类"
    configTitle="备件分类配置"
    addBtnText="添加分类 +"
    nameColumnLabel="分类名称"
    idColumnLabel="分类ID"
    initialData={INITIAL_SPARE_CATEGORIES}
    {...props}
  />
);

// =========================================================================
// 3. 知识库分类配置视图 (Knowledge Category Config - Screenshots 5 & 6)
// =========================================================================
const INITIAL_KNOWLEDGE_CATEGORIES: CategoryTreeItem[] = [
  {
    id: 'kn-cat-1',
    name: '故障处理',
    codeId: '10001',
    status: '启用',
    updateTime: '2026-09-16 14:22:40',
    isExpanded: true,
    children: [
      {
        id: 'kn-sub-1',
        name: '电气类',
        codeId: '1000101',
        status: '启用',
        updateTime: '2026-09-16 14:25:40',
      },
      {
        id: 'kn-sub-2',
        name: '机械类',
        codeId: '1000102',
        status: '启用',
        updateTime: '2026-09-16 14:22:45',
      },
      {
        id: 'kn-sub-3',
        name: '自动化类',
        codeId: '1000103',
        status: '启用',
        updateTime: '2026-09-16 14:22:50',
      },
      {
        id: 'kn-sub-4',
        name: '液压系统',
        codeId: '1000104',
        status: '启用',
        updateTime: '2026-09-16 14:23:05',
      },
      {
        id: 'kn-sub-5',
        name: '液压系统',
        codeId: '1000105',
        status: '启用',
        updateTime: '2026-09-16 14:23:15',
      },
      {
        id: 'kn-sub-6',
        name: '液压系统',
        codeId: '1000106',
        status: '启用',
        updateTime: '2026-09-16 14:23:25',
      },
    ],
  },
  {
    id: 'kn-cat-2',
    name: '维保标准',
    codeId: '10002',
    status: '启用',
    updateTime: '2026-09-16 14:30:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'kn-cat-3',
    name: '操作规程',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:35:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'kn-cat-4',
    name: '备件信息',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:40:20',
    isExpanded: true,
    children: [],
  },
  {
    id: 'kn-cat-5',
    name: '培训资料',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:48:20',
    isExpanded: true,
    children: [],
  },
];

export const KnowledgeCategoryConfigView: React.FC<CommonProps> = (props) => (
  <GenericCategoryConfigView
    moduleName="知识库分类"
    configTitle="知识库分类配置"
    addBtnText="添加分类 +"
    nameColumnLabel="分类名称"
    idColumnLabel="分类ID"
    initialData={INITIAL_KNOWLEDGE_CATEGORIES}
    {...props}
  />
);

// =========================================================================
// 4. 区域管理配置视图 (Area Management Config - Screenshot 7)
// =========================================================================
const INITIAL_AREA_CATEGORIES: CategoryTreeItem[] = [
  {
    id: 'ar-cat-1',
    name: '苯胺分厂',
    codeId: '10001',
    status: '启用',
    updateTime: '2026-09-16 14:22:40',
    isExpanded: true,
    children: [
      {
        id: 'ar-sub-1',
        name: 'A片区域',
        codeId: '1000101',
        status: '启用',
        updateTime: '2026-09-16 14:25:40',
      },
      {
        id: 'ar-sub-2',
        name: 'A片区域',
        codeId: '1000102',
        status: '启用',
        updateTime: '2026-09-16 14:22:45',
      },
      {
        id: 'ar-sub-3',
        name: 'A片区域',
        codeId: '1000103',
        status: '启用',
        updateTime: '2026-09-16 14:22:50',
      },
      {
        id: 'ar-sub-4',
        name: 'A片区域',
        codeId: '1000104',
        status: '启用',
        updateTime: '2026-09-16 14:23:05',
      },
      {
        id: 'ar-sub-5',
        name: 'A片区域',
        codeId: '1000105',
        status: '启用',
        updateTime: '2026-09-16 14:23:15',
      },
      {
        id: 'ar-sub-6',
        name: 'A片区域',
        codeId: '1000106',
        status: '启用',
        updateTime: '2026-09-16 14:23:25',
      },
    ],
  },
  {
    id: 'ar-cat-2',
    name: '苯胺分厂',
    codeId: '10002',
    status: '启用',
    updateTime: '2026-09-16 14:30:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'ar-cat-3',
    name: '苯胺分厂',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:35:25',
    isExpanded: true,
    children: [],
  },
  {
    id: 'ar-cat-4',
    name: '苯胺分厂',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:40:20',
    isExpanded: true,
    children: [],
  },
  {
    id: 'ar-cat-5',
    name: '苯胺分厂',
    codeId: '10003',
    status: '启用',
    updateTime: '2026-09-16 14:48:20',
    isExpanded: true,
    children: [],
  },
];

export const AreaManagementConfigView: React.FC<CommonProps> = (props) => (
  <GenericCategoryConfigView
    moduleName="区域管理"
    configTitle="区域管理配置"
    addBtnText="默认区域 +"
    nameColumnLabel="区域名称"
    idColumnLabel="区域ID"
    initialData={INITIAL_AREA_CATEGORIES}
    {...props}
  />
);

// =========================================================================
// 5. 点巡检项目配置 (Inspection Items Config - Screenshots 8, 9, 10, 11)
// =========================================================================

export interface InspectionCheckItemDetail {
  id: string;
  itemOrder: number;
  checkItem: string; // 检查事项
  description: string; // 描述
}

export interface InspectionProjectItem {
  id: string;
  orderNo: string; // 序号 如 20260917-089
  projectName: string; // 项目名称 如 电机日常运行点检
  category: string; // 设备分类 如 电机设备/交流异步电机
  totalCheckItems: number; // 检查事项总数 如 12, 8
  remark?: string; // 备注
  createTime: string; // 创建时间 (最新降序)
  items: InspectionCheckItemDetail[];
}

const DEFAULT_DETAIL_CHECK_ITEMS: InspectionCheckItemDetail[] = [
  {
    id: 'det-1',
    itemOrder: 1,
    checkItem: '电机转速',
    description:
      '使用红外测速仪测量实际转速，应与额定值偏差 ≤ ±5%；若偏差过大，需检查皮带张紧度或负载情况。',
  },
  {
    id: 'det-2',
    itemOrder: 2,
    checkItem: '电机温度',
    description:
      '使用红外测温枪测量外壳温度，正常运行时不超过 80℃；超过 90℃ 应立即停机检查冷却风扇是否工作。',
  },
  {
    id: 'det-3',
    itemOrder: 3,
    checkItem: '电机振动',
    description:
      '使用振动传感器检测径向振动值，应 ≤ 2.8 mm/s (ISO 10816 标准)；若超标，需检查轴承或对中情况。',
  },
  {
    id: 'det-4',
    itemOrder: 4,
    checkItem: '润滑油位',
    description:
      '检查油标尺或油窗，润滑油应在“MIN”与“MAX”之间；不足时补充同型号润滑油，严禁混用。',
  },
  {
    id: 'det-5',
    itemOrder: 5,
    checkItem: '润滑油质',
    description:
      '观察油色是否清澈，无乳化、无杂质；建议每半年取样送检，粘度变化 >10% 时更换。',
  },
  {
    id: 'det-6',
    itemOrder: 6,
    checkItem: '轴承异响',
    description:
      '启动设备后耳听是否有“咔咔”、“嗡嗡”等异常声音；如有，应停机拆检轴承是否磨损。',
  },
  {
    id: 'det-7',
    itemOrder: 7,
    checkItem: '接地电阻',
    description:
      '使用接地电阻测试仪测量，阻值应 ≤ 10Ω；大于 20Ω 时需重新焊接或更换接地线。',
  },
  {
    id: 'det-8',
    itemOrder: 8,
    checkItem: '皮带张力',
    description:
      '使用张力计测量，张力应在厂家推荐范围内 (如 10-15 N/mm)；过松易打滑，过紧加速轴承磨损。',
  },
];

const INITIAL_INSPECTION_PROJECTS: InspectionProjectItem[] = [
  {
    id: 'proj-1',
    orderNo: '20260917-089',
    projectName: '电机日常运行点检',
    category: '电机设备/交流异步电机',
    totalCheckItems: 12,
    remark: '高压主电动机日常点巡检基准规程',
    createTime: '2026-09-17 10:20:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-2',
    orderNo: '20260916-102',
    projectName: '离心泵常规巡检',
    category: '泵类设备/卧式离心泵',
    totalCheckItems: 8,
    remark: '离心泵日常巡检事项',
    createTime: '2026-09-16 14:15:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-3',
    orderNo: '20260915-056',
    projectName: '配电柜安全巡查',
    category: '电气设备/低压配电柜',
    totalCheckItems: 15,
    remark: '配电房及车间配电箱巡检',
    createTime: '2026-09-15 09:30:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-4',
    orderNo: '20260914-078',
    projectName: '空压机基础保养',
    category: '压缩空气/螺杆式空压机',
    totalCheckItems: 10,
    remark: '空压机日常工况点检',
    createTime: '2026-09-14 16:40:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-5',
    orderNo: '20260913-034',
    projectName: '工业阀门密封性检查',
    category: '管道/闸阀与球阀',
    totalCheckItems: 6,
    remark: '管廊气密性及阀门泄漏排查',
    createTime: '2026-09-13 11:00:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-6',
    orderNo: '20260912-091',
    projectName: '传送带系统点检',
    category: '传动设备/皮带输送机',
    totalCheckItems: 14,
    remark: '自动化产线输送带张力与托辊点检',
    createTime: '2026-09-12 15:20:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-7',
    orderNo: '20260911-045',
    projectName: '变频器运行状态巡检',
    category: '电气设备/变频器柜',
    totalCheckItems: 9,
    remark: '散热风扇及母线电压测量',
    createTime: '2026-09-11 08:50:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-8',
    orderNo: '20260910-023',
    projectName: '冷却水塔清理检查',
    category: '暖通空调/冷却塔',
    totalCheckItems: 7,
    remark: '风机叶片及喷淋管路点检',
    createTime: '2026-09-10 13:40:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-9',
    orderNo: '20260909-067',
    projectName: '叉车液压系统点检',
    category: '厂内运输/内燃平衡重叉车',
    totalCheckItems: 11,
    remark: '门架升降液压油路与刹车安全',
    createTime: '2026-09-09 10:10:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
  {
    id: 'proj-10',
    orderNo: '20260908-012',
    projectName: '数控车床精度校准',
    category: '加工设备/卧式数控车床',
    totalCheckItems: 18,
    remark: '几何精度及重复定位精度校验',
    createTime: '2026-09-08 09:00:00',
    items: DEFAULT_DETAIL_CHECK_ITEMS,
  },
];

export const InspectionItemsConfigView: React.FC<CommonProps> = ({ showToast }) => {
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
  const [projects, setProjects] = useState<InspectionProjectItem[]>(
    // 默认按最新时间降序排列
    [...INITIAL_INSPECTION_PROJECTS].sort(
      (a, b) =>
        new Date(b.createTime.replace(/-/g, '/')).getTime() -
        new Date(a.createTime.replace(/-/g, '/')).getTime()
    )
  );

  const [selectedProject, setSelectedProject] = useState<InspectionProjectItem | null>(null);

  // Filter State
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedOrderNos, setSelectedOrderNos] = useState<string[]>([]);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formRemark, setFormRemark] = useState('');
  const [formItems, setFormItems] = useState<InspectionCheckItemDetail[]>(DEFAULT_DETAIL_CHECK_ITEMS);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('5');

  // Filtered List
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (nameFilter && !p.projectName.includes(nameFilter.trim())) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      return true;
    });
  }, [projects, nameFilter, categoryFilter]);

  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)));

  const handleReset = () => {
    setNameFilter('');
    setCategoryFilter('');
    showToast('查询条件已重置，已按最新时间降序排列', 'info');
  };

  const handleSearch = () => {
    showToast(`查询完成，共找到 ${filteredProjects.length} 条点巡检项目`, 'info');
  };

  const toggleSelectAll = () => {
    if (selectedOrderNos.length === filteredProjects.length) {
      setSelectedOrderNos([]);
    } else {
      setSelectedOrderNos(filteredProjects.map((p) => p.orderNo));
    }
  };

  const toggleSelectOne = (orderNo: string) => {
    if (selectedOrderNos.includes(orderNo)) {
      setSelectedOrderNos(selectedOrderNos.filter((n) => n !== orderNo));
    } else {
      setSelectedOrderNos([...selectedOrderNos, orderNo]);
    }
  };

  const handleDeleteProject = (orderNo: string) => {
    if (confirm(`确定要删除编号为 ${orderNo} 的点巡检项目吗？`)) {
      setProjects(projects.filter((p) => p.orderNo !== orderNo));
      showToast(`已删除项目 ${orderNo}`, 'info');
    }
  };

  const handleBatchDelete = () => {
    if (selectedOrderNos.length === 0) {
      showToast('请先勾选需要批量删除的项目', 'warning');
      return;
    }
    setProjects(projects.filter((p) => !selectedOrderNos.includes(p.orderNo)));
    setSelectedOrderNos([]);
    showToast(`已批量删除 ${selectedOrderNos.length} 项点巡检项目`, 'success');
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormCategory('');
    setFormRemark('');
    setFormItems([
      {
        id: `item-${Date.now()}-1`,
        itemOrder: 1,
        checkItem: '电机转速',
        description:
          '使用红外测速仪测量实际转速，应与额定值偏差 ≤ ±5%；若偏差过大，需检查皮带张紧度或负载情况。',
      },
      {
        id: `item-${Date.now()}-2`,
        itemOrder: 2,
        checkItem: '电机温度',
        description:
          '使用红外测温枪测量外壳温度，正常运行时不超过 80℃；超过 90℃ 应立即停机检查冷却风扇是否工作。',
      },
    ]);
    setViewMode('add');
  };

  const handleOpenEdit = (project: InspectionProjectItem) => {
    setSelectedProject(project);
    setFormName(project.projectName);
    setFormCategory(project.category);
    setFormRemark(project.remark || '');
    setFormItems(project.items && project.items.length > 0 ? project.items : DEFAULT_DETAIL_CHECK_ITEMS);
    setViewMode('edit');
  };

  const handleOpenDetail = (project: InspectionProjectItem) => {
    setSelectedProject(project);
    setViewMode('detail');
  };

  // Add a new row to items table in Edit / Add view
  const handleAddDetailRow = () => {
    const nextOrder = formItems.length + 1;
    const newRow: InspectionCheckItemDetail = {
      id: `det-${Date.now()}`,
      itemOrder: nextOrder,
      checkItem: '',
      description: '',
    };
    setFormItems([...formItems, newRow]);
  };

  const handleRemoveDetailRow = (id: string) => {
    const updated = formItems
      .filter((i) => i.id !== id)
      .map((item, idx) => ({ ...item, itemOrder: idx + 1 }));
    setFormItems(updated);
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      showToast('请输入项目名称', 'warning');
      return;
    }
    if (!formCategory) {
      showToast('请选择设备分类', 'warning');
      return;
    }

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    if (viewMode === 'add') {
      const newOrderNo = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;

      const newProj: InspectionProjectItem = {
        id: `proj-${Date.now()}`,
        orderNo: newOrderNo,
        projectName: formName,
        category: formCategory,
        totalCheckItems: formItems.length,
        remark: formRemark,
        createTime: formattedNow, // 最新时间
        items: formItems,
      };

      setProjects([newProj, ...projects]);
      showToast(`点巡检项目 ${formName} 已成功创建`, 'success');
    } else if (viewMode === 'edit' && selectedProject) {
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                projectName: formName,
                category: formCategory,
                remark: formRemark,
                totalCheckItems: formItems.length,
                createTime: formattedNow,
                items: formItems,
              }
            : p
        )
      );
      showToast(`点巡检项目 ${formName} 已更新`, 'success');
    }

    setViewMode('list');
  };

  // ==========================================
  // VIEW: 详情模式 (Screenshot 11)
  // ==========================================
  if (viewMode === 'detail' && selectedProject) {
    return (
      <div className="space-y-4 pb-16 text-xs">
        {/* Detail Card */}
        <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">点巡检项目详情</h2>
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              返回
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Section 1: 设备信息 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                <h3 className="text-sm font-bold text-slate-800">设备信息</h3>
              </div>

              {/* Table-like Form display as in Screenshot 11 */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-20 shrink-0">项目名称:</span>
                    <span className="text-slate-900 font-medium">{selectedProject.projectName}</span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-20 shrink-0">设备分类:</span>
                    <span className="text-slate-900 font-medium">{selectedProject.category}</span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-20 shrink-0">备注:</span>
                    <span className="text-slate-500">{selectedProject.remark || '--'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: 项目明细 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                <h3 className="text-sm font-bold text-slate-800">项目明细</h3>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                    <tr>
                      <th className="p-3 w-16 text-center">序号</th>
                      <th className="p-3 w-40 font-medium">检查事项</th>
                      <th className="p-3 font-medium">描述</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedProject.items && selectedProject.items.length > 0 ? (
                      selectedProject.items.map((item, idx) => {
                        const isGreen = idx % 2 === 1;
                        return (
                          <tr
                            key={item.id || idx}
                            className={`transition-colors ${
                              isGreen ? 'bg-[#eef8f2]/90' : 'bg-white'
                            }`}
                          >
                            <td className="p-3 text-center text-slate-600 font-mono">
                              {idx + 1}
                            </td>
                            <td className="p-3 font-medium text-slate-800">{item.checkItem}</td>
                            <td className="p-3 text-slate-600 leading-relaxed">
                              {item.description}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-400">
                          暂无明细检查项
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination at bottom */}
            <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-600 bg-white">
              <button
                disabled
                className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 flex items-center justify-center border rounded font-medium ${
                    p === 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-300 text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled
                className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <select className="h-7 px-2 border border-slate-300 rounded bg-white text-slate-700 text-xs">
                <option>10条/页</option>
              </select>
              <div className="flex items-center gap-1 ml-2">
                <span>跳至</span>
                <input
                  type="text"
                  defaultValue="5"
                  className="w-10 h-7 text-center border border-slate-300 rounded text-xs text-slate-800"
                />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: 编辑 / 新增模式 (Screenshots 9 & 10)
  // ==========================================
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="space-y-4 pb-16 text-xs">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">
              {viewMode === 'edit' ? '编辑点巡检项目' : '新增点巡检项目'}
            </h2>
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              返回
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Section 1: 设备信息 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                <h3 className="text-sm font-bold text-slate-800">设备信息</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-slate-700 whitespace-nowrap font-medium w-20">
                    项目名称:
                  </span>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="请输入项目名称"
                    className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-slate-700 whitespace-nowrap font-medium w-20">
                    设备分类:
                  </span>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">请选择设备分类</option>
                    {uniqueCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="电机设备/交流异步电机">电机设备/交流异步电机</option>
                    <option value="宕机类/电机">宕机类/电机</option>
                  </select>
                </div>

                <div className="flex items-start gap-2 md:col-span-2">
                  <span className="text-transparent font-bold">*</span>
                  <span className="text-slate-700 whitespace-nowrap font-medium w-20 pt-2">
                    备注:
                  </span>
                  <div className="flex-1 relative">
                    <textarea
                      rows={3}
                      maxLength={200}
                      value={formRemark}
                      onChange={(e) => setFormRemark(e.target.value)}
                      placeholder="请输入备注"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                    />
                    <div className="absolute right-2 bottom-2 text-slate-400 text-[11px]">
                      {formRemark.length}/200
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: 项目明细 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                <h3 className="text-sm font-bold text-slate-800">项目明细</h3>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                    <tr>
                      <th className="p-3 w-16 text-center">序号</th>
                      <th className="p-3 w-48 font-medium">检查事项</th>
                      <th className="p-3 font-medium">描述</th>
                      <th className="p-3 w-20 text-center font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formItems.map((item, idx) => {
                      const isGreen = idx % 2 === 1;
                      return (
                        <tr
                          key={item.id || idx}
                          className={`transition-colors ${
                            isGreen ? 'bg-[#eef8f2]/90' : 'bg-white'
                          }`}
                        >
                          <td className="p-3 text-center text-slate-600 font-mono">{idx + 1}</td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.checkItem}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormItems(
                                  formItems.map((fi) =>
                                    fi.id === item.id ? { ...fi, checkItem: val } : fi
                                  )
                                );
                              }}
                              placeholder="例如：电机转速"
                              className="w-full h-7 px-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormItems(
                                  formItems.map((fi) =>
                                    fi.id === item.id ? { ...fi, description: val } : fi
                                  )
                                );
                              }}
                              placeholder="请输入检查标准及判定描述"
                              className="w-full h-7 px-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveDetailRow(item.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add Row Button (Screenshot 10) */}
              <div className="mt-3">
                <button
                  onClick={handleAddDetailRow}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
                >
                  + 添加一行
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setViewMode('list')}
                className="px-5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveForm}
                className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: 列表模式 (Screenshot 8)
  // ==========================================
  return (
    <div className="space-y-3 pb-16 text-xs select-none">
      {/* Filter Card */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* 项目名称 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">项目名称:</span>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="请输入项目名称"
              className="h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 w-56"
            />
          </div>

          {/* 设备分类 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">设备分类:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
            >
              <option value="">选择设备分类</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
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
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        {/* Table Top Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-800">点巡检项目列表</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            <button
              onClick={() => showToast(`已导出 ${filteredProjects.length} 项点巡检项目`, 'success')}
              className="h-8 px-3.5 bg-[#ff9800] hover:bg-[#f57c00] text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            <button
              onClick={handleBatchDelete}
              disabled={selectedOrderNos.length === 0}
              className="h-8 px-3.5 border border-rose-300 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除</span>
            </button>

            <button
              onClick={() => showToast('已刷新点巡检项目列表', 'success')}
              title="刷新"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => showToast('列自适应已设置', 'info')}
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
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredProjects.length > 0 &&
                      selectedOrderNos.length === filteredProjects.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-medium">序号</th>
                <th className="p-3 font-medium">项目名称</th>
                <th className="p-3 font-medium">设备分类</th>
                <th className="p-3 font-medium text-center">检查事项总数</th>
                <th className="p-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    暂无点巡检项目记录
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p, idx) => {
                  const isChecked = selectedOrderNos.includes(p.orderNo);
                  const isGreen = idx % 2 === 1;

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isGreen ? 'bg-[#eef8f2]/90 hover:bg-[#e4f4eb]' : 'bg-white hover:bg-slate-50'
                      } ${isChecked ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(p.orderNo)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-mono text-slate-800">{p.orderNo}</td>
                      <td className="p-3 font-medium text-slate-900">{p.projectName}</td>
                      <td className="p-3 text-slate-700">{p.category}</td>
                      <td className="p-3 text-center font-mono font-semibold text-slate-800">
                        {p.totalCheckItems}
                      </td>
                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleOpenDetail(p)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.orderNo)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          删除
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
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-600 bg-white">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 flex items-center justify-center border rounded font-medium transition-colors ${
                currentPage === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(9, p + 1))}
            disabled={currentPage === 9}
            className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-7 px-2 border border-slate-300 rounded bg-white text-slate-700 text-xs focus:outline-none"
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
              className="w-10 h-7 text-center border border-slate-300 rounded text-xs text-slate-800"
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6. 维保标准配置视图 (Maintenance Standards)
// =========================================================================
export { MaintenanceStandardsView as MaintenanceStandardsConfigView } from './MaintenanceStandardsView';
export { ApprovalWorkflowConfigView, WorkOrderApprovalCenterView } from './ApprovalWorkflowViews';

// =========================================================================
// 7. 故障类型配置视图 (Fault Types)
// =========================================================================
export const FaultTypesConfigView: React.FC<CommonProps> = ({ showToast }) => {
  return (
    <GenericCategoryConfigView
      moduleName="故障类型"
      configTitle="故障类型配置"
      addBtnText="添加故障类型 +"
      nameColumnLabel="故障类型名称"
      idColumnLabel="故障ID"
      initialData={[
        {
          id: 'flt-cat-1',
          name: '电气控制类故障',
          codeId: '10001',
          status: '启用',
          updateTime: '2026-09-16 14:22:40',
          isExpanded: true,
          children: [
            {
              id: 'flt-sub-1',
              name: '伺服过流报警',
              codeId: '1000101',
              status: '启用',
              updateTime: '2026-09-16 14:25:40',
            },
            {
              id: 'flt-sub-2',
              name: 'PLC通讯掉线',
              codeId: '1000102',
              status: '启用',
              updateTime: '2026-09-16 14:22:45',
            },
          ],
        },
        {
          id: 'flt-cat-2',
          name: '机械传动类故障',
          codeId: '10002',
          status: '启用',
          updateTime: '2026-09-16 14:30:25',
          isExpanded: true,
          children: [],
        },
      ]}
      showToast={showToast}
    />
  );
};

// =========================================================================
// 8. 班组管理配置视图 (Team Management)
// =========================================================================
export { TeamManagementView as TeamManagementConfigView } from './TeamManagementView';
