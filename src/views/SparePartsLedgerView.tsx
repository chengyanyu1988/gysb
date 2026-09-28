import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  RotateCcw,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  Settings,
  Copy,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
  Layers,
  CheckCircle2,
  Package,
  Calendar,
  Check,
  Building,
} from 'lucide-react';

export interface SpareLedgerTableItem {
  id: string;
  serialNo: string; // 如 19951001
  spareName: string;
  spareCode: string; // EAO7650
  category: string;
  spec: string;
  brand: string;
  stockQty: number;
  totalAmount: number;
  upperLimit: number;
  lowerLimit: number;
  supplier: string;
  unit: string;
  isWarningUpper?: boolean;
  isWarningLower?: boolean;
}

export interface InventoryDetailLocationItem {
  id: string;
  batchNo: string;
  locationName: string;
  locationCode: string;
  locationAddress: string;
  quantity: number;
  amount: number;
}

export interface InventoryHistoryTransactionItem {
  id: string;
  type: '入库' | '出库' | '移库' | '退货';
  orderNo: string;
  finishTime: string;
  qtyBefore: number;
  qtyChange: number;
  qtyAfter: number;
  fromLocation: string;
  toLocation: string;
  operator: string;
}

interface SparePartsLedgerViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const SparePartsLedgerView: React.FC<SparePartsLedgerViewProps> = ({ showToast }) => {
  // Navigation sub-view: 'list' | 'detail' | 'records'
  const [subView, setSubView] = useState<'list' | 'detail' | 'records'>('list');
  const [selectedPart, setSelectedPart] = useState<SpareLedgerTableItem | null>(null);

  // Search Filter State
  const [filterName, setFilterName] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSpec, setFilterSpec] = useState('');

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Warning Settings Modal
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [editingPartForWarning, setEditingPartForWarning] = useState<SpareLedgerTableItem | null>(null);
  const [warningUpperInput, setWarningUpperInput] = useState<string>('1000');
  const [warningLowerInput, setWarningLowerInput] = useState<string>('100');

  // Move Location Modal
  const [isMoveLocationModalOpen, setIsMoveLocationModalOpen] = useState(false);
  const [editingLocationItem, setEditingLocationItem] = useState<InventoryDetailLocationItem | null>(null);
  const [moveTargetLocation, setMoveTargetLocation] = useState('A1-1货位 (HW-A0101)');
  const [moveQuantity, setMoveQuantity] = useState('200');

  // Time Sorting for Inventory History Records (Screenshot 3)
  const [recordsSortOrder, setRecordsSortOrder] = useState<'desc' | 'asc'>('desc');

  // Main Inventory Data matching Screenshot 1
  const [inventoryList, setInventoryList] = useState<SpareLedgerTableItem[]>([
    {
      id: 'inv-1',
      serialNo: '19951001',
      spareName: '深沟球轴承',
      spareCode: 'EAO7650',
      category: '机械类/轴承/滚动轴承',
      spec: '6203ZZ',
      brand: '人本轴承',
      stockQty: 110,
      totalAmount: 15400.0,
      upperLimit: 1000,
      lowerLimit: 100,
      supplier: '杭州轴承厂',
      unit: '个',
      isWarningLower: true, // Lower limit warning (110 near 100)
    },
    {
      id: 'inv-2',
      serialNo: '19951002',
      spareName: '伺服驱动电机',
      spareCode: 'EAO7651',
      category: '电气类/电机/伺服电机',
      spec: 'MSMD042G1U',
      brand: '松下',
      stockQty: 1100,
      totalAmount: 330000.0,
      upperLimit: 1000,
      lowerLimit: 100,
      supplier: '松下电器机电',
      unit: '台',
      isWarningUpper: true, // Upper limit warning (1100 > 1000)
    },
    {
      id: 'inv-3',
      serialNo: '19951003',
      spareName: '工业变频器',
      spareCode: 'EAO7652',
      category: '电气类/传动/变频器',
      spec: 'ATV610D11N4C',
      brand: '施耐德',
      stockQty: 40,
      totalAmount: 120000.0,
      upperLimit: 1000,
      lowerLimit: 100,
      supplier: '施耐德电气制造',
      unit: '台',
      isWarningLower: true, // Lower limit warning (40 < 100)
    },
    {
      id: 'inv-4',
      serialNo: '19951004',
      spareName: '工业变频器',
      spareCode: 'EAO7652',
      category: '电气类/传动/变频器',
      spec: 'ATV610D11N4C',
      brand: '施耐德',
      stockQty: 50,
      totalAmount: 150000.0,
      upperLimit: 1000,
      lowerLimit: 100,
      supplier: '施耐德电气制造',
      unit: '台',
    },
    {
      id: 'inv-5',
      serialNo: '19951005',
      spareName: '气动电磁阀',
      spareCode: 'EAO7653',
      category: '气动类/阀/电磁阀',
      spec: '2V025-08',
      brand: '亚德客',
      stockQty: 200,
      totalAmount: 40000.0,
      upperLimit: 500,
      lowerLimit: 50,
      supplier: '宁波气动元件厂',
      unit: '个',
    },
    {
      id: 'inv-6',
      serialNo: '19951006',
      spareName: '光电传感器',
      spareCode: 'EAO7654',
      category: '电气类/传感器/光电开关',
      spec: 'E3Z-L61',
      brand: '欧姆龙',
      stockQty: 45,
      totalAmount: 13500.0,
      upperLimit: 200,
      lowerLimit: 30,
      supplier: '苏州自动化仪表厂',
      unit: '个',
    },
    {
      id: 'inv-7',
      serialNo: '19951007',
      spareName: '工业接触器',
      spareCode: 'EAO7655',
      category: '电气类/控制/接触器',
      spec: 'LC1-D09',
      brand: '施耐德电气',
      stockQty: 80,
      totalAmount: 8000.0,
      upperLimit: 300,
      lowerLimit: 50,
      supplier: '广州白云电气集团',
      unit: '个',
    },
    {
      id: 'inv-8',
      serialNo: '19951008',
      spareName: '24V直流开关电源',
      spareCode: 'EAO7656',
      category: '电气类/电源/开关电源',
      spec: 'S-240-24',
      brand: '明纬',
      stockQty: 25,
      totalAmount: 7500.0,
      upperLimit: 100,
      lowerLimit: 20,
      supplier: '明纬电源直营',
      unit: '台',
    },
    {
      id: 'inv-9',
      serialNo: '19951009',
      spareName: '液压齿轮泵',
      spareCode: 'EAO7657',
      category: '机械类/液压/齿轮泵',
      spec: 'CBN-E316',
      brand: '恒立液压',
      stockQty: 10,
      totalAmount: 50000.0,
      upperLimit: 50,
      lowerLimit: 5,
      supplier: '恒立液压销售部',
      unit: '台',
    },
    {
      id: 'inv-10',
      serialNo: '19951010',
      spareName: '不锈钢法兰球阀',
      spareCode: 'EAO7658',
      category: '机械类/管路/阀门',
      spec: 'DN25-PN16',
      brand: '纽威阀门',
      stockQty: 150,
      totalAmount: 30000.0,
      upperLimit: 200,
      lowerLimit: 20,
      supplier: '纽威阀门有限公司',
      unit: '个',
    },
  ]);

  // Inventory Locations Breakdown (Screenshot 2)
  const [locationDetails, setLocationDetails] = useState<InventoryDetailLocationItem[]>([
    {
      id: 'loc-1',
      batchNo: 'PL0001260915001',
      locationName: 'B3-5货位',
      locationCode: 'HW-B0305',
      locationAddress: '厂区北区2号仓库B3货架',
      quantity: 850,
      amount: 8500.0,
    },
    {
      id: 'loc-2',
      batchNo: 'PL0001260912002',
      locationName: 'A1-2货位',
      locationCode: 'HW-A0102',
      locationAddress: '厂区西南区1号仓库A1货架',
      quantity: 1100,
      amount: 11000.0,
    },
    {
      id: 'loc-3',
      batchNo: 'PL0001260908003',
      locationName: 'C5-1货位',
      locationCode: 'HW-C0501',
      locationAddress: '厂区东南区3号仓库C5货架',
      quantity: 500,
      amount: 5000.0,
    },
    {
      id: 'loc-4',
      batchNo: 'PL0001260905004',
      locationName: 'A1-1货位',
      locationCode: 'HW-A0101',
      locationAddress: '厂区西南区1号仓库A1货架',
      quantity: 1100,
      amount: 11000.0,
    },
    {
      id: 'loc-5',
      batchNo: 'PL0001260902005',
      locationName: 'D2-8货位',
      locationCode: 'HW-D0208',
      locationAddress: '厂区东区4号仓库D2货架',
      quantity: 300,
      amount: 3000.0,
    },
  ]);

  // Inventory Transaction History Records (Screenshot 3)
  const [historyRecords, setHistoryRecords] = useState<InventoryHistoryTransactionItem[]>([
    {
      id: 'hist-1',
      type: '入库',
      orderNo: 'CK202609170012',
      finishTime: '2026/9/17 10:30',
      qtyBefore: 850,
      qtyChange: -50,
      qtyAfter: 800,
      fromLocation: '-',
      toLocation: '-',
      operator: '张唔',
    },
    {
      id: 'hist-2',
      type: '出库',
      orderNo: 'YK202609160008',
      finishTime: '2026/9/16 14:20',
      qtyBefore: 850,
      qtyChange: 0,
      qtyAfter: 850,
      fromLocation: '-',
      toLocation: '-',
      operator: '李琦',
    },
    {
      id: 'hist-3',
      type: '移库',
      orderNo: 'RK202609150003',
      finishTime: '2026/9/15 9:15',
      qtyBefore: 650,
      qtyChange: 200,
      qtyAfter: 850,
      fromLocation: 'B2-2货位',
      toLocation: 'A1-1货位',
      operator: '张唔',
    },
    {
      id: 'hist-4',
      type: '退货',
      orderNo: 'CK202609140021',
      finishTime: '2026/9/14 16:45',
      qtyBefore: 750,
      qtyChange: -100,
      qtyAfter: 650,
      fromLocation: '-',
      toLocation: '-',
      operator: '李琦',
    },
    {
      id: 'hist-5',
      type: '入库',
      orderNo: 'YK202609120015',
      finishTime: '2026/9/12 11:20',
      qtyBefore: 750,
      qtyChange: 0,
      qtyAfter: 750,
      fromLocation: '-',
      toLocation: '-',
      operator: '张唔',
    },
    {
      id: 'hist-6',
      type: '移库',
      orderNo: 'CK202609100044',
      finishTime: '2026/9/10 9:00',
      qtyBefore: 950,
      qtyChange: -200,
      qtyAfter: 750,
      fromLocation: 'B2-2货位',
      toLocation: 'A1-1货位',
      operator: '张唔',
    },
    {
      id: 'hist-7',
      type: '退货',
      orderNo: 'RK202609080032',
      finishTime: '2026/9/8 13:50',
      qtyBefore: 850,
      qtyChange: 100,
      qtyAfter: 950,
      fromLocation: '-',
      toLocation: '-',
      operator: '李琦',
    },
    {
      id: 'hist-8',
      type: '移库',
      orderNo: 'YK202609060009',
      finishTime: '2026/9/6 8:20',
      qtyBefore: 850,
      qtyChange: 0,
      qtyAfter: 850,
      fromLocation: 'B2-2货位',
      toLocation: 'A1-1货位',
      operator: '张唔',
    },
    {
      id: 'hist-9',
      type: '入库',
      orderNo: 'CK202609040018',
      finishTime: '2026/9/4 17:15',
      qtyBefore: 1000,
      qtyChange: -150,
      qtyAfter: 850,
      fromLocation: '-',
      toLocation: '-',
      operator: '李琦',
    },
  ]);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`已复制: ${text}`, 'success');
  };

  // Warning Stats Counts
  const warningUpperCount = inventoryList.filter((i) => i.isWarningUpper).length;
  const warningLowerCount = inventoryList.filter((i) => i.isWarningLower).length;

  // Filtered List
  const filteredList = useMemo(() => {
    return inventoryList.filter((item) => {
      if (filterName && !item.spareName.includes(filterName.trim())) return false;
      if (filterCode && !item.spareCode.toLowerCase().includes(filterCode.trim().toLowerCase())) return false;
      if (filterSupplier && !item.supplier.includes(filterSupplier.trim())) return false;
      if (filterCategory && !item.category.includes(filterCategory)) return false;
      if (filterSpec && !item.spec.includes(filterSpec)) return false;
      return true;
    });
  }, [inventoryList, filterName, filterCode, filterSupplier, filterCategory, filterSpec]);

  // Select all checkboxes
  const isAllSelected = filteredList.length > 0 && filteredList.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((i) => i.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Open Warning Settings Modal (Screenshot 4)
  const handleOpenWarningModal = (part: SpareLedgerTableItem) => {
    setEditingPartForWarning(part);
    setWarningUpperInput(part.upperLimit > 0 ? String(part.upperLimit) : '');
    setWarningLowerInput(part.lowerLimit > 0 ? String(part.lowerLimit) : '');
    setIsWarningModalOpen(true);
  };

  // Save Warning Settings
  const handleSaveWarningSettings = () => {
    if (!editingPartForWarning) return;
    const upVal = parseInt(warningUpperInput, 10) || 0;
    const lowVal = parseInt(warningLowerInput, 10) || 0;

    setInventoryList((prev) =>
      prev.map((p) =>
        p.id === editingPartForWarning.id
          ? {
              ...p,
              upperLimit: upVal,
              lowerLimit: lowVal,
              isWarningUpper: upVal > 0 && p.stockQty > upVal,
              isWarningLower: lowVal > 0 && p.stockQty <= lowVal,
            }
          : p
      )
    );

    showToast(`已更新 ${editingPartForWarning.spareName} 的库存预警阈值`, 'success');
    setIsWarningModalOpen(false);
  };

  // Sorted History Records (Screenshot 3)
  const sortedHistoryRecords = useMemo(() => {
    return [...historyRecords].sort((a, b) => {
      const timeA = new Date(a.finishTime.replace(/\//g, '-')).getTime();
      const timeB = new Date(b.finishTime.replace(/\//g, '-')).getTime();
      return recordsSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [historyRecords, recordsSortOrder]);

  // Handle Move Warehouse Location Action
  const handleExecuteMove = () => {
    if (!editingLocationItem) return;
    const moveQtyNum = parseInt(moveQuantity, 10) || 0;
    if (moveQtyNum <= 0) {
      showToast('请输入有效的移库数量', 'warning');
      return;
    }
    if (moveQtyNum > editingLocationItem.quantity) {
      showToast('移库数量不能大于当前货位在库数量', 'warning');
      return;
    }

    // Add transaction to history log (latest on top)
    const now = new Date();
    const nowStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newTrans: InventoryHistoryTransactionItem = {
      id: `hist-${Date.now()}`,
      type: '移库',
      orderNo: `YK${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`,
      finishTime: nowStr,
      qtyBefore: editingLocationItem.quantity,
      qtyChange: -moveQtyNum,
      qtyAfter: editingLocationItem.quantity - moveQtyNum,
      fromLocation: editingLocationItem.locationName,
      toLocation: moveTargetLocation,
      operator: '张小刀',
    };

    setHistoryRecords([newTrans, ...historyRecords]);
    setLocationDetails((prev) =>
      prev.map((loc) =>
        loc.id === editingLocationItem.id
          ? {
              ...loc,
              quantity: loc.quantity - moveQtyNum,
              amount: (loc.quantity - moveQtyNum) * 10,
            }
          : loc
      )
    );

    showToast(`已成功将 ${moveQtyNum} 件备件从 ${editingLocationItem.locationName} 移库至 ${moveTargetLocation}`, 'success');
    setIsMoveLocationModalOpen(false);
  };

  // ==========================================================
  // VIEW 2: 库存明细子页面 (Screenshot 2)
  // ==========================================================
  if (subView === 'detail' && selectedPart) {
    return (
      <div className="space-y-4 pb-16 text-xs text-slate-800">
        {/* Top Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">库存明细</h2>
          <button
            onClick={() => setSubView('list')}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        {/* Part Master Info Grid */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-3 gap-y-4 text-xs">
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">备品备件编号:</span>
              <span className="font-mono font-semibold text-slate-900">
                {selectedPart.spareCode === 'EAO7650' ? 'XQ202510150001' : selectedPart.spareCode}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">备品备件名称:</span>
              <span className="font-medium text-slate-900">{selectedPart.spareName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">规格型号:</span>
              <span className="font-mono text-slate-800">{selectedPart.spec}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">计量单位:</span>
              <span className="text-slate-900 font-medium">{selectedPart.unit || '个'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">品牌:</span>
              <span className="text-slate-900 font-medium">{selectedPart.brand}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">生产厂商:</span>
              <span className="text-slate-900 font-medium">{selectedPart.supplier}</span>
            </div>
          </div>
        </div>

        {/* Warehouse Location Inventory Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="p-3 w-14 text-center">序号</th>
                  <th className="p-3">批次号</th>
                  <th className="p-3">仓库货位名称</th>
                  <th className="p-3">仓库货位编码</th>
                  <th className="p-3">仓库货位位置</th>
                  <th className="p-3 font-mono">库存数量</th>
                  <th className="p-3 font-mono">库存金额 (元)</th>
                  <th className="p-3 text-center w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locationDetails.map((loc, idx) => (
                  <tr
                    key={loc.id}
                    className={idx % 2 === 1 ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-mono text-slate-900">{loc.batchNo}</td>
                    <td className="p-3 font-semibold text-slate-900">{loc.locationName}</td>
                    <td className="p-3 font-mono text-slate-600">{loc.locationCode}</td>
                    <td className="p-3 text-slate-700">{loc.locationAddress}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{loc.quantity.toLocaleString()}</td>
                    <td className="p-3 font-mono font-medium text-slate-800">
                      {loc.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setEditingLocationItem(loc);
                          setMoveQuantity(String(Math.min(200, loc.quantity)));
                          setIsMoveLocationModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        移库
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Move Location Modal */}
        {isMoveLocationModalOpen && editingLocationItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 text-xs">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">备件移库操作</h3>
                <button
                  onClick={() => setIsMoveLocationModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">移出货位:</span>
                  <span className="font-bold text-slate-900">{editingLocationItem.locationName} ({editingLocationItem.locationCode})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">当前在库数:</span>
                  <span className="font-bold text-blue-600 font-mono">{editingLocationItem.quantity} 件</span>
                </div>

                <div className="pt-2">
                  <label className="block text-slate-700 font-semibold mb-1">移入目标货位:</label>
                  <select
                    value={moveTargetLocation}
                    onChange={(e) => setMoveTargetLocation(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="A1-1货位 (HW-A0101)">A1-1货位 (HW-A0101) - 西南区1号仓</option>
                    <option value="A1-2货位 (HW-A0102)">A1-2货位 (HW-A0102) - 西南区1号仓</option>
                    <option value="B2-2货位 (HW-B0202)">B2-2货位 (HW-B0202) - 北区2号仓</option>
                    <option value="C5-1货位 (HW-C0501)">C5-1货位 (HW-C0501) - 东南区3号仓</option>
                    <option value="D2-8货位 (HW-D0208)">D2-8货位 (HW-D0208) - 东区4号仓</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">移库数量:</label>
                  <input
                    type="number"
                    value={moveQuantity}
                    onChange={(e) => setMoveQuantity(e.target.value)}
                    max={editingLocationItem.quantity}
                    min={1}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsMoveLocationModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleExecuteMove}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  确认移库
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================
  // VIEW 3: 库存记录子页面 (Screenshot 3)
  // ==========================================================
  if (subView === 'records' && selectedPart) {
    return (
      <div className="space-y-4 pb-16 text-xs text-slate-800">
        {/* Top Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">库存记录</h2>
          <button
            onClick={() => setSubView('list')}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        {/* Part Master Info Grid */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-3 gap-y-4 text-xs">
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">备品备件编号:</span>
              <span className="font-mono font-semibold text-slate-900">
                {selectedPart.spareCode === 'EAO7650' ? 'XQ202510150001' : selectedPart.spareCode}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">备品备件名称:</span>
              <span className="font-medium text-slate-900">{selectedPart.spareName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">规格型号:</span>
              <span className="font-mono text-slate-800">{selectedPart.spec}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">计量单位:</span>
              <span className="text-slate-900 font-medium">{selectedPart.unit || '个'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">品牌:</span>
              <span className="text-slate-900 font-medium">{selectedPart.brand}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">生产厂商:</span>
              <span className="text-slate-900 font-medium">{selectedPart.supplier}</span>
            </div>
          </div>
        </div>

        {/* Inventory Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="p-3 w-14 text-center">序号</th>
                  <th className="p-3">业务类型</th>
                  <th className="p-3">单号</th>
                  {/* Clickable Header for Time Sorting */}
                  <th
                    onClick={() => {
                      const next = recordsSortOrder === 'desc' ? 'asc' : 'desc';
                      setRecordsSortOrder(next);
                      showToast(`已切换时间排序：按完成时间${next === 'desc' ? '最新降序（置顶）' : '升序'}排列`, 'info');
                    }}
                    className="p-3 cursor-pointer hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>完成时间</span>
                      <span className="text-blue-600 font-bold">
                        {recordsSortOrder === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-blue-500 font-normal">
                        ({recordsSortOrder === 'desc' ? '最新降序' : '升序'})
                      </span>
                    </div>
                  </th>
                  <th className="p-3 font-mono">变化前数量</th>
                  <th className="p-3 font-mono">变化数量</th>
                  <th className="p-3 font-mono">变化后数量</th>
                  <th className="p-3">转移前仓库</th>
                  <th className="p-3">转移后仓库</th>
                  <th className="p-3">操作人员</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedHistoryRecords.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 1 ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                          item.type === '入库'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.type === '出库'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.type === '移库'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-900 font-medium">{item.orderNo}</td>
                    <td className="p-3 font-mono text-slate-600 font-semibold">{item.finishTime}</td>
                    <td className="p-3 font-mono text-slate-700">{item.qtyBefore}</td>
                    <td
                      className={`p-3 font-mono font-bold ${
                        item.qtyChange > 0
                          ? 'text-emerald-600'
                          : item.qtyChange < 0
                          ? 'text-rose-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.qtyChange > 0 ? `+${item.qtyChange}` : item.qtyChange}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">{item.qtyAfter}</td>
                    <td className="p-3 text-slate-600">{item.fromLocation}</td>
                    <td className="p-3 text-slate-600">{item.toLocation}</td>
                    <td className="p-3 text-slate-800 font-medium">{item.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-slate-200 bg-white flex flex-wrap items-center justify-end gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <button className="p-1 border border-slate-200 rounded hover:bg-slate-50">
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button className="px-2.5 py-0.5 bg-blue-600 text-white rounded font-medium">1</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">2</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">3</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">4</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">5</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">6</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">7</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">8</button>
              <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">9</button>
              <button className="p-1 border border-slate-200 rounded hover:bg-slate-50">
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select className="px-2 py-1 border border-slate-200 rounded text-xs bg-white text-slate-700">
                <option>10条/页</option>
                <option>20条/页</option>
              </select>
              <span>跳至</span>
              <input
                type="text"
                defaultValue="5"
                className="w-10 px-1 py-0.5 border border-slate-200 rounded text-center text-xs"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // VIEW 1: 备件台账列表 / 库存管理主页面 (Screenshot 1)
  // ==========================================================
  return (
    <div className="space-y-4 pb-16 text-xs text-slate-800">
      {/* Filter Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 whitespace-nowrap">备件名称:</span>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="请输入备件名称"
                className="w-40 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 whitespace-nowrap">备件编码:</span>
              <input
                type="text"
                value={filterCode}
                onChange={(e) => setFilterCode(e.target.value)}
                placeholder="请输入备件编码"
                className="w-40 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 whitespace-nowrap">供应商:</span>
              <input
                type="text"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                placeholder="请输入供应商名称"
                className="w-44 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 whitespace-nowrap">备件分类:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-40 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs bg-white text-slate-700"
              >
                <option value="">选择备件类别</option>
                <option value="机械类">机械类</option>
                <option value="电气类">电气类</option>
                <option value="气动类">气动类</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 whitespace-nowrap">备件规格:</span>
              <select
                value={filterSpec}
                onChange={(e) => setFilterSpec(e.target.value)}
                className="w-36 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs bg-white text-slate-700"
              >
                <option value="">选择备件规格</option>
                <option value="6203ZZ">6203ZZ</option>
                <option value="MSMD042G1U">MSMD042G1U</option>
                <option value="ATV610D11N4C">ATV610D11N4C</option>
                <option value="2V025-08">2V025-08</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => showToast('已筛选备件台账', 'info')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setFilterName('');
                setFilterCode('');
                setFilterSupplier('');
                setFilterCategory('');
                setFilterSpec('');
                showToast('已重置筛选条件', 'info');
              }}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Title & Actions Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-slate-900">备件台账列表</h3>
            {/* Warning counters in red */}
            <div className="text-xs text-slate-700">
              库存上限预警 <span className="font-bold text-rose-600 font-mono text-sm">{warningUpperCount}</span> ， 库存下限预警 <span className="font-bold text-rose-600 font-mono text-sm">{warningLowerCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('已导出备件台账数据.xlsx', 'success')}
              className="px-3.5 py-1.5 bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>导出</span>
            </button>
            <button
              onClick={() => showToast('已刷新备件台账列表', 'info')}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('列设置已打开', 'info')}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="列设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3 w-28">序号</th>
                <th className="p-3">备件名称</th>
                <th className="p-3">备件编码</th>
                <th className="p-3">备件分类</th>
                <th className="p-3">规格型号</th>
                <th className="p-3">品牌</th>
                <th className="p-3 font-mono">库存总数量</th>
                <th className="p-3 font-mono">库存总金额 (元)</th>
                <th className="p-3 font-mono">库存预警上限</th>
                <th className="p-3 font-mono">库存预警下限</th>
                <th className="p-3 text-center w-44">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                const isWarning = item.isWarningUpper || item.isWarningLower;
                const isEven = idx % 2 === 1;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-50/60'
                        : isEven
                        ? 'bg-emerald-50/20 hover:bg-emerald-50/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(item.id)}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className={isWarning ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {item.serialNo}
                        </span>
                        <button
                          onClick={() => handleCopy(item.serialNo)}
                          className="text-slate-400 hover:text-blue-600 p-0.5 rounded"
                          title="复制序号"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className={`p-3 font-semibold ${isWarning ? 'text-rose-600' : 'text-slate-900'}`}>
                      {item.spareName}
                    </td>
                    <td className={`p-3 font-mono font-medium ${isWarning ? 'text-rose-600' : 'text-slate-700'}`}>
                      {item.spareCode}
                    </td>
                    <td className={`p-3 ${isWarning ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                      {item.category}
                    </td>
                    <td className={`p-3 font-mono ${isWarning ? 'text-rose-600' : 'text-slate-700'}`}>
                      {item.spec}
                    </td>
                    <td className={`p-3 ${isWarning ? 'text-rose-600 font-medium' : 'text-slate-800'}`}>
                      {item.brand}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      <span className={isWarning ? 'text-rose-600' : ''}>{item.stockQty.toLocaleString()}</span>
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-800">
                      <span className={isWarning ? 'text-rose-600' : ''}>
                        {item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 font-semibold">{item.upperLimit}</td>
                    <td className="p-3 font-mono text-slate-600 font-semibold">{item.lowerLimit}</td>
                    <td className="p-3 text-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedPart(item);
                          setSubView('detail');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        库存明细
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPart(item);
                          setSubView('records');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        库存记录
                      </button>
                      <button
                        onClick={() => handleOpenWarningModal(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        预警设置
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 bg-white flex flex-wrap items-center justify-end gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50">
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button className="px-2.5 py-0.5 bg-blue-600 text-white rounded font-medium">1</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">2</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">3</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">4</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">5</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">6</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">7</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">8</button>
            <button className="px-2.5 py-0.5 border border-slate-200 rounded hover:bg-slate-50">9</button>
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select className="px-2 py-1 border border-slate-200 rounded text-xs bg-white text-slate-700">
              <option>10条/页</option>
              <option>20条/页</option>
            </select>
            <span>跳至</span>
            <input
              type="text"
              defaultValue="5"
              className="w-10 px-1 py-0.5 border border-slate-200 rounded text-center text-xs"
            />
            <span>页</span>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MODAL: 库存预警设置弹窗 (Screenshot 4)
          ========================================================== */}
      {isWarningModalOpen && editingPartForWarning && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 text-xs">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h3 className="font-bold text-slate-900 text-sm">库存预警设置</h3>
              <button
                onClick={() => setIsWarningModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <span className="w-28 text-slate-600 font-medium">备品备件编码:</span>
                <span className="font-mono font-bold text-slate-900">
                  {editingPartForWarning.spareCode === 'EAO7650' ? 'LM0001' : editingPartForWarning.spareCode}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-28 text-slate-600 font-medium">备品备件名称:</span>
                <span className="font-medium text-slate-900">{editingPartForWarning.spareName}</span>
              </div>

              <div className="flex items-center">
                <span className="w-28 text-slate-600 font-medium">型号:</span>
                <span className="font-mono text-slate-800">{editingPartForWarning.spec}</span>
              </div>

              {/* Upper Limit Input */}
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="w-28 text-slate-600 font-medium">库存预警上限:</span>
                  <input
                    type="number"
                    value={warningUpperInput}
                    onChange={(e) => setWarningUpperInput(e.target.value)}
                    placeholder="请输入"
                    className="w-64 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
                <div className="pl-28 text-[11px] text-slate-400">
                  库存预警上限为空时表示当前备品备件无上限预警
                </div>
              </div>

              {/* Lower Limit Input */}
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="w-28 text-slate-600 font-medium">库存预警下限:</span>
                  <input
                    type="number"
                    value={warningLowerInput}
                    onChange={(e) => setWarningLowerInput(e.target.value)}
                    placeholder="请输入"
                    className="w-64 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
                <div className="pl-28 text-[11px] text-slate-400">
                  库存预警下限为空时表示当前备品备件无下限预警
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                onClick={handleSaveWarningSettings}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-xs"
              >
                保存
              </button>
              <button
                onClick={() => setIsWarningModalOpen(false)}
                className="px-5 py-1.5 border border-slate-300 text-blue-600 hover:bg-slate-100 rounded-md font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
