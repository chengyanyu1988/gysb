import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckSquare,
  FileText,
  User,
  AlertCircle,
  Calendar,
  X,
  Check,
  Send,
  ArrowRight,
  ShieldCheck,
  History,
  Building,
  Wrench,
  Package,
  Layers,
  FileCheck2,
  HelpCircle,
  CornerDownRight
} from 'lucide-react';

interface CommonProps {
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export interface WorkOrderApprovalItem {
  id: string;
  orderNo: string; // 工单编码
  initiator: string; // 发起人
  department: string; // 所属部门
  category: string; // 审批类别 (e.g. 设备维修申请, 备件采购审批, 年度保养计划审批, 生产线故障报修...)
  urgency: '紧急' | '重要' | '一般' | '低';
  equipmentName: string; // 关联设备
  equipmentCode: string;
  estimatedCost: number; // 预估费用
  applyReason: string; // 申请事由
  initiateTime: string; // 审批发起时间
  status: '待审批' | '审批中' | '已通过' | '已驳回';
  currentNode: string; // 当前审批节点
  currentApprover: string; // 当前审批人
  historyNodes: {
    nodeName: string;
    approver: string;
    role: string;
    status: 'passed' | 'rejected' | 'pending' | 'waiting';
    handleTime?: string;
    opinion?: string;
  }[];
}

export const INITIAL_WORKORDER_APPROVALS: WorkOrderApprovalItem[] = [
  {
    id: 'appr-1',
    orderNo: 'WX20260917001',
    initiator: '李伟明',
    department: '机加工一车间',
    category: '设备维修申请流程',
    urgency: '紧急',
    equipmentName: '1#高速立式加工中心',
    equipmentCode: 'CNC-2024-01',
    estimatedCost: 3500,
    applyReason: '主轴主电机在高速运转时出现异常共振及发热报警，急需拆机更换高精轴承及动平衡校正。',
    initiateTime: '2026/09/17 08:30:20',
    status: '待审批',
    currentNode: '第一审批节点',
    currentApprover: '车间设备主管（张小刀）',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '李伟明',
        role: '维修工程师',
        status: 'passed',
        handleTime: '2026/09/17 08:30:20',
        opinion: '设备振动值超标，建议停机抢修。',
      },
      {
        nodeName: '第一审批节点',
        approver: '张小刀',
        role: '车间设备主管',
        status: 'pending',
      },
      {
        nodeName: '第二审批节点',
        approver: '王建国',
        role: '设备动力科长',
        status: 'waiting',
      },
    ],
  },
  {
    id: 'appr-2',
    orderNo: 'CG20260916002',
    initiator: '王芳',
    department: '采购部',
    category: '备件采购审批流',
    urgency: '重要',
    equipmentName: '智能变频冷水机组',
    equipmentCode: 'CW-3000-INV',
    estimatedCost: 12800,
    applyReason: '申请紧急采购原装德国进口螺杆压缩机密封套件及过滤芯2套，用于三季度预防性换季大保。',
    initiateTime: '2026/09/16 14:22:15',
    status: '待审批',
    currentNode: '第一审批节点',
    currentApprover: '采购部主管（孙经理）',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '王芳',
        role: '采购专员',
        status: 'passed',
        handleTime: '2026/09/16 14:22:15',
        opinion: '已对比三家原厂供应商报价，此为最低含税价。',
      },
      {
        nodeName: '第一审批节点',
        approver: '孙经理',
        role: '采购部主管',
        status: 'pending',
      },
      {
        nodeName: '第二审批节点',
        approver: '赵总',
        role: '财务总监',
        status: 'waiting',
      },
    ],
  },
  {
    id: 'appr-3',
    orderNo: 'BY20260915003',
    initiator: '陈建国',
    department: '动力运行车间',
    category: '年度保养计划审批',
    urgency: '一般',
    equipmentName: '动力车间2#空压机组',
    equipmentCode: 'AC-002-BLT',
    estimatedCost: 4200,
    applyReason: '2026年度空压机三级大修保养计划，包含润滑油置换、油分芯与空滤芯更换、全回路气密性耐压打压测试。',
    initiateTime: '2026/09/15 09:15:00',
    status: '待审批',
    currentNode: '第一审批节点',
    currentApprover: '设备动力科长（王科长）',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '陈建国',
        role: '动力班长',
        status: 'passed',
        handleTime: '2026/09/15 09:15:00',
        opinion: '计划在国庆停产检修期间实施，不影响白班正常供气。',
      },
      {
        nodeName: '第一审批节点',
        approver: '王科长',
        role: '设备动力科长',
        status: 'pending',
      },
    ],
  },
  {
    id: 'appr-4',
    orderNo: 'BX20260914004',
    initiator: '刘洋',
    department: 'SMT贴片车间',
    category: '生产线故障报修',
    urgency: '重要',
    equipmentName: '3号高速高精贴片机',
    equipmentCode: 'SMT-P3-08',
    estimatedCost: 800,
    applyReason: '贴片头X轴伺服报警驱动器报错Err-24，需校准光栅尺并测试通信排线接插稳定性。',
    initiateTime: '2026/09/14 16:45:30',
    status: '审批中',
    currentNode: '第二审批节点',
    currentApprover: '生产厂长（周厂长）',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '刘洋',
        role: '贴片操作员',
        status: 'passed',
        handleTime: '2026/09/14 16:45:30',
        opinion: '产线暂时切至2号机缓冲，请尽快维修。',
      },
      {
        nodeName: '第一审批节点',
        approver: '张主管',
        role: '车间主管',
        status: 'passed',
        handleTime: '2026/09/14 17:10:12',
        opinion: '同意，已调派内部资深电气工程师跟进。',
      },
      {
        nodeName: '第二审批节点',
        approver: '周厂长',
        role: '生产厂长',
        status: 'pending',
      },
    ],
  },
  {
    id: 'appr-5',
    orderNo: 'BJ20260913005',
    initiator: '孙丽',
    department: '后道包装车间',
    category: '关键部件更换申请',
    urgency: '紧急',
    equipmentName: '自动包装码垛流水线',
    equipmentCode: 'PKG-LINE-02',
    estimatedCost: 8600,
    applyReason: '码垛机械手伺服减速机齿轮磨损严重造成定位偏差，需调用备件库RV减速机总成进行原位替换。',
    initiateTime: '2026/09/13 11:20:10',
    status: '已通过',
    currentNode: '流程归档',
    currentApprover: '--',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '孙丽',
        role: '包装线组长',
        status: 'passed',
        handleTime: '2026/09/13 11:20:10',
        opinion: '备件库存有货，已完成出库领用预锁定。',
      },
      {
        nodeName: '第一审批节点',
        approver: '车间主任',
        role: '车间主任',
        status: 'passed',
        handleTime: '2026/09/13 11:45:00',
        opinion: '情况属实，批准更换。',
      },
      {
        nodeName: '第二审批节点',
        approver: '设备科长',
        role: '设备动力科长',
        status: 'passed',
        handleTime: '2026/09/13 13:10:00',
        opinion: '已核实技术参数匹配，准予领料并组织抢修。',
      },
    ],
  },
  {
    id: 'appr-6',
    orderNo: 'XJ20260912006',
    initiator: '赵敏',
    department: '高压供配电室',
    category: '季度巡检报告审批',
    urgency: '低',
    equipmentName: '10KV高压配电柜整组',
    equipmentCode: 'HV-SW-10K',
    estimatedCost: 0,
    applyReason: '三季度高压变配电红外热成像及局部放电巡检全部指标正常，无超温及异常电晕放电现象。',
    initiateTime: '2026/09/12 10:05:40',
    status: '已通过',
    currentNode: '流程归档',
    currentApprover: '--',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '赵敏',
        role: '值班电工',
        status: 'passed',
        handleTime: '2026/09/12 10:05:40',
        opinion: '红外测温记录表及局放谱图已归档入附件。',
      },
      {
        nodeName: '第一审批节点',
        approver: '电气主管',
        role: '安全总监',
        status: 'passed',
        handleTime: '2026/09/12 11:00:20',
        opinion: '数据合格，准予结案归档。',
      },
    ],
  },
  {
    id: 'appr-7',
    orderNo: 'WX20260911007',
    initiator: '张伟',
    department: '品质检测中心',
    category: '实验室设备维修',
    urgency: '紧急',
    equipmentName: '三坐标高精测量机',
    equipmentCode: 'CMM-ZEISS-01',
    estimatedCost: 15000,
    applyReason: '红宝石测针测头测座旋转机构卡滞，精度校验超差，需联系蔡司原厂上门校准与更换传感器。',
    initiateTime: '2026/09/11 15:50:00',
    status: '已驳回',
    currentNode: '审批驳回',
    currentApprover: '品保实验室主管（钱主任）',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '张伟',
        role: '质量工程师',
        status: 'passed',
        handleTime: '2026/09/11 15:50:00',
        opinion: '影响下周批量出货全尺寸复检，请求特批原厂维修。',
      },
      {
        nodeName: '第一审批节点',
        approver: '钱主任',
        role: '品保实验室主管',
        status: 'rejected',
        handleTime: '2026/09/11 16:30:10',
        opinion: '驳回：该设备尚在年度原厂全保维保合同期内，请直接拨打蔡司免费报修热线，无需走额外付费审批流程。',
      },
    ],
  },
  {
    id: 'appr-8',
    orderNo: 'CG20260910008',
    initiator: '周敏',
    department: '动力运行车间',
    category: '大宗备件采购流程',
    urgency: '紧急',
    equipmentName: '动力站冷冻循环水泵',
    equipmentCode: 'PUMP-COOL-03',
    estimatedCost: 48000,
    applyReason: '循环水系统备用格兰富立式多级离心泵整机采购，补充战略安全库存。',
    initiateTime: '2026/09/10 08:12:35',
    status: '已通过',
    currentNode: '流程归档',
    currentApprover: '--',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '周敏',
        role: '采购员',
        status: 'passed',
        handleTime: '2026/09/10 08:12:35',
        opinion: '交期4周，需尽快下达采购PO。',
      },
      {
        nodeName: '第一审批节点',
        approver: '采购经理',
        role: '采购经理',
        status: 'passed',
        handleTime: '2026/09/10 09:20:00',
        opinion: '同意采购。',
      },
      {
        nodeName: '第二审批节点',
        approver: '财务总监',
        role: '财务总监',
        status: 'passed',
        handleTime: '2026/09/10 11:05:00',
        opinion: '符合三季度大件设备更新预算。',
      },
      {
        nodeName: '第三审批节点',
        approver: '分管副总',
        role: '常务副总',
        status: 'passed',
        handleTime: '2026/09/10 14:30:00',
        opinion: '同意审批实施。',
      },
    ],
  },
  {
    id: 'appr-9',
    orderNo: 'WB20260909009',
    initiator: '吴强',
    department: '厂务环保部',
    category: '车间空调维保申请',
    urgency: '低',
    equipmentName: '中央空调屋顶冷却塔',
    equipmentCode: 'COOL-TW-01',
    estimatedCost: 2100,
    applyReason: '中央空调冷却塔填料高压水枪清洗除垢及集水盘加药杀菌灭藻作业。',
    initiateTime: '2026/09/09 13:40:20',
    status: '已通过',
    currentNode: '流程归档',
    currentApprover: '--',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '吴强',
        role: '厂务工程师',
        status: 'passed',
        handleTime: '2026/09/09 13:40:20',
        opinion: '药剂已备齐，计划本周六施工。',
      },
      {
        nodeName: '第一审批节点',
        approver: '动力站长',
        role: '站长',
        status: 'passed',
        handleTime: '2026/09/09 15:10:00',
        opinion: '注意高空防滑及环保排污合规。',
      },
    ],
  },
  {
    id: 'appr-10',
    orderNo: 'NJ20260908010',
    initiator: '郑华',
    department: '安全生产保卫处',
    category: '特种设备年检审批',
    urgency: '一般',
    equipmentName: '10T双梁桥式起重机',
    equipmentCode: 'CRANE-10T-01',
    estimatedCost: 6000,
    applyReason: '年度特种设备检验研究院法定强制定期检测，包含载荷试验、制动器力矩校验及钢丝绳探伤。',
    initiateTime: '2026/09/08 09:25:50',
    status: '已通过',
    currentNode: '流程归档',
    currentApprover: '--',
    historyNodes: [
      {
        nodeName: '发起人提交',
        approver: '郑华',
        role: '特种设备安全员',
        status: 'passed',
        handleTime: '2026/09/08 09:25:50',
        opinion: '特检院已排定下周二现场检测。',
      },
      {
        nodeName: '第一审批节点',
        approver: '安全总监',
        role: '安全总监',
        status: 'passed',
        handleTime: '2026/09/08 10:15:00',
        opinion: '务必安排专人做好现场安全警戒。',
      },
      {
        nodeName: '第二审批节点',
        approver: '生产厂长',
        role: '生产厂长',
        status: 'passed',
        handleTime: '2026/09/08 11:20:00',
        opinion: '同意年检安排。',
      },
    ],
  },
];

export const WorkOrderApprovalCenterView: React.FC<CommonProps> = ({ showToast }) => {
  const [approvals, setApprovals] = useState<WorkOrderApprovalItem[]>(
    // 默认按发起时间降序排列
    [...INITIAL_WORKORDER_APPROVALS].sort(
      (a, b) => new Date(b.initiateTime.replace(/\//g, '-')).getTime() - new Date(a.initiateTime.replace(/\//g, '-')).getTime()
    )
  );

  // Filters
  const [codeFilter, setCodeFilter] = useState('');
  const [initiatorFilter, setInitiatorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [activeTab, setActiveTab] = useState<'全部' | '待我审批' | '审批中' | '已通过' | '已驳回'>('全部');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal / Drawer states
  const [actionModalItem, setActionModalItem] = useState<WorkOrderApprovalItem | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<WorkOrderApprovalItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Action form inside modal
  const [decision, setDecision] = useState<'pass' | 'reject' | 'transfer'>('pass');
  const [opinionText, setOpinionText] = useState('');
  const [transferTarget, setTransferTarget] = useState('李工（系统管理员）');

  // Batch action modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchActionType, setBatchActionType] = useState<'pass' | 'reject'>('pass');
  const [batchOpinion, setBatchOpinion] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('1');

  // Filtered dataset
  const filteredApprovals = useMemo(() => {
    return approvals.filter((item) => {
      // Tab filter
      if (activeTab === '待我审批' && item.status !== '待审批') return false;
      if (activeTab === '审批中' && item.status !== '审批中') return false;
      if (activeTab === '已通过' && item.status !== '已通过') return false;
      if (activeTab === '已驳回' && item.status !== '已驳回') return false;

      // Inputs & dropdowns
      if (codeFilter && !item.orderNo.toLowerCase().includes(codeFilter.trim().toLowerCase())) return false;
      if (initiatorFilter && !item.initiator.includes(initiatorFilter.trim())) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (statusFilter !== '全部' && item.status !== statusFilter) return false;

      return true;
    });
  }, [approvals, activeTab, codeFilter, initiatorFilter, categoryFilter, statusFilter]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(approvals.map((a) => a.category)));
  }, [approvals]);

  const pendingCount = useMemo(() => {
    return approvals.filter((a) => a.status === '待审批').length;
  }, [approvals]);

  const handleReset = () => {
    setCodeFilter('');
    setInitiatorFilter('');
    setCategoryFilter('');
    setStatusFilter('全部');
    setActiveTab('全部');
    showToast('查询条件已重置，列表已恢复最新时间降序排列', 'info');
  };

  const handleSearch = () => {
    showToast(`查询完成，共找到 ${filteredApprovals.length} 条审批工单`, 'info');
  };

  const handleOpenActionModal = (item: WorkOrderApprovalItem) => {
    setActionModalItem(item);
    setDecision('pass');
    setOpinionText('【同意】情况属实，相关参数及费用预估核实无误，同意审批执行。');
    setIsActionModalOpen(true);
  };

  const handleOpenDetail = (item: WorkOrderApprovalItem) => {
    setDetailModalItem(item);
    setIsDetailModalOpen(true);
  };

  const handleQuickFillOpinion = (text: string) => {
    setOpinionText(text);
  };

  const handleConfirmDecision = () => {
    if (!actionModalItem) return;
    if (!opinionText.trim()) {
      showToast('请输入审批意见', 'warning');
      return;
    }

    const now = new Date();
    const formatted = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let newStatus: '已通过' | '已驳回' | '审批中' = '已通过';
    let newCurrentNode = '流程归档';
    let newCurrentApprover = '--';

    if (decision === 'pass') {
      newStatus = '已通过';
      newCurrentNode = '审批通过（流程已归档）';
      newCurrentApprover = '--';
    } else if (decision === 'reject') {
      newStatus = '已驳回';
      newCurrentNode = '审批驳回（已退回发起人）';
      newCurrentApprover = actionModalItem.initiator;
    } else if (decision === 'transfer') {
      newStatus = '审批中';
      newCurrentNode = `已转办至: ${transferTarget}`;
      newCurrentApprover = transferTarget;
    }

    const updatedHistory = [
      ...actionModalItem.historyNodes.map((n) =>
        n.status === 'pending'
          ? {
              ...n,
              status: (decision === 'pass' ? 'passed' : decision === 'reject' ? 'rejected' : 'passed') as any,
              handleTime: formatted,
              opinion: opinionText,
            }
          : n
      ),
    ];

    if (decision === 'transfer') {
      updatedHistory.push({
        nodeName: '转办节点',
        approver: transferTarget,
        role: '委派受托人',
        status: 'pending',
      });
    }

    setApprovals((prev) =>
      prev.map((item) =>
        item.id === actionModalItem.id
          ? {
              ...item,
              status: newStatus,
              currentNode: newCurrentNode,
              currentApprover: newCurrentApprover,
              historyNodes: updatedHistory,
            }
          : item
      )
    );

    setIsActionModalOpen(false);
    showToast(
      `工单 ${actionModalItem.orderNo} 审批操作已成功执行: ${
        decision === 'pass' ? '【已通过】' : decision === 'reject' ? '【已驳回】' : '【已转办】'
      }`,
      decision === 'reject' ? 'warning' : 'success'
    );
  };

  const handleOpenBatch = (type: 'pass' | 'reject') => {
    if (selectedIds.length === 0) {
      showToast(`请先勾选需要批量${type === 'pass' ? '通过' : '驳回'}的待审批工单`, 'warning');
      return;
    }
    setBatchActionType(type);
    setBatchOpinion(type === 'pass' ? '批量审核无误，同意通过。' : '批量审核退回，请补充具体技术资料与明细后再报。');
    setIsBatchModalOpen(true);
  };

  const handleConfirmBatch = () => {
    const now = new Date();
    const formatted = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;

    setApprovals((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            status: batchActionType === 'pass' ? '已通过' : '已驳回',
            currentNode: batchActionType === 'pass' ? '批量通过归档' : '批量驳回退回',
            currentApprover: '--',
            historyNodes: item.historyNodes.map((n) =>
              n.status === 'pending'
                ? {
                    ...n,
                    status: (batchActionType === 'pass' ? 'passed' : 'rejected') as any,
                    handleTime: formatted,
                    opinion: batchOpinion,
                  }
                : n
            ),
          };
        }
        return item;
      })
    );

    showToast(`已成功批量${batchActionType === 'pass' ? '通过' : '驳回'} ${selectedIds.length} 个审批工单`, 'success');
    setSelectedIds([]);
    setIsBatchModalOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApprovals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApprovals.map((f) => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExportCSV = () => {
    const headers = '工单编码,发起人,所属部门,审批类别,紧急程度,关联设备,预估费用,发起时间,状态,当前审批节点,当前审批人\n';
    const rows = filteredApprovals
      .map(
        (a) =>
          `"${a.orderNo}","${a.initiator}","${a.department}","${a.category}","${a.urgency}","${a.equipmentName}","${a.estimatedCost}","${a.initiateTime}","${a.status}","${a.currentNode}","${a.currentApprover}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `工单审批流清单_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`已成功导出 ${filteredApprovals.length} 条工单审批数据`, 'success');
  };

  return (
    <div className="space-y-3 pb-16 text-xs select-none relative">
      {/* 1. Top Filter Card */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
          {/* 工单编码 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">工单编码:</span>
            <input
              type="text"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
              placeholder="请输入工单编码"
              className="h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 w-full"
            />
          </div>

          {/* 发起人 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">发起人:</span>
            <input
              type="text"
              value={initiatorFilter}
              onChange={(e) => setInitiatorFilter(e.target.value)}
              placeholder="请输入发起人姓名"
              className="h-8 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 w-full"
            />
          </div>

          {/* 审批类别 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">审批类别:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            >
              <option value="">全部类别</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 审批状态 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 whitespace-nowrap">审批状态:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            >
              <option value="全部">全部状态</option>
              <option value="待审批">待审批</option>
              <option value="审批中">审批中</option>
              <option value="已通过">已通过</option>
              <option value="已驳回">已驳回</option>
            </select>
          </div>

          {/* Query & Reset Buttons */}
          <div className="flex items-center gap-2 md:col-span-4 lg:col-span-1 justify-end">
            <button
              onClick={handleSearch}
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={handleReset}
              className="h-8 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Table Card */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        {/* Table Top Bar & Category Tabs */}
        <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-3.5 bg-blue-600 rounded-xs"></div>
              <h2 className="text-sm font-bold text-slate-800">工单审批列表</h2>
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded text-xs ml-2">
              {(['全部', '待我审批', '审批中', '已通过', '已驳回'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
                      isActive ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab}</span>
                    {tab === '待我审批' && pendingCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons on Right (Screenshot style) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenBatch('pass')}
              className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>批量通过</span>
            </button>

            <button
              onClick={() => handleOpenBatch('reject')}
              className="h-8 px-3.5 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>批量驳回</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="h-8 px-3.5 bg-[#ff9800] hover:bg-[#f57c00] text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            <button
              onClick={() => showToast('已刷新工单审批列表（时间降序置顶）', 'success')}
              title="刷新"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => showToast('已保存列显示设置', 'info')}
              title="列设置"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredApprovals.length > 0 && selectedIds.length === filteredApprovals.length}
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-medium">序号</th>
                <th className="p-3 font-medium">工单编码</th>
                <th className="p-3 font-medium">发起人</th>
                <th className="p-3 font-medium">审批类别</th>
                <th className="p-3 font-medium">关联设备</th>
                <th className="p-3 font-medium">
                  <div className="flex items-center gap-1">
                    <span>审批发起时间</span>
                    <span className="text-blue-600 text-[11px] font-mono">▾ (最新降序)</span>
                  </div>
                </th>
                <th className="p-3 font-medium text-center">状态</th>
                <th className="p-3 font-medium">当前审批节点</th>
                <th className="p-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-slate-300 stroke-1" />
                      <span>暂无匹配的工单审批记录</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((item, idx) => {
                  const isChecked = selectedIds.includes(item.id);
                  const isGreenStripe = idx % 2 === 1;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isGreenStripe ? 'bg-[#f5faf7]/80 hover:bg-[#eaf5ee]' : 'bg-white hover:bg-slate-50'
                      } ${isChecked ? 'bg-blue-50/60' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-slate-600 font-mono">{idx + 1}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{item.orderNo}</span>
                          {item.urgency === '紧急' && (
                            <span className="px-1 py-0.2 bg-rose-100 text-rose-700 rounded text-[10px] font-normal">
                              紧急
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {item.initiator.slice(0, 1)}
                          </span>
                          <span className="text-slate-800 font-medium">{item.initiator}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-800 font-medium">{item.equipmentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.equipmentCode}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{item.initiateTime}</td>
                      <td className="p-3 text-center">
                        {item.status === '待审批' && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium flex items-center justify-center gap-1 w-20 mx-auto">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>待审批</span>
                          </span>
                        )}
                        {item.status === '审批中' && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium flex items-center justify-center gap-1 w-20 mx-auto">
                            <RefreshCw className="w-3 h-3 text-blue-500" />
                            <span>审批中</span>
                          </span>
                        )}
                        {item.status === '已通过' && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium flex items-center justify-center gap-1 w-20 mx-auto">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>已通过</span>
                          </span>
                        )}
                        {item.status === '已驳回' && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-medium flex items-center justify-center gap-1 w-20 mx-auto">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            <span>已驳回</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-slate-800 font-medium">{item.currentNode}</div>
                        {item.currentApprover !== '--' && (
                          <div className="text-[11px] text-slate-500">审批人: {item.currentApprover}</div>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-3">
                        {item.status === '待审批' || item.status === '审批中' ? (
                          <button
                            onClick={() => handleOpenActionModal(item)}
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                          >
                            审批
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="text-slate-500 hover:text-slate-700 font-medium hover:underline"
                          >
                            查看
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-600 bg-white">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 flex items-center justify-center border rounded font-medium transition-colors ${
                currentPage === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
            disabled={currentPage === 5}
            className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-7 px-2 border border-slate-300 rounded bg-white text-slate-700 text-xs focus:outline-none"
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>

          <div className="flex items-center gap-1 ml-2">
            <span>跳至</span>
            <input
              type="text"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="w-10 h-7 text-center border border-slate-300 rounded text-xs text-slate-800"
            />
            <span>页</span>
          </div>
        </div>
      </div>

      {/* 3. 审批处理弹窗 (Approve / Reject Action Modal) */}
      {isActionModalOpen && actionModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">工单审批处理</h3>
                <span className="font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-200">
                  {actionModalItem.orderNo}
                </span>
              </div>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* 工单基本信息卡片 */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500">审批类别:</span>
                    <div className="font-semibold text-slate-800 mt-0.5">{actionModalItem.category}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">发起人 / 部门:</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {actionModalItem.initiator} ({actionModalItem.department})
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">发起时间:</span>
                    <div className="font-mono text-slate-700 mt-0.5">{actionModalItem.initiateTime}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">关联设备:</span>
                    <div className="font-medium text-slate-800 mt-0.5">{actionModalItem.equipmentName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">预估费用:</span>
                    <div className="font-semibold text-rose-600 font-mono mt-0.5">
                      ¥{actionModalItem.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">紧急程度:</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] ${
                          actionModalItem.urgency === '紧急'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {actionModalItem.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500">申请事由:</span>
                  <div className="text-slate-700 mt-1 leading-relaxed bg-white p-2 rounded border border-slate-200">
                    {actionModalItem.applyReason}
                  </div>
                </div>
              </div>

              {/* 流程进度节点预览 */}
              <div className="space-y-2">
                <div className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>审批流程追踪</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto p-2 bg-[#f0f8f4] rounded border border-[#d2ecd9]">
                  {actionModalItem.historyNodes.map((node, i) => {
                    const isDone = node.status === 'passed';
                    const isPending = node.status === 'pending';
                    const isRejected = node.status === 'rejected';

                    return (
                      <React.Fragment key={i}>
                        <div className="flex items-center gap-2 shrink-0 bg-white p-2 rounded border border-slate-200 shadow-2xs">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                              isDone
                                ? 'bg-emerald-500'
                                : isRejected
                                ? 'bg-rose-500'
                                : isPending
                                ? 'bg-blue-500 animate-pulse'
                                : 'bg-slate-300'
                            }`}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5" /> : isRejected ? <X className="w-3.5 h-3.5" /> : i + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{node.nodeName}</div>
                            <div className="text-[10px] text-slate-500">
                              {node.approver} ({node.role})
                            </div>
                          </div>
                        </div>
                        {i < actionModalItem.historyNodes.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* 审批决定选择 */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-800 font-semibold">审批决定:</label>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDecision('pass');
                      setOpinionText('【同意】情况属实，相关参数及费用预估核实无误，同意审批执行。');
                    }}
                    className={`p-3 rounded border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      decision === 'pass'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>同意通过 (Pass)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecision('reject');
                      setOpinionText('【驳回】预算超出限额，且请补充故障诊断明细与现场测绘报告后再提。');
                    }}
                    className={`p-3 rounded border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      decision === 'reject'
                        ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>退回驳回 (Reject)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecision('transfer');
                      setOpinionText('【转办】因专业领域划分，转交相关科室主管会签审批。');
                    }}
                    className={`p-3 rounded border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      decision === 'transfer'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CornerDownRight className="w-5 h-5 text-blue-600" />
                    <span>转办委派 (Transfer)</span>
                  </button>
                </div>
              </div>

              {/* 若选择转办，显示委派对象选择 */}
              {decision === 'transfer' && (
                <div className="space-y-1.5 bg-blue-50/60 p-3 rounded border border-blue-100">
                  <label className="text-slate-700 font-medium">委派接收人:</label>
                  <select
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    className="w-full h-8 px-3 border border-slate-300 rounded text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="李工（系统管理员）">李工（系统管理员）</option>
                    <option value="王科长（设备动力科）">王科长（设备动力科）</option>
                    <option value="孙经理（采购部）">孙经理（采购部）</option>
                    <option value="赵总（财务总监）">赵总（财务总监）</option>
                  </select>
                </div>
              )}

              {/* 常用快捷评语 Tags */}
              <div className="space-y-1.5">
                <label className="text-slate-600">快捷意见输入:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '【同意】情况属实，准予实施',
                    '【同意】备件齐全，请按标准工时规范维修',
                    '【同意】符合预防性保养计划，准予立项',
                    '【驳回】预算超标，请重新核算',
                    '【驳回】请补充故障现场照片及检测参数',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQuickFillOpinion(tag)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 审批意见输入 Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <label className="text-slate-800 font-medium">审批意见:</label>
                </div>
                <textarea
                  rows={3}
                  value={opinionText}
                  onChange={(e) => setOpinionText(e.target.value)}
                  placeholder="请输入您的具体审批意见..."
                  className="w-full p-3 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="px-5 py-1.5 border border-slate-300 text-slate-700 hover:bg-white rounded text-xs font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDecision}
                className={`px-6 py-1.5 text-white rounded text-xs font-medium transition-colors shadow-xs ${
                  decision === 'pass'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : decision === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                提交审批决定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 审批详情与全流程记录抽屉 (Detail & History Drawer) */}
      {isDetailModalOpen && detailModalItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between text-xs animate-slide-left">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">工单审批详情</h3>
                <span className="font-mono text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                  {detailModalItem.orderNo}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Status Header */}
              <div className="flex items-center justify-between p-3.5 rounded bg-blue-50 border border-blue-100">
                <div>
                  <div className="text-[11px] text-blue-700 font-medium">当前工单状态</div>
                  <div className="text-base font-bold text-blue-900 mt-0.5">{detailModalItem.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-blue-700">当前节点</div>
                  <div className="text-xs font-semibold text-blue-900 mt-0.5">{detailModalItem.currentNode}</div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>工单基本属性</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500">审批类别:</span>
                    <div className="font-medium text-slate-800">{detailModalItem.category}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">发起人:</span>
                    <div className="font-medium text-slate-800">
                      {detailModalItem.initiator} ({detailModalItem.department})
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">发起时间:</span>
                    <div className="font-mono text-slate-700">{detailModalItem.initiateTime}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">紧急程度:</span>
                    <div className="font-medium text-slate-800">{detailModalItem.urgency}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">关联设备:</span>
                    <div className="font-medium text-slate-800">{detailModalItem.equipmentName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">预估费用:</span>
                    <div className="font-mono font-bold text-rose-600">
                      ¥{detailModalItem.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>申报事由与详情</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-700 leading-relaxed">
                  {detailModalItem.applyReason}
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>审批流程历史与意见</span>
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {detailModalItem.historyNodes.map((node, i) => (
                    <div key={i} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] ${
                          node.status === 'passed'
                            ? 'bg-emerald-500 ring-2 ring-emerald-100'
                            : node.status === 'rejected'
                            ? 'bg-rose-500 ring-2 ring-rose-100'
                            : node.status === 'pending'
                            ? 'bg-blue-500 ring-2 ring-blue-100 animate-pulse'
                            : 'bg-slate-300'
                        }`}
                      >
                        {node.status === 'passed' ? (
                          <Check className="w-3 h-3" />
                        ) : node.status === 'rejected' ? (
                          <X className="w-3 h-3" />
                        ) : (
                          i + 1
                        )}
                      </div>

                      <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{node.nodeName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{node.handleTime || '待处理'}</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          审批人: <span className="font-medium text-slate-800">{node.approver}</span> (
                          {node.role})
                        </div>
                        {node.opinion && (
                          <div className="mt-2 text-xs bg-white p-2 rounded border border-slate-200 text-slate-700">
                            <span className="text-slate-400 font-semibold">意见：</span>
                            {node.opinion}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-slate-500 text-[11px]">系统审批单号: {detailModalItem.id}</span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 批量审批弹窗 */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {batchActionType === 'pass' ? '批量通过审批' : '批量驳回审批'}
              </h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-slate-600">
                已选中 <span className="font-bold text-blue-600">{selectedIds.length}</span> 个工单，确定要批量
                {batchActionType === 'pass' ? (
                  <span className="font-bold text-emerald-600">【通过】</span>
                ) : (
                  <span className="font-bold text-rose-600">【驳回】</span>
                )}
                吗？
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium">统一审批意见:</label>
                <textarea
                  rows={3}
                  value={batchOpinion}
                  onChange={(e) => setBatchOpinion(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 rounded hover:bg-white text-slate-700 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmBatch}
                className={`px-5 py-1.5 rounded text-white font-medium shadow-xs ${
                  batchActionType === 'pass' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                确认执行
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
