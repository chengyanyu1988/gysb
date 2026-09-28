export type EquipmentStatus = '使用中' | '闲置中' | '维修中' | '已停用' | '已报废';
export type EquipmentGrade = 'A' | 'B' | 'C';
export type EquipmentTag = '重要设备' | '一般设备' | '特种设备';

export interface SparePartItem {
  id: string;
  name: string;
  code: string;
  category: string;
  spec: string;
  brand: string;
  stock: number;
  unit: string;
  supplier: string;
  associatedTime?: string; // ISO string or format 2026-09-27 18:30:00
  price?: number;
}

export interface Equipment {
  id: string;
  orderNo?: number;
  name: string;
  code: string;
  category: string;
  spec: string;
  grade: EquipmentGrade;
  tag: EquipmentTag;
  installArea: string;
  status: EquipmentStatus;
  department: string;
  manager: string;
  manufacturer: string;
  factoryCode: string;
  supplier: string;
  maintenanceDate: string;
  contactPerson: string;
  contactPhone: string;
  updateTime: string; // 降序排列依据，如 2026-09-27 20:00:00
  createTime: string;
  images: string[];
  spareParts: SparePartItem[];
}

export type InspectionApprovalStatus = '无需审批' | '审批中' | '审批通过' | '审批驳回';
export type InspectionTaskStatus = '已超时' | '待执行' | '点检中' | '已完成';
export type InspectionCheckStatus = '未检查' | '正常' | '异常';
export type InspectionItemResult = '未检' | '合格' | '不合格';

export interface InspectionTaskItem {
  id: string;
  orderNo: number;
  projectName: string;
  checkItem: string;
  result: InspectionItemResult;
  remarks: string;
}

export interface InspectionTask {
  id: string;
  taskCode: string;
  planCode?: string;
  equipmentName: string;
  equipmentCode: string;
  executor: string;
  checkStatus: InspectionCheckStatus;
  plannedTime: string; // e.g. 2026/9/17 8:00
  actualTime?: string; // e.g. 2026-09-17 08:15
  checkedItemsCount: number; // e.g. 5
  totalItemsCount: number; // e.g. 5
  status: InspectionTaskStatus;
  department?: string;
  group?: string;
  items: InspectionTaskItem[];
  attachments: string[];
  updateTime: string;
}

export interface PatrolPlanItemDetail {
  id: string;
  orderNo: number;
  projectName: string;
  category: string;
  totalCheckPoints: number;
}

export interface PatrolPlanCheckPointDetail {
  id: string;
  orderNo: number;
  projectName: string;
  category: string;
  checkItem: string;
  description: string;
}

export interface PatrolTaskItem {
  id: string;
  orderNo: number;
  projectName: string;
  checkItem: string;
  result: '未检' | '合格' | '不合格';
  remarks: string;
}

export interface PatrolTask {
  id: string;
  orderCode: string;
  planCode: string;
  patrolArea: string;
  executor: string;
  plannedTime: string;
  actualTime?: string;
  checkedItemsCount: number;
  totalItemsCount: number;
  status: '已超时' | '待执行' | '巡检中' | '已完成';
  items: PatrolTaskItem[];
  attachments: string[];
  department?: string;
  updateTime: string;
}

export interface PatrolRecordTableItem {
  id: string;
  planCode: string;
  patrolArea: string;
  executor: string;
  plannedTime: string;
  actualTime: string;
  checkedItems: string;
  status: '已完成';
  items?: PatrolTaskItem[];
  attachments?: string[];
  updateTime: string;
}

export interface PatrolPlan {
  id: string;
  planCode: string;
  patrolArea: string; // 巡检区域
  executionTimeRange: string; // 执行日期时间
  approvalStatus: InspectionApprovalStatus;
  department: string;
  period: string; // e.g. 7天
  periodUnit?: '天' | '周' | '月';
  lastExecutionTime: string;
  nextExecutionTime: string;
  executor: string;
  enabled: boolean;
  group?: string; // 巡检班组
  startTime?: string;
  endTime?: string;
  isForever?: boolean;
  publishHoursBefore?: number;
  overdueHoursAfter?: number;
  items?: PatrolPlanItemDetail[];
  createTime: string;
  updateTime: string;
}

export interface InspectionPlanItemDetail {
  id: string;
  orderNo: number;
  projectName: string;
  category: string;
  totalCheckPoints: number;
}

export interface InspectionPlanItem {
  id: string;
  name: string;
  category: string;
  itemCount: number;
}

export interface InspectionPlan {
  id: string;
  planCode: string;
  equipmentName: string;
  equipmentCode: string;
  executionTimeRange: string; // e.g. 2026-09-27 08:00 - 2026-09-27 17:00
  approvalStatus: InspectionApprovalStatus;
  department: string;
  period: string; // e.g. 7天, 1天, 30天
  periodUnit?: '天' | '周' | '月';
  lastExecutionTime: string; // e.g. 2026/9/9 8:15
  nextExecutionTime: string; // e.g. ----
  executor: string; // e.g. 赵工坊
  enabled: boolean;
  group?: string; // 点检班组
  startTime?: string;
  endTime?: string;
  isForever?: boolean;
  publishHoursBefore?: number;
  overdueHoursAfter?: number;
  equipments?: Equipment[];
  inspectionItems?: InspectionPlanItem[];
  createTime: string;
  updateTime: string;
}

export interface InspectionRecord {
  id: string;
  planName: string;
  taskCode: string;
  equipmentName: string;
  equipmentCode: string;
  inspector: string;
  inspectTime: string; // 降序
  result: '正常' | '异常' | '已整改';
  remarks: string;
  area: string;
}

export interface MaintenancePlanEquipmentItem {
  id: string;
  name: string;
  code: string;
  category: string;
  model: string;
  level: string;
  installArea: string;
  status: '使用中' | '已停用' | '维修中' | '已报废' | '闲置中';
  department: string;
  manager: string;
}

export interface MaintenancePlanStandardItem {
  id: string;
  name: string;
  standard: string;
  itemCount: number;
  category?: string;
}

export interface MaintenancePlan {
  id: string;
  planCode: string;
  planName: string;
  startTime: string;
  endTime: string;
  approvalStatus: '无需审批' | '审批中' | '审批通过' | '审批驳回';
  department: string;
  maintenanceGroup: string;
  cycle: string;
  cycleValue?: number;
  cycleUnit?: '天' | '周' | '月';
  executor: string;
  enabled: boolean;
  isForever?: boolean;
  publishHoursBefore?: number;
  overdueHoursAfter?: number;
  lastExecutionTime?: string;
  nextExecutionTime?: string;
  equipments?: MaintenancePlanEquipmentItem[];
  standards?: MaintenancePlanStandardItem[];
  createTime: string;
  updateTime: string;
}

export interface MaintenanceTaskItem {
  id: string;
  orderNo: number;
  name: string;
  standard: string;
  result: '已保养' | '未保养';
  remarks: string;
}

export interface MaintenanceSpareConsumption {
  id: string;
  name: string;
  code: string;
  category: string;
  model: string;
  brand: string;
  stock: number;
  unit: string;
  supplier: string;
  quantity: number;
}

export interface MaintenanceTask {
  id: string;
  taskCode: string;
  planCode: string;
  equipmentName: string;
  equipmentCode: string;
  maintenanceGroup: string;
  executor: string;
  planTime: string;
  actualTime?: string;
  progress: string;
  status: '待执行' | '保养中' | '已完成' | '已超时';
  conclusion?: '正常' | '异常' | '已完成';
  items?: MaintenanceTaskItem[];
  spares?: MaintenanceSpareConsumption[];
  images?: string[];
  createTime: string;
}

export interface MaintenanceRecordItem {
  id: string;
  taskCode: string;
  planCode: string;
  equipmentName: string;
  equipmentCode: string;
  maintenanceGroup: string;
  executor: string;
  planTime: string;
  actualTime: string;
  status: '已完成' | '异常完成';
  conclusion: '正常' | '异常' | '已完成';
  items?: MaintenanceTaskItem[];
  images?: string[];
  spares?: MaintenanceSpareConsumption[];
}

export interface MaintenanceRecord {
  id: string;
  planCode: string;
  planName: string;
  equipmentName: string;
  equipmentCode: string;
  level: '一级保养' | '二级保养' | '日常保养' | '预防性维护';
  operator: string;
  completeTime: string; // 降序
  status: '已完成' | '进行中' | '待审核';
  durationMinutes: number;
  cost: number;
}

export interface FaultExperienceItem {
  id: string;
  expCode: string;
  category: string;
  description: string;
  solution: string;
}

export interface FaultReportItem {
  id: string;
  reportNo: string;
  equipmentName: string;
  equipmentCode: string;
  equipmentCategory?: string;
  equipmentSpec?: string;
  specification?: string;
  equipmentLevel?: string;
  installArea?: string;
  reportTime: string;
  reporter?: string;
  reportUser?: string;
  reporterPhone?: string;
  faultType: string;
  faultDescription?: string;
  description?: string;
  faultTime: string;
  faultLevel?: string;
  isUrgent?: boolean;
  urgencyLevel?: string;
  status: '待处理' | '维修中' | '已完成' | '已驳回' | '验收完成' | '已撤销' | string;
  handler?: string;
  handleType?: string;
  handleResult?: string;
  handleTime?: string;
  handleRemarks?: string;
  relatedOrderNo?: string;
  attachments?: string[];
  images?: string[];
  createTime?: string;
  updateTime?: string;
}

export interface RepairOrder {
  id: string;
  orderNo: string;
  equipmentName: string;
  equipmentCode: string;
  equipmentCategory?: string;
  equipmentSpec?: string;
  equipmentLevel?: string;
  installArea?: string;
  repairGroup?: string;
  faultType?: string;
  urgency?: string;
  reporter?: string;
  reporterPhone?: string;
  reportTime?: string; // 降序
  faultTime?: string;
  faultReportNo?: string;
  faultReportStatus?: string;
  repairman?: string;
  handler?: string;
  handleType?: string;
  handleTime?: string;
  handleRemarks?: string;
  finishTime?: string;
  createTime?: string;
  status: '待维修' | '维修中' | '待验收' | '已完成' | '待指派' | '已关闭' | string;
  description?: string;
  faultDescription?: string;
  repairSolutionDescription?: string;
  faultAttachments?: string[];
  repairImages?: string[];
  sparesConsumed?: RepairSpareConsumptionItem[];
  mttrMinutes?: number;
}

export interface RepairSpareConsumptionItem {
  id: string;
  spareName: string;
  spareCode: string;
  category: string;
  spec: string;
  brand: string;
  stock: number;
  unit: string;
  supplier: string;
  consumedQuantity: number;
}

export interface RepairAcceptanceItem {
  id: string;
  acceptanceNo: string;
  reportNo: string;
  orderNo: string;
  equipmentName: string;
  equipmentCode: string;
  equipmentCategory?: string;
  equipmentSpec?: string;
  equipmentLevel?: string;
  installArea?: string;
  reporter: string;
  repairman: string;
  repairGroup?: string;
  repairFinishTime: string; // 降序
  acceptor?: string;
  acceptTime?: string; // 降序
  status: '待验收' | '验收通过' | '验收不通过';
  rating?: number; // 1-5
  ratingRemark?: string;
  trialRunStatus?: string;
  repairSummary?: string;
  repairSolutionDescription?: string;
  acceptanceOpinion?: string;
  sparesCount?: number;
  sparesCost?: number;
  sparesConsumed?: RepairSpareConsumptionItem[];
  attachments?: string[];
  createTime: string;
}

export interface AlarmLog {
  id: string;
  equipmentName: string;
  equipmentCode: string;
  type: '温度超标' | '振动预警' | '压力过载' | '维保到期' | '点检未打卡';
  level: '高' | '中' | '低';
  timestamp: string; // 降序
  status: '已恢复' | '待处理' | '处理中';
  area: string;
}

// ==================== 备品备件模块类型 ====================

// 1. 备件台账
export interface SparePartLedgerItem {
  id: string;
  name: string;
  code: string;
  category: string;
  spec: string;
  brand: string;
  stock: number;
  unit: string;
  supplier: string;
  manager: string;
  description?: string;
  attachments?: string[];
  price?: number;
  updateTime?: string;
}

// 2. 仓库货位
export interface WarehouseLocationItem {
  id: string;
  name: string;
  code: string;
  location: string;
  authorizedPersonnel: string;
  status: '启用' | '禁用';
  remarks: string;
  parentId?: string;
  children?: WarehouseLocationItem[];
}

// 3. 需求计划
export interface RequirementPlanSpareItem {
  id: string;
  spareName: string;
  spareCode: string;
  category: string;
  spec: string;
  brand: string;
  unit: string;
  supplier: string;
  requiredQty: number;
  budgetAmount: number;
  price?: number;
}

export interface RequirementPlanItem {
  id: string;
  planNo: string;
  approvalNo: string;
  applicant: string;
  department: string;
  status: '审批中' | '审批通过' | '审批驳回';
  totalQty: number;
  totalBudget: number;
  applyTime: string; // 降序
  items: RequirementPlanSpareItem[];
}

// 4. 到货质检
export interface ArrivalInspectionSpareItem {
  id: string;
  spareName: string;
  spareCode: string;
  category: string;
  spec: string;
  brand: string;
  unit: string;
  supplier: string;
  expectedQty?: number;
  expectedAmount?: number;
  unitPrice: number;
  actualQty?: number;
  actualAmount?: number;
  unreceivedQty?: number;
  unreceivedAmount?: number;
  qualifiedQty?: number;
  qualifiedAmount?: number;
  unqualifiedQty?: number;
  unqualifiedAmount?: number;
  purchasedQuantity?: number;
  arrivalQuantity?: number;
  unqualifiedReason?: string;
  handlingMethod?: string;
  qualifiedQuantity?: number;
  unqualifiedQuantity?: number;
}

export interface InspectionHistoryRecord {
  id: string;
  approvalBatchNo: string;
  arrivalNo: string;
  buyer: string;
  buyerDepartment: string;
  supplier: string;
  inspectTime: string; // 降序
  inboundStatus: '入库完成' | '入库拒绝' | '审批拒绝' | '审批中' | '审批通过' | '无需入库';
  items: ArrivalInspectionSpareItem[];
}

export interface ArrivalInspectionItem {
  id: string;
  arrivalNo: string;
  inspectionNo?: string;
  deliveryNo?: string;
  purchaseOrderNo?: string;
  deliveryDate?: string;
  buyer?: string;
  buyerDepartment?: string;
  supplier: string;
  expectedQty?: number;
  expectedAmount?: number;
  expectedArrivalTime?: string; // 降序
  arrivalStatus: '已到货' | '未到货';
  status?: string;
  inspectionStatus?: string;
  itemCount?: number;
  totalDeliveryQuantity?: number;
  qualifiedTotalAmount?: number;
  unqualifiedTotalAmount?: number;
  actualQty?: number;
  actualAmount?: number;
  createTime: string; // 降序
  qualifiedQty?: number;
  qualifiedAmount?: number;
  unqualifiedQty?: number;
  unqualifiedAmount?: number;
  inspectTime?: string; // 降序
  inboundStatus?: '审批通过' | '审批拒绝' | '入库拒绝' | '审批中' | '入库完成' | '无需入库';
  items: ArrivalInspectionSpareItem[];
  historyRecords?: InspectionHistoryRecord[];
}

// 5. 退货管理
export interface ReturnGoodsSpareItem {
  id: string;
  batchNo: string; // 批次号 如 LM260915A, LM000120040618000
  spareCode: string; // 备品备件编码 如 ZJ-750W, CL0001, BJ-M-008
  spareName: string; // 备品备件名称 如 伺服电机, 伺服驱动电机, 内齿模数齿轮-NC
  spec: string; // 规格型号 如 MSMD042G1U, ATV610D11N4C
  unit: string; // 计量单位 如 台, 个, 套
  brand: string; // 品牌 如 松下, 施耐德, 亚德客, 倍加福, 东元, 台达, 万豪
  manufacturer: string; // 生产厂商 如 松下电器（中国）, 施耐德电气（中国）
  warehouseLocationName: string; // 仓库货位名称 如 A区-01架-2层, A1-1货位
  warehouseLocationCode: string; // 仓库货位编码 如 HW-A0102, HW001
  unitPrice: number; // 单价/金额 (元) 如 1500, 2200, 85, 850, 120
  stockQty: number; // 库存数量 如 5, 3, 50, 10, 22, 12
  returnableQty: number; // 可退货数量 如 2, 1, 5, 4, 8, 12
  returnQty: number; // 退货数量 如 2, 1, 20, 10, 2
  returnAmount: number; // 退货金额 (元) = returnQty * unitPrice
  inboundTime?: string; // 入库时间 如 2026-09-18 17:23:00 (最新降序)
  inboundNo?: string; // 关联入库单号 如 RK202609150023
}

export type ReturnGoodsApprovalStatus = '已通过' | '待审批' | '已拒绝';
export type ReturnGoodsStatus = '审批中' | '审批拒绝' | '审批通过' | '退货成功' | '退货失败' | '退货中';

export interface ReturnGoodsOrder {
  id: string;
  orderNo: number; // 序号 1, 2, 3...
  returnNo: string; // 退货单号 如 TH202609170058, TH202609160042
  inboundNo: string; // 关联入库单号 如 RK202609150023, RK202609100088
  totalReturnQty: number; // 退货总数量 如 5, 35, 12, 8, 20
  totalReturnAmount: number; // 退货总金额 (元) 如 4,500.00, 8,650.00
  reason: string; // 退货原因 如 规格型号不符, 采购计划变更, 质量不合格
  applicant: string; // 申请人 如 李伟明, 王芳, 陈建国, 赵敏, 刘志强
  department: string; // 申请部门 如 设备动力部, 生产运行部, 质检部, 仓储物流部
  approvalStatus: ReturnGoodsApprovalStatus; // 审批状态 如 已通过, 待审批, 已拒绝
  returnStatus: ReturnGoodsStatus; // 退货状态 如 审批中, 审批拒绝, 审批通过, 退货成功, 退货失败, 退货中
  createTime: string; // 创建时间 如 2026-09-17 09:30:00 (最新时间降序排列)
  items: ReturnGoodsSpareItem[]; // 退货备件明细
}
