import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Plus, Wrench, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import { MaintenanceRecord } from '../types';

interface MaintenanceViewProps {
  subType: 'plan' | 'task' | 'record';
  records: MaintenanceRecord[];
  onAddRecord?: (rec: MaintenanceRecord) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  subType,
  records,
  onAddRecord,
  showToast,
}) => {
  const [filterCode, setFilterCode] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const titleMap = {
    plan: '保养计划管理',
    task: '保养任务工单',
    record: '维保记录历史',
  };

  const filteredRecords = useMemo(() => {
    return records.filter((m) => {
      const matchCode = !filterCode || m.equipmentCode.toLowerCase().includes(filterCode.toLowerCase()) || m.equipmentName.includes(filterCode);
      const matchLevel = !filterLevel || filterLevel === '全部' || m.level === filterLevel;
      return matchCode && matchLevel;
    }).sort((a, b) => {
      const timeA = new Date(a.completeTime).getTime();
      const timeB = new Date(b.completeTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [records, filterCode, filterLevel, sortOrder]);

  return (
    <div className="space-y-4 pb-16">
      {/* Search Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">设备信息:</span>
            <input
              type="text"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              placeholder="设备名称 / 设备编码"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">保养级别:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden bg-white"
            >
              <option value="">全部</option>
              <option value="日常保养">日常保养</option>
              <option value="一级保养">一级保养</option>
              <option value="二级保养">二级保养</option>
              <option value="预防性维护">预防性维护</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => showToast('查询完成', 'info')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setFilterCode('');
                setFilterLevel('');
              }}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">{titleMap[subType]}</h3>
            <span className="text-xs text-slate-500">
              共 <span className="font-bold text-blue-600">{filteredRecords.length}</span> 条数据
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 border border-slate-200 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>完成时间: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>

            <button
              onClick={() => {
                const newRec: MaintenanceRecord = {
                  id: `mr-${Date.now()}`,
                  planCode: `BYJH-202609-${Math.floor(10 + Math.random() * 90)}`,
                  planName: '设备加注润滑油与紧固维保',
                  equipmentName: '高压离心泵',
                  equipmentCode: 'SB2026090101',
                  level: '一级保养',
                  operator: '张小刀、李工',
                  completeTime: '2026-09-27 ' + new Date().toTimeString().split(' ')[0],
                  status: '已完成',
                  durationMinutes: 90,
                  cost: 350,
                };
                if (onAddRecord) onAddRecord(newRec);
                showToast('已录入新保养记录（最新时间置顶）', 'success');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增维保记录</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 font-medium">计划编号</th>
                <th className="px-3 py-3 font-medium">维保计划名称</th>
                <th className="px-3 py-3 font-medium">设备名称</th>
                <th className="px-3 py-3 font-medium">设备编码</th>
                <th className="px-3 py-3 font-medium">维保级别</th>
                <th className="px-3 py-3 font-medium">责任技师</th>
                <th className="px-3 py-3 font-medium">耗时</th>
                <th className="px-3 py-3 font-medium">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                    <span>完成时间 (降序)</span>
                    {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-blue-600" /> : <ArrowUp className="w-3 h-3 text-blue-600" />}
                  </div>
                </th>
                <th className="px-3 py-3 font-medium">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-medium">{m.planCode}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-800">{m.planName}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{m.equipmentName}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{m.equipmentCode}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 font-medium">
                      {m.level}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-800 font-medium">{m.operator}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{m.durationMinutes} 分钟</td>
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold">{m.completeTime}</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {m.status}
                    </span>
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
