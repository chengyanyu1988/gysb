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
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Clock,
  ArrowUp,
  ArrowDown,
  Calendar,
  Layers,
  CheckCircle2,
  Package,
  Trash,
} from 'lucide-react';

export interface OutboundRecord {
  id: string;
  outboundNo: string;
  outboundType: string;
  workOrderNo: string;
  requiredQty: number;
  outboundQty?: number;
  applicant: string;
  department: string;
  createTime: string;
  outboundTime?: string;
  status: '待出库' | '已出库';
  items?: OutboundPlanItem[];
}

export interface OutboundPlanItem {
  id: string;
  spareName: string;
  spareCode: string;
  category: string;
  spec: string;
  brand: string;
  unit: string;
  supplier: string;
  availableStock: number;
  requiredQuantity: number;
  actualQuantity?: number;
  batchNo?: string;
  locations?: string;
  locationCode?: string;
}

interface OutboundPickingViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const OutboundPickingView: React.FC<OutboundPickingViewProps> = ({ showToast }) => {
  // Navigation Sub-views: 'list' | 'add' | 'print' | 'detail'
  const [subView, setSubView] = useState<'list' | 'add' | 'print' | 'detail'>('list');
  const [selectedRecordForAction, setSelectedRecordForAction] = useState<OutboundRecord | null>(null);

  // Active Tab: '待出库' | '已出库'
  const [activeTab, setActiveTab] = useState<'待出库' | '已出库'>('待出库');

  // Search Filter State
  const [filterOutboundNo, setFilterOutboundNo] = useState('');
  const [filterOutboundType, setFilterOutboundType] = useState('');
  const [filterCreateTime, setFilterCreateTime] = useState('');

  // Selected Checkbox IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Time Sorting: 'desc' (latest on top) or 'asc'
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [sortField, setSortField] = useState<'createTime' | 'outboundTime'>('createTime');

  // Confirm Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recordToConfirm, setRecordToConfirm] = useState<OutboundRecord | null>(null);

  // Location Selector Modal for Print View
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingItemForLoc, setEditingItemForLoc] = useState<OutboundPlanItem | null>(null);
  const [selectedLocationStr, setSelectedLocationStr] = useState('A1-2货位 (4) , B2-2货位 (8)');

  // Form State for Add Outbound (Screenshot 2)
  const [addOutboundType, setAddOutboundType] = useState('维修出库');
  const [addWorkOrderNo, setAddWorkOrderNo] = useState('GD202609180001');
  const [addPlanItems, setAddPlanItems] = useState<OutboundPlanItem[]>([
    {
      id: 'plan-1',
      spareName: '深沟球轴承',
      spareCode: '6203ZZ',
      category: '机械类/轴承/滚动轴承',
      spec: '6203ZZ',
      brand: '人本轴承',
      unit: '套',
      supplier: '人本集团',
      availableStock: 110,
      requiredQuantity: 100,
    },
    {
      id: 'plan-2',
      spareName: '气动电磁阀',
      spareCode: '2V025-08',
      category: '气动类/阀/电磁阀',
      spec: '2V025-08',
      brand: '亚德客',
      unit: '个',
      supplier: '亚德客（中国）',
      availableStock: 200,
      requiredQuantity: 10,
    },
    {
      id: 'plan-3',
      spareName: '光电传感器',
      spareCode: 'E3Z-L61',
      category: '电气类/传感器/光电开关',
      spec: 'E3Z-L61',
      brand: '欧姆龙',
      unit: '个',
      supplier: '欧姆龙（中国）',
      availableStock: 45,
      requiredQuantity: 5,
    },
    {
      id: 'plan-4',
      spareName: '工业接触器',
      spareCode: 'LC1-D09',
      category: '电气类/控制/接触器',
      spec: 'LC1-D09',
      brand: '施耐德电气',
      unit: '个',
      supplier: '施耐德电气',
      availableStock: 80,
      requiredQuantity: 8,
    },
  ]);

  // Main Records Data (Matching Screenshots 1 & 4)
  const [records, setRecords] = useState<OutboundRecord[]>([
    // === 待出库数据 (Pending Outbound - Screenshot 1) ===
    {
      id: 'out-1',
      outboundNo: 'XQ202609170088',
      outboundType: '维修出库',
      workOrderNo: 'GD202609170012',
      requiredQty: 5,
      applicant: '李伟明',
      department: '设备动力部',
      createTime: '2026/9/17 10:30',
      status: '待出库',
      items: [
        {
          id: 'item-1',
          spareName: '伺服驱动电机',
          spareCode: 'BJ-M-008',
          category: '电气类/电机/伺服电机',
          spec: 'MSMD042G1U',
          brand: '松下',
          unit: '台',
          supplier: '松下电器(中国)',
          availableStock: 15,
          requiredQuantity: 2,
          locations: 'A1-2货位 (4) , B2-2货位 (8)',
          locationCode: 'HW-A0102',
          batchNo: 'PC260910-A',
        },
        {
          id: 'item-2',
          spareName: '工业变频器',
          spareCode: 'BJ-D-012',
          category: '电气类/传动/变频器',
          spec: 'ATV610D11N4C',
          brand: '施耐德',
          unit: '台',
          supplier: '施耐德电气',
          availableStock: 8,
          requiredQuantity: 1,
          locations: 'A1-2货位 (4) , B2-2货位 (8)',
          locationCode: 'HW-B0301',
          batchNo: 'PC260910-B',
        },
        {
          id: 'item-3',
          spareName: '气动电磁阀',
          spareCode: 'BJ-V-005',
          category: '气动类/阀/电磁阀',
          spec: '2V025-08',
          brand: '亚德客',
          unit: '个',
          supplier: '亚德客集团',
          availableStock: 50,
          requiredQuantity: 10,
          locations: 'A1-2货位 (4) , B2-2货位 (8)',
          locationCode: 'HW-C0501',
          batchNo: 'PC260908-C',
        },
        {
          id: 'item-4',
          spareName: '深沟球轴承',
          spareCode: 'BJ-Z-009',
          category: '机械类/轴承/滚动轴承',
          spec: '6205-2RS',
          brand: '人本',
          unit: '套',
          supplier: '人本集团',
          availableStock: 100,
          requiredQuantity: 20,
          locations: '选择',
          locationCode: 'HW-D0102',
          batchNo: 'PC260901-E',
        },
      ],
    },
    {
      id: 'out-2',
      outboundNo: 'XQ202609160045',
      outboundType: '领用出库',
      workOrderNo: 'GD202609160034',
      requiredQty: 20,
      applicant: '王芳',
      department: '生产运行部',
      createTime: '2026/9/16 14:20',
      status: '待出库',
    },
    {
      id: 'out-3',
      outboundNo: 'XQ202609150021',
      outboundType: '点检出库',
      workOrderNo: 'GD202609150008',
      requiredQty: 12,
      applicant: '陈建国',
      department: '质检部',
      createTime: '2026/9/15 9:15',
      status: '待出库',
    },
    {
      id: 'out-4',
      outboundNo: 'XQ202609140067',
      outboundType: '报废出库',
      workOrderNo: 'GD202609140055',
      requiredQty: 3,
      applicant: '赵敏',
      department: '仓储物流部',
      createTime: '2026/9/14 16:45',
      status: '待出库',
    },
    {
      id: 'out-5',
      outboundNo: 'XQ202609120033',
      outboundType: '维修出库',
      workOrderNo: 'GD202609120022',
      requiredQty: 8,
      applicant: '刘志强',
      department: '采购部',
      createTime: '2026/9/12 11:20',
      status: '待出库',
    },
    {
      id: 'out-6',
      outboundNo: 'XQ202609100019',
      outboundType: '领用出库',
      workOrderNo: 'GD202609100011',
      requiredQty: 50,
      applicant: '孙丽',
      department: '设备管理部',
      createTime: '2026/9/10 9:00',
      status: '待出库',
    },
    {
      id: 'out-7',
      outboundNo: 'XQ202609080052',
      outboundType: '保养出库',
      workOrderNo: 'GD202609080041',
      requiredQty: 15,
      applicant: '周杰',
      department: '生产运行部',
      createTime: '2026/9/8 13:50',
      status: '待出库',
    },
    {
      id: 'out-8',
      outboundNo: 'XQ202609060014',
      outboundType: '领用出库',
      workOrderNo: 'GD202609060009',
      requiredQty: 100,
      applicant: '吴刚',
      department: '工程部',
      createTime: '2026/9/6 8:30',
      status: '待出库',
    },
    {
      id: 'out-9',
      outboundNo: 'XQ202609030076',
      outboundType: '维修出库',
      workOrderNo: 'GD202609030068',
      requiredQty: 2,
      applicant: '郑华',
      department: '设备动力部',
      createTime: '2026/9/3 15:10',
      status: '待出库',
    },
    {
      id: 'out-10',
      outboundNo: 'XQ202609010028',
      outboundType: '领用出库',
      workOrderNo: 'GD202609010015',
      requiredQty: 30,
      applicant: '冯强',
      department: '生产运行部',
      createTime: '2026/9/1 10:05',
      status: '待出库',
    },

    // === 已出库数据 (Inbounded / Outbounded - Screenshot 4 & 5) ===
    {
      id: 'out-done-1',
      outboundNo: 'CK202609170033',
      outboundType: '维修领料',
      workOrderNo: 'WX272987892',
      requiredQty: 12,
      outboundQty: 12,
      applicant: '李伟明',
      department: '设备管理部',
      createTime: '2026-09-17 08:45:12',
      outboundTime: '2026-09-17 09:30:00',
      status: '已出库',
      items: [
        {
          id: 'it-d-1',
          batchNo: 'PC260910-A',
          spareName: '伺服驱动电机',
          spareCode: 'BJ-M-008',
          spec: 'MSMD042G1U',
          unit: '台',
          brand: '松下',
          supplier: '松下电器(中国)',
          category: '电气类/电机/伺服电机',
          availableStock: 15,
          requiredQuantity: 2,
          actualQuantity: 2,
          locations: 'A区-01架-2层',
          locationCode: 'HW-A0102',
        },
        {
          id: 'it-d-2',
          batchNo: 'PC260910-B',
          spareName: '工业变频器',
          spareCode: 'BJ-D-012',
          spec: 'ATV610D11N4C',
          unit: '台',
          brand: '施耐德',
          supplier: '施耐德电气',
          category: '电气类/传动/变频器',
          availableStock: 8,
          requiredQuantity: 1,
          actualQuantity: 1,
          locations: 'B区-03架-1层',
          locationCode: 'HW-B0301',
        },
        {
          id: 'it-d-3',
          batchNo: 'PC260908-C',
          spareName: '气动电磁阀',
          spareCode: 'BJ-V-005',
          spec: '2V025-08',
          unit: '个',
          brand: '亚德客',
          supplier: '亚德客集团',
          category: '气动类/阀/电磁阀',
          availableStock: 50,
          requiredQuantity: 10,
          actualQuantity: 10,
          locations: 'C区-05排-1层',
          locationCode: 'HW-C0501',
        },
        {
          id: 'it-d-4',
          batchNo: 'PC260905-D',
          spareName: '接近开关',
          spareCode: 'BJ-S-003',
          spec: 'NBN4-12GM40',
          unit: '个',
          brand: '倍加福',
          supplier: '倍加福中国',
          category: '电气类/传感器/接近开关',
          availableStock: 25,
          requiredQuantity: 5,
          actualQuantity: 5,
          locations: 'A区-02架-3层',
          locationCode: 'HW-A0203',
        },
        {
          id: 'it-d-5',
          batchNo: 'PC260901-E',
          spareName: '深沟球轴承',
          spareCode: 'BJ-Z-009',
          spec: '6205-2RS',
          unit: '套',
          brand: '人本',
          supplier: '人本集团',
          category: '机械类/轴承/滚动轴承',
          availableStock: 100,
          requiredQuantity: 20,
          actualQuantity: 20,
          locations: 'D区-01排-2层',
          locationCode: 'HW-D0102',
        },
      ],
    },
    {
      id: 'out-done-2',
      outboundNo: 'CK202408189282',
      outboundType: '保养出库',
      workOrderNo: 'BY1282197812',
      requiredQty: 4,
      outboundQty: 4,
      applicant: '李琦',
      department: '维修二组',
      createTime: '2026-09-16 17:23:00',
      outboundTime: '2026-09-16 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-3',
      outboundNo: 'CK202408189283',
      outboundType: '点检出库',
      workOrderNo: 'DJ217128721',
      requiredQty: 12,
      outboundQty: 12,
      applicant: '张唔',
      department: '维修一组',
      createTime: '2026-09-15 17:23:00',
      outboundTime: '2026-09-15 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-4',
      outboundNo: 'CK202408189284',
      outboundType: '其他出库',
      workOrderNo: '-',
      requiredQty: 4,
      outboundQty: 4,
      applicant: '李琦',
      department: '维修二组',
      createTime: '2026-09-14 17:23:00',
      outboundTime: '2026-09-14 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-5',
      outboundNo: 'CK202408189285',
      outboundType: '维修出库',
      workOrderNo: '-',
      requiredQty: 12,
      outboundQty: 12,
      applicant: '张唔',
      department: '维修一组',
      createTime: '2026-09-12 17:23:00',
      outboundTime: '2026-09-12 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-6',
      outboundNo: 'CK202408189286',
      outboundType: '保养出库',
      workOrderNo: '-',
      requiredQty: 4,
      outboundQty: 4,
      applicant: '李琦',
      department: '维修二组',
      createTime: '2026-09-10 17:23:00',
      outboundTime: '2026-09-10 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-7',
      outboundNo: 'CK202408189287',
      outboundType: '点检出库',
      workOrderNo: '-',
      requiredQty: 12,
      outboundQty: 12,
      applicant: '张唔',
      department: '维修一组',
      createTime: '2026-09-08 17:23:00',
      outboundTime: '2026-09-08 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-8',
      outboundNo: 'CK202408189288',
      outboundType: '其他出库',
      workOrderNo: '-',
      requiredQty: 4,
      outboundQty: 4,
      applicant: '李琦',
      department: '维修二组',
      createTime: '2026-09-06 17:23:00',
      outboundTime: '2026-09-06 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-9',
      outboundNo: 'CK202408189289',
      outboundType: '维修出库',
      workOrderNo: '-',
      requiredQty: 12,
      outboundQty: 12,
      applicant: '张唔',
      department: '维修一组',
      createTime: '2026-09-04 17:23:00',
      outboundTime: '2026-09-04 17:23:00',
      status: '已出库',
    },
    {
      id: 'out-done-10',
      outboundNo: 'CK202408189290',
      outboundType: '保养出库',
      workOrderNo: '-',
      requiredQty: 4,
      outboundQty: 4,
      applicant: '李琦',
      department: '维修二组',
      createTime: '2026-09-02 17:23:00',
      outboundTime: '2026-09-02 17:23:00',
      status: '已出库',
    },
  ]);

  // Copy Helper
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`已复制单号: ${text}`, 'success');
  };

  // Filter & Sort Records
  const filteredRecords = useMemo(() => {
    let list = records.filter((r) => {
      if (r.status !== activeTab) return false;
      if (filterOutboundNo && !r.outboundNo.toLowerCase().includes(filterOutboundNo.toLowerCase())) {
        return false;
      }
      if (filterOutboundType && r.outboundType !== filterOutboundType) {
        return false;
      }
      if (filterCreateTime && !r.createTime.includes(filterCreateTime)) {
        return false;
      }
      return true;
    });

    // Time sort (default descending latest on top)
    list.sort((a, b) => {
      const fieldA = sortField === 'outboundTime' ? (a.outboundTime || a.createTime) : a.createTime;
      const fieldB = sortField === 'outboundTime' ? (b.outboundTime || b.createTime) : b.createTime;
      const timeA = new Date(fieldA.replace(/\//g, '-')).getTime();
      const timeB = new Date(fieldB.replace(/\//g, '-')).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [records, activeTab, filterOutboundNo, filterOutboundType, filterCreateTime, sortOrder, sortField]);

  // Checkbox Selection
  const isAllSelected =
    filteredRecords.length > 0 &&
    filteredRecords.every((r) => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Batch Delete
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先选择要删除的出库单', 'warning');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedIds.length} 条出库单记录吗？`)) {
      setRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      showToast(`已成功删除 ${selectedIds.length} 项出库单`, 'success');
    }
  };

  // Confirm Outbound Execution (Modal Confirm)
  const handleConfirmOutbound = () => {
    if (!recordToConfirm) return;
    const now = new Date();
    const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordToConfirm.id
          ? {
              ...r,
              status: '已出库',
              outboundQty: r.requiredQty,
              outboundTime: nowStr,
            }
          : r
      )
    );
    showToast(`出库单 ${recordToConfirm.outboundNo} 已确认完成出库并核销！`, 'success');
    setIsConfirmModalOpen(false);
    setRecordToConfirm(null);
  };

  // Save Add Outbound Plan (Screenshot 2)
  const handleSaveAddOutbound = () => {
    const totalQty = addPlanItems.reduce((acc, curr) => acc + (Number(curr.requiredQuantity) || 0), 0);
    const now = new Date();
    const nowStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRec: OutboundRecord = {
      id: `out-${Date.now()}`,
      outboundNo: `XQ${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`,
      outboundType: addOutboundType,
      workOrderNo: addWorkOrderNo,
      requiredQty: totalQty,
      applicant: '张小刀',
      department: '设备管理部',
      createTime: nowStr,
      status: '待出库',
      items: addPlanItems,
    };

    setRecords([newRec, ...records]);
    showToast(`已成功创建领用出库单: ${newRec.outboundNo}`, 'success');
    setSubView('list');
  };

  // Add Item to Plan
  const handleAddItemToPlan = () => {
    const newItem: OutboundPlanItem = {
      id: `plan-${Date.now()}`,
      spareName: '三相异步电机',
      spareCode: 'M07653',
      category: '电气类/电机/异步电机',
      spec: 'Y2-132S-4',
      brand: '皖南电机',
      unit: '台',
      supplier: '安徽电机制造厂',
      availableStock: 20,
      requiredQuantity: 1,
    };
    setAddPlanItems([...addPlanItems, newItem]);
    showToast('已添加一行出库物料计划', 'info');
  };

  // Remove Item from Plan
  const handleRemovePlanItem = (id: string) => {
    setAddPlanItems(addPlanItems.filter((i) => i.id !== id));
  };

  // ==========================================
  // VIEW 2: 新增出库单页面 (Screenshot 2)
  // ==========================================
  if (subView === 'add') {
    return (
      <div className="space-y-4 pb-16 text-xs text-slate-800">
        {/* Top Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">新增出库单</h2>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSubView('list')}
              className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSaveAddOutbound}
              className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-xs"
            >
              保存
            </button>
          </div>
        </div>

        {/* Form Inputs (Outbound Type & Work Order) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <label className="w-24 text-slate-700 font-semibold text-right">
              <span className="text-rose-500 mr-1">*</span>出库类型:
            </label>
            <select
              value={addOutboundType}
              onChange={(e) => setAddOutboundType(e.target.value)}
              className="w-72 px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="维修出库">维修出库</option>
              <option value="领用出库">领用出库</option>
              <option value="点检出库">点检出库</option>
              <option value="保养出库">保养出库</option>
              <option value="报废出库">报废出库</option>
              <option value="其他出库">其他出库</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-24 text-slate-700 font-semibold text-right">关联工单:</label>
            <select
              value={addWorkOrderNo}
              onChange={(e) => setAddWorkOrderNo(e.target.value)}
              className="w-72 px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="GD202609180001">GD202609180001 (1#数控机床主轴轴承异常)</option>
              <option value="GD202609170012">GD202609170012 (2#空压机气路漏气维护)</option>
              <option value="GD202609160034">GD202609160034 (动力车间伺服驱动器报警)</option>
              <option value="GD202609150008">GD202609150008 (包装线光电传感器更换)</option>
            </select>
          </div>
        </div>

        {/* Outbound Plan Section */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddItemToPlan}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
              <div className="border-l border-slate-200 pl-3 ml-2 font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span className="w-1 h-3.5 bg-blue-600 rounded-full"></span>
                <span>出库计划</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="p-3 w-14 text-center">序号</th>
                  <th className="p-3">
                    <span className="text-rose-500 mr-1">*</span>备件名称
                  </th>
                  <th className="p-3">备件编码</th>
                  <th className="p-3">备件分类</th>
                  <th className="p-3">规格型号</th>
                  <th className="p-3">品牌</th>
                  <th className="p-3">单位</th>
                  <th className="p-3">供应商</th>
                  <th className="p-3 font-mono">可用总数</th>
                  <th className="p-3 font-mono">
                    <span className="text-rose-500 mr-1">*</span>需求数量
                  </th>
                  <th className="p-3 text-center w-20">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {addPlanItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 1 ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <select
                        value={item.spareName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAddPlanItems(
                            addPlanItems.map((p) => (p.id === item.id ? { ...p, spareName: val } : p))
                          );
                        }}
                        className="px-2 py-1 border border-slate-200 rounded-md bg-white text-slate-800 text-xs w-40"
                      >
                        <option value="深沟球轴承">深沟球轴承</option>
                        <option value="气动电磁阀">气动电磁阀</option>
                        <option value="光电传感器">光电传感器</option>
                        <option value="工业接触器">工业接触器</option>
                        <option value="伺服驱动电机">伺服驱动电机</option>
                        <option value="工业变频器">工业变频器</option>
                      </select>
                    </td>
                    <td className="p-3 font-mono text-slate-700">{item.spareCode}</td>
                    <td className="p-3 text-slate-600">{item.category}</td>
                    <td className="p-3 font-mono text-slate-700">{item.spec}</td>
                    <td className="p-3 text-slate-800">{item.brand}</td>
                    <td className="p-3 text-slate-600">{item.unit}</td>
                    <td className="p-3 text-slate-800 font-medium">{item.supplier}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{item.availableStock}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={item.requiredQuantity || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setAddPlanItems(
                            addPlanItems.map((p) => (p.id === item.id ? { ...p, requiredQuantity: val } : p))
                          );
                        }}
                        placeholder="请输入"
                        className="w-24 px-2 py-1 border border-slate-200 rounded-md font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleRemovePlanItem(item.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        移除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: 打印出库单详情页面 (Screenshot 3)
  // ==========================================
  if (subView === 'print' && selectedRecordForAction) {
    const detailItems = selectedRecordForAction.items || [
      {
        id: 'it-1',
        spareName: '伺服驱动电机',
        spareCode: 'BJ-M-008',
        category: '电气类/电机/伺服电机',
        spec: 'MSMD042G1U',
        brand: '松下',
        unit: '台',
        supplier: '松下电器(中国)',
        requiredQuantity: 2,
        availableStock: 15,
        locations: 'A1-2货位 (4) , B2-2货位 (8)',
      },
      {
        id: 'it-2',
        spareName: '工业变频器',
        spareCode: 'BJ-D-012',
        category: '电气类/传动/变频器',
        spec: 'ATV610D11N4C',
        brand: '施耐德',
        unit: '台',
        supplier: '施耐德电气',
        requiredQuantity: 1,
        availableStock: 8,
        locations: 'A1-2货位 (4) , B2-2货位 (8)',
      },
      {
        id: 'it-3',
        spareName: '气动电磁阀',
        spareCode: 'BJ-V-005',
        category: '气动类/阀/电磁阀',
        spec: '2V025-08',
        brand: '亚德客',
        unit: '个',
        supplier: '亚德客集团',
        requiredQuantity: 10,
        availableStock: 50,
        locations: 'A1-2货位 (4) , B2-2货位 (8)',
      },
      {
        id: 'it-4',
        spareName: '深沟球轴承',
        spareCode: 'BJ-Z-009',
        category: '机械类/轴承/滚动轴承',
        spec: '6205-2RS',
        brand: '人本',
        unit: '套',
        supplier: '人本集团',
        requiredQuantity: 20,
        availableStock: 100,
        locations: '选择',
      },
    ];

    return (
      <div className="space-y-4 pb-16 text-xs text-slate-800">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">打印出库单</h2>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSubView('list')}
              className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                showToast(`已生成出库单据并发送至打印机`, 'success');
                setSubView('list');
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>保存并打印</span>
            </button>
          </div>
        </div>

        {/* Master Summary Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-3 gap-y-4 text-xs">
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">出库单号：</span>
              <span className="font-mono font-semibold text-slate-900">
                {selectedRecordForAction.outboundNo || 'CK202408189282'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">出库类型：</span>
              <span className="font-medium text-slate-900">{selectedRecordForAction.outboundType}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">关联工单号：</span>
              <span className="font-mono text-slate-800">{selectedRecordForAction.workOrderNo}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">申请人：</span>
              <span className="font-medium text-slate-900">{selectedRecordForAction.applicant || '赵琳'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">申请部门：</span>
              <span className="text-slate-800 font-medium">{selectedRecordForAction.department || '设备管理部'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">申请时间：</span>
              <span className="font-mono text-slate-700 font-semibold">
                {selectedRecordForAction.createTime.includes(':')
                  ? `${selectedRecordForAction.createTime}:00`
                  : `${selectedRecordForAction.createTime} 08:45:12`}
              </span>
            </div>
          </div>
        </div>

        {/* Detail Table with Locations */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="p-3 w-14 text-center">序号</th>
                  <th className="p-3">备件名称</th>
                  <th className="p-3">备件编码</th>
                  <th className="p-3">备件分类</th>
                  <th className="p-3">规格型号</th>
                  <th className="p-3">品牌</th>
                  <th className="p-3">单位</th>
                  <th className="p-3">供应商</th>
                  <th className="p-3 font-mono">需求数量</th>
                  <th className="p-3 font-mono">库存总数</th>
                  <th className="p-3">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 1 ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">{item.spareName}</td>
                    <td className="p-3 font-mono font-medium text-slate-700">{item.spareCode}</td>
                    <td className="p-3 text-slate-600">{item.category}</td>
                    <td className="p-3 font-mono text-slate-700">{item.spec}</td>
                    <td className="p-3 text-slate-800">{item.brand}</td>
                    <td className="p-3 text-slate-600">{item.unit}</td>
                    <td className="p-3 text-slate-800 font-medium">{item.supplier}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{item.requiredQuantity}</td>
                    <td className="p-3 font-mono font-bold text-blue-600">{item.availableStock}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setEditingItemForLoc(item);
                          setIsLocationModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        {item.locations || '选择'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location Picker Modal */}
        {isLocationModalOpen && editingItemForLoc && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 text-xs">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">选择下架出库货位</h3>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-slate-600">
                  出库备件：<span className="font-bold text-slate-900">{editingItemForLoc.spareName}</span> (需求 {editingItemForLoc.requiredQuantity} {editingItemForLoc.unit})
                </p>
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
                    <input
                      type="radio"
                      name="loc"
                      checked={selectedLocationStr === 'A1-2货位 (4) , B2-2货位 (8)'}
                      onChange={() => setSelectedLocationStr('A1-2货位 (4) , B2-2货位 (8)')}
                      className="text-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">A1-2货位 (4) , B2-2货位 (8)</div>
                      <div className="text-[11px] text-slate-500">主仓库 A片区 / 标准备件仓</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
                    <input
                      type="radio"
                      name="loc"
                      checked={selectedLocationStr === 'A区-01架-2层 (HW-A0102)'}
                      onChange={() => setSelectedLocationStr('A区-01架-2层 (HW-A0102)')}
                      className="text-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">A区-01架-2层 (HW-A0102)</div>
                      <div className="text-[11px] text-slate-500">西南区 1号仓</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    editingItemForLoc.locations = selectedLocationStr;
                    showToast(`已指定下架货位: ${selectedLocationStr}`, 'success');
                    setIsLocationModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 5: 出库详情页面 (Screenshot 5)
  // ==========================================
  if (subView === 'detail' && selectedRecordForAction) {
    const detailItems = selectedRecordForAction.items || [
      {
        id: 'it-d-1',
        batchNo: 'PC260910-A',
        spareName: '伺服驱动电机',
        spareCode: 'BJ-M-008',
        spec: 'MSMD042G1U',
        unit: '台',
        brand: '松下',
        supplier: '松下电器(中国)',
        requiredQuantity: 2,
        actualQuantity: 2,
        locations: 'A区-01架-2层',
        locationCode: 'HW-A0102',
      },
      {
        id: 'it-d-2',
        batchNo: 'PC260910-B',
        spareName: '工业变频器',
        spareCode: 'BJ-D-012',
        spec: 'ATV610D11N4C',
        unit: '台',
        brand: '施耐德',
        supplier: '施耐德电气',
        requiredQuantity: 1,
        actualQuantity: 1,
        locations: 'B区-03架-1层',
        locationCode: 'HW-B0301',
      },
      {
        id: 'it-d-3',
        batchNo: 'PC260908-C',
        spareName: '气动电磁阀',
        spareCode: 'BJ-V-005',
        spec: '2V025-08',
        unit: '个',
        brand: '亚德客',
        supplier: '亚德客集团',
        requiredQuantity: 10,
        actualQuantity: 10,
        locations: 'C区-05排-1层',
        locationCode: 'HW-C0501',
      },
      {
        id: 'it-d-4',
        batchNo: 'PC260905-D',
        spareName: '接近开关',
        spareCode: 'BJ-S-003',
        spec: 'NBN4-12GM40',
        unit: '个',
        brand: '倍加福',
        supplier: '倍加福中国',
        requiredQuantity: 5,
        actualQuantity: 5,
        locations: 'A区-02架-3层',
        locationCode: 'HW-A0203',
      },
      {
        id: 'it-d-5',
        batchNo: 'PC260901-E',
        spareName: '深沟球轴承',
        spareCode: 'BJ-Z-009',
        spec: '6205-2RS',
        unit: '套',
        brand: '人本',
        supplier: '人本集团',
        requiredQuantity: 20,
        actualQuantity: 20,
        locations: 'D区-01排-2层',
        locationCode: 'HW-D0102',
      },
    ];

    return (
      <div className="space-y-4 pb-16 text-xs text-slate-800">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">出库详情</h2>
          <button
            onClick={() => setSubView('list')}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        {/* Master Summary Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-3 gap-y-4 text-xs">
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">出库单号:</span>
              <span className="font-mono font-semibold text-slate-900">
                {selectedRecordForAction.outboundNo || 'CK202609170033'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">出库类型:</span>
              <span className="font-medium text-slate-900">{selectedRecordForAction.outboundType || '维修领料'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">关联工单号:</span>
              <span className="font-mono text-slate-800">{selectedRecordForAction.workOrderNo || 'XQ202510150001'}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">申请部门:</span>
              <span className="text-slate-800 font-medium">{selectedRecordForAction.department || '设备管理部'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">申请人:</span>
              <span className="font-medium text-slate-900">{selectedRecordForAction.applicant || '李伟明'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">创建时间:</span>
              <span className="font-mono text-slate-700 font-semibold">
                {selectedRecordForAction.createTime}
              </span>
            </div>
          </div>
        </div>

        {/* 12 Columns Detail Table matching Screenshot 5 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="p-3 w-12 text-center">序号</th>
                  <th className="p-3">批次号</th>
                  <th className="p-3">备品备件名称</th>
                  <th className="p-3">备品备件编码</th>
                  <th className="p-3">规格型号</th>
                  <th className="p-3">计量单位</th>
                  <th className="p-3">品牌</th>
                  <th className="p-3">生产厂商</th>
                  <th className="p-3 font-mono">需求数量</th>
                  <th className="p-3 font-mono">出库数量</th>
                  <th className="p-3">出库库位名称</th>
                  <th className="p-3">出库库位编码</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 1 ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-mono text-slate-900">{item.batchNo}</td>
                    <td className="p-3 font-semibold text-slate-900">{item.spareName}</td>
                    <td className="p-3 font-mono font-medium text-slate-700">{item.spareCode}</td>
                    <td className="p-3 font-mono text-slate-700">{item.spec}</td>
                    <td className="p-3 text-slate-600">{item.unit}</td>
                    <td className="p-3 text-slate-800">{item.brand}</td>
                    <td className="p-3 text-slate-800 font-medium">{item.supplier}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{item.requiredQuantity}</td>
                    <td className="p-3 font-mono font-bold text-blue-600">{item.actualQuantity || item.requiredQuantity}</td>
                    <td className="p-3 text-slate-700">{item.locations}</td>
                    <td className="p-3 font-mono text-slate-600">{item.locationCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1 & 4: 领用出库主列表页面 (Screenshot 1 & 4)
  // ==========================================
  return (
    <div className="space-y-4 pb-16 text-xs text-slate-800">
      {/* Filter Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Filter: 出库单号 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">出库单号:</span>
              <input
                type="text"
                value={filterOutboundNo}
                onChange={(e) => setFilterOutboundNo(e.target.value)}
                placeholder="请输入出库单号"
                className="w-48 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {/* Filter: 出库类型 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">出库类型:</span>
              <select
                value={filterOutboundType}
                onChange={(e) => setFilterOutboundType(e.target.value)}
                className="w-48 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs bg-white text-slate-700"
              >
                <option value="">选择出库类型</option>
                <option value="维修出库">维修出库</option>
                <option value="领用出库">领用出库</option>
                <option value="点检出库">点检出库</option>
                <option value="保养出库">保养出库</option>
                <option value="报废出库">报废出库</option>
                <option value="其他出库">其他出库</option>
              </select>
            </div>

            {/* Filter: 创建时间 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">创建时间:</span>
              <div className="relative">
                <input
                  type="text"
                  value={filterCreateTime}
                  onChange={(e) => setFilterCreateTime(e.target.value)}
                  placeholder="请选择时间"
                  className="w-48 pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Search / Reset Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => showToast('已完成出库单筛选查询', 'info')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setFilterOutboundNo('');
                setFilterOutboundType('');
                setFilterCreateTime('');
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
        {/* Sub Header / Tab Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-slate-900">领用出库列表</h3>
            {/* Tabs: 待出库 | 已出库 */}
            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden p-0.5 bg-slate-50">
              <button
                onClick={() => {
                  setActiveTab('待出库');
                  setSelectedIds([]);
                }}
                className={`px-3.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === '待出库'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                待出库
              </button>
              <button
                onClick={() => {
                  setActiveTab('已出库');
                  setSelectedIds([]);
                }}
                className={`px-3.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === '已出库'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                已出库
              </button>
            </div>
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView('add')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>
            <button
              onClick={() => showToast('已导出领用出库数据.xlsx', 'success')}
              className="px-3.5 py-1.5 bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>导出</span>
            </button>
            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className={`px-3.5 py-1.5 bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>批量删除</span>
            </button>
            <button
              onClick={() => showToast('已刷新领用出库列表', 'info')}
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

        {/* Table Content (Scrollable Container matching Screenshot 1 & 4) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
              <tr>
                {activeTab === '待出库' && (
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                )}
                <th className="p-3 w-14 text-center">序号</th>
                <th className="p-3">出库单号</th>
                <th className="p-3">出库类型</th>
                <th className="p-3">关联工单号</th>
                <th className="p-3 font-mono">需求总数量</th>
                <th className="p-3">申请人</th>
                <th className="p-3">申请部门</th>

                {/* Clickable Header for Asc/Desc Sorting on 创建时间 */}
                <th
                  onClick={() => {
                    setSortField('createTime');
                    const nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
                    setSortOrder(nextOrder);
                    showToast(
                      `已切换时间排序：按创建时间${nextOrder === 'desc' ? '最新降序（置顶）' : '升序'}排列`,
                      'info'
                    );
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>创建时间</span>
                    <span className="flex items-center text-blue-600">
                      {sortOrder === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 font-bold" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 font-bold" />
                      )}
                    </span>
                  </div>
                </th>

                {activeTab === '已出库' && (
                  <>
                    <th className="p-3 font-mono">出库总数量</th>
                    <th
                      onClick={() => {
                        setSortField('outboundTime');
                        const nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
                        setSortOrder(nextOrder);
                        showToast(`已切换时间排序：按出库时间${nextOrder === 'desc' ? '最新降序' : '升序'}排列`, 'info');
                      }}
                      className="p-3 cursor-pointer hover:bg-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>出库时间</span>
                        <span className="text-blue-600 font-bold">
                          {sortOrder === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                    </th>
                  </>
                )}

                <th className="p-3 text-center w-36">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    暂无相关出库单数据
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => {
                  const isSelected = selectedIds.includes(r.id);
                  const isEven = idx % 2 === 1;

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-blue-50/60'
                          : isEven
                          ? 'bg-emerald-50/20 hover:bg-emerald-50/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {activeTab === '待出库' && (
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(r.id)}
                            className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(r.outboundNo)}
                            className="text-slate-400 hover:text-blue-600 p-0.5 rounded"
                            title="复制单号"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <span>{r.outboundNo}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{r.outboundType}</td>
                      <td className="p-3 font-mono text-slate-700">{r.workOrderNo}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{r.requiredQty}</td>
                      <td className="p-3 text-slate-900 font-medium">{r.applicant}</td>
                      <td className="p-3 text-slate-600">{r.department}</td>
                      <td className="p-3 font-mono text-slate-600 font-medium">{r.createTime}</td>

                      {activeTab === '已出库' && (
                        <>
                          <td className="p-3 font-mono font-bold text-slate-800">{r.outboundQty || r.requiredQty}</td>
                          <td className="p-3 font-mono text-slate-600 font-semibold">{r.outboundTime || r.createTime}</td>
                        </>
                      )}

                      <td className="p-3 text-center space-x-3">
                        {activeTab === '待出库' ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRecordForAction(r);
                                setSubView('print');
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                              打印出库单
                            </button>
                            <button
                              onClick={() => {
                                setRecordToConfirm(r);
                                setIsConfirmModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                              确认出库
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedRecordForAction(r);
                              setSubView('detail');
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            详情
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
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

      {/* Confirmation Modal */}
      {isConfirmModalOpen && recordToConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600 fill-blue-100" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">确认完成出库吗？</h3>
            <p className="text-xs text-slate-500 mb-6">
              确认出库后，单号为 <span className="font-mono font-bold text-slate-800">{recordToConfirm.outboundNo}</span> 的备件将从库存中核销并生成出库流水。
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setRecordToConfirm(null);
                }}
                className="px-5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-md font-medium text-xs transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmOutbound}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs shadow-xs transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
