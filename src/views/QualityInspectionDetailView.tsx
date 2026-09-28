import React, { useState } from 'react';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';
import { ArrivalInspectionItem } from '../types';

interface QualityInspectionDetailViewProps {
  inspection: ArrivalInspectionItem | null;
  onBack: () => void;
}

export const QualityInspectionDetailView: React.FC<QualityInspectionDetailViewProps> = ({
  inspection,
  onBack,
}) => {
  if (!inspection) return null;

  const [expandedHistories, setExpandedHistories] = useState<string[]>(['his-1']);

  const toggleHistory = (id: string) => {
    setExpandedHistories((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const historyRecords = inspection.historyRecords || [
    {
      id: 'his-1',
      approvalBatchNo: 'SP28122131231290',
      arrivalNo: 'XQ202510150001',
      buyer: '张晤',
      buyerDepartment: '设备管理部',
      supplier: '广东奥峰紧固件有限公司',
      inspectTime: '2026-09-12 10:55',
      inboundStatus: '入库拒绝' as const,
      items: [
        {
          id: 'h1',
          spareName: '伺服驱动器',
          spareCode: 'S202611',
          category: '电气类/驱动/伺服系统',
          spec: 'IS620PS5R5I',
          brand: '汇川技术',
          unit: '台',
          supplier: '深圳汇川技术',
          expectedQty: 5,
          expectedAmount: 15000,
          unitPrice: 3000,
          qualifiedQty: 0,
          qualifiedAmount: 0,
          unqualifiedQty: 5,
          unqualifiedAmount: 15000,
        },
        {
          id: 'h2',
          spareName: '接近开关',
          spareCode: 'P202612',
          category: '电气类/传感器/电感式',
          spec: 'NBB4-12GM50-E2',
          brand: '倍加福',
          unit: '个',
          supplier: '苏州自动化仪表厂',
          expectedQty: 100,
          expectedAmount: 3000,
          unitPrice: 30,
          qualifiedQty: 0,
          qualifiedAmount: 0,
          unqualifiedQty: 100,
          unqualifiedAmount: 3000,
        },
        {
          id: 'h3',
          spareName: '电磁阀线圈',
          spareCode: 'C202613',
          category: '电气类/配件/线圈',
          spec: '4V210-08',
          brand: '亚德客',
          unit: '个',
          supplier: '宁波气动元件厂',
          expectedQty: 50,
          expectedAmount: 1000,
          unitPrice: 20,
          qualifiedQty: 0,
          qualifiedAmount: 0,
          unqualifiedQty: 50,
          unqualifiedAmount: 1000,
        },
        {
          id: 'h4',
          spareName: '旋转编码器',
          spareCode: 'R202614',
          category: '电气类/传感器/编码器',
          spec: 'E6B2-CWZ6C',
          brand: '欧姆龙',
          unit: '个',
          supplier: '广州白云电气集团',
          expectedQty: 10,
          expectedAmount: 4500,
          unitPrice: 450,
          qualifiedQty: 0,
          qualifiedAmount: 0,
          unqualifiedQty: 10,
          unqualifiedAmount: 4500,
        },
        {
          id: 'h5',
          spareName: '触摸屏',
          spareCode: 'H202615',
          category: '电气类/HMI/触摸屏',
          spec: 'MT8071iP',
          brand: '威纶通',
          unit: '台',
          supplier: '深圳汇川技术',
          expectedQty: 2,
          expectedAmount: 3600,
          unitPrice: 1800,
          qualifiedQty: 0,
          qualifiedAmount: 0,
          unqualifiedQty: 2,
          unqualifiedAmount: 3600,
        },
      ],
    },
    {
      id: 'his-2',
      approvalBatchNo: 'SP38593583958034',
      arrivalNo: 'XQ202510150001',
      buyer: '赵工坊',
      buyerDepartment: '采购部',
      supplier: '广东奥峰紧固件有限公司',
      inspectTime: '2026-09-10 14:00',
      inboundStatus: '审批拒绝' as const,
      items: [],
    },
  ];

  return (
    <div className="space-y-4 pb-16 text-xs text-slate-700">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">质检详情</h3>
          <button
            onClick={onBack}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 基础信息 (Screenshot 14) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h4 className="font-bold text-xs text-slate-800">基础信息</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center">
                <span className="w-24 text-slate-400">到货单号:</span>
                <span className="font-mono font-bold text-slate-900">{inspection.arrivalNo}</span>
              </div>

              <div className="flex items-center">
                <span className="w-24 text-slate-400">采购人:</span>
                <span className="font-bold text-slate-900">{inspection.buyer}</span>
              </div>

              <div className="flex items-center">
                <span className="w-24 text-slate-400">采购部门:</span>
                <span className="text-slate-800">{inspection.buyerDepartment}</span>
              </div>

              <div className="flex items-center">
                <span className="w-24 text-slate-400">供应商名称:</span>
                <span className="text-slate-800 font-medium">{inspection.supplier}</span>
              </div>

              <div className="flex items-center">
                <span className="w-24 text-slate-400">质检完成时间:</span>
                <span className="font-mono text-slate-800 font-semibold">
                  {inspection.inspectTime || '2026-09-15 14:30'}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-24 text-slate-400">入库状态:</span>
                <span
                  className={`inline-flex items-center font-bold ${
                    inspection.inboundStatus === '审批拒绝' || inspection.inboundStatus === '入库拒绝'
                      ? 'text-rose-600'
                      : inspection.inboundStatus === '入库完成' || inspection.inboundStatus === '审批通过'
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      inspection.inboundStatus === '审批拒绝' || inspection.inboundStatus === '入库拒绝'
                        ? 'bg-rose-500'
                        : inspection.inboundStatus === '入库完成' || inspection.inboundStatus === '审批通过'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                  ></span>
                  {inspection.inboundStatus || '入库完成'}
                </span>
              </div>
            </div>
          </div>

          {/* 质检计划 (Screenshot 14) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
              <h4 className="font-bold text-xs text-slate-800">质检计划</h4>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3 w-12 text-center">序号</th>
                    <th className="px-3 py-3">备件名称</th>
                    <th className="px-3 py-3">备件编码</th>
                    <th className="px-3 py-3">备件分类</th>
                    <th className="px-3 py-3">规格型号</th>
                    <th className="px-3 py-3">品牌</th>
                    <th className="px-3 py-3">单位</th>
                    <th className="px-3 py-3">供应商</th>
                    <th className="px-3 py-3">预计到货数量</th>
                    <th className="px-3 py-3">预计到货金额 (元)</th>
                    <th className="px-3 py-3">单价 (元)</th>
                    <th className="px-3 py-3">质检合格数量</th>
                    <th className="px-3 py-3">质检合格金额 (元)</th>
                    <th className="px-3 py-3">质检不合格数量</th>
                    <th className="px-3 py-3">质检不合格金额 (元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(inspection.items && inspection.items.length > 0 ? inspection.items : [
                    {
                      id: 'dis-1',
                      spareName: '三相异步电机',
                      spareCode: 'M202601',
                      category: '电气类/电机/异步电机',
                      spec: 'Y2-132S-4',
                      brand: '皖南电机',
                      unit: '台',
                      supplier: '上海精工机械厂',
                      expectedQty: 10,
                      expectedAmount: 25000,
                      unitPrice: 2500,
                      qualifiedQty: 10,
                      qualifiedAmount: 25000,
                      unqualifiedQty: 0,
                      unqualifiedAmount: 0,
                    },
                    {
                      id: 'dis-2',
                      spareName: '光电传感器',
                      spareCode: 'E202602',
                      category: '电气类/传感器/光电开关',
                      spec: 'E3Z-D62',
                      brand: '欧姆龙',
                      unit: '个',
                      supplier: '苏州自动化仪表厂',
                      expectedQty: 50,
                      expectedAmount: 6000,
                      unitPrice: 120,
                      qualifiedQty: 48,
                      qualifiedAmount: 5760,
                      unqualifiedQty: 2,
                      unqualifiedAmount: 240,
                    },
                    {
                      id: 'dis-3',
                      spareName: '气动节流阀',
                      spareCode: 'V202603',
                      category: '气动类/阀/控制阀',
                      spec: 'ASC1102F-04',
                      brand: '亚德客',
                      unit: '个',
                      supplier: '宁波气动元件厂',
                      expectedQty: 100,
                      expectedAmount: 1500,
                      unitPrice: 15,
                      qualifiedQty: 100,
                      qualifiedAmount: 1500,
                      unqualifiedQty: 0,
                      unqualifiedAmount: 0,
                    },
                    {
                      id: 'dis-4',
                      spareName: '液压高压滤芯',
                      spareCode: 'F202604',
                      category: '液压类/过滤/高压滤芯',
                      spec: 'HC9600FKS13H',
                      brand: '贺德克',
                      unit: '件',
                      supplier: '广州白云电气集团',
                      expectedQty: 20,
                      expectedAmount: 4000,
                      unitPrice: 200,
                      qualifiedQty: 20,
                      qualifiedAmount: 4000,
                      unqualifiedQty: 0,
                      unqualifiedAmount: 0,
                    },
                    {
                      id: 'dis-5',
                      spareName: '深沟球轴承',
                      spareCode: 'B202605',
                      category: '机械类/轴承/滚动轴承',
                      spec: '6205-2RS',
                      brand: '人本轴承',
                      unit: '套',
                      supplier: '浙江人本集团',
                      expectedQty: 200,
                      expectedAmount: 2000,
                      unitPrice: 10,
                      qualifiedQty: 195,
                      qualifiedAmount: 1950,
                      unqualifiedQty: 5,
                      unqualifiedAmount: 50,
                    },
                  ]).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="px-3 py-3 font-bold text-slate-900">{row.spareName}</td>
                      <td className="px-3 py-3 font-mono text-slate-700">{row.spareCode}</td>
                      <td className="px-3 py-3 text-slate-600">{row.category}</td>
                      <td className="px-3 py-3 font-mono text-slate-700">{row.spec}</td>
                      <td className="px-3 py-3 text-slate-800 font-medium">{row.brand}</td>
                      <td className="px-3 py-3 text-slate-600">{row.unit}</td>
                      <td className="px-3 py-3 text-slate-700 max-w-xs truncate">{row.supplier}</td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-900">{row.expectedQty ?? 0}</td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-900">
                        {(row.expectedAmount ?? ((row.expectedQty ?? 0) * row.unitPrice)).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-700">{row.unitPrice}</td>
                      <td className="px-3 py-3 font-mono font-bold text-emerald-600">
                        {row.qualifiedQty ?? row.expectedQty ?? 0}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-emerald-600">
                        {(row.qualifiedAmount ?? row.expectedAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-rose-600">{row.unqualifiedQty ?? 0}</td>
                      <td className="px-3 py-3 font-mono font-bold text-rose-600">
                        {(row.unqualifiedAmount ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 质检历史折叠卡片 (Screenshot 14 / 15 精准还原) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {historyRecords.map((hist) => {
              const isExpanded = expandedHistories.includes(hist.id);
              return (
                <div key={hist.id} className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-800 flex items-center gap-2">
                      <span>质检历史 - 入库审批单号:</span>
                      <span className="font-mono text-blue-600">{hist.approvalBatchNo}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => toggleHistory(hist.id)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
                      <span>{isExpanded ? '收起' : '展开'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 p-3 rounded-lg bg-white border border-slate-200">
                        <div className="flex items-center">
                          <span className="w-24 text-slate-400">到货单号:</span>
                          <span className="font-mono font-bold text-slate-900">{hist.arrivalNo}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-slate-400">采购人:</span>
                          <span className="font-bold text-slate-900">{hist.buyer}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-slate-400">采购部门:</span>
                          <span className="text-slate-800">{hist.buyerDepartment}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-slate-400">供应商名称:</span>
                          <span className="text-slate-800 font-medium">{hist.supplier}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-slate-400">质检完成时间:</span>
                          <span className="font-mono text-slate-800 font-semibold">{hist.inspectTime}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-slate-400">入库状态:</span>
                          <span className="inline-flex items-center font-bold text-rose-600">
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500"></span>
                            {hist.inboundStatus}
                          </span>
                        </div>
                      </div>

                      {hist.items && hist.items.length > 0 && (
                        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                          <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                              <tr>
                                <th className="px-3 py-2 w-12 text-center">序号</th>
                                <th className="px-3 py-2">备件名称</th>
                                <th className="px-3 py-2">备件编码</th>
                                <th className="px-3 py-2">分类</th>
                                <th className="px-3 py-2">规格型号</th>
                                <th className="px-3 py-2">品牌</th>
                                <th className="px-3 py-2">单位</th>
                                <th className="px-3 py-2">预计数量</th>
                                <th className="px-3 py-2">合格数</th>
                                <th className="px-3 py-2">不合格数</th>
                                <th className="px-3 py-2">不合格金额 (元)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {hist.items.map((it, i) => (
                                <tr key={it.id} className="hover:bg-slate-50">
                                  <td className="px-3 py-2 text-center font-mono text-slate-400">{i + 1}</td>
                                  <td className="px-3 py-2 font-bold text-slate-900">{it.spareName}</td>
                                  <td className="px-3 py-2 font-mono text-slate-700">{it.spareCode}</td>
                                  <td className="px-3 py-2 text-slate-600">{it.category}</td>
                                  <td className="px-3 py-2 font-mono text-slate-700">{it.spec}</td>
                                  <td className="px-3 py-2 text-slate-800">{it.brand}</td>
                                  <td className="px-3 py-2 text-slate-600">{it.unit}</td>
                                  <td className="px-3 py-2 font-mono font-bold text-slate-900">{it.expectedQty}</td>
                                  <td className="px-3 py-2 font-mono font-bold text-emerald-600">{it.qualifiedQty ?? 0}</td>
                                  <td className="px-3 py-2 font-mono font-bold text-rose-600">{it.unqualifiedQty ?? 0}</td>
                                  <td className="px-3 py-2 font-mono font-bold text-rose-600">
                                    {(it.unqualifiedAmount ?? 0).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
