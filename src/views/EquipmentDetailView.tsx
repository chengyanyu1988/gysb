import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Wrench, ClipboardList, AlertCircle, Package, Clock, ExternalLink } from 'lucide-react';
import { Equipment } from '../types';
import { INITIAL_INSPECTION_RECORDS, INITIAL_MAINTENANCE_RECORDS, INITIAL_REPAIR_ORDERS } from '../data/mockData';

interface EquipmentDetailViewProps {
  equipment: Equipment;
  onBack: () => void;
  onNavigate: (tab: any, params?: any) => void;
}

export const EquipmentDetailView: React.FC<EquipmentDetailViewProps> = ({
  equipment,
  onBack,
  onNavigate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'spare' | 'maintenance' | 'inspection' | 'repair'>('spare');

  // Filter and sort related records descending by time
  const relatedInspections = INITIAL_INSPECTION_RECORDS.filter(
    (r) => r.equipmentCode === equipment.code || r.equipmentName === equipment.name
  ).sort((a, b) => new Date(b.inspectTime).getTime() - new Date(a.inspectTime).getTime());

  const relatedMaintenance = INITIAL_MAINTENANCE_RECORDS.filter(
    (m) => m.equipmentCode === equipment.code || m.equipmentName === equipment.name
  ).sort((a, b) => new Date(b.completeTime).getTime() - new Date(a.completeTime).getTime());

  const relatedRepairs = INITIAL_REPAIR_ORDERS.filter(
    (rp) => rp.equipmentCode === equipment.code || rp.equipmentName === equipment.name
  ).sort(
    (a, b) =>
      new Date(b.reportTime || b.createTime || '').getTime() -
      new Date(a.reportTime || a.createTime || '').getTime()
  );

  return (
    <div className="space-y-4 pb-16">
      {/* Top Header matching Screenshot 4 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">设备详情</h2>
        <button
          onClick={onBack}
          className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors"
        >
          返回
        </button>
      </div>

      {/* Main Details Card (Screenshot 4 Grid) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-7 text-xs">
        {/* 1. 设备基础信息 */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">设备基础信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            <div className="flex items-center">
              <span className="w-24 text-slate-400">设备名称:</span>
              <span className="font-semibold text-slate-800">{equipment.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">设备编码:</span>
              <span className="font-mono text-slate-700">{equipment.code}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">规格型号:</span>
              <span className="font-mono text-slate-700">{equipment.spec}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">设备分类:</span>
              <span className="text-slate-700">{equipment.category}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">安装区域:</span>
              <span className="text-slate-700">{equipment.installArea}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">设备等级:</span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-bold font-mono border border-purple-200">
                {equipment.grade}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">设备标记:</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium border border-blue-200">
                {equipment.tag}
              </span>
            </div>
          </div>
        </div>

        {/* 2. 设备出厂信息 */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">设备出厂信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            <div className="flex items-center">
              <span className="w-24 text-slate-400">生产厂商:</span>
              <span className="text-slate-700">{equipment.manufacturer || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">出厂编码:</span>
              <span className="font-mono text-slate-700">{equipment.factoryCode || equipment.code}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">供应商:</span>
              <span className="text-slate-700">{equipment.supplier || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">维保日期:</span>
              <span className="font-mono text-slate-700">{equipment.maintenanceDate}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">联系人:</span>
              <span className="text-slate-700">{equipment.contactPerson || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">联系方式:</span>
              <span className="font-mono text-slate-700">{equipment.contactPhone || '-'}</span>
            </div>
          </div>
        </div>

        {/* 3. 设备使用信息 */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">设备使用信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            <div className="flex items-center">
              <span className="w-24 text-slate-400">设备状态:</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {equipment.status}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">使用部门:</span>
              <span className="text-slate-700">{equipment.department}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-400">负责人:</span>
              <span className="font-semibold text-slate-800">{equipment.manager}</span>
            </div>
          </div>
        </div>

        {/* 4. 附件 (Screenshot 4 Bottom) */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">附件</h3>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {equipment.images && equipment.images.length > 0 ? (
              equipment.images.map((img, i) => (
                <div key={i} className="w-28 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={img} alt="设备图片" className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <>
                <div className="w-28 h-28 rounded-lg border border-slate-200 bg-slate-100/70 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="w-28 h-28 rounded-lg border border-slate-200 bg-slate-100/70 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="w-28 h-28 rounded-lg border border-slate-200 bg-slate-100/70 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5. 关联业务动态与履历 (按时间降序排列 - 满足时间降序要求) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('spare')}
              className={`pb-2 transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'spare'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>关联备件 ({equipment.spareParts?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('maintenance')}
              className={`pb-2 transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'maintenance'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>维保记录 (降序)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inspection')}
              className={`pb-2 transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'inspection'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>点检记录 (降序)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('repair')}
              className={`pb-2 transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'repair'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>维修工单 (降序)</span>
            </button>
          </div>

          {activeSubTab === 'spare' && (
            <button
              onClick={() => onNavigate('equipment-spare-parts', { equipment })}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>进入备件管理页面</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tab Contents (All strictly sorted by latest time descending) */}
        {activeSubTab === 'spare' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">序号</th>
                  <th className="px-3 py-2 font-medium">备件名称</th>
                  <th className="px-3 py-2 font-medium">备件编码</th>
                  <th className="px-3 py-2 font-medium">备件分类</th>
                  <th className="px-3 py-2 font-medium">规格型号</th>
                  <th className="px-3 py-2 font-medium">品牌</th>
                  <th className="px-3 py-2 font-medium">库存</th>
                  <th className="px-3 py-2 font-medium">关联时间 (最新降序 ▾)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(!equipment.spareParts || equipment.spareParts.length === 0) ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-400">暂未关联备件</td>
                  </tr>
                ) : (
                  equipment.spareParts.map((sp, idx) => (
                    <tr key={sp.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-slate-400">{idx + 1}</td>
                      <td className="px-3 py-2 font-medium text-slate-800">{sp.name}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{sp.code}</td>
                      <td className="px-3 py-2 text-slate-600">{sp.category}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{sp.spec}</td>
                      <td className="px-3 py-2 text-slate-700">{sp.brand}</td>
                      <td className="px-3 py-2 font-mono font-bold text-slate-800">{sp.stock} {sp.unit}</td>
                      <td className="px-3 py-2 font-mono text-slate-500">{sp.associatedTime || '2026-09-27 18:30:00'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'maintenance' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">完成时间 (最新降序 ▾)</th>
                  <th className="px-3 py-2 font-medium">计划名称</th>
                  <th className="px-3 py-2 font-medium">保养级别</th>
                  <th className="px-3 py-2 font-medium">执行人</th>
                  <th className="px-3 py-2 font-medium">耗时</th>
                  <th className="px-3 py-2 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relatedMaintenance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">暂无维保历史</td>
                  </tr>
                ) : (
                  relatedMaintenance.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-slate-700 font-medium">{m.completeTime}</td>
                      <td className="px-3 py-2 font-medium text-slate-800">{m.planName}</td>
                      <td className="px-3 py-2 text-slate-600">{m.level}</td>
                      <td className="px-3 py-2 text-slate-700">{m.operator}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{m.durationMinutes} 分钟</td>
                      <td className="px-3 py-2 text-emerald-600 font-medium">{m.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'inspection' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">点检时间 (最新降序 ▾)</th>
                  <th className="px-3 py-2 font-medium">任务编号</th>
                  <th className="px-3 py-2 font-medium">点检员</th>
                  <th className="px-3 py-2 font-medium">点检结论</th>
                  <th className="px-3 py-2 font-medium">备注说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relatedInspections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">暂无点检记录</td>
                  </tr>
                ) : (
                  relatedInspections.map((ir) => (
                    <tr key={ir.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-slate-700 font-medium">{ir.inspectTime}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{ir.taskCode}</td>
                      <td className="px-3 py-2 text-slate-800">{ir.inspector}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded font-medium ${
                          ir.result === '正常'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {ir.result}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">{ir.remarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'repair' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">报修时间 (最新降序 ▾)</th>
                  <th className="px-3 py-2 font-medium">工单编号</th>
                  <th className="px-3 py-2 font-medium">故障类型</th>
                  <th className="px-3 py-2 font-medium">紧急度</th>
                  <th className="px-3 py-2 font-medium">维修人</th>
                  <th className="px-3 py-2 font-medium">工单状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relatedRepairs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">暂无故障报修工单</td>
                  </tr>
                ) : (
                  relatedRepairs.map((rp) => (
                    <tr key={rp.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-slate-700 font-medium">{rp.reportTime}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{rp.orderNo}</td>
                      <td className="px-3 py-2 font-medium text-slate-800">{rp.faultType}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          rp.urgency === '特急'
                            ? 'bg-rose-100 text-rose-800'
                            : rp.urgency === '紧急'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rp.urgency}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-700">{rp.repairman}</td>
                      <td className="px-3 py-2 font-medium text-blue-600">{rp.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
