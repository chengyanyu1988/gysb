import React, { useState } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { ReturnGoodsSpareItem } from '../types';
import { INITIAL_RETURN_CANDIDATE_SPARES } from '../data/mockData';

interface ReturnGoodsSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: ReturnGoodsSpareItem[]) => void;
  alreadySelectedIds?: string[];
}

export const ReturnGoodsSelectModal: React.FC<ReturnGoodsSelectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  alreadySelectedIds = [],
}) => {
  const [inboundNoFilter, setInboundNoFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [candidateList, setCandidateList] = useState<ReturnGoodsSpareItem[]>(
    // 默认按入库时间降序排列 (最新时间显示在最前面)
    [...INITIAL_RETURN_CANDIDATE_SPARES].sort((a, b) =>
      (b.inboundTime || '').localeCompare(a.inboundTime || '')
    )
  );

  if (!isOpen) return null;

  const handleSearch = () => {
    let filtered = [...INITIAL_RETURN_CANDIDATE_SPARES];
    if (inboundNoFilter) {
      filtered = filtered.filter(
        (it) => it.inboundNo?.includes(inboundNoFilter) || it.batchNo.includes(inboundNoFilter)
      );
    }
    // 保持最新时间降序排列
    filtered.sort((a, b) => (b.inboundTime || '').localeCompare(a.inboundTime || ''));
    setCandidateList(filtered);
  };

  const toggleSelect = (item: ReturnGoodsSpareItem) => {
    if (selectedIds.includes(item.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== item.id));
    } else {
      setSelectedIds([...selectedIds, item.id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === candidateList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidateList.map((c) => c.id));
    }
  };

  const handleModalConfirm = () => {
    const selectedItems = candidateList.filter((item) => selectedIds.includes(item.id));
    onConfirm(selectedItems);
    setSelectedIds([]);
    onClose();
  };

  const uniqueInboundNos = Array.from(
    new Set(INITIAL_RETURN_CANDIDATE_SPARES.map((s) => s.inboundNo).filter(Boolean))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <h3 className="text-base font-medium text-slate-800">选择退货备品备件</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Section */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 whitespace-nowrap">入库单号</span>
            <select
              value={inboundNoFilter}
              onChange={(e) => setInboundNoFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 min-w-[220px] focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择</option>
              {uniqueInboundNos.map((no) => (
                <option key={no} value={no}>
                  {no}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            查询
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f2f6fc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        candidateList.length > 0 && selectedIds.length === candidateList.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 font-medium">批次号</th>
                  <th className="p-3 font-medium">备品备件编码</th>
                  <th className="p-3 font-medium">备品备件名称</th>
                  <th className="p-3 font-medium text-center">库存数量</th>
                  <th className="p-3 font-medium text-center">可退货数量</th>
                  <th className="p-3 font-medium">仓库货位名称</th>
                  <th className="p-3 font-medium">仓库货位编码</th>
                  <th className="p-3 font-medium text-slate-600">入库时间 (最新降序)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidateList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      暂无可选备件记录
                    </td>
                  </tr>
                ) : (
                  candidateList.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isAlreadyAdded = alreadySelectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => toggleSelect(item)}
                        className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/70' : ''
                        }`}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(item)}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-mono text-slate-800">{item.batchNo}</td>
                        <td className="p-3 font-mono text-slate-600">{item.spareCode}</td>
                        <td className="p-3 font-medium text-slate-800">{item.spareName}</td>
                        <td className="p-3 text-center text-slate-700 font-semibold">
                          {item.stockQty}
                        </td>
                        <td className="p-3 text-center text-blue-600 font-bold">
                          {item.returnableQty}
                        </td>
                        <td className="p-3 text-slate-700">{item.warehouseLocationName}</td>
                        <td className="p-3 font-mono text-slate-600">{item.warehouseLocationCode}</td>
                        <td className="p-3 text-slate-500 font-mono">
                          {item.inboundTime || '2026-09-18 17:23:00'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-start gap-3 bg-white">
          <button
            onClick={handleModalConfirm}
            disabled={selectedIds.length === 0}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            确定
          </button>
          <button
            onClick={onClose}
            className="px-5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};
