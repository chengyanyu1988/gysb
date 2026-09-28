import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Plus, CheckCircle, Clock, FileCheck, ArrowDown, ArrowUp } from 'lucide-react';
import { InspectionRecord } from '../types';

interface InspectionViewProps {
  subType: 'plan' | 'task' | 'record';
  records: InspectionRecord[];
  onAddRecord?: (rec: InspectionRecord) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const InspectionView: React.FC<InspectionViewProps> = ({
  subType,
  records,
  onAddRecord,
  showToast,
}) => {
  const [filterCode, setFilterCode] = useState('');
  const [filterInspector, setFilterInspector] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const titleMap = {
    plan: '点检计划管理',
    task: '点检任务执行',
    record: '点检历史记录',
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchCode = !filterCode || r.equipmentCode.toLowerCase().includes(filterCode.toLowerCase()) || r.equipmentName.includes(filterCode);
      const matchInspector = !filterInspector || r.inspector.includes(filterInspector);
      const matchResult = !filterResult || filterResult === '全部' || r.result === filterResult;
      return matchCode && matchInspector && matchResult;
    }).sort((a, b) => {
      const timeA = new Date(a.inspectTime).getTime();
      const timeB = new Date(b.inspectTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [records, filterCode, filterInspector, filterResult, sortOrder]);

  return (
    <div className="space-y-4 pb-16">
      {/* Search Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
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
            <span className="w-16 text-slate-600 text-right shrink-0">点检员:</span>
            <input
              type="text"
              value={filterInspector}
              onChange={(e) => setFilterInspector(e.target.value)}
              placeholder="请输入点检员姓名"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">点检结果:</span>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden bg-white"
            >
              <option value="">全部</option>
              <option value="正常">正常</option>
              <option value="异常">异常</option>
              <option value="已整改">已整改</option>
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
                setFilterInspector('');
                setFilterResult('');
              }}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main List */}
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
              <span>点检时间: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>

            <button
              onClick={() => {
                const newRec: InspectionRecord = {
                  id: `ir-${Date.now()}`,
                  planName: '现场临时巡检打卡',
                  taskCode: `DJ-20260927-${Math.floor(100 + Math.random() * 900)}`,
                  equipmentName: '20000L 蒸压釜',
                  equipmentCode: 'H02536',
                  inspector: '张小刀',
                  inspectTime: '2026-09-27 ' + new Date().toTimeString().split(' ')[0],
                  result: '正常',
                  remarks: '压力及温控仪表运行平稳，零跑冒滴漏。',
                  area: '1栋/3楼/303号',
                };
                if (onAddRecord) onAddRecord(newRec);
                showToast('已新增点检记录（最新时间置顶）', 'success');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增点检打卡</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 font-medium">任务/计划编号</th>
                <th className="px-3 py-3 font-medium">计划名称</th>
                <th className="px-3 py-3 font-medium">设备名称</th>
                <th className="px-3 py-3 font-medium">设备编码</th>
                <th className="px-3 py-3 font-medium">安装区域</th>
                <th className="px-3 py-3 font-medium">点检员</th>
                <th className="px-3 py-3 font-medium">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                    <span>点检时间 (降序)</span>
                    {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-blue-600" /> : <ArrowUp className="w-3 h-3 text-blue-600" />}
                  </div>
                </th>
                <th className="px-3 py-3 font-medium">结论</th>
                <th className="px-3 py-3 font-medium">备注说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-medium">{r.taskCode}</td>
                  <td className="px-3 py-2.5 text-slate-800">{r.planName}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{r.equipmentName}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{r.equipmentCode}</td>
                  <td className="px-3 py-2.5 text-slate-600">{r.area}</td>
                  <td className="px-3 py-2.5 text-slate-800 font-medium">{r.inspector}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold">{r.inspectTime}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      r.result === '正常'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {r.result}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 max-w-xs truncate">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
