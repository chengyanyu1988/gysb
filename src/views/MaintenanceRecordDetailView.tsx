import React from 'react';
import { Home, Image as ImageIcon } from 'lucide-react';
import { MaintenanceRecordItem } from '../types';
import {
  SAMPLE_MAINTENANCE_RECORD_DETAILS,
  SAMPLE_MAINTENANCE_RECORD_SPARES,
} from '../data/mockData';

interface MaintenanceRecordDetailViewProps {
  record: MaintenanceRecordItem;
  onBack: () => void;
}

export const MaintenanceRecordDetailView: React.FC<MaintenanceRecordDetailViewProps> = ({
  record,
  onBack,
}) => {
  const items =
    record.items && record.items.length > 0
      ? record.items
      : SAMPLE_MAINTENANCE_RECORD_DETAILS;

  const spares =
    record.spares && record.spares.length > 0
      ? record.spares
      : SAMPLE_MAINTENANCE_RECORD_SPARES;

  return (
    <div className="space-y-4 pb-16">
      {/* Header with Return button */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-800">保养记录详情</h2>
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
        >
          返回
        </button>
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
              {record.planCode || 'DJJH202408020002'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">设备名称:</span>
            <span className="text-gray-800 font-medium">
              {record.equipmentName || '2#离心式空气压缩机'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">设备编码:</span>
            <span className="font-mono text-gray-800">
              {record.equipmentCode || 'EQ-YSJ-002'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">计划保养时间:</span>
            <span className="font-mono text-gray-800">
              {record.planTime || '2026-09-10 09:00'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">实际保养时间:</span>
            <span className="font-mono text-gray-800">
              {record.actualTime || '2026-09-10 10:45'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">保养班组:</span>
            <span className="text-gray-800">
              {record.maintenanceGroup || '动力车间机修二班'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">维保结论:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {record.conclusion || '正常'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">任务状态:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {record.status || '已完成'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-gray-500">实际执行人:</span>
            <span className="text-gray-800 font-medium">{record.executor || '陈伟'}</span>
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
                <th className="py-3 px-4 w-32 text-center">保养结果</th>
                <th className="py-3 px-4 w-80">备注</th>
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
                  <td className="py-3 px-4 text-center font-medium text-emerald-600">
                    {item.result}
                  </td>
                  <td className="py-3 px-4 text-gray-600 leading-relaxed">{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: 附件 (Image 15) */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
          <h3 className="text-sm font-bold text-gray-800">附件</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="h-28 bg-gray-200/75 rounded flex items-center justify-center text-gray-400 hover:bg-gray-200 transition cursor-pointer"
            >
              <ImageIcon className="w-8 h-8 text-white/90 drop-shadow-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: 备件消耗 (Image 15) */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
          <h3 className="text-sm font-bold text-gray-800">备件消耗</h3>
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
                <th className="py-2.5 px-3 text-center font-semibold">消耗数量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {spares.map((spare, index) => (
                <tr
                  key={spare.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center text-gray-500">{index + 1}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-800">{spare.name}</td>
                  <td className="py-2.5 px-3 font-mono text-gray-600">{spare.code}</td>
                  <td className="py-2.5 px-3 text-gray-600">{spare.category}</td>
                  <td className="py-2.5 px-3 text-gray-600">{spare.model}</td>
                  <td className="py-2.5 px-3 text-gray-600">{spare.brand}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-700">{spare.stock}</td>
                  <td className="py-2.5 px-3 text-center text-gray-600">{spare.unit}</td>
                  <td className="py-2.5 px-3 text-gray-600">{spare.supplier}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-gray-800 font-mono">
                    {spare.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
