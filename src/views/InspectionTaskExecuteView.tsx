import React, { useState, useRef } from 'react';
import {
  InspectionTask,
  InspectionTaskItem,
  InspectionCheckStatus,
  InspectionTaskStatus,
} from '../types';
import {
  Home,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  X,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { MainTab } from '../components/Sidebar';
import { DEFAULT_INSPECTION_TASK_ITEMS } from '../data/mockData';

interface InspectionTaskExecuteViewProps {
  task?: InspectionTask | null;
  onSaveTask: (updatedTask: InspectionTask, isCompleted?: boolean) => void;
  onNavigate: (tab: MainTab, params?: any) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const InspectionTaskExecuteView: React.FC<InspectionTaskExecuteViewProps> = ({
  task,
  onSaveTask,
  onNavigate,
  showToast,
}) => {
  // Current task data
  const currentTask: InspectionTask = task || {
    id: 'task-default',
    taskCode: 'DJJH202408020002',
    planCode: 'DJJH202408020002',
    equipmentName: '硝基苯成品泵-1#-P26421A',
    equipmentCode: 'P26421A',
    executor: '张建国',
    checkStatus: '未检查',
    plannedTime: '2026-09-17 08:00',
    actualTime: '2026-09-17 08:15',
    checkedItemsCount: 0,
    totalItemsCount: 8,
    status: '已超时',
    department: '生产A厂',
    group: '点检一班',
    items: [...DEFAULT_INSPECTION_TASK_ITEMS],
    attachments: [],
    updateTime: '2026-09-27 20:30:00',
  };

  // State
  const [items, setItems] = useState<InspectionTaskItem[]>(
    currentTask.items && currentTask.items.length > 0
      ? currentTask.items
      : [...DEFAULT_INSPECTION_TASK_ITEMS]
  );

  const [actualTime, setActualTime] = useState<string>(
    currentTask.actualTime || '2026-09-17 08:15'
  );
  const [checkStatus, setCheckStatus] = useState<InspectionCheckStatus>(
    currentTask.checkStatus || '未检查'
  );
  const [taskStatus] = useState<InspectionTaskStatus>(
    currentTask.status || '已超时'
  );

  // Attachments state
  const [attachments, setAttachments] = useState<string[]>(
    currentTask.attachments || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exception modal state (Screenshot 4)
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);

  // Item result change handler
  const handleResultChange = (
    itemId: string,
    result: '未检' | '合格' | '不合格'
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, result } : it))
    );
  };

  // Item remark change handler
  const handleRemarkChange = (itemId: string, remarks: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, remarks } : it))
    );
  };

  // Upload photo handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (attachments.length + newPhotos.length >= 10) {
        showToast('最多上传10张图片', 'warning');
        break;
      }
      const fakeUrl = URL.createObjectURL(file);
      newPhotos.push(fakeUrl);
    }
    setAttachments((prev) => [...prev, ...newPhotos]);
    showToast(`已成功添加 ${newPhotos.length} 张现场照片`, 'success');
  };

  const handleRemovePhoto = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save as Draft (暂存)
  const handleSaveDraft = () => {
    const checkedCount = items.filter((it) => it.result !== '未检').length;
    const updated: InspectionTask = {
      ...currentTask,
      items,
      actualTime,
      checkStatus,
      checkedItemsCount: checkedCount,
      attachments,
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    onSaveTask(updated, false);
    showToast('点检任务已暂存保存', 'info');
  };

  // Click 【点检异常】 button (Opens modal Screenshot 4)
  const handleTriggerException = () => {
    setCheckStatus('异常');
    setIsExceptionModalOpen(true);
  };

  // Click 【点检完成】
  const handleComplete = () => {
    const hasUnchecked = items.some((it) => it.result === '未检');
    if (hasUnchecked) {
      if (!confirm('存在尚未检查的项目，确定要直接完成提交吗？')) {
        return;
      }
    }

    const hasFailed = items.some((it) => it.result === '不合格');
    const finalCheckStatus: InspectionCheckStatus = hasFailed ? '异常' : '正常';

    const checkedCount = items.filter((it) => it.result !== '未检').length;
    const updated: InspectionTask = {
      ...currentTask,
      items,
      actualTime,
      checkStatus: finalCheckStatus,
      checkedItemsCount: checkedCount,
      status: '已完成',
      attachments,
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    onSaveTask(updated, true);
    showToast('点检任务已完成并归档至点检记录', 'success');
    onNavigate('inspection-task');
  };

  // Modal option 1: 暂不处理
  const handleModalIgnore = () => {
    setIsExceptionModalOpen(false);
    const checkedCount = items.filter((it) => it.result !== '未检').length;
    const updated: InspectionTask = {
      ...currentTask,
      items,
      actualTime,
      checkStatus: '异常',
      checkedItemsCount: checkedCount,
      status: '已完成',
      attachments,
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    onSaveTask(updated, true);
    showToast('已标记设备异常并归档', 'warning');
    onNavigate('inspection-task');
  };

  // Modal option 2: 故障报修
  const handleModalReportRepair = () => {
    setIsExceptionModalOpen(false);
    showToast('正在前往故障报修流程...', 'info');
    onNavigate('repair-report');
  };

  // Modal option 3: 重新点检
  const handleModalRecheck = () => {
    setItems((prev) => prev.map((it) => ({ ...it, result: '未检' })));
    setCheckStatus('未检查');
    setIsExceptionModalOpen(false);
    showToast('已重置点检状态，请重新执行点检', 'info');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 2. Page Title Header & Top Action Buttons (Screenshot 2) */}
      <div className="bg-white rounded border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight">
            执行点检任务
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            请逐项检查设备运行参数，确认无误后点击完成或异常处理
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 暂存 */}
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            暂存
          </button>

          {/* 点检异常 (Red Button - Screenshot 2) */}
          <button
            onClick={handleTriggerException}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            点检异常
          </button>

          {/* 点检完成 (Blue Button - Screenshot 2) */}
          <button
            onClick={handleComplete}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            点检完成
          </button>
        </div>
      </div>

      {/* 3. Section 1: 基本信息 (Screenshot 2) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-semibold text-slate-800">基本信息</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-slate-700">
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">计划编码:</span>
            <span className="font-mono text-slate-800 font-medium">
              {currentTask.taskCode || currentTask.planCode}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备名称:</span>
            <span className="text-slate-800 font-medium">{currentTask.equipmentName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备编码:</span>
            <span className="font-mono text-slate-800">{currentTask.equipmentCode}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">计划点检时间:</span>
            <span className="font-mono text-slate-800">{currentTask.plannedTime}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">实际点检时间:</span>
            <input
              type="text"
              value={actualTime}
              onChange={(e) => setActualTime(e.target.value)}
              className="font-mono text-slate-800 px-2 py-0.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500 w-44"
            />
          </div>
          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">实际执行人:</span>
            <span className="text-slate-800 font-medium">{currentTask.executor}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">设备检查状态:</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  checkStatus === '异常'
                    ? 'bg-rose-500'
                    : checkStatus === '正常'
                    ? 'bg-emerald-500'
                    : 'bg-slate-400'
                }`}
              />
              <span
                className={
                  checkStatus === '异常'
                    ? 'text-rose-600'
                    : checkStatus === '正常'
                    ? 'text-emerald-600'
                    : 'text-slate-600'
                }
              >
                {checkStatus}
              </span>
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-400 w-24 shrink-0">任务状态:</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  taskStatus === '已超时'
                    ? 'bg-rose-500'
                    : taskStatus === '已完成'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              />
              <span
                className={
                  taskStatus === '已超时'
                    ? 'text-rose-600'
                    : taskStatus === '已完成'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }
              >
                {taskStatus}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Section 2: 点检内容 (Screenshot 2 & 3) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
            <h2 className="text-xs font-semibold text-slate-800">点检内容</h2>
          </div>
          <span className="text-xs text-slate-500">
            已检 <span className="font-semibold text-blue-600">{items.filter((i) => i.result !== '未检').length}</span> / {items.length} 项
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <th className="px-4 py-2.5 w-16 text-center">序号</th>
                <th className="px-4 py-2.5 w-40">项目名称</th>
                <th className="px-4 py-2.5">检查项</th>
                <th className="px-4 py-2.5 w-56 text-center">检查结果</th>
                <th className="px-4 py-2.5 w-72">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  {/* 序号 */}
                  <td className="px-4 py-3 text-center text-slate-500 font-mono">
                    {item.orderNo}
                  </td>

                  {/* 项目名称 */}
                  <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">
                    {item.projectName}
                  </td>

                  {/* 检查项 */}
                  <td className="px-4 py-3 text-slate-700">
                    {item.checkItem}
                  </td>

                  {/* 检查结果 Radio Group (Screenshot 2: ○ 未检 ○ 合格 ○ 不合格) */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-600 select-none hover:text-slate-900">
                        <input
                          type="radio"
                          name={`result-${item.id}`}
                          value="未检"
                          checked={item.result === '未检'}
                          onChange={() => handleResultChange(item.id, '未检')}
                          className="w-3.5 h-3.5 text-slate-500 focus:ring-0 cursor-pointer"
                        />
                        <span>未检</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-emerald-700 select-none hover:text-emerald-900">
                        <input
                          type="radio"
                          name={`result-${item.id}`}
                          value="合格"
                          checked={item.result === '合格'}
                          onChange={() => handleResultChange(item.id, '合格')}
                          className="w-3.5 h-3.5 text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                        <span>合格</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-rose-700 select-none hover:text-rose-900">
                        <input
                          type="radio"
                          name={`result-${item.id}`}
                          value="不合格"
                          checked={item.result === '不合格'}
                          onChange={() => handleResultChange(item.id, '不合格')}
                          className="w-3.5 h-3.5 text-rose-600 focus:ring-0 cursor-pointer"
                        />
                        <span>不合格</span>
                      </label>
                    </div>
                  </td>

                  {/* 备注 (Screenshot 2: 请输入备注 input) */}
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="请输入备注"
                      value={item.remarks}
                      onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Section 3: 上传附件 (Screenshot 3) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-semibold text-slate-800">上传附件</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Upload Button Box */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">上传图片</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Uploaded Images / Placeholders (Screenshot 3) */}
          {attachments.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group w-24 h-24 border border-slate-200 rounded overflow-hidden bg-slate-100 shadow-2xs"
            >
              <img
                src={imgUrl}
                alt={`附件-${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                title="删除图片"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Default Placeholder Image (Screenshot 3) */}
          {attachments.length === 0 && (
            <div className="w-24 h-24 border border-slate-200 rounded bg-slate-100 flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mt-2.5">
          *支持上传JPG/JPEG/PNG图片,单张图片大小不超过20M,最多上传10张图片
        </p>
      </div>

      {/* 6. Exception Confirmation Modal (Screenshot 4) */}
      {isExceptionModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-800">操作确认</h3>
              <button
                onClick={() => setIsExceptionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Screenshot 4) */}
            <div className="p-6 text-center">
              {/* Illustration */}
              <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shadow-inner">
                  <FileSpreadsheet className="w-9 h-9 text-slate-400" />
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-1">
                点检设备异常
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                请选择异常处理方式
              </p>

              {/* Three action buttons (Screenshot 4) */}
              <div className="flex items-center justify-center gap-3">
                {/* 暂不处理 */}
                <button
                  onClick={handleModalIgnore}
                  className="px-4 py-1.5 border border-blue-600 hover:bg-blue-50 text-blue-600 rounded text-xs font-medium transition-colors"
                >
                  暂不处理
                </button>

                {/* 故障报修 */}
                <button
                  onClick={handleModalReportRepair}
                  className="px-4 py-1.5 border border-blue-600 hover:bg-blue-50 text-blue-600 rounded text-xs font-medium transition-colors"
                >
                  故障报修
                </button>

                {/* 重新点检 */}
                <button
                  onClick={handleModalRecheck}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
                >
                  重新点检
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
