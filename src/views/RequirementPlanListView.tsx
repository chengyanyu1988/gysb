import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  RotateCcw,
  Plus,
  Download,
  Upload,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  ArrowDown,
  ArrowUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  Calendar,
} from 'lucide-react';
import { RequirementPlanItem } from '../types';

interface RequirementPlanListViewProps {
  plans: RequirementPlanItem[];
  onGoToAdd: () => void;
  onGoToDetail: (plan: RequirementPlanItem) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const RequirementPlanListView: React.FC<RequirementPlanListViewProps> = ({
  plans,
  onGoToAdd,
  onGoToDetail,
  showToast,
}) => {
  // Query Filters (Screenshot 5)
  const [filterPlanNo, setFilterPlanNo] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filtered & Sorted (降序排列最新时间在最前)
  const filteredPlans = useMemo(() => {
    return plans
      .filter((p) => {
        if (filterPlanNo && !p.planNo.toLowerCase().includes(filterPlanNo.trim().toLowerCase())) return false;
        if (filterDepartment && p.department !== filterDepartment) return false;
        if (filterStatus && p.status !== filterStatus) return false;
        if (filterTime && !p.applyTime.includes(filterTime)) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.applyTime).getTime();
        const timeB = new Date(b.applyTime).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [plans, filterPlanNo, filterDepartment, filterStatus, filterTime, sortOrder]);

  return (
    <div className="space-y-4 pb-16">
      {/* Query Filter Area (Screenshot 5) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* 需求单号 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">需求单号:</span>
            <input
              type="text"
              value={filterPlanNo}
              onChange={(e) => setFilterPlanNo(e.target.value)}
              placeholder="请输入需求单号"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 申请部门 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">申请部门:</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 bg-white"
            >
              <option value="">选择申请部门</option>
              <option value="设备维修部">设备维修部</option>
              <option value="生产运行部">生产运行部</option>
              <option value="动力车间">动力车间</option>
              <option value="仓储物流部">仓储物流部</option>
              <option value="质检部">质检部</option>
              <option value="工程项目部">工程项目部</option>
            </select>
          </div>

          {/* 审批状态 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">审批状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 bg-white"
            >
              <option value="">选择审批状态</option>
              <option value="审批中">审批中</option>
              <option value="审批通过">审批通过</option>
              <option value="审批驳回">审批驳回</option>
            </select>
          </div>

          {/* 申请时间 */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-slate-600 text-right shrink-0">申请时间:</span>
            <div className="flex-1 relative">
              <input
                type="text"
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                placeholder="请选择时间"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 pr-7"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs pt-3 border-t border-slate-100">
          <button
            onClick={() => showToast(`查询完成，匹配 ${filteredPlans.length} 条需求计划`, 'info')}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={() => {
              setFilterPlanNo('');
              setFilterDepartment('');
              setFilterStatus('');
              setFilterTime('');
              showToast('筛选已清空', 'info');
            }}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (Screenshot 5) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">需求计划列表</h3>
            <span className="text-xs text-slate-500">
              共 <span className="font-bold text-blue-600">{filteredPlans.length}</span> 条
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* 时间排序 */}
            <button
              onClick={() => {
                const next = sortOrder === 'desc' ? 'asc' : 'desc';
                setSortOrder(next);
                showToast(`已按申请时间${next === 'desc' ? '最新降序' : '升序'}排列`, 'info');
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>时间: {sortOrder === 'desc' ? '最新降序 ▾' : '升序 ▴'}</span>
            </button>

            {/* + 新增 */}
            <button
              onClick={onGoToAdd}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            {/* 导入 */}
            <button
              onClick={() => showToast('打开导入需求计划向导', 'info')}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-orange-500" />
              <span>导入</span>
            </button>

            {/* 导出 */}
            <button
              onClick={() => showToast('正在导出需求计划清单...', 'success')}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span>导出</span>
            </button>

            {/* 刷新 */}
            <button
              onClick={() => showToast('数据已刷新，已按最新时间降序排列', 'success')}
              className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50"
              title="刷新"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('列设置已保存', 'info')}
              className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50"
              title="表格设置"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-3 py-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                </th>
                <th className="px-3 py-3 w-12 text-center">序号</th>
                <th className="px-3 py-3">需求单号</th>
                <th className="px-3 py-3">需求总数量</th>
                <th className="px-3 py-3">审批单号</th>
                <th className="px-3 py-3">预算总金额 (元)</th>
                <th className="px-3 py-3">申请人</th>
                <th className="px-3 py-3">申请部门</th>
                <th className="px-3 py-3 text-center">审批状态</th>
                <th className="px-3 py-3">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  >
                    <span>申请时间 (降序)</span>
                    {sortOrder === 'desc' ? (
                      <ArrowDown className="w-3 h-3 text-blue-600" />
                    ) : (
                      <ArrowUp className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                </th>
                <th className="px-3 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.map((item, idx) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-3 py-3 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                  <td className="px-3 py-3 font-mono font-bold text-blue-600">
                    <button onClick={() => onGoToDetail(item)} className="hover:underline">
                      {item.planNo}
                    </button>
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-slate-900">{item.totalQty}</td>
                  <td className="px-3 py-3 font-mono text-slate-600">{item.approvalNo}</td>
                  <td className="px-3 py-3 font-mono font-bold text-slate-900">
                    {item.totalBudget.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-slate-800">{item.applicant}</td>
                  <td className="px-3 py-3 text-slate-600">{item.department}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center text-[11px] font-bold ${
                        item.status === '审批通过'
                          ? 'text-emerald-600'
                          : item.status === '审批中'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          item.status === '审批通过'
                            ? 'bg-emerald-500'
                            : item.status === '审批中'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      ></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-600 font-semibold">{item.applyTime}</td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onGoToDetail(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
          <div>共 {filteredPlans.length} 条数据</div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-400 disabled:opacity-50" disabled>
              &lt;
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded text-xs font-medium flex items-center justify-center ${
                  p === 1
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="p-1 rounded border border-slate-200 hover:bg-white text-slate-600">
              &gt;
            </button>
            <span className="ml-2">10条/页</span>
            <span className="ml-2">跳至</span>
            <input
              type="number"
              defaultValue={5}
              className="w-10 px-1 py-0.5 border border-slate-200 rounded text-center"
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};
