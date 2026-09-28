import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Search,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Package,
  Layers
} from 'lucide-react';
import { Equipment, SparePartItem } from '../types';
import { INITIAL_ALL_SPARE_PARTS } from '../data/mockData';

interface EquipmentSparePartsViewProps {
  equipment: Equipment;
  onBack: () => void;
  onUpdateEquipmentSpareParts: (equipmentId: string, spareParts: SparePartItem[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const EquipmentSparePartsView: React.FC<EquipmentSparePartsViewProps> = ({
  equipment,
  onBack,
  onUpdateEquipmentSpareParts,
  showToast,
}) => {
  const [spareParts, setSpareParts] = useState<SparePartItem[]>(equipment.spareParts || []);
  const [selectedInMainTable, setSelectedInMainTable] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination for main table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('1');

  // Modal State
  const [modalSearchName, setModalSearchName] = useState('');
  const [modalSearchCode, setModalSearchCode] = useState('');
  const [modalSelectedIds, setModalSelectedIds] = useState<string[]>([]);
  const [modalPage, setModalPage] = useState(1);
  const [modalPageSize, setModalPageSize] = useState(10);

  // Remove single spare part
  const handleRemove = (spId: string, spName: string) => {
    const updated = spareParts.filter((sp) => sp.id !== spId);
    setSpareParts(updated);
    onUpdateEquipmentSpareParts(equipment.id, updated);
    showToast(`已从当前设备移除备件: ${spName}`, 'info');
  };

  // Main table select all
  const isAllMainSelected =
    spareParts.length > 0 && spareParts.every((sp) => selectedInMainTable.includes(sp.id));

  const handleSelectAllMain = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInMainTable(spareParts.map((sp) => sp.id));
    } else {
      setSelectedInMainTable([]);
    }
  };

  // Modal spare parts filtered list
  const modalFilteredParts = useMemo(() => {
    return INITIAL_ALL_SPARE_PARTS.filter((part) => {
      const matchName =
        !modalSearchName.trim() || part.name.toLowerCase().includes(modalSearchName.toLowerCase());
      const matchCode =
        !modalSearchCode.trim() || part.code.toLowerCase().includes(modalSearchCode.toLowerCase());
      return matchName && matchCode;
    });
  }, [modalSearchName, modalSearchCode]);

  // Modal select all
  const isAllModalSelected =
    modalFilteredParts.length > 0 &&
    modalFilteredParts.every((p) => modalSelectedIds.includes(p.id));

  const handleToggleModalSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setModalSelectedIds(modalFilteredParts.map((p) => p.id));
    } else {
      setModalSelectedIds([]);
    }
  };

  // Confirm Modal Selection
  const handleConfirmAddModal = () => {
    if (modalSelectedIds.length === 0) {
      showToast('请选择至少一个备件', 'error');
      return;
    }

    const selectedObjects = INITIAL_ALL_SPARE_PARTS.filter((p) => modalSelectedIds.includes(p.id));
    // Merge without duplicates
    const existingIds = new Set(spareParts.map((s) => s.id));
    const toAdd = selectedObjects.filter((p) => !existingIds.has(p.id));

    const updatedList = [
      ...toAdd.map(item => ({
        ...item,
        associatedTime: '2026-09-27 ' + new Date().toTimeString().split(' ')[0]
      })),
      ...spareParts,
    ];

    setSpareParts(updatedList);
    onUpdateEquipmentSpareParts(equipment.id, updatedList);
    setShowAddModal(false);
    setModalSelectedIds([]);
    showToast(`成功关联 ${toAdd.length} 个备件到当前设备`, 'success');
  };

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Header (Screenshot 5 Top) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
          <h2 className="text-base font-bold text-slate-800">备件</h2>
        </div>
        <button
          onClick={onBack}
          className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors"
        >
          返回
        </button>
      </div>

      {/* 2. 设备基础信息 Summary Card (Screenshot 5 Middle) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs">
        <h3 className="font-bold text-slate-800 mb-3">设备基础信息</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-6">
          <div>
            <span className="text-slate-400 mr-2">设备名称:</span>
            <span className="font-semibold text-slate-800">{equipment.name}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-2">设备编码:</span>
            <span className="font-mono text-slate-700">{equipment.code}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-2">规格型号:</span>
            <span className="font-mono text-slate-700">{equipment.spec}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-2">设备分类:</span>
            <span className="text-slate-700">{equipment.category}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-2">安装区域:</span>
            <span className="text-slate-700">{equipment.installArea}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-2">设备等级:</span>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-bold font-mono border border-purple-200">
              {equipment.grade}
            </span>
          </div>
          <div>
            <span className="text-slate-400 mr-2">设备标记:</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium border border-blue-200">
              {equipment.tag}
            </span>
          </div>
        </div>
      </div>

      {/* 3. 设备备件清单 Table (Screenshot 5 Bottom) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">设备备件清单</h3>
          <button
            onClick={() => {
              setModalSelectedIds([]);
              setShowAddModal(true);
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllMainSelected}
                    onChange={handleSelectAllMain}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="w-12 px-2 py-3 text-center font-medium">序号</th>
                <th className="px-3 py-3 font-medium">备件名称</th>
                <th className="px-3 py-3 font-medium">备件编码</th>
                <th className="px-3 py-3 font-medium">备件分类</th>
                <th className="px-3 py-3 font-medium">规格型号</th>
                <th className="px-3 py-3 font-medium">品牌</th>
                <th className="px-3 py-3 font-medium">库存数量</th>
                <th className="px-3 py-3 font-medium">单位</th>
                <th className="px-3 py-3 font-medium">供应商</th>
                <th className="w-20 px-3 py-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {spareParts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    当前设备暂未关联任何备件，点击右上角 "+ 新增" 即可添加。
                  </td>
                </tr>
              ) : (
                spareParts.map((sp, idx) => {
                  const isSelected = selectedInMainTable.includes(sp.id);
                  return (
                    <tr
                      key={sp.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/60' : idx % 2 === 1 ? 'bg-slate-50/30' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInMainTable([...selectedInMainTable, sp.id]);
                            } else {
                              setSelectedInMainTable(selectedInMainTable.filter((id) => id !== sp.id));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-2 py-2.5 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                        {sp.name}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                        {sp.code}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {sp.category}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {sp.spec}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {sp.brand}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {sp.stock}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        {sp.unit}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        {sp.supplier}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleRemove(sp.id, sp.name)}
                          className="text-blue-600 hover:text-rose-600 hover:underline font-medium"
                        >
                          移除
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>共 {spareParts.length} 条备件数据</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium ${
                    currentPage === p
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-700"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
            </select>
            <div className="flex items-center gap-1">
              <span>跳至</span>
              <input
                type="text"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                className="w-10 px-1 py-1 text-center border border-slate-200 rounded bg-white"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 新增备件弹窗 Modal (Screenshot 6) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">新增</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-slate-600 shrink-0">设备名称:</span>
                <input
                  type="text"
                  value={modalSearchName}
                  onChange={(e) => setModalSearchName(e.target.value)}
                  placeholder="请输入设备名称"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-slate-600 shrink-0">设备编码:</span>
                <input
                  type="text"
                  value={modalSearchCode}
                  onChange={(e) => setModalSearchCode(e.target.value)}
                  placeholder="请输入设备编码"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalPage(1)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>查询</span>
                </button>
                <button
                  onClick={() => {
                    setModalSearchName('');
                    setModalSearchCode('');
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="w-10 px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isAllModalSelected}
                        onChange={handleToggleModalSelectAll}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="w-12 px-2 py-2.5 text-center font-medium">序号</th>
                    <th className="px-3 py-2.5 font-medium">备件名称</th>
                    <th className="px-3 py-2.5 font-medium">备件编码</th>
                    <th className="px-3 py-2.5 font-medium">备件分类</th>
                    <th className="px-3 py-2.5 font-medium">规格型号</th>
                    <th className="px-3 py-2.5 font-medium">品牌</th>
                    <th className="px-3 py-2.5 font-medium">库存数量</th>
                    <th className="px-3 py-2.5 font-medium">单位</th>
                    <th className="px-3 py-2.5 font-medium">供应商</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {modalFilteredParts.map((item, index) => {
                    const isChecked = modalSelectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (isChecked) {
                            setModalSelectedIds(modalSelectedIds.filter((id) => id !== item.id));
                          } else {
                            setModalSelectedIds([...modalSelectedIds, item.id]);
                          }
                        }}
                        className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50/70 font-medium' : ''
                        }`}
                      >
                        <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setModalSelectedIds([...modalSelectedIds, item.id]);
                              } else {
                                setModalSelectedIds(modalSelectedIds.filter((id) => id !== item.id));
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-2 text-center font-mono text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-700 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
                          {item.spec}
                        </td>
                        <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                          {item.brand}
                        </td>
                        <td className="px-3 py-2 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {item.stock}
                        </td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                          {item.unit}
                        </td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                          {item.supplier}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Bottom Action Bar (Screenshot 6 Bottom) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                当前已选 <span className="font-bold text-rose-500">{modalSelectedIds.length}</span> 项数据 / 共 {modalFilteredParts.length} 项数据
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="p-1 border border-slate-200 rounded bg-white text-slate-400">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded text-xs font-medium">
                    1
                  </span>
                  <button className="p-1 border border-slate-200 rounded bg-white text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <select
                    value={modalPageSize}
                    onChange={(e) => setModalPageSize(Number(e.target.value))}
                    className="px-1.5 py-0.5 border border-slate-200 rounded bg-white text-slate-700 text-[11px]"
                  >
                    <option value={10}>10条/页</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmAddModal}
                    className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-xs transition-colors"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
