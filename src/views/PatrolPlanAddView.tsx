import React, { useState } from 'react';
import { PatrolPlan, PatrolPlanItemDetail } from '../types';
import {
  Home,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  X,
  Search,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  DEFAULT_PATROL_PLAN_ITEMS,
  PATROL_MODAL_ITEMS_POOL,
} from '../data/mockData';

interface PatrolPlanAddViewProps {
  initialPlan?: PatrolPlan | null;
  onSave: (plan: PatrolPlan) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PatrolPlanAddView: React.FC<PatrolPlanAddViewProps> = ({
  initialPlan,
  onSave,
  onCancel,
  showToast,
}) => {
  const isEditing = !!initialPlan;

  // Basic info form states (Screenshot 3)
  const [group, setGroup] = useState(initialPlan?.group || '巡检一组');
  const [department, setDepartment] = useState(initialPlan?.department || '生产运行部');
  const [executor, setExecutor] = useState(initialPlan?.executor || '张建国');
  const [startTime, setStartTime] = useState(
    initialPlan?.startTime || '2026-09-28 08:00'
  );
  const [endTime, setEndTime] = useState(
    initialPlan?.endTime || '2026-10-28 17:00'
  );
  const [isForever, setIsForever] = useState(initialPlan?.isForever || false);
  const [enabled, setEnabled] = useState(initialPlan?.enabled ?? true);
  const [periodVal, setPeriodVal] = useState(
    initialPlan?.period?.replace(/[^0-9]/g, '') || '7'
  );
  const [periodUnit, setPeriodUnit] = useState<'天' | '周' | '月'>(
    initialPlan?.periodUnit || '天'
  );
  const [publishHoursBefore, setPublishHoursBefore] = useState(
    initialPlan?.publishHoursBefore ?? 2
  );
  const [overdueHoursAfter, setOverdueHoursAfter] = useState(
    initialPlan?.overdueHoursAfter ?? 4
  );
  const [patrolArea, setPatrolArea] = useState(
    initialPlan?.patrolArea || '合成车间-A区'
  );

  // Patrol Content Items Table (Screenshot 3)
  const [items, setItems] = useState<PatrolPlanItemDetail[]>(
    initialPlan?.items && initialPlan.items.length > 0
      ? initialPlan.items
      : [...DEFAULT_PATROL_PLAN_ITEMS]
  );

  // Modal State (Screenshot 4: 添加项目弹窗)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFilterName, setModalFilterName] = useState('');
  const [modalFilterCategory, setModalFilterCategory] = useState('');
  const [selectedModalItemIds, setSelectedModalItemIds] = useState<string[]>(['pm-1']);

  // Modal Items Filtered
  const filteredModalItems = PATROL_MODAL_ITEMS_POOL.filter((item) => {
    const matchName = modalFilterName
      ? item.projectName.toLowerCase().includes(modalFilterName.toLowerCase())
      : true;
    const matchCat = modalFilterCategory
      ? item.category.toLowerCase().includes(modalFilterCategory.toLowerCase())
      : true;
    return matchName && matchCat;
  });

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    showToast('已移除巡检项目', 'info');
  };

  const handleToggleModalSelect = (id: string) => {
    if (selectedModalItemIds.includes(id)) {
      setSelectedModalItemIds(selectedModalItemIds.filter((i) => i !== id));
    } else {
      setSelectedModalItemIds([...selectedModalItemIds, id]);
    }
  };

  const handleSelectAllModal = (checked: boolean) => {
    if (checked) {
      setSelectedModalItemIds(filteredModalItems.map((i) => i.id));
    } else {
      setSelectedModalItemIds([]);
    }
  };

  const handleConfirmModalAdd = () => {
    const selected = PATROL_MODAL_ITEMS_POOL.filter((i) =>
      selectedModalItemIds.includes(i.id)
    );
    if (selected.length === 0) {
      showToast('请至少选择一个巡检项目', 'warning');
      return;
    }

    const existingNames = new Set(items.map((i) => i.projectName));
    const newItems: PatrolPlanItemDetail[] = selected.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderNo: items.length + idx + 1,
      projectName: item.projectName,
      category: item.category,
      totalCheckPoints: item.totalCheckPoints,
    }));

    setItems([...items, ...newItems]);
    setIsModalOpen(false);
    showToast(`已成功添加 ${newItems.length} 个巡检项目`, 'success');
  };

  // Submit Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patrolArea.trim()) {
      showToast('请选择巡检区域', 'warning');
      return;
    }
    if (items.length === 0) {
      showToast('请至少添加一个巡检内容项目', 'warning');
      return;
    }

    const planCode =
      initialPlan?.planCode ||
      `DJJH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;

    const executionTimeRange = isForever
      ? `${startTime} - 永久`
      : `${startTime} - ${endTime}`;

    const newPlan: PatrolPlan = {
      id: initialPlan?.id || `patrol-${Date.now()}`,
      planCode,
      patrolArea,
      executionTimeRange,
      approvalStatus: initialPlan?.approvalStatus || '无需审批',
      department,
      period: `${periodVal}${periodUnit}`,
      periodUnit,
      lastExecutionTime: initialPlan?.lastExecutionTime || '----',
      nextExecutionTime: initialPlan?.nextExecutionTime || `${startTime.split(' ')[0]} 08:00`,
      executor,
      enabled,
      group,
      startTime,
      endTime: isForever ? '永久' : endTime,
      isForever,
      publishHoursBefore,
      overdueHoursAfter,
      items,
      createTime: initialPlan?.createTime || new Date().toISOString().replace('T', ' ').slice(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    onSave(newPlan);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 pb-12">
      {/* 2. Top Header & Save Button (Screenshot 3) */}
      <div className="bg-white rounded border border-slate-200 p-4 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight">
            {isEditing ? '编辑计划' : '新增计划'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            配置区域巡检路线、执行班组、触发周期与检查项列表
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            保存
          </button>
        </div>
      </div>

      {/* 3. Section 1: 基本信息 (Screenshot 3) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-semibold text-slate-800">基本信息</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* * 巡检班组 */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>巡检班组:
            </label>
            <select
              required
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="">请选择巡检班组</option>
              <option value="巡检一组">巡检一组</option>
              <option value="巡检二组">巡检二组</option>
              <option value="热能巡检班">热能巡检班</option>
              <option value="水务环保组">水务环保组</option>
              <option value="储运巡检班">储运巡检班</option>
              <option value="自动化仪表班">自动化仪表班</option>
              <option value="包装保全组">包装保全组</option>
              <option value="安防巡检组">安防巡检组</option>
              <option value="强电运维班">强电运维班</option>
            </select>
          </div>

          {/* * 所属部门 */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>所属部门:
            </label>
            <select
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="">请选择所属部门</option>
              <option value="生产运行部">生产运行部</option>
              <option value="动力车间">动力车间</option>
              <option value="环保科">环保科</option>
              <option value="储运部">储运部</option>
              <option value="仪表车间">仪表车间</option>
              <option value="成品车间">成品车间</option>
              <option value="安全部">安全部</option>
              <option value="电气车间">电气车间</option>
            </select>
          </div>

          {/* * 执行人选 */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>执行人选:
            </label>
            <select
              required
              value={executor}
              onChange={(e) => setExecutor(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="">请选择执行人</option>
              <option value="张建国">张建国</option>
              <option value="刘志强">刘志强</option>
              <option value="李敏">李敏</option>
              <option value="王强">王强</option>
              <option value="陈伟">陈伟</option>
              <option value="赵刚">赵刚</option>
              <option value="孙丽">孙丽</option>
              <option value="周杰">周杰</option>
              <option value="吴秀兰">吴秀兰</option>
              <option value="郑凯">郑凯</option>
            </select>
          </div>

          {/* * 开始时间 */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>开始时间:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="请输入计划开始时间"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded pl-8 focus:outline-hidden focus:border-blue-500 font-mono"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>

          {/* * 结束时间 + 永久 */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>结束时间:
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  disabled={isForever}
                  placeholder="请输入计划结束时间"
                  value={isForever ? '永久' : endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded pl-8 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-hidden focus:border-blue-500 font-mono"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={isForever}
                  onChange={(e) => setIsForever(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-0"
                />
                <span>永久</span>
              </label>
            </div>
          </div>

          {/* * 是否启用 (Switch) */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>是否启用:
            </label>
            <div className="pt-1">
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
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>周期:
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                required
                placeholder="请输入周期"
                value={periodVal}
                onChange={(e) => setPeriodVal(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-l focus:outline-hidden focus:border-blue-500"
              />
              <select
                value={periodUnit}
                onChange={(e) => setPeriodUnit(e.target.value as any)}
                className="px-2.5 py-1.5 border border-l-0 border-slate-300 rounded-r bg-slate-50 text-slate-700 focus:outline-hidden"
              >
                <option value="天">天</option>
                <option value="周">周</option>
                <option value="月">月</option>
              </select>
            </div>
          </div>

          {/* * 发布时间 */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>发布时间:
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min={0}
                required
                placeholder="请输入任务发布时间"
                value={publishHoursBefore}
                onChange={(e) => setPublishHoursBefore(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-l focus:outline-hidden focus:border-blue-500"
              />
              <span className="px-3 py-1.5 border border-l-0 border-slate-300 rounded-r bg-slate-50 text-slate-500 whitespace-nowrap">
                小时前
              </span>
            </div>
          </div>

          {/* * 超时时间 */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>超时时间:
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min={0}
                required
                placeholder="请输入任务超时时间"
                value={overdueHoursAfter}
                onChange={(e) => setOverdueHoursAfter(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-l focus:outline-hidden focus:border-blue-500"
              />
              <span className="px-3 py-1.5 border border-l-0 border-slate-300 rounded-r bg-slate-50 text-slate-500 whitespace-nowrap">
                小时后
              </span>
            </div>
          </div>

          {/* * 巡检区域 */}
          <div className="md:col-span-3">
            <label className="block text-slate-700 font-medium mb-1.5">
              <span className="text-rose-500 mr-1">*</span>巡检区域:
            </label>
            <select
              required
              value={patrolArea}
              onChange={(e) => setPatrolArea(e.target.value)}
              className="w-full md:w-1/3 px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="">请选择巡检区域</option>
              <option value="合成车间-A区">合成车间-A区</option>
              <option value="动力站-锅炉房">动力站-锅炉房</option>
              <option value="污水处理站">污水处理站</option>
              <option value="原料罐区-B组">原料罐区-B组</option>
              <option value="中控室机房">中控室机房</option>
              <option value="包装车间-流水线">包装车间-流水线</option>
              <option value="消防泵站">消防泵站</option>
              <option value="变配电室-1#">变配电室-1#</option>
              <option value="循环水场">循环水场</option>
              <option value="空分装置区">空分装置区</option>
              <option value="苯胶分厂">苯胶分厂</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Section 2: 巡检内容 (Screenshot 3) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
            <h2 className="text-xs font-semibold text-slate-800">巡检内容</h2>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* + 添加项目 Button (Screenshot 3) */}
          <button
            type="button"
            onClick={() => {
              setSelectedModalItemIds(['pm-1']);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            添加项目
          </button>

          {/* Table Container (Screenshot 3) */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="px-4 py-2.5 w-16 text-center">序号</th>
                  <th className="px-4 py-2.5">项目名称</th>
                  <th className="px-4 py-2.5">设备分类</th>
                  <th className="px-4 py-2.5 text-center w-36">检查事项总数</th>
                  <th className="px-4 py-2.5 text-center w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 text-xs">
                      暂未添加巡检项目，请点击上方按钮添加
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="px-4 py-2.5 text-center text-slate-500 font-mono">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2.5 text-slate-800 font-medium">
                        {item.projectName}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">
                        {item.category}
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono text-slate-700">
                        {item.totalCheckPoints}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-blue-600 hover:text-rose-600 font-medium hover:underline"
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

      {/* 5. Modal: 添加项目 (Screenshot 4) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800">新增</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Filter (Screenshot 4) */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 whitespace-nowrap">项目名称:</span>
                  <input
                    type="text"
                    placeholder="请输入项目名称"
                    value={modalFilterName}
                    onChange={(e) => setModalFilterName(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 whitespace-nowrap">设备分类:</span>
                  <select
                    value={modalFilterCategory}
                    onChange={(e) => setModalFilterCategory(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">请选择设备分类</option>
                    <option value="一级/二级/三级分类">一级/二级/三级分类</option>
                    <option value="动设备/机泵类">动设备/机泵类</option>
                    <option value="电气设备/仪表类">电气设备/仪表类</option>
                    <option value="静设备/管线类">静设备/管线类</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                  >
                    <Search className="w-3 h-3" />
                    查询
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalFilterName('');
                      setModalFilterCategory('');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    重置
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Table (Screenshot 4) */}
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium sticky top-0">
                    <th className="px-3 py-2 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredModalItems.length > 0 &&
                          filteredModalItems.every((i) => selectedModalItemIds.includes(i.id))
                        }
                        onChange={(e) => handleSelectAllModal(e.target.checked)}
                        className="rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-2 w-12 text-center">序号</th>
                    <th className="px-3 py-2">项目名称</th>
                    <th className="px-3 py-2">设备分类</th>
                    <th className="px-3 py-2 text-center w-28">检查事项总数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredModalItems.map((item, index) => {
                    const isChecked = selectedModalItemIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleToggleModalSelect(item.id)}
                        className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                          index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                        }`}
                      >
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-2 text-center text-slate-500 font-mono">
                          {item.orderNo}
                        </td>
                        <td className="px-3 py-2 text-slate-800 font-medium">
                          {item.projectName}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-rose-500 font-semibold">
                          {item.totalCheckPoints}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Bottom Counter & Pagination (Screenshot 4) */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
              <div>
                当前已选 <span className="font-semibold text-rose-500">{selectedModalItemIds.length}</span> 项数据/共 {filteredModalItems.length} 项数据
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">&lt;</span>
                <span className="w-5 h-5 bg-blue-600 text-white rounded text-center leading-5 text-[11px] font-medium">
                  1
                </span>
                <span className="text-slate-400">&gt;</span>
                <span className="text-slate-500 ml-1">10条/页</span>
              </div>
            </div>

            {/* Modal Action Buttons (Screenshot 4) */}
            <div className="p-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-white">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmModalAdd}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
