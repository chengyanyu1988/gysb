import React, { useState } from 'react';
import { Home, Plus, Trash2, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { ReturnGoodsOrder, ReturnGoodsSpareItem } from '../types';
import { ReturnGoodsSelectModal } from './ReturnGoodsSelectModal';

interface ReturnGoodsAddViewProps {
  onSave: (order: ReturnGoodsOrder) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const ReturnGoodsAddView: React.FC<ReturnGoodsAddViewProps> = ({
  onSave,
  onCancel,
  showToast,
}) => {
  const [reason, setReason] = useState('');
  const [applicant, setApplicant] = useState('张小刀');
  const [department, setDepartment] = useState('设备管理部');
  const [inboundNo, setInboundNo] = useState('RK202609180011');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ReturnGoodsSpareItem[]>([
    {
      id: 'cand-1',
      batchNo: 'LM260915A',
      spareCode: 'ZJ-750W',
      spareName: '伺服电机',
      spec: 'MSMD042G1U',
      unit: '台',
      brand: '松下',
      manufacturer: '松下电器（中国）',
      warehouseLocationName: 'A区-01架-2层',
      warehouseLocationCode: 'HW-A0102',
      unitPrice: 1500,
      stockQty: 5,
      returnableQty: 2,
      returnQty: 2,
      returnAmount: 3000,
    },
    {
      id: 'cand-2',
      batchNo: 'LM260915B',
      spareCode: 'DY-100L1-4',
      spareName: '三相异步电机',
      spec: 'YS-100L1-4',
      unit: '台',
      brand: '东元',
      manufacturer: '东元电机（无锡）',
      warehouseLocationName: 'B区-02排-1层',
      warehouseLocationCode: 'HW-B0201',
      unitPrice: 2200,
      stockQty: 3,
      returnableQty: 1,
      returnQty: 1,
      returnAmount: 2200,
    },
    {
      id: 'cand-3',
      batchNo: 'LM260910A',
      spareCode: 'CJ-009',
      spareName: '工业接触器',
      spec: 'LC1-D09',
      unit: '个',
      brand: '施耐德',
      manufacturer: '施耐德电气（中国）',
      warehouseLocationName: 'A区-03排-2层',
      warehouseLocationCode: 'HW-A0306',
      unitPrice: 85,
      stockQty: 50,
      returnableQty: 5,
      returnQty: 5,
      returnAmount: 425,
    },
    {
      id: 'cand-4',
      batchNo: 'LM260908A',
      spareCode: 'FZ-1.5',
      spareName: '交流变频器',
      spec: 'ATV610D11N4C',
      unit: '台',
      brand: '台达',
      manufacturer: '台达电子（东莞）',
      warehouseLocationName: 'C区-04排-3层',
      warehouseLocationCode: 'HW-C0403',
      unitPrice: 850,
      stockQty: 10,
      returnableQty: 4,
      returnQty: 4,
      returnAmount: 3400,
    },
    {
      id: 'cand-5',
      batchNo: 'LM260905A',
      spareCode: 'ZF-001',
      spareName: '直齿圆柱齿轮',
      spec: 'ML-12',
      unit: '个',
      brand: '万豪',
      manufacturer: '万豪齿轮生产公司',
      warehouseLocationName: 'A区-01货位',
      warehouseLocationCode: 'HW001',
      unitPrice: 120,
      stockQty: 22,
      returnableQty: 8,
      returnQty: 8,
      returnAmount: 960,
    },
  ]);

  const [checkedItemIds, setCheckedItemIds] = useState<string[]>([]);

  // 数量变动并联动金额
  const handleQtyChange = (id: string, qtyStr: string) => {
    const qty = parseInt(qtyStr, 10);
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const validQty = isNaN(qty) ? 0 : qty;
          return {
            ...item,
            returnQty: validQty,
            returnAmount: validQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
    setCheckedItemIds((prev) => prev.filter((i) => i !== id));
    showToast('已移除该备件', 'info');
  };

  const handleModalSelect = (newItems: ReturnGoodsSpareItem[]) => {
    const existingIds = new Set(selectedItems.map((i) => i.id));
    const itemsToAdd = newItems.filter((i) => !existingIds.has(i.id)).map((i) => ({
      ...i,
      returnQty: i.returnableQty > 0 ? i.returnableQty : 1,
      returnAmount: (i.returnableQty > 0 ? i.returnableQty : 1) * i.unitPrice,
    }));
    setSelectedItems((prev) => [...prev, ...itemsToAdd]);
    showToast(`成功添加 ${itemsToAdd.length} 项备件`, 'success');
  };

  const totalReturnQty = selectedItems.reduce((sum, it) => sum + (it.returnQty || 0), 0);
  const totalReturnAmount = selectedItems.reduce((sum, it) => sum + (it.returnAmount || 0), 0);

  const handleSubmit = (isDraft = false) => {
    if (!reason.trim()) {
      showToast('请输入退货原因', 'warning');
      return;
    }
    if (selectedItems.length === 0) {
      showToast('请至少选择一项备品备件', 'warning');
      return;
    }

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newOrder: ReturnGoodsOrder = {
      id: `ret-${Date.now()}`,
      orderNo: 1,
      returnNo: `TH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}${String(Math.floor(1000 + Math.random() * 9000))}`,
      inboundNo: inboundNo || 'RK202609180011',
      totalReturnQty,
      totalReturnAmount,
      reason,
      applicant,
      department,
      approvalStatus: isDraft ? '待审批' : '待审批',
      returnStatus: isDraft ? '审批中' : '审批中',
      createTime: formattedNow, // 最新创建时间
      items: selectedItems,
    };

    onSave(newOrder);
  };

  return (
    <div className="space-y-4 pb-20 text-xs">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        {/* Title Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">新增退货单</h2>
          <button
            onClick={onCancel}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Reason Input */}
          <div className="flex items-center gap-2 max-w-2xl">
            <span className="text-rose-500 font-bold text-sm leading-none">*</span>
            <span className="text-xs text-slate-700 whitespace-nowrap font-medium">退货原因:</span>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入退货原因"
              className="flex-1 h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Select Button */}
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50/60 rounded text-xs font-medium transition-colors"
            >
              选择备品备件
            </button>
          </div>

          {/* Selected Spares Table */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#f2f6fc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.length > 0 &&
                          checkedItemIds.length === selectedItems.length
                        }
                        onChange={() => {
                          if (checkedItemIds.length === selectedItems.length) {
                            setCheckedItemIds([]);
                          } else {
                            setCheckedItemIds(selectedItems.map((i) => i.id));
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3 font-medium">批次号</th>
                    <th className="p-3 font-medium">备品备件编码</th>
                    <th className="p-3 font-medium">备品备件名称</th>
                    <th className="p-3 font-medium">规格型号</th>
                    <th className="p-3 font-medium text-center">计量单位</th>
                    <th className="p-3 font-medium">品牌</th>
                    <th className="p-3 font-medium">生产厂商</th>
                    <th className="p-3 font-medium">仓库货位名称</th>
                    <th className="p-3 font-medium">仓库货位编码</th>
                    <th className="p-3 font-medium text-right">金额 (元)</th>
                    <th className="p-3 font-medium text-center">库存数量</th>
                    <th className="p-3 font-medium text-center">可退货数量</th>
                    <th className="p-3 font-medium text-center text-slate-800">
                      <span className="text-rose-500 mr-0.5 font-bold">*</span>退货数量
                    </th>
                    <th className="p-3 font-medium text-right">退货金额 (元)</th>
                    <th className="p-3 font-medium text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedItems.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="p-8 text-center text-slate-400">
                        暂未添加退货备品备件，请点击上方按钮选择
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((item) => {
                      const isChecked = checkedItemIds.includes(item.id);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setCheckedItemIds(checkedItemIds.filter((i) => i !== item.id));
                                } else {
                                  setCheckedItemIds([...checkedItemIds, item.id]);
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-mono text-slate-800">{item.batchNo}</td>
                          <td className="p-3 font-mono text-slate-600">{item.spareCode}</td>
                          <td className="p-3 font-medium text-slate-800">{item.spareName}</td>
                          <td className="p-3 text-slate-600 font-mono">{item.spec}</td>
                          <td className="p-3 text-center text-slate-700">{item.unit}</td>
                          <td className="p-3 text-slate-700">{item.brand}</td>
                          <td className="p-3 text-slate-600">{item.manufacturer}</td>
                          <td className="p-3 text-slate-700">{item.warehouseLocationName}</td>
                          <td className="p-3 font-mono text-slate-600">
                            {item.warehouseLocationCode}
                          </td>
                          <td className="p-3 text-right font-mono text-slate-700">
                            {item.unitPrice.toLocaleString('zh-CN', {
                              minimumFractionDigits: 0,
                            })}
                          </td>
                          <td className="p-3 text-center font-mono text-slate-700">
                            {item.stockQty}
                          </td>
                          <td className="p-3 text-center font-mono text-blue-600 font-semibold">
                            {item.returnableQty}
                          </td>
                          <td className="p-2 text-center w-28">
                            <input
                              type="number"
                              min="1"
                              value={item.returnQty === 0 ? '' : item.returnQty}
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                              placeholder="请输入"
                              className="w-20 h-7 px-2 text-xs text-center border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-800"
                            />
                          </td>
                          <td className="p-3 text-right font-mono text-slate-800 font-medium">
                            {(item.returnAmount || 0).toLocaleString('zh-CN', {
                              minimumFractionDigits: 0,
                            })}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
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

            {/* Total Footer Summary */}
            {selectedItems.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-6">
                <div>
                  已选择备件种类：<span className="font-bold text-slate-800">{selectedItems.length}</span> 种
                </div>
                <div className="flex items-center gap-6">
                  <span>
                    退货总数量：<span className="font-bold text-blue-600 font-mono text-sm">{totalReturnQty}</span>
                  </span>
                  <span>
                    退货总金额：<span className="font-bold text-rose-600 font-mono text-sm">¥{totalReturnAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => handleSubmit(false)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>提交退货申请</span>
            </button>
          </div>
        </div>
      </div>

      {/* Select Spares Modal */}
      <ReturnGoodsSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalSelect}
        alreadySelectedIds={selectedItems.map((i) => i.id)}
      />
    </div>
  );
};
