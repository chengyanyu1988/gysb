import React, { useState } from 'react';
import {
  Home,
  Plus,
  Trash2,
  Search,
  RotateCcw,
  X,
  Copy,
  Calendar,
  Layers,
  CheckCircle2,
  Check,
} from 'lucide-react';
import {
  MaintenancePlan,
  MaintenancePlanEquipmentItem,
  MaintenancePlanStandardItem,
} from '../types';
import {
  INITIAL_MAINTENANCE_PLAN_EQUIPMENTS,
  INITIAL_MAINTENANCE_PLAN_STANDARDS,
} from '../data/mockData';

interface MaintenancePlanAddViewProps {
  initialPlan?: MaintenancePlan | null;
  onSave: (plan: Partial<MaintenancePlan>) => void;
  onCancel: () => void;
}

export const MaintenancePlanAddView: React.FC<MaintenancePlanAddViewProps> = ({
  initialPlan,
  onSave,
  onCancel,
}) => {
  const isEdit = !!initialPlan;

  // Basic Info Form State
  const [planName, setPlanName] = useState(initialPlan?.planName || '');
  const [department, setDepartment] = useState(initialPlan?.department || '动力车间');
  const [maintenanceGroup, setMaintenanceGroup] = useState(initialPlan?.maintenanceGroup || '机修一班');
  const [executor, setExecutor] = useState(initialPlan?.executor || '张建国');
  const [startTime, setStartTime] = useState(initialPlan?.startTime || '2026/09/18 08:00');
  const [endTime, setEndTime] = useState(initialPlan?.endTime || '2026/09/19 18:00');
  const [isForever, setIsForever] = useState(initialPlan?.isForever || false);
  const [cycleValue, setCycleValue] = useState<number>(initialPlan?.cycleValue || 30);
  const [cycleUnit, setCycleUnit] = useState<'天' | '周' | '月'>(initialPlan?.cycleUnit || '天');
  const [publishHoursBefore, setPublishHoursBefore] = useState<number>(initialPlan?.publishHoursBefore || 12);
  const [overdueHoursAfter, setOverdueHoursAfter] = useState<number>(initialPlan?.overdueHoursAfter || 24);
  const [enabled, setEnabled] = useState(initialPlan ? initialPlan.enabled : true);

  // Equipments list
  const [equipments, setEquipments] = useState<MaintenancePlanEquipmentItem[]>(
    initialPlan?.equipments && initialPlan.equipments.length > 0
      ? initialPlan.equipments
      : INITIAL_MAINTENANCE_PLAN_EQUIPMENTS.slice(0, 10)
  );

  // Standards list
  const [standards, setStandards] = useState<MaintenancePlanStandardItem[]>(
    initialPlan?.standards && initialPlan.standards.length > 0
      ? initialPlan.standards
      : INITIAL_MAINTENANCE_PLAN_STANDARDS.slice(0, 10)
  );

  // Modal 1: Add Equipments modal
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
  const [equipModalSearchName, setEquipModalSearchName] = useState('');
  const [equipModalSearchCode, setEquipModalSearchCode] = useState('');
  const [selectedEquipPoolIds, setSelectedEquipPoolIds] = useState<string[]>(['mpe-1']);

  // Modal 2: Add Standards modal
  const [isStandardModalOpen, setIsStandardModalOpen] = useState(false);
  const [standardModalSearchName, setStandardModalSearchName] = useState('');
  const [standardModalSearchCategory, setStandardModalSearchCategory] = useState('');
  const [selectedStandardPoolIds, setSelectedStandardPoolIds] = useState<string[]>(['mps-1']);

  // Filtered equipments pool
  const filteredEquipPool = INITIAL_MAINTENANCE_PLAN_EQUIPMENTS.filter((item) => {
    if (equipModalSearchName && !item.name.includes(equipModalSearchName)) return false;
    if (equipModalSearchCode && !item.code.includes(equipModalSearchCode)) return false;
    return true;
  });

  // Filtered standards pool
  const filteredStandardPool = INITIAL_MAINTENANCE_PLAN_STANDARDS.filter((item) => {
    if (standardModalSearchName && !item.name.includes(standardModalSearchName)) return false;
    if (standardModalSearchCategory && item.category !== standardModalSearchCategory) return false;
    return true;
  });

  const handleRemoveEquipment = (id: string) => {
    setEquipments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveStandard = (id: string) => {
    setStandards((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmAddEquipments = () => {
    const newlySelected = INITIAL_MAINTENANCE_PLAN_EQUIPMENTS.filter((item) =>
      selectedEquipPoolIds.includes(item.id)
    );
    // Combine without duplicate code/id
    const combined = [...equipments];
    newlySelected.forEach((item) => {
      if (!combined.some((c) => c.code === item.code)) {
        combined.push(item);
      }
    });
    setEquipments(combined);
    setIsEquipModalOpen(false);
  };

  const handleConfirmAddStandards = () => {
    const newlySelected = INITIAL_MAINTENANCE_PLAN_STANDARDS.filter((item) =>
      selectedStandardPoolIds.includes(item.id)
    );
    const combined = [...standards];
    newlySelected.forEach((item) => {
      if (!combined.some((c) => c.name === item.name)) {
        combined.push(item);
      }
    });
    setStandards(combined);
    setIsStandardModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) {
      alert('请输入计划名称');
      return;
    }

    const payload: Partial<MaintenancePlan> = {
      planName,
      department,
      maintenanceGroup,
      executor,
      startTime,
      endTime: isForever ? '永久' : endTime,
      isForever,
      cycle: `${cycleValue}${cycleUnit}`,
      cycleValue,
      cycleUnit,
      publishHoursBefore,
      overdueHoursAfter,
      enabled,
      equipments,
      standards,
      approvalStatus: initialPlan?.approvalStatus || '无需审批',
    };

    onSave(payload);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case '使用中':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            使用中
          </span>
        );
      case '闲置中':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            闲置中
          </span>
        );
      case '维修中':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-blue-600">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            维修中
          </span>
        );
      case '已报废':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            已报废
          </span>
        );
      case '已停用':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            已停用
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header Title with Save Button */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-800">{isEdit ? '编辑计划' : '新增计划'}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-xs font-medium transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
            >
              保存
            </button>
          </div>
        </div>

        {/* Section 1: 基本信息 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
            <h3 className="text-sm font-bold text-gray-800">基本信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 计划名称 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>计划名称:
              </label>
              <input
                type="text"
                placeholder="请输入计划名称"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* 所属部门 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>所属部门:
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="动力车间">动力车间</option>
                <option value="生产运行部">生产运行部</option>
                <option value="环保部">环保部</option>
                <option value="设备管理部">设备管理部</option>
                <option value="成品车间">成品车间</option>
                <option value="公用工程部">公用工程部</option>
                <option value="合成车间">合成车间</option>
                <option value="安全环保部">安全环保部</option>
                <option value="行政部">行政部</option>
                <option value="仓储物流部">仓储物流部</option>
              </select>
            </div>

            {/* 保养班组 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>保养班组:
              </label>
              <select
                value={maintenanceGroup}
                onChange={(e) => setMaintenanceGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="机修一班">机修一班</option>
                <option value="机修二班">机修二班</option>
                <option value="起重班组">起重班组</option>
                <option value="高压电工班">高压电工班</option>
                <option value="电工班">电工班</option>
                <option value="仪表班组">仪表班组</option>
                <option value="维修一组">维修一组</option>
                <option value="维修二组">维修二组</option>
                <option value="管工班组">管工班组</option>
                <option value="暖通班组">暖通班组</option>
                <option value="车辆维修组">车辆维修组</option>
              </select>
            </div>

            {/* 执行人选 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>执行人选:
              </label>
              <select
                value={executor}
                onChange={(e) => setExecutor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="张建国">张建国</option>
                <option value="李强">李强</option>
                <option value="王军">王军</option>
                <option value="赵刚">赵刚</option>
                <option value="陈静">陈静</option>
                <option value="刘洋">刘洋</option>
                <option value="张伟">张伟</option>
                <option value="孙丽">孙丽</option>
                <option value="周杰">周杰</option>
                <option value="吴刚">吴刚</option>
              </select>
            </div>

            {/* 开始时间 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>开始时间:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="请输入计划开始时间"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white pr-8"
                />
                <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
              </div>
            </div>

            {/* 结束时间 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>结束时间:
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    disabled={isForever}
                    placeholder="请输入计划结束时间"
                    value={isForever ? '永久' : endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white pr-8 disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
                </div>
                <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isForever}
                    onChange={(e) => setIsForever(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>永久</span>
                </label>
              </div>
            </div>

            {/* 周期 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>周期:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="请输入周期"
                  value={cycleValue}
                  onChange={(e) => setCycleValue(parseInt(e.target.value, 10) || 1)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <select
                  value={cycleUnit}
                  onChange={(e) => setCycleUnit(e.target.value as any)}
                  className="w-20 px-2 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="天">天</option>
                  <option value="周">周</option>
                  <option value="月">月</option>
                </select>
              </div>
            </div>

            {/* 发布时间 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>发布时间:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="请输入任务提前发布时间"
                  value={publishHoursBefore}
                  onChange={(e) => setPublishHoursBefore(parseInt(e.target.value, 10) || 0)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">小时前</span>
              </div>
            </div>

            {/* 超时时间 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>超时时间:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="请输入任务超时时间"
                  value={overdueHoursAfter}
                  onChange={(e) => setOverdueHoursAfter(parseInt(e.target.value, 10) || 0)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">小时后</span>
              </div>
            </div>

            {/* 是否启用 */}
            <div className="space-y-1.5 flex items-center gap-3 pt-2">
              <label className="text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>是否启用:
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: 添加设备 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
              <h3 className="text-sm font-bold text-gray-800">添加设备</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEquipModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              添加设备
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3">设备名称</th>
                  <th className="py-2.5 px-3">设备编码</th>
                  <th className="py-2.5 px-3">设备分类</th>
                  <th className="py-2.5 px-3">规格型号</th>
                  <th className="py-2.5 px-3">设备等级</th>
                  <th className="py-2.5 px-3">安装区域</th>
                  <th className="py-2.5 px-3">状态</th>
                  <th className="py-2.5 px-3">使用部门</th>
                  <th className="py-2.5 px-3">负责人</th>
                  <th className="py-2.5 px-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {equipments.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-400">
                      尚未添加设备，请点击上方“+ 添加设备”
                    </td>
                  </tr>
                ) : (
                  equipments.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-gray-500">{index + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-800 flex items-center gap-1.5">
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-gray-600">{item.code}</td>
                      <td className="py-2.5 px-3 text-gray-600">{item.category}</td>
                      <td className="py-2.5 px-3 text-gray-600">{item.model}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-700">{item.level}</td>
                      <td className="py-2.5 px-3 text-gray-600">{item.installArea}</td>
                      <td className="py-2.5 px-3">{renderStatusBadge(item.status)}</td>
                      <td className="py-2.5 px-3 text-gray-600">{item.department}</td>
                      <td className="py-2.5 px-3 text-gray-800">{item.manager}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipment(item.id)}
                          className="text-blue-600 hover:text-red-600 text-xs font-medium hover:underline"
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

        {/* Section 3: 维保内容 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
              <h3 className="text-sm font-bold text-gray-800">维保内容</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsStandardModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              添加标准
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">序号</th>
                  <th className="py-2.5 px-4">维保项目</th>
                  <th className="py-2.5 px-4">维保标准</th>
                  <th className="py-2.5 px-4 text-center">维保项总数</th>
                  <th className="py-2.5 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {standards.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      尚未添加维保内容标准，请点击上方“+ 添加标准”
                    </td>
                  </tr>
                ) : (
                  standards.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-gray-500">{index + 1}</td>
                      <td className="py-2.5 px-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-2.5 px-4 text-gray-600">{item.standard}</td>
                      <td className="py-2.5 px-4 text-center font-medium text-gray-700">
                        {item.itemCount}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveStandard(item.id)}
                          className="text-blue-600 hover:text-red-600 text-xs font-medium hover:underline"
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
      </form>

      {/* Modal 1: 添加设备弹窗 (Image 4) */}
      {isEquipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800">新增</h3>
              <button
                onClick={() => setIsEquipModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Filter in Modal */}
            <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">设备名称:</span>
                <input
                  type="text"
                  placeholder="请输入设备名称"
                  value={equipModalSearchName}
                  onChange={(e) => setEquipModalSearchName(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-44"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">设备编码:</span>
                <input
                  type="text"
                  placeholder="请输入设备编码"
                  value={equipModalSearchCode}
                  onChange={(e) => setEquipModalSearchCode(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-44"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {}}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                >
                  <Search className="w-3 h-3" />
                  查询
                </button>
                <button
                  onClick={() => {
                    setEquipModalSearchName('');
                    setEquipModalSearchCode('');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  重置
                </button>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredEquipPool.length > 0 &&
                          selectedEquipPoolIds.length === filteredEquipPool.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEquipPoolIds(filteredEquipPool.map((item) => item.id));
                          } else {
                            setSelectedEquipPoolIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="py-2.5 px-2 w-10 text-center">序号</th>
                    <th className="py-2.5 px-3">设备名称</th>
                    <th className="py-2.5 px-3">设备编码</th>
                    <th className="py-2.5 px-3">设备分类</th>
                    <th className="py-2.5 px-3">规格型号</th>
                    <th className="py-2.5 px-2 text-center">设备等级</th>
                    <th className="py-2.5 px-3">安装区域</th>
                    <th className="py-2.5 px-3">状态</th>
                    <th className="py-2.5 px-3">使用部门</th>
                    <th className="py-2.5 px-3">负责人</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredEquipPool.map((item, index) => {
                    const isSelected = selectedEquipPoolIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedEquipPoolIds((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((id) => id !== item.id)
                              : [...prev, item.id]
                          );
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/60' : index % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedEquipPoolIds((prev) =>
                                prev.includes(item.id)
                                  ? prev.filter((id) => id !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center text-gray-500">{index + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-gray-800">{item.name}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-600">{item.code}</td>
                        <td className="py-2.5 px-3 text-gray-600">{item.category}</td>
                        <td className="py-2.5 px-3 text-gray-600">{item.model}</td>
                        <td className="py-2.5 px-2 text-center font-semibold text-gray-700">{item.level}</td>
                        <td className="py-2.5 px-3 text-gray-600">{item.installArea}</td>
                        <td className="py-2.5 px-3">{renderStatusBadge(item.status)}</td>
                        <td className="py-2.5 px-3 text-gray-600">{item.department}</td>
                        <td className="py-2.5 px-3 text-gray-800">{item.manager}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs">
              <span className="text-gray-600">
                当前已选 <strong className="text-red-500 font-bold">{selectedEquipPoolIds.length}</strong> 项数据 / 共 {filteredEquipPool.length} 项数据
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEquipModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddEquipments}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 添加标准弹窗 (Image 5) */}
      {isStandardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800">新增</h3>
              <button
                onClick={() => setIsStandardModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Filter in Modal */}
            <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">标准名称:</span>
                <input
                  type="text"
                  placeholder="请输入标准名称"
                  value={standardModalSearchName}
                  onChange={(e) => setStandardModalSearchName(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-44"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">设备分类:</span>
                <select
                  value={standardModalSearchCategory}
                  onChange={(e) => setStandardModalSearchCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-44"
                >
                  <option value="">请选择设备分类</option>
                  <option value="反应设备/高压釜">反应设备/高压釜</option>
                  <option value="分离设备/离心机">分离设备/离心机</option>
                  <option value="输送设备/耐腐蚀泵">输送设备/耐腐蚀泵</option>
                  <option value="储存设备/压力容器">储存设备/压力容器</option>
                  <option value="动力设备/压缩机">动力设备/压缩机</option>
                  <option value="动力设备/防爆电机">动力设备/防爆电机</option>
                  <option value="起重设备/桥式起重机">起重设备/桥式起重机</option>
                  <option value="换热设备/板换">换热设备/板换</option>
                  <option value="仪表设备/控制系统">仪表设备/控制系统</option>
                  <option value="动力设备/风机">动力设备/风机</option>
                </select>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {}}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                >
                  <Search className="w-3 h-3" />
                  查询
                </button>
                <button
                  onClick={() => {
                    setStandardModalSearchName('');
                    setStandardModalSearchCategory('');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  重置
                </button>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredStandardPool.length > 0 &&
                          selectedStandardPoolIds.length === filteredStandardPool.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStandardPoolIds(filteredStandardPool.map((item) => item.id));
                          } else {
                            setSelectedStandardPoolIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="py-2.5 px-2 w-10 text-center">序号</th>
                    <th className="py-2.5 px-4">标准名称</th>
                    <th className="py-2.5 px-4">设备分类</th>
                    <th className="py-2.5 px-4 text-center">维保项总数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredStandardPool.map((item, index) => {
                    const isSelected = selectedStandardPoolIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedStandardPoolIds((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((id) => id !== item.id)
                              : [...prev, item.id]
                          );
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/60' : index % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedStandardPoolIds((prev) =>
                                prev.includes(item.id)
                                  ? prev.filter((id) => id !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center text-gray-500">{index + 1}</td>
                        <td className="py-2.5 px-4 font-medium text-gray-800">{item.name}</td>
                        <td className="py-2.5 px-4 text-gray-600">{item.category || '一级/二级/三级分类'}</td>
                        <td className="py-2.5 px-4 text-center font-bold text-red-500">
                          {item.itemCount || 12}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs">
              <span className="text-gray-600">
                当前已选 <strong className="text-red-500 font-bold">{selectedStandardPoolIds.length}</strong> 项数据 / 共 {filteredStandardPool.length} 项数据
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsStandardModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddStandards}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm"
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
