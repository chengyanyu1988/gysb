import React, { useState } from 'react';
import {
  Home,
  Plus,
  Trash2,
  Search,
  RotateCcw,
  X,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  MaintenanceTask,
  MaintenanceTaskItem,
  MaintenanceSpareConsumption,
} from '../types';
import {
  INITIAL_MAINTENANCE_TASK_ITEMS,
  INITIAL_MAINTENANCE_SPARE_PARTS,
  SAMPLE_MAINTENANCE_RECORD_SPARES,
} from '../data/mockData';

interface MaintenanceTaskExecuteViewProps {
  task: MaintenanceTask;
  onSaveStaging: (task: MaintenanceTask) => void;
  onComplete: (task: MaintenanceTask) => void;
  onReportFault: (task: MaintenanceTask) => void;
  onBack: () => void;
}

export const MaintenanceTaskExecuteView: React.FC<MaintenanceTaskExecuteViewProps> = ({
  task,
  onSaveStaging,
  onComplete,
  onReportFault,
  onBack,
}) => {
  const [actualTime, setActualTime] = useState(
    task.actualTime || '2026-09-12 14:30'
  );
  const [conclusion, setConclusion] = useState<'正常' | '异常' | '已完成'>(
    task.conclusion || '已完成'
  );

  // Items
  const [items, setItems] = useState<MaintenanceTaskItem[]>(
    task.items && task.items.length > 0 ? task.items : INITIAL_MAINTENANCE_TASK_ITEMS
  );

  // Spares
  const [spares, setSpares] = useState<MaintenanceSpareConsumption[]>(
    task.spares && task.spares.length > 0 ? task.spares : INITIAL_MAINTENANCE_SPARE_PARTS
  );

  // Images list
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
  ]);

  // Modal 1: Add Spare Modal
  const [isSpareModalOpen, setIsSpareModalOpen] = useState(false);
  const [spareSearchName, setSpareSearchName] = useState('');
  const [spareSearchCode, setSpareSearchCode] = useState('');
  const [selectedSparePoolIds, setSelectedSparePoolIds] = useState<string[]>(['mrs-1']);

  // Modal 2: Anomaly Confirm Modal
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);

  // Filter Spare Pool
  const sparePool = SAMPLE_MAINTENANCE_RECORD_SPARES;
  const filteredSparePool = sparePool.filter((item) => {
    if (spareSearchName && !item.name.includes(spareSearchName)) return false;
    if (spareSearchCode && !item.code.toLowerCase().includes(spareSearchCode.toLowerCase()))
      return false;
    return true;
  });

  const handleItemResultChange = (id: string, result: '已保养' | '未保养') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, result } : item))
    );
  };

  const handleItemRemarksChange = (id: string, remarks: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, remarks } : item))
    );
  };

  const handleSpareQuantityChange = (id: string, quantity: number) => {
    setSpares((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveSpare = (id: string) => {
    setSpares((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmAddSpares = () => {
    const newlySelected = sparePool.filter((item) => selectedSparePoolIds.includes(item.id));
    const combined = [...spares];
    newlySelected.forEach((item) => {
      if (!combined.some((c) => c.code === item.code && c.name === item.name)) {
        combined.push({ ...item, quantity: 1 });
      }
    });
    setSpares(combined);
    setIsSpareModalOpen(false);
  };

  const handleUploadFakeImage = () => {
    const sampleImgs = [
      'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=300&auto=format&fit=crop&q=80',
    ];
    const nextImg = sampleImgs[uploadedImages.length % sampleImgs.length];
    setUploadedImages((prev) => [...prev, nextImg]);
  };

  const handleSaveStaging = () => {
    const updated: MaintenanceTask = {
      ...task,
      actualTime,
      conclusion,
      items,
      spares,
      images: uploadedImages,
      status: '保养中',
    };
    onSaveStaging(updated);
  };

  const handleCompleteTask = () => {
    const updated: MaintenanceTask = {
      ...task,
      actualTime,
      conclusion: '已完成',
      items: items.map((i) => ({ ...i, result: '已保养' })),
      spares,
      images: uploadedImages,
      status: '已完成',
      progress: '1/1',
    };
    onComplete(updated);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header with 3 Action Buttons matching Image 8 */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-800">执行保养任务</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveStaging}
            className="px-5 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-xs font-medium transition"
          >
            暂存
          </button>
          <button
            type="button"
            onClick={() => setIsAnomalyModalOpen(true)}
            className="px-5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition shadow-sm"
          >
            保养异常
          </button>
          <button
            type="button"
            onClick={handleCompleteTask}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
          >
            保养完成
          </button>
        </div>
      </div>

      {/* Section 1: 基本信息 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3 mb-2">
          <h3 className="text-sm font-bold text-gray-800">基本信息</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-xs">
          <div className="flex items-center">
            <span className="w-24 text-gray-500">任务编码:</span>
            <span className="font-mono text-gray-800 font-medium">
              {task.planCode || 'DJJH202408020002'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">设备名称:</span>
            <span className="text-gray-800 font-medium">
              {task.equipmentName || '硝基苯成品泵-1#-P26421A'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">设备编码:</span>
            <span className="font-mono text-gray-800">{task.equipmentCode || 'P26421A'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">计划保养时间:</span>
            <span className="font-mono text-gray-800">{task.planTime || '2026-09-10 09:00'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">实际保养时间:</span>
            <input
              type="text"
              value={actualTime}
              onChange={(e) => setActualTime(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono w-40"
            />
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">保养班组:</span>
            <span className="text-gray-800">{task.maintenanceGroup || '工坊科技保养A组'}</span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">维保结论:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {conclusion}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">任务状态:</span>
            <span className="inline-flex items-center gap-1.5 text-red-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {task.status || '已超时'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">实际执行人:</span>
            <span className="text-gray-800 font-medium">{task.executor || '陈伟'}</span>
          </div>
        </div>
      </div>

      {/* Section 2: 保养内容 (Table) */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
          <h3 className="text-sm font-bold text-gray-800">保养内容</h3>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 w-12 text-center">序号</th>
                <th className="py-3 px-4 w-44">维保名称</th>
                <th className="py-3 px-4">维保标准</th>
                <th className="py-3 px-4 w-44 text-center">保养结果</th>
                <th className="py-3 px-4 w-60">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  <td className="py-3 px-3 text-center text-gray-500">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600 leading-relaxed">{item.standard}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-gray-900">
                        <input
                          type="radio"
                          name={`result-${item.id}`}
                          checked={item.result === '未保养'}
                          onChange={() => handleItemResultChange(item.id, '未保养')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>未保养</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-gray-900">
                        <input
                          type="radio"
                          name={`result-${item.id}`}
                          checked={item.result === '已保养'}
                          onChange={() => handleItemResultChange(item.id, '已保养')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>已保养</span>
                      </label>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="请输入备注"
                      value={item.remarks}
                      onChange={(e) => handleItemRemarksChange(item.id, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: 上传附件 (Image 9 top) */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
          <h3 className="text-sm font-bold text-gray-800">上传附件</h3>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleUploadFakeImage}
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

      {/* Section 4: 备件消耗 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
            <h3 className="text-sm font-bold text-gray-800">备件消耗</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsSpareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            添加备件
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">序号</th>
                <th className="py-2.5 px-3">备件名称</th>
                <th className="py-2.5 px-3">备件编码</th>
                <th className="py-2.5 px-3">备件分类</th>
                <th className="py-2.5 px-3">规格型号</th>
                <th className="py-2.5 px-3">品牌</th>
                <th className="py-2.5 px-3 text-center">库存数量</th>
                <th className="py-2.5 px-3 text-center">单位</th>
                <th className="py-2.5 px-3">供应商</th>
                <th className="py-2.5 px-3 w-28 text-center">消耗数量</th>
                <th className="py-2.5 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {spares.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    暂无消耗备件，可点击右上角“+ 添加备件”
                  </td>
                </tr>
              ) : (
                spares.map((spare, index) => (
                  <tr
                    key={spare.id + index}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center text-gray-500">1</td>
                    <td className="py-2.5 px-3 font-medium text-gray-800">{spare.name}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-600">{spare.code}</td>
                    <td className="py-2.5 px-3 text-gray-600">{spare.category}</td>
                    <td className="py-2.5 px-3 text-gray-600">{spare.model}</td>
                    <td className="py-2.5 px-3 text-gray-600">{spare.brand}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-gray-700">
                      {spare.stock}
                    </td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{spare.unit}</td>
                    <td className="py-2.5 px-3 text-gray-600">{spare.supplier}</td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={spare.quantity}
                        onChange={(e) =>
                          handleSpareQuantityChange(spare.id, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSpare(spare.id)}
                        className="text-blue-600 hover:text-red-600 font-medium hover:underline text-xs"
                      >
                        移除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: 添加备件弹窗 (Image 9 Middle) */}
      {isSpareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800">新增</h3>
              <button
                onClick={() => setIsSpareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Filter in Modal */}
            <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">备件名称:</span>
                <input
                  type="text"
                  placeholder="请输入备件名称"
                  value={spareSearchName}
                  onChange={(e) => setSpareSearchName(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-44"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">备件编码:</span>
                <input
                  type="text"
                  placeholder="请输入备件编码"
                  value={spareSearchCode}
                  onChange={(e) => setSpareSearchCode(e.target.value)}
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
                    setSpareSearchName('');
                    setSpareSearchCode('');
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
                          filteredSparePool.length > 0 &&
                          selectedSparePoolIds.length === filteredSparePool.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSparePoolIds(filteredSparePool.map((item) => item.id));
                          } else {
                            setSelectedSparePoolIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="py-2.5 px-2 w-10 text-center">序号</th>
                    <th className="py-2.5 px-3">备件名称</th>
                    <th className="py-2.5 px-3">备件编码</th>
                    <th className="py-2.5 px-3">备件分类</th>
                    <th className="py-2.5 px-3">规格型号</th>
                    <th className="py-2.5 px-3">品牌</th>
                    <th className="py-2.5 px-3 text-center">库存数量</th>
                    <th className="py-2.5 px-3 text-center">单位</th>
                    <th className="py-2.5 px-3">供应商</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredSparePool.map((item, index) => {
                    const isSelected = selectedSparePoolIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedSparePoolIds((prev) =>
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
                              setSelectedSparePoolIds((prev) =>
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
                        <td className="py-2.5 px-3 text-gray-600">{item.brand}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-gray-700">{item.stock}</td>
                        <td className="py-2.5 px-3 text-center text-gray-600">{item.unit}</td>
                        <td className="py-2.5 px-3 text-gray-600">{item.supplier}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs">
              <span className="text-gray-600">
                当前已选 <strong className="text-red-500 font-bold">{selectedSparePoolIds.length}</strong> 项数据 / 共 {filteredSparePool.length} 项数据
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSpareModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddSpares}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 操作确认 (保养设备异常弹窗, Image 9 Bottom) */}
      {isAnomalyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700">操作确认</h3>
              <button
                onClick={() => setIsAnomalyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-2">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="text-base font-bold text-gray-800">保养设备异常</h4>
              <p className="text-xs text-gray-500">请选择异常处理方式</p>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setConclusion('异常');
                    setIsAnomalyModalOpen(false);
                  }}
                  className="px-5 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium transition"
                >
                  暂不处理
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAnomalyModalOpen(false);
                    onReportFault(task);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
                >
                  故障报修
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
