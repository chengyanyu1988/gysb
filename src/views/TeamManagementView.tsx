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
  UserPlus,
  Users
} from 'lucide-react';

interface CommonProps {
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export interface TeamItem {
  id: string;
  orderNo: string; // 序号 如 2026091001, 2026091002
  teamName: string; // 班组名称
  teamType: string; // 班组类型
  description: string; // 班组描述
  members: string; // 人员 如 赵工坊, 李工坊, 张工坊, 黄工坊
  createTime: string; // 降序最新
}

export const INITIAL_TEAMS_DATA: TeamItem[] = [
  {
    id: 'team-1',
    orderNo: '2026091001',
    teamName: '电气维修班',
    teamType: '技术类 / 维修 / 电气',
    description: '负责全厂电机、配电柜、PLC 控制系统维护；具备高压电工证，擅长变频器故障排查',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-17 08:30:00',
  },
  {
    id: 'team-2',
    orderNo: '2026091002',
    teamName: '机械维修班',
    teamType: '技术类 / 维修 / 机械',
    description: '负责设备传动系统、轴承、齿轮箱、液压系统检修；持有焊工证、钳工证',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-16 14:22:00',
  },
  {
    id: 'team-3',
    orderNo: '2026091003',
    teamName: '自动化班组',
    teamType: '技术类 / 维修 / 自动化',
    description: '负责机器人、SCADA 系统、传感器网络调试；精通西门子、三菱 PLC 编程',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-15 09:15:00',
  },
  {
    id: 'team-4',
    orderNo: '2026091004',
    teamName: '备件管理班',
    teamType: '物流类 / 库存 / 仓储',
    description: '负责备件入库、出库、盘点、库存预警；熟悉 FIFO 管理规则',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-14 16:45:00',
  },
  {
    id: 'team-5',
    orderNo: '2026091005',
    teamName: '巡检运维班',
    teamType: '运维类 / 巡检 / 日常巡检',
    description: '负责每日点检、巡检任务执行；配备移动终端，实时上传数据',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-13 11:20:00',
  },
  {
    id: 'team-6',
    orderNo: '2026091005_2',
    teamName: '预防性维护班',
    teamType: '技术类 / 维护 / PM',
    description: '负责制定并执行预防性维护计划；定期润滑、校准、更换易损件',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-12 10:05:00',
  },
  {
    id: 'team-7',
    orderNo: '2026091006',
    teamName: '紧急抢修队',
    teamType: '技术类 / 抢修 / 应急响应',
    description: '24小时待命，处理突发停机事件；由电气+机械骨干组成',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-11 15:50:00',
  },
  {
    id: 'team-8',
    orderNo: '2026091008',
    teamName: '安全监督班',
    teamType: '管理类 / 安全 / 安全检查',
    description: '负责现场安全巡查、隐患整改、作业许可审批；持安全员证书',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-10 08:12:00',
  },
  {
    id: 'team-9',
    orderNo: '2026091009',
    teamName: '设备技术组',
    teamType: '管理类 / 技术 / 技术支持',
    description: '负责设备选型、技术方案评审、故障分析报告编写',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-09 13:40:00',
  },
  {
    id: 'team-10',
    orderNo: '2026091010',
    teamName: '仪表维修班',
    teamType: '技术类 / 维修 / 仪表',
    description: '负责压力表、温度传感器、流量计等仪表校准与更换',
    members: '赵工坊，李工坊，张工坊，黄工坊',
    createTime: '2026-09-08 09:25:00',
  },
];

const CANDIDATE_MEMBERS = [
  '赵工坊',
  '李工坊',
  '张工坊',
  '黄工坊',
  '王工坊',
  '钱工坊',
  '孙工坊',
  '周工坊',
  '吴工坊',
  '郑工坊'
];

export const TeamManagementView: React.FC<CommonProps> = ({ showToast }) => {
  const [teams, setTeams] = useState<TeamItem[]>(
    // 严格按最新时间降序排列
    [...INITIAL_TEAMS_DATA].sort(
      (a, b) => new Date(b.createTime.replace(/-/g, '/')).getTime() - new Date(a.createTime.replace(/-/g, '/')).getTime()
    )
  );

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [memberFilter, setMemberFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<TeamItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMembers, setFormMembers] = useState('');
  const [isSelectMemberModalOpen, setIsSelectMemberModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('5');

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      if (nameFilter && !t.teamName.includes(nameFilter.trim()) && !t.orderNo.includes(nameFilter.trim())) {
        return false;
      }
      if (memberFilter && !t.members.includes(memberFilter.trim())) return false;
      if (typeFilter && t.teamType !== typeFilter) return false;
      return true;
    });
  }, [teams, nameFilter, memberFilter, typeFilter]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(teams.map((t) => t.teamType)));
  }, [teams]);

  const handleReset = () => {
    setNameFilter('');
    setMemberFilter('');
    setTypeFilter('');
    showToast('已重置查询条件，列表已按最新时间降序排列', 'info');
  };

  const handleSearch = () => {
    showToast(`查询完成，共找到 ${filteredTeams.length} 条班组记录`, 'info');
  };

  const handleOpenAdd = () => {
    setDrawerMode('add');
    setEditingItem(null);
    setFormName('');
    setFormType('');
    setFormDescription('');
    setFormMembers('赵工坊，李工坊，张工坊，黄工坊');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: TeamItem) => {
    setDrawerMode('edit');
    setEditingItem(item);
    setFormName(item.teamName);
    setFormType(item.teamType);
    setFormDescription(item.description);
    setFormMembers(item.members);
    setIsDrawerOpen(true);
  };

  const handleDeleteOne = (id: string, name: string) => {
    if (confirm(`确定要删除班组 "${name}" 吗？`)) {
      setTeams(teams.filter((t) => t.id !== id));
      showToast(`已删除班组 "${name}"`, 'info');
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量删除的班组', 'warning');
      return;
    }
    if (confirm(`确定要批量删除已选中的 ${selectedIds.length} 个班组吗？`)) {
      setTeams(teams.filter((t) => !selectedIds.includes(t.id)));
      setSelectedIds([]);
      showToast(`已批量删除 ${selectedIds.length} 个班组`, 'success');
    }
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      showToast('请输入班组名称', 'warning');
      return;
    }
    if (!formType) {
      showToast('请选择班组类型', 'warning');
      return;
    }
    if (!formDescription.trim()) {
      showToast('请输入班组描述', 'warning');
      return;
    }
    if (!formMembers.trim()) {
      showToast('请选择班组成员', 'warning');
      return;
    }

    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    if (drawerMode === 'add') {
      const newOrderNo = `202609${String(1000 + Math.floor(Math.random() * 900))}`;
      const newRecord: TeamItem = {
        id: `team-${Date.now()}`,
        orderNo: newOrderNo,
        teamName: formName,
        teamType: formType,
        description: formDescription,
        members: formMembers,
        createTime: formatted, // 最新时间降序置顶
      };
      setTeams([newRecord, ...teams]);
      showToast(`班组 "${formName}" 已成功创建`, 'success');
    } else if (drawerMode === 'edit' && editingItem) {
      setTeams(
        teams.map((t) =>
          t.id === editingItem.id
            ? {
                ...t,
                teamName: formName,
                teamType: formType,
                description: formDescription,
                members: formMembers,
                createTime: formatted,
              }
            : t
        )
      );
      showToast(`班组 "${formName}" 已更新`, 'success');
    }

    setIsDrawerOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTeams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeams.map((t) => t.id));
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
          {/* 班组名称 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">班组名称:</span>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="请输入班组名称"
              className="h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 w-52"
            />
          </div>

          {/* 班组人员 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">班组人员:</span>
            <input
              type="text"
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              placeholder="请输入班组人员"
              className="h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 w-52"
            />
          </div>

          {/* 班组类型 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">班组类型:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
            >
              <option value="">选择班组类型</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
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
          <h2 className="text-base font-bold text-slate-800">班组列表</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            <button
              onClick={() => showToast(`已成功导出 ${filteredTeams.length} 条班组数据`, 'success')}
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
              onClick={() => showToast('已刷新班组列表', 'success')}
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
                    checked={filteredTeams.length > 0 && selectedIds.length === filteredTeams.length}
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-medium">序号</th>
                <th className="p-3 font-medium">班组名称</th>
                <th className="p-3 font-medium">班组类型</th>
                <th className="p-3 font-medium">班组描述</th>
                <th className="p-3 font-medium">人员</th>
                <th className="p-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    暂无班组记录
                  </td>
                </tr>
              ) : (
                filteredTeams.map((item, idx) => {
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
                      <td className="p-3 text-slate-700 font-mono">{item.orderNo.replace('_2', '')}</td>
                      <td className="p-3 font-medium text-slate-900">{item.teamName}</td>
                      <td className="p-3 text-slate-700">{item.teamType}</td>
                      <td className="p-3 text-slate-600 max-w-md truncate" title={item.description}>
                        {item.description}
                      </td>
                      <td className="p-3 text-slate-700">{item.members}</td>
                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteOne(item.id, item.teamName)}
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

        {/* Pagination Section (Exact as Screenshot 1) */}
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

      {/* Right Drawer: 新增班组 / 编辑班组 (Exact as Screenshot 2) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between text-xs animate-slide-left">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {drawerMode === 'add' ? '新增班组' : '编辑班组'}
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
              {/* 班组名称 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-700 font-medium">班组名称:</label>
                </div>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入班组名称"
                  className="w-full h-9 px-3 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* 班组类型 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-700 font-medium">班组类型:</label>
                </div>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择班组类型</option>
                  <option value="技术类 / 维修 / 电气">技术类 / 维修 / 电气</option>
                  <option value="技术类 / 维修 / 机械">技术类 / 维修 / 机械</option>
                  <option value="技术类 / 维修 / 自动化">技术类 / 维修 / 自动化</option>
                  <option value="物流类 / 库存 / 仓储">物流类 / 库存 / 仓储</option>
                  <option value="运维类 / 巡检 / 日常巡检">运维类 / 巡检 / 日常巡检</option>
                  <option value="技术类 / 维护 / PM">技术类 / 维护 / PM</option>
                  <option value="技术类 / 抢修 / 应急响应">技术类 / 抢修 / 应急响应</option>
                  <option value="管理类 / 安全 / 安全检查">管理类 / 安全 / 安全检查</option>
                  <option value="管理类 / 技术 / 技术支持">管理类 / 技术 / 技术支持</option>
                  <option value="技术类 / 维修 / 仪表">技术类 / 维修 / 仪表</option>
                </select>
              </div>

              {/* 班组描述 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-700 font-medium">班组描述:</label>
                </div>
                <div className="relative">
                  <textarea
                    rows={6}
                    maxLength={200}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="请输入班组描述"
                    className="w-full p-3 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                  <div className="absolute right-3 bottom-2 text-slate-400 text-[11px]">
                    {formDescription.length}/200
                  </div>
                </div>
              </div>

              {/* 班组成员 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-700 font-medium">班组成员:</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formMembers}
                    onChange={(e) => setFormMembers(e.target.value)}
                    placeholder="请选择班组成员"
                    className="w-full h-9 pl-3 pr-9 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSelectMemberModalOpen(true)}
                    className="absolute right-2 text-slate-500 hover:text-blue-600 p-1"
                    title="选择成员"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
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

      {/* Member Selector Modal */}
      {isSelectMemberModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h4 className="font-bold text-slate-800 text-xs">选择班组成员</h4>
              <button onClick={() => setIsSelectMemberModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {CANDIDATE_MEMBERS.map((mem) => {
                const isChecked = formMembers.includes(mem);
                return (
                  <label
                    key={mem}
                    className={`flex items-center gap-2 p-2 border rounded cursor-pointer text-xs ${
                      isChecked ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        let list = formMembers ? formMembers.split('，').map((s) => s.trim()).filter(Boolean) : [];
                        if (list.includes(mem)) {
                          list = list.filter((m) => m !== mem);
                        } else {
                          list.push(mem);
                        }
                        setFormMembers(list.join('，'));
                      }}
                      className="rounded text-blue-600"
                    />
                    <span>{mem}</span>
                  </label>
                );
              })}
            </div>
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsSelectMemberModalOpen(false)}
                className="px-4 py-1 bg-blue-600 text-white rounded text-xs"
              >
                确定选择
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
