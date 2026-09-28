import React, { useState } from 'react';
import {
  Home,
  Plus,
  Trash2,
  Search,
  RotateCcw,
  X,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FaultReportItem, FaultExperienceItem } from '../types';
import { INITIAL_FAULT_EXPERIENCES, INITIAL_EQUIPMENT_LIST } from '../data/mockData';

interface FaultReportAddViewProps {
  onSave: (report: Partial<FaultReportItem>) => void;
  onCancel: () => void;
}

export const FaultReportAddView: React.FC<FaultReportAddViewProps> = ({
  onSave,
  onCancel,
}) => {
  // Form State
  const [equipmentCode, setEquipmentCode] = useState('EQ-KYJ-002');
  const [equipmentName, setEquipmentName] = useState('2#螺杆式空压机');
  const [faultType, setFaultType] = useState<'电气故障' | '机械故障' | '仪表故障' | '外观破损' | '其他'>('电气故障');
  const [faultTime, setFaultTime] = useState('2026/09/27 22:30');
  const [isUrgent, setIsUrgent] = useState(false);
  const [faultDescription, setFaultDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Experience Library Modal State
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expCategoryFilter, setExpCategoryFilter] = useState('');
  const [expDescFilter, setExpDescFilter] = useState('');
  const [selectedExpId, setSelectedExpId] = useState<string>('exp-1');

  // Equipment Picker Modal State
  const [isEquipPickerOpen, setIsEquipPickerOpen] = useState(false);
  const [equipSearch, setEquipSearch] = useState('');

  // Filtered Experiences
  const filteredExperiences = INITIAL_FAULT_EXPERIENCES.filter((exp) => {
    if (expCategoryFilter && exp.category !== expCategoryFilter) return false;
    if (expDescFilter && !exp.description.includes(expDescFilter)) return false;
    return true;
  });

  const handleSelectExpConfirm = () => {
    const chosen = INITIAL_FAULT_EXPERIENCES.find((e) => e.id === selectedExpId);
    if (chosen) {
      setFaultDescription(chosen.description);
    }
    setIsExpModalOpen(false);
  };

  const handleUploadImage = () => {
    const samplePool = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80',
    ];
    if (uploadedImages.length < 10) {
      setUploadedImages((prev) => [...prev, samplePool[prev.length % samplePool.length]]);
    } else {
      alert('最多只支持上传10张图片');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentCode || !equipmentName) {
      alert('请选择或输入设备信息');
      return;
    }
    if (!faultDescription.trim()) {
      alert('请输入故障描述');
      return;
    }

    const payload: Partial<FaultReportItem> = {
      equipmentCode,
      equipmentName,
      faultType,
      faultTime,
      isUrgent,
      urgencyLevel: isUrgent ? '紧急' : '正常',
      faultDescription,
      attachments: uploadedImages,
      reporter: '张小刀',
      reporterPhone: '13800138000',
      handler: '待指派',
      status: '待处理',
    };

    onSave(payload);
  };

  return (
    <div className="space-y-4 pb-16">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header Title with Save Button */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-800">新增故障报修</h2>
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

        {/* Section 1: 设备信息 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
            <h3 className="text-sm font-bold text-gray-800">设备信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 故障编码 / 设备编码 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>故障编码:
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="请选择故障编码"
                  value={equipmentCode}
                  onChange={(e) => setEquipmentCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white pr-8 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setIsEquipPickerOpen(true)}
                  title="选择设备"
                  className="absolute right-2 text-gray-400 hover:text-blue-600 p-0.5"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 设备名称 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>设备名称:
              </label>
              <input
                type="text"
                placeholder="请输入计划名称"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: 故障内容 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
            <h3 className="text-sm font-bold text-gray-800">故障内容</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 故障类型 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>故障类型:
              </label>
              <select
                value={faultType}
                onChange={(e) => setFaultType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
              >
                <option value="电气故障">电气故障</option>
                <option value="机械故障">机械故障</option>
                <option value="仪表故障">仪表故障</option>
                <option value="外观破损">外观破损</option>
                <option value="其他">其他</option>
              </select>
            </div>

            {/* 故障时间 + 紧急 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>故障时间:
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="请选择故障时间"
                    value={faultTime}
                    onChange={(e) => setFaultTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white pr-8 font-mono"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
                </div>
                <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span>紧急</span>
                </label>
              </div>
            </div>
          </div>

          {/* 故障描述 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>故障描述:
              </label>
              <button
                type="button"
                onClick={() => setIsExpModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline flex items-center gap-1"
              >
                + 从经验库选择
              </button>
            </div>
            <div className="relative">
              <textarea
                rows={4}
                maxLength={200}
                placeholder="请进行故障描述"
                value={faultDescription}
                onChange={(e) => setFaultDescription(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white leading-relaxed resize-none"
              />
              <span className="absolute right-3 bottom-2.5 text-xs text-gray-400 select-none">
                {faultDescription.length}/200
              </span>
            </div>
          </div>

          {/* 上传附件 */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              <span className="text-red-500 mr-1">*</span>上传附件:
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleUploadImage}
                className="w-24 h-24 border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50/60 hover:bg-blue-50/30 rounded flex flex-col items-center justify-center gap-1 text-gray-500 transition group"
              >
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <span className="text-xs group-hover:text-blue-600">上传图片</span>
              </button>

              {uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 border border-gray-200 rounded overflow-hidden group shadow-sm bg-gray-100"
                >
                  <img src={img} alt={`附件-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setUploadedImages((prev) => prev.filter((_, index) => index !== idx))
                    }
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-300 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400">
              *支持上传JPG/JPEG/PNG图片,单张图片大小不超过20M,最多上传10张图片
            </p>
          </div>
        </div>
      </form>

      {/* Modal: 从经验库选择 (Screenshot 3) */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800">新增</h3>
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter in Modal */}
            <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">设备分类:</span>
                <select
                  value={expCategoryFilter}
                  onChange={(e) => setExpCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-44"
                >
                  <option value="">请选择设备分类</option>
                  <option value="动力设备/空压机">动力设备/空压机</option>
                  <option value="输送设备/减速机">输送设备/减速机</option>
                  <option value="电气设备/变频器">电气设备/变频器</option>
                  <option value="流体设备/离心泵">流体设备/离心泵</option>
                  <option value="包装设备/热封机">包装设备/热封机</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">故障描述:</span>
                <input
                  type="text"
                  placeholder="请输入故障描述"
                  value={expDescFilter}
                  onChange={(e) => setExpDescFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-44"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {}}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                >
                  <Search className="w-3 h-3" />
                  查询
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExpCategoryFilter('');
                    setExpDescFilter('');
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
                        checked={selectedExpId !== ''}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="py-2.5 px-2 w-10 text-center">序号</th>
                    <th className="py-2.5 px-3">经验编码</th>
                    <th className="py-2.5 px-4">设备分类</th>
                    <th className="py-2.5 px-4">故障描述</th>
                    <th className="py-2.5 px-4">维修方案</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredExperiences.map((item, index) => {
                    const isSelected = selectedExpId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedExpId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/70' : index % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelectedExpId(item.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center text-gray-500">{index + 1}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-600">{item.expCode}</td>
                        <td className="py-2.5 px-4 text-gray-600">{item.category}</td>
                        <td className="py-2.5 px-4 font-medium text-gray-800">{item.description}</td>
                        <td className="py-2.5 px-4 text-gray-600">{item.solution}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs">
              <span className="text-gray-600">
                当前已选 <strong className="text-red-500 font-bold">{selectedExpId ? 1 : 0}</strong> 项数据 / 共 {filteredExperiences.length} 项数据
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSelectExpConfirm}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 选择设备 */}
      {isEquipPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800">选择设备</h3>
              <button
                onClick={() => setIsEquipPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <input
                type="text"
                placeholder="输入设备名称或编码搜索..."
                value={equipSearch}
                onChange={(e) => setEquipSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">设备编码</th>
                    <th className="py-2.5 px-3">设备名称</th>
                    <th className="py-2.5 px-3">规格型号</th>
                    <th className="py-2.5 px-3">安装区域</th>
                    <th className="py-2.5 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {INITIAL_EQUIPMENT_LIST.filter(
                    (eq) =>
                      eq.name.includes(equipSearch) || eq.code.toLowerCase().includes(equipSearch.toLowerCase())
                  ).map((eq) => (
                    <tr key={eq.id} className="hover:bg-blue-50/50 transition">
                      <td className="py-2.5 px-3 font-mono text-gray-600">{eq.code}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-800">{eq.name}</td>
                      <td className="py-2.5 px-3 text-gray-600">{eq.spec}</td>
                      <td className="py-2.5 px-3 text-gray-600">{eq.installArea}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEquipmentCode(eq.code);
                            setEquipmentName(eq.name);
                            setIsEquipPickerOpen(false);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                        >
                          选择
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
