import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Plus, Clock, FileCheck, ArrowDown, ArrowUp } from 'lucide-react';

interface PatrolRecordItem {
  id: string;
  routeCode: string;
  routeName: string;
  patroller: string;
  checkpoints: number;
  abnormalCount: number;
  completeTime: string;
  status: '正常' | '发现隐患' | '巡检中';
  area: string;
}

const INITIAL_PATROL_RECORDS: PatrolRecordItem[] = [
  {
    id: 'pr-1',
    routeCode: 'XJ-20260927-01',
    routeName: '全厂动力主干管网巡检路线',
    patroller: '王强',
    checkpoints: 18,
    abnormalCount: 0,
    completeTime: '2026-09-27 19:50:00',
    status: '正常',
    area: '全厂动力区/管廊'
  },
  {
    id: 'pr-2',
    routeCode: 'XJ-20260927-02',
    routeName: '一车间高危特种设备巡更点',
    patroller: '赵敏',
    checkpoints: 12,
    abnormalCount: 1,
    completeTime: '2026-09-27 17:15:00',
    status: '发现隐患',
    area: '2栋/1层/5号车间'
  },
  {
    id: 'pr-3',
    routeCode: 'XJ-20260927-03',
    routeName: '成品包装及立体仓库巡检',
    patroller: '孙丽',
    checkpoints: 15,
    abnormalCount: 0,
    completeTime: '2026-09-27 15:20:00',
    status: '正常',
    area: '5栋/成品包装间'
  }
];

interface PatrolViewProps {
  subType: 'plan' | 'task' | 'record';
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const PatrolView: React.FC<PatrolViewProps> = ({ subType, showToast }) => {
  const [records, setRecords] = useState<PatrolRecordItem[]>(INITIAL_PATROL_RECORDS);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const titleMap = {
    plan: '巡检计划路线制定',
    task: '巡检任务下发与监控',
    record: '巡检历史台账',
  };

  const filtered = useMemo(() => {
    return records.filter(
      (r) =>
        (!filterName || r.routeName.includes(filterName) || r.patroller.includes(filterName)) &&
        (!filterStatus || filterStatus === '全部' || r.status === filterStatus)
    ).sort((a, b) => {
      const timeA = new Date(a.completeTime).getTime();
      const timeB = new Date(b.completeTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [records, filterName, filterStatus, sortOrder]);

  return (
    <div className="space-y-4 pb-16">
      {/* Search Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">路线/巡检人:</span>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="请输入路线名称或人员"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">巡检状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden bg-white"
            >
              <option value="">全部</option>
              <option value="正常">正常</option>
              <option value="发现隐患">发现隐患</option>
              <option value="巡检中">巡检中</option>
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
                setFilterName('');
                setFilterStatus('');
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
              共 <span className="font-bold text-blue-600">{filtered.length}</span> 条数据
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
                const newRec: PatrolRecordItem = {
                  id: `pr-${Date.now()}`,
                  routeCode: `XJ-20260927-${Math.floor(10 + Math.random() * 90)}`,
                  routeName: '配电房与电气设备特巡',
                  patroller: '郑霞',
                  checkpoints: 10,
                  abnormalCount: 0,
                  completeTime: '2026-09-27 ' + new Date().toTimeString().split(' ')[0],
                  status: '正常',
                  area: '2栋/1层/电气动力区'
                };
                setRecords([newRec, ...records]);
                showToast('已完成新巡检任务（最新时间置顶）', 'success');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增巡检任务</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 font-medium">任务编号</th>
                <th className="px-3 py-3 font-medium">巡检路线名称</th>
                <th className="px-3 py-3 font-medium">巡检区域</th>
                <th className="px-3 py-3 font-medium">点位数</th>
                <th className="px-3 py-3 font-medium">隐患数</th>
                <th className="px-3 py-3 font-medium">巡检员</th>
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
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-medium">{r.routeCode}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{r.routeName}</td>
                  <td className="px-3 py-2.5 text-slate-600">{r.area}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-700">{r.checkpoints} 个</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-rose-600">{r.abnormalCount}</td>
                  <td className="px-3 py-2.5 text-slate-800 font-medium">{r.patroller}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold">{r.completeTime}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      r.status === '正常'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {r.status}
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
