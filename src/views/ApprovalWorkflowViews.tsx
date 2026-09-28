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
  Check,
  Menu,
  FileCheck,
  Clock,
  CheckCircle2,
  Radio
} from 'lucide-react';

interface CommonProps {
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export interface ApprovalFlowNode {
  id: string;
  nodeIndexName: string; // 如 第一审批节点, 第二审批节点, 第三审批节点
  approver: string; // 如 请选择审批人 / 部门主管 / 李科长
}

export interface ApprovalFlowItem {
  id: string;
  orderNo: number; // 序号 1, 2, 3...
  flowName: string; // 审批流名称
  category: string; // 审批类别
  creator: string; // 创建人
  createTime: string; // 2026/9/17 8:30 (最新降序)
  isEnabled: boolean; // 状态 开关
  nodes: ApprovalFlowNode[];
}

export const INITIAL_APPROVAL_FLOWS_DATA: ApprovalFlowItem[] = [
  {
    id: 'flow-1',
    orderNo: 1,
    flowName: '设备维修申请流程',
    category: '维修类/紧急抢修/一级审批',
    creator: '李伟明',
    createTime: '2026/9/17 8:30',
    isEnabled: true,
    nodes: [
      { id: 'node-1-1', nodeIndexName: '第一审批节点', approver: '车间设备主管' },
    ],
  },
  {
    id: 'flow-2',
    orderNo: 2,
    flowName: '备件采购审批流',
    category: '采购类/常规采购/二级审批',
    creator: '王芳',
    createTime: '2026/9/16 14:22',
    isEnabled: true,
    nodes: [
      { id: 'node-2-1', nodeIndexName: '第一审批节点', approver: '采购部主管' },
      { id: 'node-2-2', nodeIndexName: '第二审批节点', approver: '财务部经理' },
    ],
  },
  {
    id: 'flow-3',
    orderNo: 3,
    flowName: '年度保养计划审批',
    category: '维护类/预防性维护/一级审批',
    creator: '陈建国',
    createTime: '2026/9/15 9:15',
    isEnabled: true,
    nodes: [
      { id: 'node-3-1', nodeIndexName: '第一审批节点', approver: '设备动力科长' },
    ],
  },
  {
    id: 'flow-4',
    orderNo: 4,
    flowName: '生产线故障报修',
    category: '维修类/普通维修/一级审批',
    creator: '刘洋',
    createTime: '2026/9/14 16:45',
    isEnabled: true,
    nodes: [
      { id: 'node-4-1', nodeIndexName: '第一审批节点', approver: '值班工程师' },
    ],
  },
  {
    id: 'flow-5',
    orderNo: 5,
    flowName: '关键部件更换申请',
    category: '维修类/备件更换/二级审批',
    creator: '孙丽',
    createTime: '2026/9/13 11:20',
    isEnabled: true,
    nodes: [
      { id: 'node-5-1', nodeIndexName: '第一审批节点', approver: '车间主任' },
      { id: 'node-5-2', nodeIndexName: '第二审批节点', approver: '设备科长' },
    ],
  },
  {
    id: 'flow-6',
    orderNo: 6,
    flowName: '季度巡检报告审批',
    category: '维护类/预防性维护/一级审批',
    creator: '赵敏',
    createTime: '2026/9/12 10:05',
    isEnabled: true,
    nodes: [
      { id: 'node-6-1', nodeIndexName: '第一审批节点', approver: '巡检组长' },
    ],
  },
  {
    id: 'flow-7',
    orderNo: 7,
    flowName: '实验室设备维修',
    category: '维修类/普通维修/一级审批',
    creator: '张伟',
    createTime: '2026/9/11 15:50',
    isEnabled: true,
    nodes: [
      { id: 'node-7-1', nodeIndexName: '第一审批节点', approver: '品保实验室主管' },
    ],
  },
  {
    id: 'flow-8',
    orderNo: 8,
    flowName: '大宗原料采购流程',
    category: '采购类/紧急采购/三级审批',
    creator: '周敏',
    createTime: '2026/9/10 8:12',
    isEnabled: true,
    nodes: [
      { id: 'node-8-1', nodeIndexName: '第一审批节点', approver: '采购经理' },
      { id: 'node-8-2', nodeIndexName: '第二审批节点', approver: '财务总监' },
      { id: 'node-8-3', nodeIndexName: '第三审批节点', approver: '分管副总' },
    ],
  },
  {
    id: 'flow-9',
    orderNo: 9,
    flowName: '车间空调维保申请',
    category: '维护类/预防性维护/一级审批',
    creator: '吴强',
    createTime: '2026/9/9 13:40',
    isEnabled: true,
    nodes: [
      { id: 'node-9-1', nodeIndexName: '第一审批节点', approver: '动力站长' },
    ],
  },
  {
    id: 'flow-10',
    orderNo: 10,
    flowName: '特种设备年检审批',
    category: '合规类/年检审核/二级审批',
    creator: '郑华',
    createTime: '2026/9/8 9:25',
    isEnabled: true,
    nodes: [
      { id: 'node-10-1', nodeIndexName: '第一审批节点', approver: '安全总监' },
      { id: 'node-10-2', nodeIndexName: '第二审批节点', approver: '生产厂长' },
    ],
  },
];

const NODE_NAMES = ['第一审批节点', '第二审批节点', '第三审批节点', '第四审批节点', '第五审批节点'];

export const ApprovalWorkflowConfigView: React.FC<CommonProps> = ({ showToast }) => {
  const [flows, setStreams] = useState<ApprovalFlowItem[]>(
    // 严格按创建时间最新降序排列
    [...INITIAL_APPROVAL_FLOWS_DATA].sort(
      (a, b) => new Date(b.createTime.replace(/\//g, '-')).getTime() - new Date(a.createTime.replace(/\//g, '-')).getTime()
    )
  );

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer modal
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [editingFlow, setEditingFlow] = useState<ApprovalFlowItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formNodes, setFormNodes] = useState<ApprovalFlowNode[]>([
    { id: 'node-init-1', nodeIndexName: '第一审批节点', approver: '' },
    { id: 'node-init-2', nodeIndexName: '第二审批节点', approver: '' },
  ]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('5');

  const filteredFlows = useMemo(() => {
    return flows.filter((f) => {
      if (nameFilter && !f.flowName.includes(nameFilter.trim())) return false;
      if (categoryFilter && f.category !== categoryFilter) return false;
      return true;
    });
  }, [flows, nameFilter, categoryFilter]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(flows.map((f) => f.category)));
  }, [flows]);

  const handleReset = () => {
    setNameFilter('');
    setCategoryFilter('');
    showToast('查询条件已重置，列表按最新时间降序排列', 'info');
  };

  const handleSearch = () => {
    showToast(`查询完成，共找到 ${filteredFlows.length} 条审批流`, 'info');
  };

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStreams(
      flows.map((f) => {
        if (f.id === id) {
          const next = !f.isEnabled;
          showToast(`审批流 "${f.flowName}" 状态已切换为: ${next ? '启用' : '停用'}`, next ? 'success' : 'warning');
          return { ...f, isEnabled: next };
        }
        return f;
      })
    );
  };

  const handleOpenAdd = () => {
    setDrawerMode('add');
    setEditingFlow(null);
    setFormName('');
    setFormCategory('');
    setFormEnabled(true);
    setFormNodes([
      { id: `node-${Date.now()}-1`, nodeIndexName: '第一审批节点', approver: '' },
      { id: `node-${Date.now()}-2`, nodeIndexName: '第二审批节点', approver: '' },
    ]);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: ApprovalFlowItem) => {
    setDrawerMode('edit');
    setEditingFlow(item);
    setFormName(item.flowName);
    setFormCategory(item.category);
    setFormEnabled(item.isEnabled);
    setFormNodes(
      item.nodes && item.nodes.length > 0
        ? item.nodes
        : [
            { id: `node-${Date.now()}-1`, nodeIndexName: '第一审批节点', approver: '' },
            { id: `node-${Date.now()}-2`, nodeIndexName: '第二审批节点', approver: '' },
          ]
    );
    setIsDrawerOpen(true);
  };

  const handleDeleteOne = (id: string, name: string) => {
    if (confirm(`确定要删除审批流 "${name}" 吗？`)) {
      setStreams(flows.filter((f) => f.id !== id));
      showToast(`已删除审批流 "${name}"`, 'info');
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量删除的审批流', 'warning');
      return;
    }
    if (confirm(`确定要批量删除已选中的 ${selectedIds.length} 个审批流吗？`)) {
      setStreams(flows.filter((f) => !selectedIds.includes(f.id)));
      setSelectedIds([]);
      showToast(`已批量删除 ${selectedIds.length} 个审批流`, 'success');
    }
  };

  const handleAddNode = () => {
    if (formNodes.length >= 5) {
      showToast('最多可配置 5 级审批节点', 'warning');
      return;
    }
    const nextIdx = formNodes.length;
    const newNode: ApprovalFlowNode = {
      id: `node-${Date.now()}`,
      nodeIndexName: NODE_NAMES[nextIdx] || `第${nextIdx + 1}审批节点`,
      approver: '',
    };
    setFormNodes([...formNodes, newNode]);
  };

  const handleRemoveNode = (id: string) => {
    if (formNodes.length <= 1) {
      showToast('至少需要保留 1 个审批节点', 'warning');
      return;
    }
    const updated = formNodes
      .filter((n) => n.id !== id)
      .map((node, idx) => ({ ...node, nodeIndexName: NODE_NAMES[idx] || `第${idx + 1}审批节点` }));
    setFormNodes(updated);
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      showToast('请输入审批流名称', 'warning');
      return;
    }
    if (!formCategory) {
      showToast('请选择审批类别', 'warning');
      return;
    }

    const now = new Date();
    const formatted = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (drawerMode === 'add') {
      const nextOrder = flows.length + 1;
      const newRecord: ApprovalFlowItem = {
        id: `flow-${Date.now()}`,
        orderNo: nextOrder,
        flowName: formName,
        category: formCategory,
        creator: '张小刀',
        createTime: formatted, // 降序最新时间置顶
        isEnabled: formEnabled,
        nodes: formNodes,
      };
      setStreams([newRecord, ...flows]);
      showToast(`审批流 "${formName}" 已成功创建`, 'success');
    } else if (drawerMode === 'edit' && editingFlow) {
      setStreams(
        flows.map((f) =>
          f.id === editingFlow.id
            ? {
                ...f,
                flowName: formName,
                category: formCategory,
                isEnabled: formEnabled,
                createTime: formatted,
                nodes: formNodes,
              }
            : f
        )
      );
      showToast(`审批流 "${formName}" 已更新`, 'success');
    }

    setIsDrawerOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFlows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFlows.map((f) => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-3 pb-16 text-xs select-none relative">
      {/* Filter Card */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* 审批流名称 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">审批流名称:</span>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="请输入审批流名称"
              className="h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 w-52"
            />
          </div>

          {/* 审批类别 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">审批类别:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
            >
              <option value="">选择审批类别</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
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
          <h2 className="text-base font-bold text-slate-800">审批流列表</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            <button
              onClick={() => showToast(`已成功导出 ${filteredFlows.length} 条审批流配置`, 'success')}
              className="h-8 px-3.5 bg-[#ff9800] hover:bg-[#f57c00] text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className="h-8 px-3.5 border border-rose-300 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除</span>
            </button>

            <button
              onClick={() => showToast('已刷新审批流列表', 'success')}
              title="刷新"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => showToast('列设置已保存', 'info')}
              title="设置"
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
                    checked={filteredFlows.length > 0 && selectedIds.length === filteredFlows.length}
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-medium">序号</th>
                <th className="p-3 font-medium">审批流名称</th>
                <th className="p-3 font-medium">审批类别</th>
                <th className="p-3 font-medium">创建人</th>
                <th className="p-3 font-medium">创建时间</th>
                <th className="p-3 font-medium text-center">状态</th>
                <th className="p-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFlows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    暂无审批流记录
                  </td>
                </tr>
              ) : (
                filteredFlows.map((item, idx) => {
                  const isChecked = selectedIds.includes(item.id);
                  const isGreen = idx % 2 === 1;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isGreen ? 'bg-[#eef8f2]/90 hover:bg-[#e4f4eb]' : 'bg-white hover:bg-slate-50'
                      } ${isChecked ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-slate-700 font-mono">{idx + 1}</td>
                      <td className="p-3 font-medium text-slate-900">{item.flowName}</td>
                      <td className="p-3 text-slate-700">{item.category}</td>
                      <td className="p-3 text-slate-800">{item.creator}</td>
                      <td className="p-3 font-mono text-slate-600">{item.createTime}</td>
                      <td className="p-3 text-center">
                        {/* Blue toggle switch as in Screenshot 3 */}
                        <button
                          onClick={(e) => handleToggleStatus(item.id, e)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.isEnabled ? 'bg-[#1890ff]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteOne(item.id, item.flowName)}
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

        {/* Pagination Section (Exact as Screenshot 3) */}
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

      {/* Right Drawer: 编辑审批流 / 新增审批流 (Exact as Screenshot 4) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between text-xs animate-slide-left">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {drawerMode === 'add' ? '新增审批流' : '编辑审批流'}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* 审批流名称 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-700 font-medium">审批流名称:</label>
                </div>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入审批流名称"
                  className="w-full h-9 px-3 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* 审批类别 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-700 font-medium">审批类别:</label>
                </div>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择审批类别</option>
                  <option value="维修类/紧急抢修/一级审批">维修类/紧急抢修/一级审批</option>
                  <option value="采购类/常规采购/二级审批">采购类/常规采购/二级审批</option>
                  <option value="维护类/预防性维护/一级审批">维护类/预防性维护/一级审批</option>
                  <option value="维修类/普通维修/一级审批">维修类/普通维修/一级审批</option>
                  <option value="维修类/备件更换/二级审批">维修类/备件更换/二级审批</option>
                  <option value="采购类/紧急采购/三级审批">采购类/紧急采购/三级审批</option>
                  <option value="合规类/年检审核/二级审批">合规类/年检审核/二级审批</option>
                </select>
              </div>

              {/* 默认启用 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-700 font-medium">默认启用:</label>
                </div>
                <button
                  type="button"
                  onClick={() => setFormEnabled(!formEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formEnabled ? 'bg-[#1890ff]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 审批节点配置 */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-rose-500 font-bold">*</span>
                    <label className="text-slate-800 font-medium">
                      审批节点配置（最多可配置5级审批）
                    </label>
                  </div>
                </div>

                {/* + 新增节点 Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleAddNode}
                    className="px-3 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增节点</span>
                  </button>
                </div>

                {/* Nodes Container (Light green background as in Screenshot 4) */}
                <div className="bg-[#f0f8f4] p-3 rounded space-y-2.5 border border-[#d2ecd9]">
                  {formNodes.map((node, idx) => (
                    <div
                      key={node.id || idx}
                      className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      {/* Left radio / node title */}
                      <div className="flex items-center gap-2">
                        {/* Blue radio bullseye icon */}
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="font-medium text-slate-800 whitespace-nowrap">
                          {node.nodeIndexName}
                        </span>
                      </div>

                      {/* Middle: 审批人 + Input with + icon */}
                      <div className="flex items-center gap-2 flex-1 max-w-sm">
                        <span className="text-slate-600 whitespace-nowrap">审批人</span>
                        <div className="relative flex items-center flex-1">
                          <input
                            type="text"
                            value={node.approver}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormNodes(
                                formNodes.map((n) => (n.id === node.id ? { ...n, approver: val } : n))
                              );
                            }}
                            placeholder="请选择审批人"
                            className="w-full h-8 pl-3 pr-8 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const approverCandidates = ['部门主管', '李科长(设备科)', '王仓管', '孙经理(采购部)', '钱总工'];
                              const nextApprover = approverCandidates[idx % approverCandidates.length];
                              setFormNodes(
                                formNodes.map((n) => (n.id === node.id ? { ...n, approver: nextApprover } : n))
                              );
                            }}
                            className="absolute right-2 text-slate-400 hover:text-blue-600 p-0.5"
                            title="选择审批人"
                          >
                            <Plus className="w-3.5 h-3.5 border border-slate-400 rounded-xs" />
                          </button>
                        </div>
                      </div>

                      {/* Right icons: reorder & delete */}
                      <div className="flex items-center gap-2">
                        <button type="button" className="text-blue-600 p-1 cursor-grab" title="拖动排序">
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveNode(node.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="删除节点"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-1.5 border border-slate-300 text-slate-700 hover:bg-white rounded text-xs font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveForm}
                className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
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

export { WorkOrderApprovalCenterView } from './WorkOrderApprovalView';
