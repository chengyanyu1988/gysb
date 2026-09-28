import React, { useState } from 'react';
import {
  Home,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  X,
  Check,
  Building,
  MapPin,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { WarehouseLocationItem } from '../types';

interface WarehouseLocationViewProps {
  locations: WarehouseLocationItem[];
  onAddLocation: (item: WarehouseLocationItem) => void;
  onUpdateLocation: (item: WarehouseLocationItem) => void;
  onDeleteLocation: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const WarehouseLocationView: React.FC<WarehouseLocationViewProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
  showToast,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['wh-1']);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [parentWarehouseId, setParentWarehouseId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<WarehouseLocationItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRemarks, setFormRemarks] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenAdd = (parentId?: string) => {
    setParentWarehouseId(parentId || null);
    setActiveItem(null);
    setFormName(parentId ? '新片区-货位' : '新仓库');
    setFormCode(
      parentId
        ? `100010${Math.floor(7 + Math.random() * 90)}`
        : `1000${Math.floor(6 + Math.random() * 90)}`
    );
    setFormLocation('重庆市渝北区空港大道289号');
    setFormRemarks('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: WarehouseLocationItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormLocation(item.location);
    setFormRemarks(item.remarks);
    setIsAddModalOpen(true);
  };

  const handleSaveLocation = () => {
    if (!formName || !formCode) {
      showToast('请填写仓库货位名称及编码', 'error');
      return;
    }

    if (activeItem) {
      onUpdateLocation({
        ...activeItem,
        name: formName,
        code: formCode,
        location: formLocation,
        remarks: formRemarks,
      });
      showToast('货位配置已更新', 'success');
    } else {
      const newItem: WarehouseLocationItem = {
        id: `wh-${Date.now()}`,
        name: formName,
        code: formCode,
        location: formLocation,
        authorizedPersonnel: '未配置',
        status: '启用',
        remarks: formRemarks,
        parentId: parentWarehouseId || undefined,
        children: [],
      };
      onAddLocation(newItem);
      showToast('成功添加仓库货位', 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (item: WarehouseLocationItem) => {
    const nextStatus = item.status === '启用' ? '禁用' : '启用';
    onUpdateLocation({ ...item, status: nextStatus });
    showToast(`${item.name} 状态已变更为: ${nextStatus}`, 'info');
  };

  const handleOpenAssignPerson = (item: WarehouseLocationItem) => {
    setActiveItem(item);
    setAssignedPerson(item.authorizedPersonnel === '未配置' ? '张建国' : item.authorizedPersonnel);
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignPerson = () => {
    if (!activeItem) return;
    onUpdateLocation({
      ...activeItem,
      authorizedPersonnel: assignedPerson || '未配置',
    });
    setIsAssignModalOpen(false);
    showToast(`已更新 ${activeItem.name} 权限负责人为: ${assignedPerson}`, 'success');
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header (Screenshot 4) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">仓库货位配置</h3>
          </div>
          <button
            onClick={() => handleOpenAdd()}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
          >
            <span>默认仓库 +</span>
          </button>
        </div>

        {/* Tree Table (Screenshot 4 精准还原) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-6 py-3">仓库货位名称</th>
                <th className="px-4 py-3">仓库货位编码</th>
                <th className="px-4 py-3">位置</th>
                <th className="px-4 py-3">权限人员</th>
                <th className="px-4 py-3 text-center">状态</th>
                <th className="px-4 py-3">备注</th>
                <th className="px-4 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations.map((wh) => {
                const isExpanded = expandedNodes.includes(wh.id);
                return (
                  <React.Fragment key={wh.id}>
                    {/* Warehouse Parent Row */}
                    <tr className="hover:bg-blue-50/30 transition-colors bg-white font-medium">
                      <td className="px-4 py-3 text-slate-900">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(wh.id)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <span className="font-bold">{wh.name}</span>
                          <button
                            onClick={() => handleOpenAdd(wh.id)}
                            className="text-blue-600 font-bold ml-1 hover:text-blue-800"
                            title="新增子货位"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">{wh.code}</td>
                      <td className="px-4 py-3 text-slate-600">{wh.location}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenAssignPerson(wh)}
                          className={`font-medium ${
                            wh.authorizedPersonnel === '未配置'
                              ? 'text-blue-600 hover:underline'
                              : 'text-slate-800'
                          }`}
                        >
                          {wh.authorizedPersonnel}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(wh)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            wh.status === '启用'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {wh.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{wh.remarks}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(wh)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => {
                              onDeleteLocation(wh.id);
                              showToast(`已删除 ${wh.name}`, 'info');
                            }}
                            className="text-blue-600 hover:text-rose-600 font-medium hover:underline"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sub Bin Locations */}
                    {isExpanded &&
                      wh.children &&
                      wh.children.map((sub) => (
                        <tr key={sub.id} className="bg-emerald-50/15 hover:bg-blue-50/40 transition-colors">
                          <td className="px-4 py-2.5 text-slate-800 pl-12">
                            <span className="font-normal text-slate-700">{sub.name}</span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-slate-600">{sub.code}</td>
                          <td className="px-4 py-2.5 text-slate-500">{sub.location}</td>
                          <td className="px-4 py-2.5">
                            <button
                              onClick={() => handleOpenAssignPerson(sub)}
                              className={`font-medium ${
                                sub.authorizedPersonnel === '未配置'
                                  ? 'text-blue-600 hover:underline'
                                  : 'text-slate-800'
                              }`}
                            >
                              {sub.authorizedPersonnel}
                            </button>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button
                              onClick={() => handleToggleStatus(sub)}
                              className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                                sub.status === '启用'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {sub.status}
                            </button>
                          </td>
                          <td className="px-4 py-2.5 text-slate-500">{sub.remarks}</td>
                          <td className="px-4 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(sub)}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => {
                                  onDeleteLocation(sub.id);
                                  showToast(`已删除 ${sub.name}`, 'info');
                                }}
                                className="text-blue-600 hover:text-rose-600 font-medium hover:underline"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination (Screenshot 4) */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
          <div>共 {locations.length} 个总仓</div>
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

      {/* 新增 / 编辑 仓库货位弹窗 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {activeItem ? '编辑仓库货位' : parentWarehouseId ? '新增子货位片区' : '新增仓库'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>货位/仓库名称:
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="如：A片区-液压件区"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>货位/仓库编码:
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="如：1000101"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">地理位置 / 所在地址:</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="如：重庆市渝北区空港大道289号"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">备注说明:</label>
                <input
                  type="text"
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="如：1-10号货架，精密阀件"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveLocation}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 权限人员配置弹窗 */}
      {isAssignModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>配置权限管理人员</span>
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-slate-500">
                正在为 <span className="font-bold text-slate-800">{activeItem.name}</span> 配置出入库权限管理责任人:
              </p>
              <select
                value={assignedPerson}
                onChange={(e) => setAssignedPerson(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white font-medium"
              >
                <option value="未配置">未配置</option>
                <option value="施袁">施袁 (高级仓管员)</option>
                <option value="蒋露">蒋露 (仪表仓专管)</option>
                <option value="张建国">张建国 (机修主管)</option>
                <option value="李敏">李敏 (备品调度)</option>
                <option value="王强">王强 (动力仓管)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveAssignPerson}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                确认配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
