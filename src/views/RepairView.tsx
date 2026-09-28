import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Plus, Hammer, Clock, AlertTriangle, ArrowDown, ArrowUp, CheckCircle } from 'lucide-react';
import { RepairOrder } from '../types';

interface RepairViewProps {
  subType: 'report' | 'workorder' | 'acceptance';
  orders: RepairOrder[];
  onAddOrder?: (order: RepairOrder) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const RepairView: React.FC<RepairViewProps> = ({
  subType,
  orders,
  onAddOrder,
  showToast,
}) => {
  const [filterCode, setFilterCode] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const titleMap = {
    report: '设备故障报修',
    workorder: '维修工单执行',
    acceptance: '设备修复验收',
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchCode = !filterCode || o.equipmentCode.toLowerCase().includes(filterCode.toLowerCase()) || o.equipmentName.includes(filterCode);
      const matchUrgency = !filterUrgency || filterUrgency === '全部' || o.urgency === filterUrgency;
      const matchStatus = !filterStatus || filterStatus === '全部' || o.status === filterStatus;
      return matchCode && matchUrgency && matchStatus;
    }).sort((a, b) => {
      const timeA = new Date(a.reportTime || a.createTime || '').getTime();
      const timeB = new Date(b.reportTime || b.createTime || '').getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [orders, filterCode, filterUrgency, filterStatus, sortOrder]);

  return (
    <div className="space-y-4 pb-16">
      {/* Search Filter */}
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
            <span className="w-16 text-slate-600 text-right shrink-0">紧急程度:</span>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden bg-white"
            >
              <option value="">全部</option>
              <option value="特急">特急</option>
              <option value="紧急">紧急</option>
              <option value="普通">普通</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-600 text-right shrink-0">工单状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden bg-white"
            >
              <option value="">全部</option>
              <option value="待指派">待指派</option>
              <option value="维修中">维修中</option>
              <option value="待验收">待验收</option>
              <option value="已关闭">已关闭</option>
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
                setFilterUrgency('');
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
              共 <span className="font-bold text-blue-600">{filteredOrders.length}</span> 单
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 border border-slate-200 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>报修时间: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>

            <button
              onClick={() => {
                const newOrder: RepairOrder = {
                  id: `ro-${Date.now()}`,
                  orderNo: `WX-20260927-${Math.floor(100 + Math.random() * 900)}`,
                  equipmentName: '20000L 蒸压釜',
                  equipmentCode: 'H02536',
                  faultType: '安全阀压力测试微偏',
                  urgency: '紧急',
                  reporter: '张小刀',
                  reportTime: '2026-09-27 ' + new Date().toTimeString().split(' ')[0],
                  repairman: '赵工',
                  status: '维修中',
                  description: '已安排安全阀离线送检校准，并更换备用安全阀保障生产。',
                  mttrMinutes: 45,
                };
                if (onAddOrder) onAddOrder(newOrder);
                showToast('已创建新报修工单（最新时间置顶）', 'success');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>提交故障报修</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 font-medium">工单编号</th>
                <th className="px-3 py-3 font-medium">设备名称</th>
                <th className="px-3 py-3 font-medium">设备编码</th>
                <th className="px-3 py-3 font-medium">故障类型</th>
                <th className="px-3 py-3 font-medium">紧急度</th>
                <th className="px-3 py-3 font-medium">报修人</th>
                <th className="px-3 py-3 font-medium">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                    <span>报修时间 (降序)</span>
                    {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-blue-600" /> : <ArrowUp className="w-3 h-3 text-blue-600" />}
                  </div>
                </th>
                <th className="px-3 py-3 font-medium">维修责任人</th>
                <th className="px-3 py-3 font-medium">工单状态</th>
                <th className="px-3 py-3 font-medium">故障现象描述</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-medium">{o.orderNo}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{o.equipmentName}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{o.equipmentCode}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-800">{o.faultType}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      o.urgency === '特急'
                        ? 'bg-rose-100 text-rose-800'
                        : o.urgency === '紧急'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {o.urgency}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-800">{o.reporter}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold">{o.reportTime}</td>
                  <td className="px-3 py-2.5 text-slate-800 font-medium">{o.repairman}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      o.status === '已关闭'
                        ? 'bg-slate-100 text-slate-600'
                        : o.status === '待验收'
                        ? 'bg-emerald-50 text-emerald-700'
                        : o.status === '维修中'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 max-w-xs truncate">{o.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
