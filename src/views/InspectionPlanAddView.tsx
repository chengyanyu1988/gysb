import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Search,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Calendar,
  Save,
  ArrowLeft
} from 'lucide-react';
import {
  Equipment,
  InspectionPlan,
  InspectionPlanItem,
  EquipmentGrade,
  EquipmentStatus
} from '../types';
import {
  INITIAL_PLAN_EQUIPMENTS,
  INITIAL_INSPECTION_ITEMS,
  MODAL_AVAILABLE_EQUIPMENTS,
  MODAL_AVAILABLE_INSPECTION_ITEMS
} from '../data/mockData';

interface InspectionPlanAddViewProps {
  initialPlan?: InspectionPlan | null;
  onSave: (plan: InspectionPlan) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const InspectionPlanAddView: React.FC<InspectionPlanAddViewProps> = ({
  initialPlan,
  onSave,
  onCancel,
  showToast,
}) => {
  const isEdit = Boolean(initialPlan);

  // Form State matching Screenshot 3 & 4
  const [group, setGroup] = useState(initialPlan?.group || '动力一班');
  const [department, setDepartment] = useState(initialPlan?.department || '动力车间');
  const [executor, setExecutor] = useState(initialPlan?.executor || '赵工坊');
  const [startTime, setStartTime] = useState(initialPlan?.startTime || '2026-09-27');
  const [endTime, setEndTime] = useState(initialPlan?.endTime || '2026-10-27');
  const [isForever, setIsForever] = useState(initialPlan?.isForever || false);
  const [enabled, setEnabled] = useState(initialPlan?.enabled ?? true);
  const [periodVal, setPeriodVal] = useState(initialPlan?.period?.replace(/[^0-9]/g, '') || '7');
  const [periodUnit, setPeriodUnit] = useState<'天' | '周' | '月'>(
    initialPlan?.periodUnit || '天'
  );
  const [publishHours, setPublishHours] = useState(initialPlan?.publishHoursBefore ?? 2);
  const [overdueHours, setOverdueHours] = useState(initialPlan?.overdueHoursAfter ?? 4);

  // Added Equipments in Plan (Screenshot 3 & 4)
  const [selectedEquipments, setSelectedEquipments] = useState<Equipment[]>(
    initialPlan?.equipments || INITIAL_PLAN_EQUIPMENTS
  );

  // Added Inspection Items in Plan (Screenshot 4)
  const [selectedItems, setSelectedItems] = useState<InspectionPlanItem[]>(
    initialPlan?.inspectionItems || INITIAL_INSPECTION_ITEMS
  );

  // Modals visibility
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  // Equipment Modal state (Screenshot 5)
  const [modalEquipSearchName, setModalEquipSearchName] = useState('');
  const [modalEquipSearchCode, setModalEquipSearchCode] = useState('');
  const [modalEquipSelectedIds, setModalEquipSelectedIds] = useState<string[]>(['meq-1']);
  const [modalEquipPage, setModalEquipPage] = useState(1);

  // Item Modal state (Screenshot 6)
  const [modalItemSearchName, setModalItemSearchName] = useState('');
  const [modalItemSearchCategory, setModalItemSearchCategory] = useState('');
  const [modalItemSelectedIds, setModalItemSelectedIds] = useState<string[]>(['m-item-1']);
  const [modalItemPage, setModalItemPage] = useState(1);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    showToast(`已复制${label}: ${text}`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Remove Equipment
  const handleRemoveEquipment = (id: string, name: string) => {
    setSelectedEquipments(prev => prev.filter(e => e.id !== id));
    showToast(`已移除设备: ${name}`, 'info');
  };

  // Remove Item
  const handleRemoveItem = (id: string, name: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
    showToast(`已移除点检项目: ${name}`, 'info');
  };

  // Filtered modal equipments
  const modalFilteredEquipments = useMemo(() => {
    return MODAL_AVAILABLE_EQUIPMENTS.filter(e => {
      const matchName = !modalEquipSearchName || e.name.includes(modalEquipSearchName);
      const matchCode = !modalEquipSearchCode || e.code.includes(modalEquipSearchCode);
      return matchName && matchCode;
    });
  }, [modalEquipSearchName, modalEquipSearchCode]);

  // Filtered modal items
  const modalFilteredItems = useMemo(() => {
    return MODAL_AVAILABLE_INSPECTION_ITEMS.filter(item => {
      const matchName = !modalItemSearchName || item.name.includes(modalItemSearchName);
      const matchCat = !modalItemSearchCategory || item.category.includes(modalItemSearchCategory);
      return matchName && matchCat;
    });
  }, [modalItemSearchName, modalItemSearchCategory]);

  // Modal Confirm Add Equipments
  const handleConfirmAddEquipments = () => {
    const selectedObjs = MODAL_AVAILABLE_EQUIPMENTS.filter(e => modalEquipSelectedIds.includes(e.id));
    const existingIds = new Set(selectedEquipments.map(e => e.id));
    const toAdd = selectedObjs.filter(e => !existingIds.has(e.id));

    setSelectedEquipments(prev => [...prev, ...toAdd]);
    setShowEquipModal(false);
    showToast(`成功添加 ${toAdd.length} 台设备到计划`, 'success');
  };

  // Modal Confirm Add Items
  const handleConfirmAddItems = () => {
    const selectedObjs = MODAL_AVAILABLE_INSPECTION_ITEMS.filter(i => modalItemSelectedIds.includes(i.id));
    const existingIds = new Set(selectedItems.map(i => i.id));
    const toAdd = selectedObjs.filter(i => !existingIds.has(i.id));

    setSelectedItems(prev => [...prev, ...toAdd]);
    setShowItemModal(false);
    showToast(`成功添加 ${toAdd.length} 个点检项目`, 'success');
  };

  // Submit Plan
  const handleSubmit = () => {
    if (!group) {
      showToast('请选择点检班组', 'error');
      return;
    }
    if (!department) {
      showToast('请选择所属部门', 'error');
      return;
    }
    if (!executor) {
      showToast('请选择执行人', 'error');
      return;
    }
    if (selectedEquipments.length === 0) {
      showToast('请至少添加一台设备', 'error');
      return;
    }
    if (selectedItems.length === 0) {
      showToast('请至少添加一个点检项目', 'error');
      return;
    }

    const nowStr = '2026-09-27 ' + new Date().toTimeString().split(' ')[0];
    const planCode = initialPlan?.planCode || `DJ202609${Math.floor(1000 + Math.random() * 9000)}`;
    const primaryEquip = selectedEquipments[0];

    const newPlan: InspectionPlan = {
      id: initialPlan?.id || `plan-${Date.now()}`,
      planCode,
      equipmentName: primaryEquip.name,
      equipmentCode: primaryEquip.code,
      executionTimeRange: `${startTime} 08:00 - ${isForever ? '永久' : endTime} 17:00`,
      approvalStatus: initialPlan?.approvalStatus || '无需审批',
      department,
      period: `${periodVal}${periodUnit}`,
      periodUnit,
      lastExecutionTime: initialPlan?.lastExecutionTime || '2026/9/27 08:30',
      nextExecutionTime: '----',
      executor,
      enabled,
      group,
      startTime,
      endTime: isForever ? '永久' : endTime,
      isForever,
      publishHoursBefore: publishHours,
      overdueHoursAfter: overdueHours,
      equipments: selectedEquipments,
      inspectionItems: selectedItems,
      createTime: initialPlan?.createTime || nowStr,
      updateTime: nowStr, // Always newest for descending order
    };

    onSave(newPlan);
  };

  // Status dot renderer
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
    <div className="space-y-4 pb-20">
      {/* Top Header matching Screenshot 3 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? '编辑计划' : '新增计划'}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors"
        >
          保存
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-8 text-xs">
        {/* 1. 基本信息 Section (Screenshot 3 Top) */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">基本信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* * 点检班组 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>点检班组:
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择点检班组</option>
                <option value="动力一班">动力一班</option>
                <option value="输送运维班">输送运维班</option>
                <option value="暖通保全组">暖通保全组</option>
                <option value="数控机加组">数控机加组</option>
                <option value="行车特检班">行车特检班</option>
                <option value="环保水处理组">环保水处理组</option>
                <option value="高压电工组">高压电工组</option>
                <option value="包装自动化班">包装自动化班</option>
                <option value="储运安全组">储运安全组</option>
                <option value="机修一班">机修一班</option>
              </select>
            </div>

            {/* * 所属部门 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>所属部门:
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择所属部门</option>
                <option value="动力车间">动力车间</option>
                <option value="生产一部">生产一部</option>
                <option value="生产二部">生产二部</option>
                <option value="生产三部">生产三部</option>
                <option value="设备管理部">设备管理部</option>
                <option value="机加工车间">机加工车间</option>
                <option value="物流仓储部">物流仓储部</option>
                <option value="仓储部">仓储部</option>
                <option value="污水处理站">污水处理站</option>
                <option value="包装车间">包装车间</option>
                <option value="储运部">储运部</option>
                <option value="维修班组">维修班组</option>
              </select>
            </div>

            {/* * 执行人选 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>执行人选:
              </label>
              <select
                value={executor}
                onChange={(e) => setExecutor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择执行人</option>
                <option value="赵工坊">赵工坊</option>
                <option value="张建国">张建国</option>
                <option value="李敏">李敏</option>
                <option value="王强">王强</option>
                <option value="赵刚">赵刚</option>
                <option value="刘伟">刘伟</option>
                <option value="陈静">陈静</option>
                <option value="孙丽">孙丽</option>
                <option value="周涛">周涛</option>
              </select>
            </div>

            {/* * 开始时间 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>开始时间:
              </label>
              <input
                type="date"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden text-slate-700"
              />
            </div>

            {/* * 结束时间 + 永久 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>结束时间:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  disabled={isForever}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`flex-1 px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden text-slate-700 ${
                    isForever ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''
                  }`}
                />
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 shrink-0">
                  <input
                    type="checkbox"
                    checked={isForever}
                    onChange={(e) => setIsForever(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>永久</span>
                </label>
              </div>
            </div>

            {/* * 是否启用 Toggle Switch */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>是否启用:
              </label>
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* * 周期 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>周期:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={periodVal}
                  onChange={(e) => setPeriodVal(e.target.value)}
                  placeholder="请输入周期"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
                <select
                  value={periodUnit}
                  onChange={(e) => setPeriodUnit(e.target.value as any)}
                  className="w-20 px-2 py-2 border border-slate-200 rounded-md bg-white text-slate-700"
                >
                  <option value="天">天 ▾</option>
                  <option value="周">周 ▾</option>
                  <option value="月">月 ▾</option>
                </select>
              </div>
            </div>

            {/* * 发布时间 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>发布时间:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={publishHours}
                  onChange={(e) => setPublishHours(Number(e.target.value))}
                  placeholder="请输入任务发布时间"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
                <span className="text-slate-500 shrink-0">小时前</span>
              </div>
            </div>

            {/* * 超时时间 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>超时时间:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={overdueHours}
                  onChange={(e) => setOverdueHours(Number(e.target.value))}
                  placeholder="请输入任务超时时间"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
                <span className="text-slate-500 shrink-0">小时后</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 添加设备 Section (Screenshot 3 & 4 Middle) */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">添加设备</h3>
          </div>

          <div className="mb-3">
            <button
              type="button"
              onClick={() => {
                setModalEquipSelectedIds(['meq-1']);
                setShowEquipModal(true);
              }}
              className="px-3.5 py-1.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加设备</span>
            </button>
          </div>

          {/* Added Equipments Table */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[900px]">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="w-12 px-3 py-2.5 text-center font-medium">序号</th>
                  <th className="px-3 py-2.5 font-medium">设备名称</th>
                  <th className="px-3 py-2.5 font-medium">设备编码</th>
                  <th className="px-3 py-2.5 font-medium">设备分类</th>
                  <th className="px-3 py-2.5 font-medium">规格型号</th>
                  <th className="w-16 px-2 py-2.5 text-center font-medium">设备等级</th>
                  <th className="px-3 py-2.5 font-medium">安装区域</th>
                  <th className="w-20 px-3 py-2.5 font-medium">状态</th>
                  <th className="px-3 py-2.5 font-medium">使用部门</th>
                  <th className="px-3 py-2.5 font-medium">负责人</th>
                  <th className="w-16 px-3 py-2.5 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedEquipments.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400">
                      请点击上方 “+ 添加设备” 按钮关联点检设备
                    </td>
                  </tr>
                ) : (
                  selectedEquipments.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        idx % 2 === 1 ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 group">
                          <span>{item.name}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.name, '设备名称')}
                            className="p-0.5 text-slate-400 hover:text-blue-600 transition-colors opacity-70 group-hover:opacity-100"
                            title="复制"
                          >
                            {copiedCode === item.name ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {item.code}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {item.spec}
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <span className="font-bold font-mono text-slate-700">{item.grade}</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        {item.installArea}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {item.department}
                      </td>
                      <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                        {item.manager}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipment(item.id, item.name)}
                          className="text-blue-600 hover:text-rose-600 hover:underline font-medium"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. 添加项目 Section (Screenshot 4 Bottom) */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">添加项目</h3>
          </div>

          <div className="mb-3">
            <button
              type="button"
              onClick={() => {
                setModalItemSelectedIds(['m-item-1']);
                setShowItemModal(true);
              }}
              className="px-3.5 py-1.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加项目</span>
            </button>
          </div>

          {/* Added Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="w-12 px-3 py-2.5 text-center font-medium">序号</th>
                  <th className="px-3 py-2.5 font-medium">项目名称</th>
                  <th className="px-3 py-2.5 font-medium">设备分类</th>
                  <th className="w-36 px-3 py-2.5 font-medium text-center">检查事项总数</th>
                  <th className="w-20 px-3 py-2.5 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      请点击上方 “+ 添加项目” 按钮关联点检标准事项
                    </td>
                  </tr>
                ) : (
                  selectedItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        idx % 2 === 1 ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-700 text-center font-semibold">
                        {item.itemCount}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-blue-600 hover:text-rose-600 hover:underline font-medium"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Modal for Adding Equipment (Screenshot 5) */}
      {showEquipModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">新增</h3>
              <button
                onClick={() => setShowEquipModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search inputs */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-slate-600 shrink-0">设备名称:</span>
                <input
                  type="text"
                  value={modalEquipSearchName}
                  onChange={(e) => setModalEquipSearchName(e.target.value)}
                  placeholder="请输入设备名称"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-slate-600 shrink-0">设备编码:</span>
                <input
                  type="text"
                  value={modalEquipSearchCode}
                  onChange={(e) => setModalEquipSearchCode(e.target.value)}
                  placeholder="请输入设备编码"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalEquipPage(1)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>查询</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalEquipSearchName('');
                    setModalEquipSearchCode('');
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="w-10 px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={
                          modalFilteredEquipments.length > 0 &&
                          modalFilteredEquipments.every((e) =>
                            modalEquipSelectedIds.includes(e.id)
                          )
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setModalEquipSelectedIds(modalFilteredEquipments.map((item) => item.id));
                          } else {
                            setModalEquipSelectedIds([]);
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="w-12 px-2 py-2.5 text-center font-medium">序号</th>
                    <th className="px-3 py-2.5 font-medium">设备名称</th>
                    <th className="px-3 py-2.5 font-medium">设备编码</th>
                    <th className="px-3 py-2.5 font-medium">设备分类</th>
                    <th className="px-3 py-2.5 font-medium">规格型号</th>
                    <th className="w-16 px-2 py-2.5 text-center font-medium">设备等级</th>
                    <th className="px-3 py-2.5 font-medium">安装区域</th>
                    <th className="w-20 px-3 py-2.5 font-medium">状态</th>
                    <th className="px-3 py-2.5 font-medium">使用部门</th>
                    <th className="px-3 py-2.5 font-medium">负责人</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {modalFilteredEquipments.map((item, idx) => {
                    const isChecked = modalEquipSelectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (isChecked) {
                            setModalEquipSelectedIds(
                              modalEquipSelectedIds.filter((id) => id !== item.id)
                            );
                          } else {
                            setModalEquipSelectedIds([...modalEquipSelectedIds, item.id]);
                          }
                        }}
                        className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50/70' : ''
                        }`}
                      >
                        <td
                          className="px-3 py-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setModalEquipSelectedIds([...modalEquipSelectedIds, item.id]);
                              } else {
                                setModalEquipSelectedIds(
                                  modalEquipSelectedIds.filter((id) => id !== item.id)
                                );
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-2 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-700 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
                          {item.spec}
                        </td>
                        <td className="px-2 py-2 text-center font-bold text-slate-700">
                          {item.grade}
                        </td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                          {item.installArea}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderStatusBadge(item.status)}
                        </td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                          {item.department}
                        </td>
                        <td className="px-3 py-2 text-slate-800 font-medium whitespace-nowrap">
                          {item.manager}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer (Screenshot 5 Bottom) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                当前已选{' '}
                <span className="font-bold text-rose-500">
                  {modalEquipSelectedIds.length}
                </span>{' '}
                项数据 / 共 {modalFilteredEquipments.length} 项数据
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="p-1 border border-slate-200 rounded bg-white text-slate-400">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded text-xs font-medium">
                    1
                  </span>
                  <button className="p-1 border border-slate-200 rounded bg-white text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <select className="px-1.5 py-0.5 border border-slate-200 rounded bg-white text-slate-700 text-[11px]">
                    <option value={10}>10条/页</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEquipModal(false)}
                    className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAddEquipments}
                    className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-xs transition-colors"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal for Adding Items (Screenshot 6) */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">新增</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search inputs */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <span className="text-slate-600 shrink-0">项目名称:</span>
                <input
                  type="text"
                  value={modalItemSearchName}
                  onChange={(e) => setModalItemSearchName(e.target.value)}
                  placeholder="请输入项目名称"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <span className="text-slate-600 shrink-0">设备分类:</span>
                <select
                  value={modalItemSearchCategory}
                  onChange={(e) => setModalItemSearchCategory(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
                >
                  <option value="">请选择设备分类</option>
                  <option value="一级/二级/三级分类">一级/二级/三级分类</option>
                  <option value="动力设备">动力设备</option>
                  <option value="机械传动">机械传动</option>
                  <option value="气动系统">气动系统</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalItemPage(1)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>查询</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalItemSearchName('');
                    setModalItemSearchCategory('');
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="w-10 px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={
                          modalFilteredItems.length > 0 &&
                          modalFilteredItems.every((item) =>
                            modalItemSelectedIds.includes(item.id)
                          )
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setModalItemSelectedIds(modalFilteredItems.map((item) => item.id));
                          } else {
                            setModalItemSelectedIds([]);
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="w-12 px-2 py-2.5 text-center font-medium">序号</th>
                    <th className="px-3 py-2.5 font-medium">项目名称</th>
                    <th className="px-3 py-2.5 font-medium">设备分类</th>
                    <th className="w-32 px-3 py-2.5 font-medium text-center">检查事项总数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {modalFilteredItems.map((item, idx) => {
                    const isChecked = modalItemSelectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (isChecked) {
                            setModalItemSelectedIds(
                              modalItemSelectedIds.filter((id) => id !== item.id)
                            );
                          } else {
                            setModalItemSelectedIds([...modalItemSelectedIds, item.id]);
                          }
                        }}
                        className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50/70' : ''
                        }`}
                      >
                        <td
                          className="px-3 py-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setModalItemSelectedIds([...modalItemSelectedIds, item.id]);
                              } else {
                                setModalItemSelectedIds(
                                  modalItemSelectedIds.filter((id) => id !== item.id)
                                );
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-2 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 font-mono text-center font-bold text-rose-500">
                          {item.itemCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer (Screenshot 6 Bottom) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                当前已选{' '}
                <span className="font-bold text-rose-500">
                  {modalItemSelectedIds.length}
                </span>{' '}
                项数据 / 共 {modalFilteredItems.length} 项数据
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="p-1 border border-slate-200 rounded bg-white text-slate-400">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded text-xs font-medium">
                    1
                  </span>
                  <button className="p-1 border border-slate-200 rounded bg-white text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <select className="px-1.5 py-0.5 border border-slate-200 rounded bg-white text-slate-700 text-[11px]">
                    <option value={10}>10条/页</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowItemModal(false)}
                    className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAddItems}
                    className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-xs transition-colors"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
