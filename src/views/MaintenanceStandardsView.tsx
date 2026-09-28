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
  Printer,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export interface MaintenanceCheckItem {
  id: string;
  itemOrder: number;
  itemName: string;
  method: string;
  criteria: string;
  estimatedMinutes: number;
  materials?: string;
}

export interface MaintenanceStandard {
  id: string;
  standardNo: string;
  standardName: string;
  category: string;
  level: '日常保养' | '一级保养' | '二级保养' | '专项保养';
  cycleDays: number;
  status: '启用' | '停用';
  creator: string;
  createTime: string;
  remark?: string;
  items: MaintenanceCheckItem[];
}

interface CommonProps {
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

const DEFAULT_MAINTENANCE_ITEMS: MaintenanceCheckItem[] = [
  {
    id: 'm-item-1',
    itemOrder: 1,
    itemName: '电机轴承加注高温润滑脂',
    method: '目视/油脂加注枪',
    criteria: '注入美孚聚脲脂约30g，轴承无异响与漏油',
    estimatedMinutes: 20,
    materials: '美孚Polyrex EM润滑脂 30g',
  },
  {
    id: 'm-item-2',
    itemOrder: 2,
    itemName: '主轴同轴度与皮带张紧度检测',
    method: '皮带张力计/百分表',
    criteria: '挠度压下5mm受力50N，同轴度公差≤0.05mm',
    estimatedMinutes: 30,
    materials: '标准校准块',
  },
  {
    id: 'm-item-3',
    itemOrder: 3,
    itemName: '电机绕组相间及对地绝缘电阻测试',
    method: '1000V数字兆欧表',
    criteria: '绝缘阻值≥10MΩ，测试完成后接地放电',
    estimatedMinutes: 25,
    materials: '绝缘手套、放电棒',
  },
  {
    id: 'm-item-4',
    itemOrder: 4,
    itemName: '散热风扇及风道积尘深度清理',
    method: '工业吸尘器/压缩空气',
    criteria: '风道无积絮油垢，风扇叶片无裂纹与动平衡失调',
    estimatedMinutes: 15,
    materials: '工业吸尘器、防静电毛刷',
  },
  {
    id: 'm-item-5',
    itemOrder: 5,
    itemName: '地脚紧固螺栓与减震垫检查',
    method: '力矩扳手',
    criteria: '预紧力矩达到180N·m，减震橡胶无硬化龟裂',
    estimatedMinutes: 15,
    materials: '防松标记漆',
  },
];

export const INITIAL_MAINTENANCE_STANDARDS: MaintenanceStandard[] = [
  {
    id: 'ms-1',
    standardNo: 'WB20260928-01',
    standardName: '主轴驱动电机月度一级保养标准',
    category: '动力设备/电机',
    level: '一级保养',
    cycleDays: 30,
    status: '启用',
    creator: '张建国',
    createTime: '2026-09-28 09:30:00',
    remark: '适用于全厂产线主轴交流电机定期润滑与绝缘检测',
    items: DEFAULT_MAINTENANCE_ITEMS,
  },
  {
    id: 'ms-2',
    standardNo: 'WB20260927-04',
    standardName: '数控机床主轴及导轨季度二级维保标准',
    category: '加工设备/CNC数控机床',
    level: '二级保养',
    cycleDays: 90,
    status: '启用',
    creator: '李明华',
    createTime: '2026-09-27 15:40:22',
    remark: '包含丝杠预紧力检测与自动润滑管路排气',
    items: DEFAULT_MAINTENANCE_ITEMS.slice(0, 4),
  },
  {
    id: 'ms-3',
    standardNo: 'WB20260925-02',
    standardName: '螺杆空压机油气分离器定期更换标准',
    category: '动力设备/空压机',
    level: '专项保养',
    cycleDays: 180,
    status: '启用',
    creator: '王海滨',
    createTime: '2026-09-25 11:15:00',
    remark: '按压差传感器报警值更换油分芯及全合成油',
    items: DEFAULT_MAINTENANCE_ITEMS.slice(0, 3),
  },
  {
    id: 'ms-4',
    standardNo: 'WB20260922-09',
    standardName: '干式电力变压器半年度预防性维保',
    category: '供配电/干式变压器',
    level: '二级保养',
    cycleDays: 180,
    status: '启用',
    creator: '刘工程师',
    createTime: '2026-09-22 14:05:30',
    remark: '温控器校验、紧固母排接头及红外测温',
    items: DEFAULT_MAINTENANCE_ITEMS,
  },
  {
    id: 'ms-5',
    standardNo: 'WB20260918-03',
    standardName: '工业机器人减速机润滑油更换规程',
    category: '智能装备/工业机器人',
    level: '专项保养',
    cycleDays: 365,
    status: '启用',
    creator: '陈工',
    createTime: '2026-09-18 16:20:00',
    remark: 'RV减速机与谐波减速机专用润滑脂充填',
    items: DEFAULT_MAINTENANCE_ITEMS.slice(1, 5),
  },
  {
    id: 'ms-6',
    standardNo: 'WB20260915-05',
    standardName: '自动化皮带输送机日常维保规范',
    category: '传动设备/皮带输送机',
    level: '日常保养',
    cycleDays: 7,
    status: '启用',
    creator: '张建国',
    createTime: '2026-09-15 08:30:00',
    remark: '跑偏开关测试、滚筒清扫及轴承加油',
    items: DEFAULT_MAINTENANCE_ITEMS.slice(0, 3),
  },
];

export const MaintenanceStandardsView: React.FC<CommonProps> = ({ showToast }) => {
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
  const [standards, setStandards] = useState<MaintenanceStandard[]>(
    // 默认按创建时间最新降序排列
    [...INITIAL_MAINTENANCE_STANDARDS].sort(
      (a, b) => new Date(b.createTime.replace(/-/g, '/')).getTime() - new Date(a.createTime.replace(/-/g, '/')).getTime()
    )
  );

  const [selectedStandard, setSelectedStandard] = useState<MaintenanceStandard | null>(null);

  // Filter conditions
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formLevel, setFormLevel] = useState<'日常保养' | '一级保养' | '二级保养' | '专项保养'>('一级保养');
  const [formCycleDays, setFormCycleDays] = useState<number>(30);
  const [formStatus, setFormStatus] = useState<'启用' | '停用'>('启用');
  const [formRemark, setFormRemark] = useState('');
  const [formItems, setFormItems] = useState<MaintenanceCheckItem[]>(DEFAULT_MAINTENANCE_ITEMS);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('1');

  // Categories
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(standards.map((s) => s.category)));
  }, [standards]);

  // Filtered standards
  const filteredStandards = useMemo(() => {
    return standards.filter((s) => {
      if (nameFilter && !s.standardName.includes(nameFilter.trim()) && !s.standardNo.includes(nameFilter.trim())) {
        return false;
      }
      if (categoryFilter && s.category !== categoryFilter) return false;
      if (levelFilter && s.level !== levelFilter) return false;
      return true;
    });
  }, [standards, nameFilter, categoryFilter, levelFilter]);

  const handleReset = () => {
    setNameFilter('');
    setCategoryFilter('');
    setLevelFilter('');
    showToast('已重置筛选条件，列表按最新时间降序排列', 'info');
  };

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStandards(
      standards.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === '启用' ? '停用' : '启用';
          showToast(`维保标准 ${s.standardName} 已${nextStatus}`, nextStatus === '启用' ? 'success' : 'warning');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleDeleteOne = (id: string, name: string) => {
    if (confirm(`确定要删除维保标准 "${name}" 吗？`)) {
      setStandards(standards.filter((s) => s.id !== id));
      showToast(`已成功删除维保标准 "${name}"`, 'info');
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量删除的维保标准', 'warning');
      return;
    }
    if (confirm(`确定要批量删除已选中的 ${selectedIds.length} 项维保标准吗？`)) {
      setStandards(standards.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      showToast(`已批量删除 ${selectedIds.length} 项维保标准`, 'success');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStandards.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStandards.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormCategory('动力设备/电机');
    setFormLevel('一级保养');
    setFormCycleDays(30);
    setFormStatus('启用');
    setFormRemark('');
    setFormItems(DEFAULT_MAINTENANCE_ITEMS);
    setViewMode('add');
  };

  const handleOpenEdit = (standard: MaintenanceStandard) => {
    setSelectedStandard(standard);
    setFormName(standard.standardName);
    setFormCategory(standard.category);
    setFormLevel(standard.level);
    setFormCycleDays(standard.cycleDays);
    setFormStatus(standard.status);
    setFormRemark(standard.remark || '');
    setFormItems(standard.items && standard.items.length > 0 ? standard.items : DEFAULT_MAINTENANCE_ITEMS);
    setViewMode('edit');
  };

  const handleOpenDetail = (standard: MaintenanceStandard) => {
    setSelectedStandard(standard);
    setViewMode('detail');
  };

  const handleAddDetailRow = () => {
    const nextOrder = formItems.length + 1;
    const newRow: MaintenanceCheckItem = {
      id: `m-item-${Date.now()}`,
      itemOrder: nextOrder,
      itemName: '',
      method: '目视/工具测量',
      criteria: '',
      estimatedMinutes: 20,
      materials: '',
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
      showToast('请输入标准名称', 'warning');
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
      const newNo = `WB${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}-${String(Math.floor(10 + Math.random() * 90))}`;

      const newRecord: MaintenanceStandard = {
        id: `ms-${Date.now()}`,
        standardNo: newNo,
        standardName: formName,
        category: formCategory,
        level: formLevel,
        cycleDays: Number(formCycleDays) || 30,
        status: formStatus,
        creator: '当前用户',
        createTime: formattedNow, // 降序最新时间
        remark: formRemark,
        items: formItems,
      };

      setStandards([newRecord, ...standards]);
      showToast(`维保标准 "${formName}" 已成功创建`, 'success');
    } else if (viewMode === 'edit' && selectedStandard) {
      setStandards(
        standards.map((s) =>
          s.id === selectedStandard.id
            ? {
                ...s,
                standardName: formName,
                category: formCategory,
                level: formLevel,
                cycleDays: Number(formCycleDays) || 30,
                status: formStatus,
                remark: formRemark,
                createTime: formattedNow,
                items: formItems,
              }
            : s
        )
      );
      showToast(`维保标准 "${formName}" 已成功更新`, 'success');
    }

    setViewMode('list');
  };

  // =========================================================================
  // VIEW: 详情视图
  // =========================================================================
  if (viewMode === 'detail' && selectedStandard) {
    return (
      <div className="space-y-4 pb-16 text-xs">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800">维保标准详情</h2>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  selectedStandard.status === '启用'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {selectedStandard.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('正在调起打印维保作业指导规程...', 'info');
                }}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印维保规程</span>
              </button>
              <button
                onClick={() => handleOpenEdit(selectedStandard)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
              >
                编辑标准
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium transition-colors"
              >
                返回
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Section 1: 基本信息 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                <h3 className="text-sm font-bold text-slate-800">基本信息</h3>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-24 shrink-0">标准编号:</span>
                    <span className="text-slate-900 font-mono font-medium">{selectedStandard.standardNo}</span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-24 shrink-0">标准名称:</span>
                    <span className="text-slate-900 font-medium">{selectedStandard.standardName}</span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-24 shrink-0">适用设备分类:</span>
                    <span className="text-slate-900 font-medium">{selectedStandard.category}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white border-t border-slate-200">
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-24 shrink-0">维保级别:</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium text-xs">
                      {selectedStandard.level}
                    </span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-24 shrink-0">推荐周期:</span>
                    <span className="text-slate-900 font-medium font-mono">{selectedStandard.cycleDays} 天</span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-slate-600 w-24 shrink-0">创建时间:</span>
                    <span className="text-slate-700 font-mono">{selectedStandard.createTime}</span>
                  </div>
                </div>
                <div className="p-3 flex items-start gap-3 bg-white border-t border-slate-200">
                  <span className="text-slate-600 w-24 shrink-0 pt-0.5">标准说明与备注:</span>
                  <span className="text-slate-700 leading-relaxed">{selectedStandard.remark || '无特殊说明'}</span>
                </div>
              </div>
            </div>

            {/* Section 2: 维保项目明细 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                  <h3 className="text-sm font-bold text-slate-800">
                    维保项目作业明细（共 {selectedStandard.items?.length || 0} 项）
                  </h3>
                </div>
                <span className="text-slate-500 text-xs">
                  预计总耗时：
                  <span className="font-semibold font-mono text-blue-600">
                    {selectedStandard.items?.reduce((sum, item) => sum + (item.estimatedMinutes || 0), 0)}
                  </span>{' '}
                  分钟
                </span>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                    <tr>
                      <th className="p-3 w-14 text-center">序号</th>
                      <th className="p-3 w-48 font-medium">维保作业项目</th>
                      <th className="p-3 w-40 font-medium">作业/检测方法</th>
                      <th className="p-3 font-medium">技术标准及判定准则</th>
                      <th className="p-3 w-48 font-medium">耗材与工具要求</th>
                      <th className="p-3 w-24 text-center font-medium">工时(分)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedStandard.items && selectedStandard.items.length > 0 ? (
                      selectedStandard.items.map((item, idx) => {
                        const isGreen = idx % 2 === 1;
                        return (
                          <tr key={item.id || idx} className={`transition-colors ${isGreen ? 'bg-[#eef8f2]/90' : 'bg-white'}`}>
                            <td className="p-3 text-center text-slate-600 font-mono">{idx + 1}</td>
                            <td className="p-3 font-medium text-slate-900">{item.itemName}</td>
                            <td className="p-3 text-slate-700">{item.method}</td>
                            <td className="p-3 text-slate-700 leading-relaxed">{item.criteria}</td>
                            <td className="p-3 text-slate-600">{item.materials || '--'}</td>
                            <td className="p-3 text-center font-mono font-medium text-slate-800">
                              {item.estimatedMinutes}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          暂无维保项目明细
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 新增 / 编辑模式
  // =========================================================================
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="space-y-4 pb-16 text-xs">
        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">
              {viewMode === 'edit' ? '编辑维保标准' : '新增维保标准'}
            </h2>
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              返回
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Section 1: 基本信息 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                <h3 className="text-sm font-bold text-slate-800">基本信息</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-slate-700 whitespace-nowrap font-medium w-24">标准名称:</span>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="请输入维保标准名称（如：主电机月度一级保养）"
                    className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-slate-700 whitespace-nowrap font-medium w-24">设备分类:</span>
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
                    <option value="动力设备/电机">动力设备/电机</option>
                    <option value="加工设备/CNC数控机床">加工设备/CNC数控机床</option>
                    <option value="动力设备/空压机">动力设备/空压机</option>
                    <option value="供配电/干式变压器">供配电/干式变压器</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-slate-700 whitespace-nowrap font-medium w-24">维保级别:</span>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="日常保养">日常保养</option>
                    <option value="一级保养">一级保养</option>
                    <option value="二级保养">二级保养</option>
                    <option value="专项保养">专项保养</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-slate-700 whitespace-nowrap font-medium w-24">维保周期(天):</span>
                  <input
                    type="number"
                    min={1}
                    value={formCycleDays}
                    onChange={(e) => setFormCycleDays(Number(e.target.value))}
                    className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-700 whitespace-nowrap font-medium w-24 ml-3">启用状态:</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formStatus === '启用'}
                        onChange={() => setFormStatus('启用')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>启用</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formStatus === '停用'}
                        onChange={() => setFormStatus('停用')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>停用</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:col-span-2">
                  <span className="text-slate-700 whitespace-nowrap font-medium w-24 pt-2 ml-3">备注说明:</span>
                  <div className="flex-1 relative">
                    <textarea
                      rows={3}
                      maxLength={200}
                      value={formRemark}
                      onChange={(e) => setFormRemark(e.target.value)}
                      placeholder="请输入维保标准详细说明"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute right-2 bottom-2 text-slate-400 text-[11px]">
                      {formRemark.length}/200
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: 维保项目明细 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
                  <h3 className="text-sm font-bold text-slate-800">维保项目作业明细</h3>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                    <tr>
                      <th className="p-3 w-12 text-center">序号</th>
                      <th className="p-3 w-48 font-medium">维保项目名称*</th>
                      <th className="p-3 w-36 font-medium">作业/检测方法</th>
                      <th className="p-3 font-medium">判定准则与技术要求</th>
                      <th className="p-3 w-40 font-medium">耗材与工具要求</th>
                      <th className="p-3 w-20 text-center font-medium">工时(分)</th>
                      <th className="p-3 w-16 text-center font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formItems.map((item, idx) => {
                      const isGreen = idx % 2 === 1;
                      return (
                        <tr key={item.id || idx} className={`transition-colors ${isGreen ? 'bg-[#eef8f2]/90' : 'bg-white'}`}>
                          <td className="p-3 text-center text-slate-600 font-mono">{idx + 1}</td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormItems(formItems.map((fi) => (fi.id === item.id ? { ...fi, itemName: val } : fi)));
                              }}
                              placeholder="如：轴承润滑加注"
                              className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs text-slate-800 font-medium focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.method}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormItems(formItems.map((fi) => (fi.id === item.id ? { ...fi, method: val } : fi)));
                              }}
                              placeholder="目视/仪器测试"
                              className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.criteria}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormItems(formItems.map((fi) => (fi.id === item.id ? { ...fi, criteria: val } : fi)));
                              }}
                              placeholder="如：阻值≥10MΩ"
                              className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.materials || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormItems(formItems.map((fi) => (fi.id === item.id ? { ...fi, materials: val } : fi)));
                              }}
                              placeholder="耗材工具说明"
                              className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={1}
                              value={item.estimatedMinutes}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFormItems(formItems.map((fi) => (fi.id === item.id ? { ...fi, estimatedMinutes: val } : fi)));
                              }}
                              className="w-full h-7 px-1 text-center border border-slate-300 rounded bg-white text-xs text-slate-800 font-mono focus:ring-1 focus:ring-blue-500"
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

              <div className="mt-3">
                <button
                  onClick={handleAddDetailRow}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
                >
                  + 添加一行
                </button>
              </div>
            </div>

            {/* Bottom actions */}
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

  // =========================================================================
  // VIEW: 列表视图
  // =========================================================================
  return (
    <div className="space-y-3 pb-16 text-xs select-none">
      {/* Filter Card */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">标准名称:</span>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="请输入标准名称或编号"
              className="h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 w-52"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">设备分类:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
            >
              <option value="">全部设备分类</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">维保级别:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
            >
              <option value="">全部级别</option>
              <option value="日常保养">日常保养</option>
              <option value="一级保养">一级保养</option>
              <option value="二级保养">二级保养</option>
              <option value="专项保养">专项保养</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => showToast(`查询完成，共找到 ${filteredStandards.length} 条维保标准`, 'info')}
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
        {/* Top bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-800">维保标准列表</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            <button
              onClick={() => showToast(`已成功导出 ${filteredStandards.length} 条维保标准规程`, 'success')}
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
              onClick={() => showToast('已刷新维保标准列表', 'success')}
              title="刷新"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => showToast('列自适应已设置', 'info')}
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
                    checked={filteredStandards.length > 0 && selectedIds.length === filteredStandards.length}
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-medium">序号</th>
                <th className="p-3 font-medium">标准编号</th>
                <th className="p-3 font-medium">标准名称</th>
                <th className="p-3 font-medium">设备分类</th>
                <th className="p-3 font-medium text-center">维保级别</th>
                <th className="p-3 font-medium text-center">周期(天)</th>
                <th className="p-3 font-medium text-center">维保项目数</th>
                <th className="p-3 font-medium text-center">状态</th>
                <th className="p-3 font-medium">创建时间</th>
                <th className="p-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStandards.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    暂无维保标准记录
                  </td>
                </tr>
              ) : (
                filteredStandards.map((item, idx) => {
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
                      <td className="p-3 text-slate-600 font-mono">{idx + 1}</td>
                      <td className="p-3 font-mono font-medium text-slate-800">{item.standardNo}</td>
                      <td className="p-3 font-medium text-slate-900">{item.standardName}</td>
                      <td className="p-3 text-slate-700">{item.category}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium text-[11px]">
                          {item.level}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-800 font-medium">{item.cycleDays}</td>
                      <td className="p-3 text-center font-mono font-semibold text-blue-600">
                        {item.items?.length || 0}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={(e) => handleToggleStatus(item.id, e)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.status === '启用' ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              item.status === '启用' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{item.createTime}</td>
                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => handleDeleteOne(item.id, item.standardName)}
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

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-600 bg-white">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5].map((p) => (
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
            onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
            disabled={currentPage === 5}
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
