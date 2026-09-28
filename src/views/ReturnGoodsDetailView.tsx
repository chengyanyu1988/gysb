import React from 'react';
import { Home, ArrowLeft, Printer, Download, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { ReturnGoodsOrder } from '../types';

interface ReturnGoodsDetailViewProps {
  order: ReturnGoodsOrder | null;
  onBack: () => void;
  showToast?: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const ReturnGoodsDetailView: React.FC<ReturnGoodsDetailViewProps> = ({
  order,
  onBack,
  showToast,
}) => {
  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded border border-slate-200">
        <p className="text-slate-500 mb-4">未找到对应的退货单信息</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded text-xs"
        >
          返回列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 text-xs">
      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        {/* Title & Back Button */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">退货详情</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (showToast) showToast('已生成并发送打印指令', 'success');
              }}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>打印单据</span>
            </button>
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              返回
            </button>
          </div>
        </div>

        {/* Overview Info 3-Columns Grid */}
        <div className="p-6 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-xs">
          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">退货单号:</span>
            <span className="font-mono text-slate-900 font-medium">{order.returnNo}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">关联入库单号:</span>
            <span className="font-mono text-slate-900 font-medium">{order.inboundNo}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">退货数量:</span>
            <span className="font-mono text-slate-900 font-bold">{order.totalReturnQty}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">退货总金额 (元):</span>
            <span className="font-mono text-slate-900 font-bold text-rose-600">
              {order.totalReturnAmount.toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">退货原因:</span>
            <span className="text-slate-900 font-medium">{order.reason}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">申请人:</span>
            <span className="text-slate-900 font-medium">{order.applicant}</span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">申请部门:</span>
            <span className="text-slate-900 font-medium">{order.department}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">审批状态:</span>
            <span
              className={`font-medium ${
                order.approvalStatus === '已通过'
                  ? 'text-emerald-600'
                  : order.approvalStatus === '已拒绝'
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`}
            >
              {order.approvalStatus}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-600 w-28 shrink-0">退货状态:</span>
            <span
              className={`font-medium ${
                order.returnStatus === '退货成功' || order.returnStatus === '审批通过'
                  ? 'text-emerald-600'
                  : order.returnStatus === '退货失败' || order.returnStatus === '审批拒绝'
                  ? 'text-rose-600'
                  : 'text-blue-600'
              }`}
            >
              {order.returnStatus}
            </span>
          </div>

          <div className="flex items-center md:col-span-3">
            <span className="text-slate-600 w-28 shrink-0">创建时间:</span>
            <span className="font-mono text-slate-900 font-medium">{order.createTime}</span>
          </div>
        </div>

        {/* Spares Detail Table */}
        <div className="p-6">
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#f2f6fc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                  <tr>
                    <th className="p-3 w-12 text-center font-medium">序号</th>
                    <th className="p-3 font-medium">批次号</th>
                    <th className="p-3 font-medium">备品备件编码</th>
                    <th className="p-3 font-medium">备品备件名称</th>
                    <th className="p-3 font-medium">规格型号</th>
                    <th className="p-3 font-medium text-center">计量单位</th>
                    <th className="p-3 font-medium">品牌</th>
                    <th className="p-3 font-medium">生产厂商</th>
                    <th className="p-3 font-medium">仓库货位名称</th>
                    <th className="p-3 font-medium">仓库货位编码</th>
                    <th className="p-3 font-medium text-center">退货数量</th>
                    <th className="p-3 font-medium text-right">退货金额 (元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-center text-slate-500 font-mono">
                          {index + 1}
                        </td>
                        <td className="p-3 font-mono text-slate-800 font-medium">
                          {item.batchNo}
                        </td>
                        <td className="p-3 font-mono text-slate-600">{item.spareCode}</td>
                        <td className="p-3 font-medium text-slate-900">{item.spareName}</td>
                        <td className="p-3 text-slate-600 font-mono">{item.spec}</td>
                        <td className="p-3 text-center text-slate-700">{item.unit}</td>
                        <td className="p-3 text-slate-700">{item.brand}</td>
                        <td className="p-3 text-slate-600">{item.manufacturer}</td>
                        <td className="p-3 text-slate-700">{item.warehouseLocationName}</td>
                        <td className="p-3 font-mono text-slate-600">
                          {item.warehouseLocationCode}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-900 font-bold">
                          {item.returnQty}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-900 font-semibold">
                          {(item.returnAmount || 0).toLocaleString('zh-CN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-slate-400">
                        暂无明细记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Subtotal Footer */}
            {order.items && order.items.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-6">
                <div>
                  明细记录总数：<span className="font-bold text-slate-800">{order.items.length}</span> 条
                </div>
                <div className="flex items-center gap-6">
                  <span>
                    退货数量合计：<span className="font-bold text-blue-600 font-mono text-sm">{order.totalReturnQty}</span>
                  </span>
                  <span>
                    退货金额合计：<span className="font-bold text-rose-600 font-mono text-sm">¥{order.totalReturnAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
