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
  ArrowLeft,
  Eye,
} from 'lucide-react';

export interface InboundReceiptRecord {
  id: string;
  serialNo?: string; // 序号编码 如 19951001
  inboundNo: string;
  arrivalNo: string; // 关联到货单号
  inboundType: string;
  quantity: number;
  totalAmount: number;
  applicant: string;
  department: string;
  createTime: string;
  inboundTime?: string;
  status: '待入库' | '已入库';
  // Detail payload
  deliveryNo?: string;
  expectedDeliveryDate?: string;
  supplier?: string;
  items?: InboundDetailItem[];
  subBatches?: InboundSubBatchItem[];
}

export interface InboundSubBatchItem {
  id: string;
  inboundNo: string;
  arrivalNo: string;
  inboundType: string;
  quantity: number;
  totalAmount: number;
  applicant: string;
  department: string;
  createTime: string;
  inboundTime: string;
}

export interface InboundDetailItem {
  id: string;
  spareName: string;
  spareCode: string;
  category: string;
  spec: string;
  brand: string;
  unit: string;
  supplier: string;
  quantity: number;
  locations: string;
}

export interface DeliveryNoticeItem {
  id: string;
  deliveryNo: string;
  purchaser: string;
  purchaseDept: string;
  supplier: string;
  createTime: string;
  itemCount: number;
}

interface InboundReceiptViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const InboundReceiptView: React.FC<InboundReceiptViewProps> = ({ showToast }) => {
  // Navigation sub-view: 'list' | 'print' | 'detail'
  const [subView, setSubView] = useState<'list' | 'print' | 'detail'>('list');
  const [selectedRecordForAction, setSelectedRecordForAction] = useState<InboundReceiptRecord | null>(null);

  // Active Tab: '待入库' | '已入库'
  const [activeTab, setActiveTab] = useState<'待入库' | '已入库'>('待入库');

  // Search Filter State
  const [filterInboundNo, setFilterInboundNo] = useState('');
  const [filterInboundType, setFilterInboundType] = useState('');
  const [filterCreateTime, setFilterCreateTime] = useState('');

  // Selected row IDs for batch delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Time Sorting: 'desc' (latest on top) or 'asc'
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [sortField, setSortField] = useState<'createTime' | 'inboundTime'>('createTime');

  // Detail sub-batch table sort
  const [detailSortOrder, setDetailSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recordToConfirm, setRecordToConfirm] = useState<InboundReceiptRecord | null>(null);

  // Modal 1 (Add) search & selection
  const [addFilterDeliveryNo, setAddFilterDeliveryNo] = useState('');
  const [addFilterPurchaser, setAddFilterPurchaser] = useState('');
  const [selectedDeliveryIds, setSelectedDeliveryIds] = useState<string[]>(['del-1']);

  // Warehouse location selector modal
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState<InboundDetailItem | null>(null);
  const [selectedWarehouseLoc, setSelectedWarehouseLoc] = useState('A1-2货位 (4) , B2-2货位 (8)');

  // Main Records Data
  const [records, setRecords] = useState<InboundReceiptRecord[]>([
    // === 待入库数据 (Pending) ===
    {
      id: 'rec-1',
      serialNo: '19951001',
      inboundNo: 'RK202609170045',
      arrivalNo: 'DH202609170011',
      inboundType: '需求计划入库',
      quantity: 50,
      totalAmount: 12500.0,
      applicant: '张伟',
      department: '生产运行部',
      createTime: '2026/9/17 9:30',
      status: '待入库',
      deliveryNo: 'XQ202510150001',
      expectedDeliveryDate: '2026-09-16',
      supplier: '广东奥峰紧固件有限公司',
      items: [
        {
          id: 'it-1',
          spareName: '深沟球轴承',
          spareCode: 'A07651',
          category: '机械类/轴承/滚动轴承',
          spec: '6205-2RS',
          brand: '人本轴承',
          unit: '个',
          supplier: '杭州轴承厂',
          quantity: 50,
          locations: 'A1-2货位 (4) , B2-2货位 (8)',
        },
        {
          id: 'it-2',
          spareName: '光电传感器',
          spareCode: 'EA07652',
          category: '电气类/传感器/光电开关',
          spec: 'E3Z-D61',
          brand: '欧姆龙',
          unit: '个',
          supplier: '苏州自动化仪表厂',
          quantity: 20,
          locations: 'A1-2货位 (4) , B2-2货位 (8)',
        },
        {
          id: 'it-3',
          spareName: '三相异步电机',
          spareCode: 'M07653',
          category: '电气类/电机/异步电机',
          spec: 'Y2-132S-4',
          brand: '皖南电机',
          unit: '台',
          supplier: '安徽电机制造厂',
          quantity: 5,
          locations: 'A1-2货位 (4) , B2-2货位 (8)',
        },
        {
          id: 'it-4',
          spareName: '气动电磁阀',
          spareCode: 'V07654',
          category: '气动类/阀/电磁阀',
          spec: '4V210-08',
          brand: '亚德客',
          unit: '个',
          supplier: '宁波气动元件厂',
          quantity: 100,
          locations: 'A1-3货位 (100)',
        },
      ],
    },
    {
      id: 'rec-2',
      serialNo: '19951002',
      inboundNo: 'RK202609160032',
      arrivalNo: 'DH202609160008',
      inboundType: '临时采购入库',
      quantity: 200,
      totalAmount: 8000.0,
      applicant: '李娜',
      department: '设备管理部',
      createTime: '2026/9/16 14:15',
      status: '待入库',
      deliveryNo: 'XQ202510150002',
      expectedDeliveryDate: '2026-09-16',
      supplier: '广州白云电气集团',
      items: [
        {
          id: 'it-2-1',
          spareName: '交流接触器',
          spareCode: 'CJX2-1810',
          category: '电气类/继电器与接触器',
          spec: 'AC 220V 18A',
          brand: '正泰电器',
          unit: '个',
          supplier: '广州白云电气集团',
          quantity: 200,
          locations: 'B1-1货位 (200)',
        },
      ],
    },
    {
      id: 'rec-3',
      serialNo: '19951003',
      inboundNo: 'RK202609150018',
      arrivalNo: 'DH202609150022',
      inboundType: '调拨入库',
      quantity: 1000,
      totalAmount: 5000.0,
      applicant: '王强',
      department: '仓储物流部',
      createTime: '2026/9/15 11:20',
      status: '待入库',
      deliveryNo: 'XQ202510150003',
      expectedDeliveryDate: '2026-09-15',
      supplier: '深圳汇川技术有限公司',
    },
    {
      id: 'rec-4',
      serialNo: '19951004',
      inboundNo: 'RK202609140027',
      arrivalNo: 'DH202609140019',
      inboundType: '需求计划入库',
      quantity: 30,
      totalAmount: 45000.0,
      applicant: '赵敏',
      department: '采购部',
      createTime: '2026/9/14 16:45',
      status: '待入库',
      deliveryNo: 'XQ202510150004',
      expectedDeliveryDate: '2026-09-14',
      supplier: '苏州自动化仪表厂',
    },
    {
      id: 'rec-5',
      serialNo: '19951005',
      inboundNo: 'RK202609120009',
      arrivalNo: 'DH202609120005',
      inboundType: '退货入库',
      quantity: 15,
      totalAmount: 3750.0,
      applicant: '陈建国',
      department: '质检部',
      createTime: '2026/9/12 10:10',
      status: '待入库',
    },
    {
      id: 'rec-6',
      serialNo: '19951006',
      inboundNo: 'RK202609100055',
      arrivalNo: 'DH202609100018',
      inboundType: '需求计划入库',
      quantity: 500,
      totalAmount: 25000.0,
      applicant: '刘洋',
      department: '生产运行部',
      createTime: '2026/9/10 13:50',
      status: '待入库',
    },
    {
      id: 'rec-7',
      serialNo: '19951007',
      inboundNo: 'RK202609080041',
      arrivalNo: 'DH202609080029',
      inboundType: '紧急采购入库',
      quantity: 10,
      totalAmount: 12000.0,
      applicant: '孙丽',
      department: '设备管理部',
      createTime: '2026/9/8 9:00',
      status: '待入库',
    },
    {
      id: 'rec-8',
      serialNo: '19951008',
      inboundNo: 'RK202609060012',
      arrivalNo: 'DH202609060007',
      inboundType: '需求计划入库',
      quantity: 80,
      totalAmount: 4000.0,
      applicant: '周杰',
      department: '维修班组',
      createTime: '2026/9/6 15:30',
      status: '待入库',
    },
    {
      id: 'rec-9',
      serialNo: '19951009',
      inboundNo: 'RK202609040038',
      arrivalNo: 'DH202609040014',
      inboundType: '调拨入库',
      quantity: 300,
      totalAmount: 9000.0,
      applicant: '吴刚',
      department: '仓储物流部',
      createTime: '2026/9/4 11:15',
      status: '待入库',
    },
    {
      id: 'rec-10',
      serialNo: '19951010',
      inboundNo: 'RK202609020023',
      arrivalNo: 'DH202609020002',
      inboundType: '需求计划入库',
      quantity: 120,
      totalAmount: 36000.0,
      applicant: '郑华',
      department: '生产运行部',
      createTime: '2026/9/2 8:45',
      status: '待入库',
    },

    // === 已入库数据 (Inbounded - matching Screenshot 1, 2, 3) ===
    {
      id: 'rec-done-1',
      serialNo: '19951001',
      inboundNo: 'XQ202510150001',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/16 14:20:00',
      inboundTime: '2026/9/16 15:00:00',
      status: '已入库',
      subBatches: [
        {
          id: 'sub-1',
          inboundNo: 'RK202609160005',
          arrivalNo: 'DH202609160011',
          inboundType: '需求计划入库',
          quantity: 50,
          totalAmount: 12500.0,
          applicant: '王芳',
          department: '生产运行部',
          createTime: '2026/9/16 14:20',
          inboundTime: '2026/9/16 15:00',
        },
        {
          id: 'sub-2',
          inboundNo: 'RK202609150012',
          arrivalNo: 'DH202609150008',
          inboundType: '需求计划入库',
          quantity: 100,
          totalAmount: 5000.0,
          applicant: '刘伟',
          department: '设备管理部',
          createTime: '2026/9/15 10:30',
          inboundTime: '2026/9/15 11:45',
        },
        {
          id: 'sub-3',
          inboundNo: 'RK202609120008',
          arrivalNo: 'DH202609120021',
          inboundType: '调拨入库',
          quantity: 200,
          totalAmount: 8000.0,
          applicant: '陈建国',
          department: '仓储物流部',
          createTime: '2026/9/12 11:20',
          inboundTime: '2026/9/12 11:55',
        },
        {
          id: 'sub-4',
          inboundNo: 'RK202609080015',
          arrivalNo: 'DH202609080033',
          inboundType: '临时采购入库',
          quantity: 30,
          totalAmount: 9000.0,
          applicant: '赵敏',
          department: '采购部',
          createTime: '2026/9/8 13:40',
          inboundTime: '2026/9/8 14:15',
        },
        {
          id: 'sub-5',
          inboundNo: 'RK202609050003',
          arrivalNo: 'DH202609050005',
          inboundType: '需求计划入库',
          quantity: 150,
          totalAmount: 18000.0,
          applicant: '孙浩',
          department: '设备管理部',
          createTime: '2026/9/5 9:10',
          inboundTime: '2026/9/5 9:45',
        },
      ],
    },
    {
      id: 'rec-done-2',
      serialNo: '19951001',
      inboundNo: 'XQ202510150002',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/15 16:20:29',
      inboundTime: '2026/9/15 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-3',
      serialNo: '19951001',
      inboundNo: 'XQ202510150003',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/14 16:20:29',
      inboundTime: '2026/9/14 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-4',
      serialNo: '19951001',
      inboundNo: 'XQ202510150004',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/13 16:20:29',
      inboundTime: '2026/9/13 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-5',
      serialNo: '19951001',
      inboundNo: 'XQ202510150005',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/12 16:20:29',
      inboundTime: '2026/9/12 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-6',
      serialNo: '19951001',
      inboundNo: 'XQ202510150006',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/10 16:20:29',
      inboundTime: '2026/9/10 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-7',
      serialNo: '19951001',
      inboundNo: 'XQ202510150007',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/08 16:20:29',
      inboundTime: '2026/9/08 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-8',
      serialNo: '19951001',
      inboundNo: 'XQ202510150008',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/06 16:20:29',
      inboundTime: '2026/9/06 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-9',
      serialNo: '19951001',
      inboundNo: 'XQ202510150009',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/04 16:20:29',
      inboundTime: '2026/9/04 16:20:29',
      status: '已入库',
    },
    {
      id: 'rec-done-10',
      serialNo: '19951001',
      inboundNo: 'XQ202510150010',
      arrivalNo: 'XQ202510150001',
      inboundType: '需求计划入库',
      quantity: 1100,
      totalAmount: 11000.0,
      applicant: '赵工坊',
      department: '设备管理部',
      createTime: '2026/9/02 16:20:29',
      inboundTime: '2026/9/02 16:20:29',
      status: '已入库',
    },
  ]);

  // Delivery Notices for Modal 1 (Add Modal)
  const deliveryNotices: DeliveryNoticeItem[] = [
    {
      id: 'del-1',
      deliveryNo: 'SD202609170088',
      purchaser: '张伟',
      purchaseDept: '生产运行部',
      supplier: '上海精工机械厂',
      createTime: '2026/9/17 9:15',
      itemCount: 4,
    },
    {
      id: 'del-2',
      deliveryNo: 'SD202609160055',
      purchaser: '李娜',
      purchaseDept: '设备管理部',
      supplier: '广州白云电气集团',
      createTime: '2026/9/16 13:50',
      itemCount: 2,
    },
    {
      id: 'del-3',
      deliveryNo: 'SD202609140021',
      purchaser: '王强',
      purchaseDept: '仓储物流部',
      supplier: '深圳汇川技术有限公司',
      createTime: '2026/9/14 15:30',
      itemCount: 1,
    },
    {
      id: 'del-4',
      deliveryNo: 'SD202609100033',
      purchaser: '赵敏',
      purchaseDept: '采购部',
      supplier: '苏州自动化仪表厂',
      createTime: '2026/9/10 11:20',
      itemCount: 3,
    },
    {
      id: 'del-5',
      deliveryNo: 'SD202609050012',
      purchaser: '陈建国',
      purchaseDept: '质检部',
      supplier: '宁波气动元件厂',
      createTime: '2026/9/05 09:40',
      itemCount: 2,
    },
  ];

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`已复制单号: ${text}`, 'success');
  };

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    let list = records.filter((r) => {
      if (r.status !== activeTab) return false;
      if (filterInboundNo && !r.inboundNo.toLowerCase().includes(filterInboundNo.toLowerCase())) {
        return false;
      }
      if (filterInboundType && r.inboundType !== filterInboundType) {
        return false;
      }
      if (filterCreateTime && !r.createTime.includes(filterCreateTime)) {
        return false;
      }
      return true;
    });

    // Time sort (default descending latest on top)
    list.sort((a, b) => {
      const fieldA = sortField === 'inboundTime' ? (a.inboundTime || a.createTime) : a.createTime;
      const fieldB = sortField === 'inboundTime' ? (b.inboundTime || b.createTime) : b.createTime;
      const timeA = new Date(fieldA.replace(/\//g, '-')).getTime();
      const timeB = new Date(fieldB.replace(/\//g, '-')).getTime();
      if (sortOrder === 'desc') {
        return timeB - timeA;
      } else {
        return timeA - timeB;
      }
    });

    return list;
  }, [records, activeTab, filterInboundNo, filterInboundType, filterCreateTime, sortOrder, sortField]);

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
      showToast('请先选择要删除的入库单', 'warning');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedIds.length} 条入库单记录吗？`)) {
      setRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      showToast(`已成功删除 ${selectedIds.length} 项入库单`, 'success');
    }
  };

  // Confirm Inbound Execution
  const handleConfirmInbound = () => {
    if (!recordToConfirm) return;
    const now = new Date();
    const nowStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordToConfirm.id
          ? {
              ...r,
              status: '已入库',
              inboundTime: nowStr,
              createTime: r.createTime,
            }
          : r
      )
    );
    showToast(`入库单 ${recordToConfirm.inboundNo} 已确认完成入库！`, 'success');
    setIsConfirmModalOpen(false);
    setRecordToConfirm(null);
  };

  // Add Modal Confirm
  const handleAddSubmit = () => {
    if (selectedDeliveryIds.length === 0) {
      showToast('请至少选择一条送货单据', 'warning');
      return;
    }

    const selectedNotices = deliveryNotices.filter((d) => selectedDeliveryIds.includes(d.id));
    const newItems: InboundReceiptRecord[] = selectedNotices.map((n, idx) => {
      const now = new Date();
      const nowStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      return {
        id: `rec-${Date.now()}-${idx}`,
        serialNo: `1995${Math.floor(1000 + Math.random() * 9000)}`,
        inboundNo: `RK${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`,
        arrivalNo: n.deliveryNo,
        inboundType: '需求计划入库',
        quantity: 175,
        totalAmount: 18500.0,
        applicant: n.purchaser,
        department: n.purchaseDept,
        createTime: nowStr,
        status: '待入库',
        deliveryNo: n.deliveryNo,
        expectedDeliveryDate: now.toISOString().slice(0, 10),
        supplier: n.supplier,
        items: [
          {
            id: `it-${Date.now()}-1`,
            spareName: '深沟球轴承',
            spareCode: 'A07651',
            category: '机械类/轴承/滚动轴承',
            spec: '6205-2RS',
            brand: '人本轴承',
            unit: '个',
            supplier: '杭州轴承厂',
            quantity: 50,
            locations: 'A1-2货位 (4) , B2-2货位 (8)',
          },
          {
            id: `it-${Date.now()}-2`,
            spareName: '光电传感器',
            spareCode: 'EA07652',
            category: '电气类/传感器/光电开关',
            spec: 'E3Z-D61',
            brand: '欧姆龙',
            unit: '个',
            supplier: '苏州自动化仪表厂',
            quantity: 20,
            locations: 'A1-2货位 (4) , B2-2货位 (8)',
          },
        ],
      };
    });

    setRecords([...newItems, ...records]);
    setIsAddModalOpen(false);
    showToast(`成功新增 ${newItems.length} 条待入库单据`, 'success');
  };

  // Open Detail View (Screenshot 3)
  const handleOpenDetailView = (record: InboundReceiptRecord) => {
    setSelectedRecordForAction(record);
    setSubView('detail');
  };

  // Open Print View
  const handleOpenPrintView = (record: InboundReceiptRecord) => {
    setSelectedRecordForAction(record);
    setSubView('print');
  };

  // ==========================================
  // VIEW 3: 入库详情页面 (Image 3)
  // ==========================================
  if (subView === 'detail' && selectedRecordForAction) {
    const defaultSubBatches: InboundSubBatchItem[] = selectedRecordForAction.subBatches || [
      {
        id: 'sub-1',
        inboundNo: 'RK202609160005',
        arrivalNo: 'DH202609160011',
        inboundType: '需求计划入库',
        quantity: 50,
        totalAmount: 12500.0,
        applicant: '王芳',
        department: '生产运行部',
        createTime: '2026/9/16 14:20',
        inboundTime: '2026/9/16 15:00',
      },
      {
        id: 'sub-2',
        inboundNo: 'RK202609150012',
        arrivalNo: 'DH202609150008',
        inboundType: '需求计划入库',
        quantity: 100,
        totalAmount: 5000.0,
        applicant: '刘伟',
        department: '设备管理部',
        createTime: '2026/9/15 10:30',
        inboundTime: '2026/9/15 11:45',
      },
      {
        id: 'sub-3',
        inboundNo: 'RK202609120008',
        arrivalNo: 'DH202609120021',
        inboundType: '调拨入库',
        quantity: 200,
        totalAmount: 8000.0,
        applicant: '陈建国',
        department: '仓储物流部',
        createTime: '2026/9/12 11:20',
        inboundTime: '2026/9/12 11:55',
      },
      {
        id: 'sub-4',
        inboundNo: 'RK202609080015',
        arrivalNo: 'DH202609080033',
        inboundType: '临时采购入库',
        quantity: 30,
        totalAmount: 9000.0,
        applicant: '赵敏',
        department: '采购部',
        createTime: '2026/9/8 13:40',
        inboundTime: '2026/9/8 14:15',
      },
      {
        id: 'sub-5',
        inboundNo: 'RK202609050003',
        arrivalNo: 'DH202609050005',
        inboundType: '需求计划入库',
        quantity: 150,
        totalAmount: 18000.0,
        applicant: '孙浩',
        department: '设备管理部',
        createTime: '2026/9/5 9:10',
        inboundTime: '2026/9/5 9:45',
      },
    ];

    // Sorted sub batches
    const sortedSubBatches = [...defaultSubBatches].sort((a, b) => {
      const timeA = new Date(a.inboundTime.replace(/\//g, '-')).getTime();
      const timeB = new Date(b.inboundTime.replace(/\//g, '-')).getTime();
      return detailSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return (
      <div className="space-y-4 pb-16 text-xs text-slate-800">
        {/* Top Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">打印入库单</h2>
          <button
            onClick={() => setSubView('list')}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-xs"
          >
            返回
          </button>
        </div>

        {/* Master Info Grid Box (6 Fields matching Image 3) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-3 gap-y-4 text-xs">
            <div className="flex items-center">
              <span className="w-20 text-slate-500 font-medium">入库单号:</span>
              <span className="font-mono font-semibold text-slate-900">
                {selectedRecordForAction.inboundNo || 'XQ202510150001'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-slate-500 font-medium">入库类型:</span>
              <span className="font-medium text-slate-900">
                {selectedRecordForAction.inboundType || '需求计划入库'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-slate-500 font-medium">申请人:</span>
              <span className="font-medium text-slate-900">
                {selectedRecordForAction.applicant || '王芳'}
              </span>
            </div>

            <div className="flex items-center">
              <span className="w-20 text-slate-500 font-medium">申请部门:</span>
              <span className="text-slate-800 font-medium">
                {selectedRecordForAction.department || '设备管理部'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-slate-500 font-medium">创建时间:</span>
              <span className="font-mono text-slate-700 font-medium">
                {selectedRecordForAction.createTime.includes(':')
                  ? selectedRecordForAction.createTime
                  : `${selectedRecordForAction.createTime} 14:20:00`}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-slate-500 font-medium">入库时间:</span>
              <span className="font-mono text-slate-700 font-medium">
                {selectedRecordForAction.inboundTime || '2026-09-16 15:00:00'}
              </span>
            </div>
          </div>
        </div>

        {/* Sub Inbound Orders Table (Matching Screenshot 3) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="p-3 w-14 text-center">序号</th>
                  <th className="p-3">入库单号</th>
                  <th className="p-3">关联到货单号</th>
                  <th className="p-3">入库类型</th>
                  <th className="p-3">入库总数量</th>
                  <th className="p-3">入库总金额 (元)</th>
                  <th className="p-3">申请人</th>
                  <th className="p-3">申请部门</th>
                  <th className="p-3">创建时间</th>
                  <th
                    onClick={() => {
                      const next = detailSortOrder === 'desc' ? 'asc' : 'desc';
                      setDetailSortOrder(next);
                      showToast(`已切换明细时间排序: ${next === 'desc' ? '最新降序' : '升序'}`, 'info');
                    }}
                    className="p-3 cursor-pointer hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      <span>入库时间</span>
                      <span className="text-blue-600 font-bold">
                        {detailSortOrder === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedSubBatches.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 1 ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-mono font-medium text-slate-900">{item.inboundNo}</td>
                    <td className="p-3 font-mono text-slate-700">{item.arrivalNo}</td>
                    <td className="p-3 text-slate-800">{item.inboundType}</td>
                    <td className="p-3 font-mono font-bold text-slate-800">{item.quantity}</td>
                    <td className="p-3 font-mono text-slate-800">
                      {item.totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-3 text-slate-900 font-medium">{item.applicant}</td>
                    <td className="p-3 text-slate-600">{item.department}</td>
                    <td className="p-3 font-mono text-slate-600">{item.createTime}</td>
                    <td className="p-3 font-mono text-slate-700 font-semibold">{item.inboundTime}</td>
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
  // VIEW 2: 打印入库单详情页面 (Image 3 legacy/modal)
  // ==========================================
  if (subView === 'print' && selectedRecordForAction) {
    const detailItems = selectedRecordForAction.items || [
      {
        id: 'it-1',
        spareName: '深沟球轴承',
        spareCode: 'A07651',
        category: '机械类/轴承/滚动轴承',
        spec: '6205-2RS',
        brand: '人本轴承',
        unit: '个',
        supplier: '杭州轴承厂',
        quantity: 50,
        locations: 'A1-2货位 (4) , B2-2货位 (8)',
      },
      {
        id: 'it-2',
        spareName: '光电传感器',
        spareCode: 'EA07652',
        category: '电气类/传感器/光电开关',
        spec: 'E3Z-D61',
        brand: '欧姆龙',
        unit: '个',
        supplier: '苏州自动化仪表厂',
        quantity: 20,
        locations: 'A1-2货位 (4) , B2-2货位 (8)',
      },
      {
        id: 'it-3',
        spareName: '三相异步电机',
        spareCode: 'M07653',
        category: '电气类/电机/异步电机',
        spec: 'Y2-132S-4',
        brand: '皖南电机',
        unit: '台',
        supplier: '安徽电机制造厂',
        quantity: 5,
        locations: 'A1-2货位 (4) , B2-2货位 (8)',
      },
      {
        id: 'it-4',
        spareName: '气动电磁阀',
        spareCode: 'V07654',
        category: '气动类/阀/电磁阀',
        spec: '4V210-08',
        brand: '亚德客',
        unit: '个',
        supplier: '宁波气动元件厂',
        quantity: 100,
        locations: 'A1-3货位 (100)',
      },
    ];

    const totalQty = detailItems.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
      <div className="space-y-4 pb-16 text-xs text-slate-800">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">打印入库单</h2>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSubView('list')}
              className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                showToast(`已保存并输出打印入库单`, 'success');
                setSubView('list');
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>保存并打印</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-3 gap-y-4 text-xs">
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">到货单号：</span>
              <span className="font-mono font-semibold text-slate-900">
                {selectedRecordForAction.deliveryNo || selectedRecordForAction.arrivalNo || 'XQ202510150001'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">预计到货时间：</span>
              <span className="font-mono text-slate-800">
                {selectedRecordForAction.expectedDeliveryDate || '2026-09-16'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">采购人：</span>
              <span className="font-medium text-slate-900">
                {selectedRecordForAction.applicant || '赵工坊'}
              </span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">采购部门：</span>
              <span className="text-slate-800 font-medium">
                {selectedRecordForAction.department || '设备管理部'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">供应商名称：</span>
              <span className="text-slate-900 font-medium">
                {selectedRecordForAction.supplier || '广东奥峰紧固件有限公司'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium">创建时间：</span>
              <span className="font-mono text-slate-700 font-semibold">
                {selectedRecordForAction.createTime}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-3 w-14 text-center">序号</th>
                  <th className="p-3">备件名称</th>
                  <th className="p-3">备件编码</th>
                  <th className="p-3">备件分类</th>
                  <th className="p-3">规格型号</th>
                  <th className="p-3">品牌</th>
                  <th className="p-3">单位</th>
                  <th className="p-3">供应商</th>
                  <th className="p-3">入库数量</th>
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
                    <td className="p-3 font-mono font-bold text-slate-900">{item.quantity}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setCurrentEditingItem(item);
                          setIsLocationModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        {item.locations}
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="p-3 text-center">合计</td>
                  <td className="p-3">-</td>
                  <td className="p-3">-</td>
                  <td className="p-3">-</td>
                  <td className="p-3">-</td>
                  <td className="p-3">-</td>
                  <td className="p-3">-</td>
                  <td className="p-3">-</td>
                  <td className="p-3 font-mono font-bold text-rose-600 text-sm">{totalQty}</td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: 收货入库主列表页面 (Image 1 & Image 2)
  // ==========================================
  return (
    <div className="space-y-4 pb-16 text-xs text-slate-800">
      {/* Filter Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Filter: 入库单号 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">入库单号:</span>
              <input
                type="text"
                value={filterInboundNo}
                onChange={(e) => setFilterInboundNo(e.target.value)}
                placeholder="请输入入库单号"
                className="w-48 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {/* Filter: 入库类型 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">入库类型:</span>
              <select
                value={filterInboundType}
                onChange={(e) => setFilterInboundType(e.target.value)}
                className="w-48 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs bg-white text-slate-700"
              >
                <option value="">选择入库类型</option>
                <option value="需求计划入库">需求计划入库</option>
                <option value="临时采购入库">临时采购入库</option>
                <option value="调拨入库">调拨入库</option>
                <option value="退货入库">退货入库</option>
                <option value="紧急采购入库">紧急采购入库</option>
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
              onClick={() => showToast('已完成入库单筛选查询', 'info')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setFilterInboundNo('');
                setFilterInboundType('');
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
            <h3 className="text-sm font-bold text-slate-900">收货入库列表</h3>
            {/* Tabs: 待入库 | 已入库 */}
            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden p-0.5 bg-slate-50">
              <button
                onClick={() => {
                  setActiveTab('待入库');
                  setSelectedIds([]);
                }}
                className={`px-3.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === '待入库'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                待入库
              </button>
              <button
                onClick={() => {
                  setActiveTab('已入库');
                  setSelectedIds([]);
                }}
                className={`px-3.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === '已入库'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                已入库
              </button>
            </div>
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>
            <button
              onClick={() => showToast('已导出收货入库清单数据.xlsx', 'success')}
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
              onClick={() => showToast('已刷新收货入库列表', 'info')}
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

        {/* Table Content (Scrollable Container matching Screenshot 1 & 2) */}
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
                <th className="p-3 w-14 text-center">序号</th>
                <th className="p-3">入库单号</th>
                {activeTab === '已入库' && <th className="p-3">关联到货单号</th>}
                <th className="p-3">入库类型</th>
                <th className="p-3">
                  {activeTab === '待入库' ? '待入库总数量' : '入库总数量'}
                </th>
                <th className="p-3">
                  {activeTab === '待入库' ? '待入库总金额 (元)' : '入库总金额 (元)'}
                </th>
                <th className="p-3">申请人</th>
                <th className="p-3">申请部门</th>

                {/* Clickable Header for Asc/Desc Sorting on 创建时间 */}
                <th
                  onClick={() => {
                    setSortField('createTime');
                    const nextOrder = sortField === 'createTime' && sortOrder === 'desc' ? 'asc' : 'desc';
                    setSortOrder(nextOrder);
                    showToast(
                      `已按创建时间${nextOrder === 'desc' ? '最新降序（置顶）' : '升序'}排列`,
                      'info'
                    );
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>创建时间</span>
                    <span className="flex items-center text-blue-600">
                      {sortField === 'createTime' && sortOrder === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 font-bold" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 font-bold" />
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-500 font-normal">
                      ({sortField === 'createTime' && sortOrder === 'desc' ? '最新降序' : '升序'})
                    </span>
                  </div>
                </th>

                {/* 入库时间 column in 已入库 tab */}
                {activeTab === '已入库' && (
                  <th
                    onClick={() => {
                      setSortField('inboundTime');
                      const nextOrder = sortField === 'inboundTime' && sortOrder === 'desc' ? 'asc' : 'desc';
                      setSortOrder(nextOrder);
                      showToast(
                        `已按入库时间${nextOrder === 'desc' ? '最新降序（置顶）' : '升序'}排列`,
                        'info'
                      );
                    }}
                    className="p-3 cursor-pointer hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>入库时间</span>
                      <span className="flex items-center text-blue-600">
                        {sortField === 'inboundTime' && sortOrder === 'desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 font-bold" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 font-bold" />
                        )}
                      </span>
                    </div>
                  </th>
                )}

                <th className="p-3 text-center w-36">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    暂无相关入库单数据
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
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(r.id)}
                          className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700 flex items-center justify-center gap-1">
                        <span>{r.serialNo || idx + 1}</span>
                        <button
                          onClick={() => handleCopy(r.serialNo || r.inboundNo)}
                          className="text-slate-400 hover:text-blue-600"
                          title="复制序号"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-900">{r.inboundNo}</td>
                      {activeTab === '已入库' && (
                        <td className="p-3 font-mono text-slate-700">{r.arrivalNo}</td>
                      )}
                      <td className="p-3 text-slate-700 font-medium">{r.inboundType}</td>
                      <td className="p-3 font-mono font-semibold text-slate-800">
                        {r.quantity.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-800">
                        {r.totalAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-3 text-slate-900 font-medium">{r.applicant}</td>
                      <td className="p-3 text-slate-600">{r.department}</td>
                      <td className="p-3 font-mono text-slate-600 font-medium">{r.createTime}</td>
                      {activeTab === '已入库' && (
                        <td className="p-3 font-mono text-slate-600 font-medium">{r.inboundTime || r.createTime}</td>
                      )}
                      <td className="p-3 text-center space-x-3">
                        {activeTab === '已入库' ? (
                          <button
                            onClick={() => handleOpenDetailView(r)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            详情
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenPrintView(r)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                              打印入库单
                            </button>
                            <button
                              onClick={() => {
                                setRecordToConfirm(r);
                                setIsConfirmModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                              确认入库
                            </button>
                          </>
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
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40">
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
              <option>50条/页</option>
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

      {/* ==========================================
          MODAL 1: 新增入库单弹窗 (Image 2)
          ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 text-xs">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h3 className="font-bold text-slate-900 text-sm">新增</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 whitespace-nowrap">送货单号:</span>
                    <input
                      type="text"
                      value={addFilterDeliveryNo}
                      onChange={(e) => setAddFilterDeliveryNo(e.target.value)}
                      placeholder="请输入送货单号"
                      className="w-44 px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 whitespace-nowrap">采购人:</span>
                    <input
                      type="text"
                      value={addFilterPurchaser}
                      onChange={(e) => setAddFilterPurchaser(e.target.value)}
                      placeholder="请输入采购人"
                      className="w-44 px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('已查询匹配送货单', 'info')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={() => {
                      setAddFilterDeliveryNo('');
                      setAddFilterPurchaser('');
                    }}
                    className="px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          deliveryNotices.length > 0 &&
                          deliveryNotices.every((d) => selectedDeliveryIds.includes(d.id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDeliveryIds(deliveryNotices.map((d) => d.id));
                          } else {
                            setSelectedDeliveryIds([]);
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                    </th>
                    <th className="p-2.5 w-12 text-center">序号</th>
                    <th className="p-2.5">送货单号</th>
                    <th className="p-2.5">采购人</th>
                    <th className="p-2.5">采购部门</th>
                    <th className="p-2.5">供应商</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveryNotices.map((d, idx) => {
                    const isChecked = selectedDeliveryIds.includes(d.id);
                    const isEven = idx % 2 === 1;

                    return (
                      <tr
                        key={d.id}
                        className={`transition-colors ${
                          isChecked
                            ? 'bg-blue-50/50'
                            : isEven
                            ? 'bg-emerald-50/20 hover:bg-emerald-50/40'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedDeliveryIds(selectedDeliveryIds.filter((id) => id !== d.id));
                              } else {
                                setSelectedDeliveryIds([...selectedDeliveryIds, d.id]);
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                        </td>
                        <td className="p-2.5 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-medium text-slate-900">{d.deliveryNo}</td>
                        <td className="p-2.5 text-slate-800 font-medium">{d.purchaser}</td>
                        <td className="p-2.5 text-slate-600">{d.purchaseDept}</td>
                        <td className="p-2.5 text-slate-800 font-medium">{d.supplier}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  当前已选{' '}
                  <span className="text-rose-500 font-bold font-mono">
                    {selectedDeliveryIds.length}
                  </span>{' '}
                  项数据/共计{' '}
                  <span className="text-rose-500 font-bold font-mono">8</span> 项数据
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="px-1.5 py-0.5 border border-slate-200 rounded">&lt;</button>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-mono font-bold">
                    1
                  </span>
                  <button className="px-1.5 py-0.5 border border-slate-200 rounded">&gt;</button>
                  <select className="px-1 py-0.5 border border-slate-200 rounded bg-white text-slate-600">
                    <option>10条/页</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddSubmit}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: 确认完成入库二次确认弹窗 (Image 4)
          ========================================== */}
      {isConfirmModalOpen && recordToConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600 fill-blue-100" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">确认完成入库吗？</h3>
            <p className="text-xs text-slate-500 mb-6">
              确认入库后，单号为 <span className="font-mono font-bold text-slate-800">{recordToConfirm.inboundNo}</span> 的物料将计入系统可用库存。
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
                onClick={handleConfirmInbound}
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
