/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, MainTab } from './components/Sidebar';
import { Breadcrumb } from './components/Breadcrumb';
import { ToastContainer, ToastMessage } from './components/Toast';
import { BarcodeModal } from './components/BarcodeModal';
import { ImportModal } from './components/ImportExportModal';

import { OverviewView } from './views/OverviewView';
import { EquipmentLedgerView } from './views/EquipmentLedgerView';
import { EquipmentFormView } from './views/EquipmentFormView';
import { EquipmentDetailView } from './views/EquipmentDetailView';
import { EquipmentSparePartsView } from './views/EquipmentSparePartsView';
import { InspectionView } from './views/InspectionView';
import { InspectionPlanListView } from './views/InspectionPlanListView';
import { InspectionPlanAddView } from './views/InspectionPlanAddView';
import { InspectionPlanDetailView } from './views/InspectionPlanDetailView';
import { InspectionTaskListView } from './views/InspectionTaskListView';
import { InspectionTaskExecuteView } from './views/InspectionTaskExecuteView';
import {
  InspectionRecordListView,
  InspectionRecordTableItem,
  DEFAULT_INSPECTION_RECORD_LIST,
} from './views/InspectionRecordListView';
import { InspectionRecordDetailView } from './views/InspectionRecordDetailView';
import { PatrolPlanListView } from './views/PatrolPlanListView';
import { PatrolPlanAddView } from './views/PatrolPlanAddView';
import { PatrolPlanDetailView } from './views/PatrolPlanDetailView';
import { PatrolView } from './views/PatrolView';
import { MaintenancePlanListView } from './views/MaintenancePlanListView';
import { MaintenancePlanAddView } from './views/MaintenancePlanAddView';
import { MaintenancePlanDetailView } from './views/MaintenancePlanDetailView';
import { MaintenanceTaskListView } from './views/MaintenanceTaskListView';
import { MaintenanceTaskExecuteView } from './views/MaintenanceTaskExecuteView';
import { MaintenanceRecordListView } from './views/MaintenanceRecordListView';
import { MaintenanceRecordDetailView } from './views/MaintenanceRecordDetailView';
import { MaintenanceView } from './views/MaintenanceView';
import { FaultReportListView } from './views/FaultReportListView';
import { FaultReportAddView } from './views/FaultReportAddView';
import { FaultReportProcessView } from './views/FaultReportProcessView';
import { FaultReportDetailView } from './views/FaultReportDetailView';
import { RepairWorkOrderListView } from './views/RepairWorkOrderListView';
import { RepairWorkOrderExecuteView } from './views/RepairWorkOrderExecuteView';
import { RepairAcceptanceView } from './views/RepairAcceptanceView';
import { RepairView } from './views/RepairView';
import { SparePartsLedgerView } from './views/SparePartsLedgerView';
import { SparePartsManagementView } from './views/SparePartsManagementView';
import { WarehouseLocationView } from './views/WarehouseLocationView';
import { RequirementPlanListView } from './views/RequirementPlanListView';
import { RequirementPlanAddView } from './views/RequirementPlanAddView';
import { RequirementPlanDetailView } from './views/RequirementPlanDetailView';
import { ArrivalInspectionListView } from './views/ArrivalInspectionListView';
import { ArrivalConfirmView } from './views/ArrivalConfirmView';
import { QualityInspectionExecuteView } from './views/QualityInspectionExecuteView';
import { QualityInspectionDetailView } from './views/QualityInspectionDetailView';
import { QualityInspectionReinspectView } from './views/QualityInspectionReinspectView';
import { InboundReceiptView } from './views/InboundReceiptView';
import { OutboundPickingView } from './views/OutboundPickingView';
import {
  ReturnGoodsView,
  GenericConfigView,
} from './views/SparePartsExtraViews';
import { LoginView } from './views/LoginView';
import {
  EquipmentCategoryConfigView,
  SparePartsCategoryConfigView,
  KnowledgeCategoryConfigView,
  AreaManagementConfigView,
  InspectionItemsConfigView,
  MaintenanceStandardsConfigView,
  ApprovalWorkflowConfigView,
  WorkOrderApprovalCenterView,
  FaultTypesConfigView,
  TeamManagementConfigView,
} from './views/ConfigManagementViews';

import {
  INITIAL_EQUIPMENT_LIST,
  INITIAL_ALARM_LOGS,
  INITIAL_INSPECTION_RECORDS,
  INITIAL_MAINTENANCE_RECORDS,
  INITIAL_REPAIR_ORDERS,
  INITIAL_ALL_SPARE_PARTS,
  INITIAL_INSPECTION_PLANS,
  INITIAL_INSPECTION_TASKS,
  INITIAL_PATROL_PLANS,
  INITIAL_MAINTENANCE_PLANS,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_MAINTENANCE_RECORD_LIST,
  INITIAL_FAULT_REPORTS,
  INITIAL_REPAIR_ACCEPTANCES,
  INITIAL_SPARE_PARTS_LEDGER,
  INITIAL_WAREHOUSE_LOCATIONS,
  INITIAL_REQUIREMENT_PLANS,
  INITIAL_ARRIVAL_INSPECTIONS,
} from './data/mockData';
import {
  Equipment,
  SparePartItem,
  InspectionRecord,
  MaintenanceRecord,
  RepairOrder,
  RepairAcceptanceItem,
  SparePartLedgerItem,
  WarehouseLocationItem,
  RequirementPlanItem,
  ArrivalInspectionItem,
  InspectionPlan,
  InspectionTask,
  PatrolPlan,
  MaintenancePlan,
  MaintenanceTask,
  MaintenanceRecordItem,
  FaultReportItem,
} from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState({ name: '张小刀', role: '高级设备主管' });
  const [activeTab, setActiveTab] = useState<MainTab>('overview');
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [currentInspectionPlan, setCurrentInspectionPlan] = useState<InspectionPlan | null>(null);
  const [currentInspectionTask, setCurrentInspectionTask] = useState<InspectionTask | null>(null);
  const [currentInspectionRecord, setCurrentInspectionRecord] = useState<InspectionRecordTableItem | null>(null);
  const [currentPatrolPlan, setCurrentPatrolPlan] = useState<PatrolPlan | null>(null);
  const [currentMaintenancePlan, setCurrentMaintenancePlan] = useState<MaintenancePlan | null>(null);
  const [currentMaintenanceTask, setCurrentMaintenanceTask] = useState<MaintenanceTask | null>(null);
  const [currentMaintenanceRecord, setCurrentMaintenanceRecord] = useState<MaintenanceRecordItem | null>(null);
  const [currentFaultReport, setCurrentFaultReport] = useState<FaultReportItem | null>(null);
  const [currentRepairOrder, setCurrentRepairOrder] = useState<RepairOrder | null>(null);

  // State Stores
  const [equipments, setEquipments] = useState<Equipment[]>(INITIAL_EQUIPMENT_LIST);
  const [inspectionPlans, setInspectionPlans] = useState<InspectionPlan[]>(INITIAL_INSPECTION_PLANS);
  const [patrolPlans, setPatrolPlans] = useState<PatrolPlan[]>(INITIAL_PATROL_PLANS);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>(INITIAL_MAINTENANCE_PLANS);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [maintenanceRecordList, setMaintenanceRecordList] = useState<MaintenanceRecordItem[]>(
    INITIAL_MAINTENANCE_RECORD_LIST
  );
  const [inspectionTasks, setInspectionTasks] = useState<InspectionTask[]>(INITIAL_INSPECTION_TASKS);
  const [inspectionRecordList, setInspectionRecordList] = useState<InspectionRecordTableItem[]>(
    DEFAULT_INSPECTION_RECORD_LIST
  );
  const [inspectionRecords, setInspectionRecords] = useState<InspectionRecord[]>(INITIAL_INSPECTION_RECORDS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE_RECORDS);
  const [faultReports, setFaultReports] = useState<FaultReportItem[]>(INITIAL_FAULT_REPORTS);
  const [repairOrders, setRepairOrders] = useState<RepairOrder[]>(INITIAL_REPAIR_ORDERS);
  const [repairAcceptances, setRepairAcceptances] = useState<RepairAcceptanceItem[]>(INITIAL_REPAIR_ACCEPTANCES);

  // Spare Parts & Warehouse & Procurement States
  const [sparePartsLedger, setSparePartsLedger] = useState<SparePartLedgerItem[]>(INITIAL_SPARE_PARTS_LEDGER);
  const [warehouseLocations, setWarehouseLocations] = useState<WarehouseLocationItem[]>(INITIAL_WAREHOUSE_LOCATIONS);
  const [requirementPlans, setRequirementPlans] = useState<RequirementPlanItem[]>(INITIAL_REQUIREMENT_PLANS);
  const [selectedRequirementPlan, setSelectedRequirementPlan] = useState<RequirementPlanItem | null>(
    INITIAL_REQUIREMENT_PLANS[0] || null
  );
  const [arrivalInspections, setArrivalInspections] = useState<ArrivalInspectionItem[]>(INITIAL_ARRIVAL_INSPECTIONS);
  const [selectedArrivalInspection, setSelectedArrivalInspection] = useState<ArrivalInspectionItem | null>(
    INITIAL_ARRIVAL_INSPECTIONS[0] || null
  );

  // Modals & Toasts
  const [barcodeTarget, setBarcodeTarget] = useState<Equipment | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation Handler
  const handleNavigate = (
    tab: MainTab,
    params?: {
      equipment?: Equipment;
      plan?: InspectionPlan;
      task?: InspectionTask;
      record?: InspectionRecordTableItem;
      patrolPlan?: PatrolPlan;
      maintenancePlan?: MaintenancePlan;
      maintenanceTask?: MaintenanceTask;
      maintenanceRecord?: MaintenanceRecordItem;
      faultReport?: FaultReportItem;
      repairOrder?: RepairOrder;
      requirementPlan?: RequirementPlanItem;
      arrivalInspection?: ArrivalInspectionItem;
    }
  ) => {
    if (params?.equipment) {
      setCurrentEquipment(params.equipment);
    }
    if (params?.plan) {
      setCurrentInspectionPlan(params.plan);
    }
    if (params?.task) {
      setCurrentInspectionTask(params.task);
    }
    if (params?.record) {
      setCurrentInspectionRecord(params.record);
    }
    if (params?.patrolPlan) {
      setCurrentPatrolPlan(params.patrolPlan);
    }
    if (params?.maintenancePlan) {
      setCurrentMaintenancePlan(params.maintenancePlan);
    }
    if (params?.maintenanceTask) {
      setCurrentMaintenanceTask(params.maintenanceTask);
    }
    if (params?.maintenanceRecord) {
      setCurrentMaintenanceRecord(params.maintenanceRecord);
    }
    if (params?.faultReport) {
      setCurrentFaultReport(params.faultReport);
    }
    if (params?.repairOrder) {
      setCurrentRepairOrder(params.repairOrder);
    }
    if (params?.requirementPlan) {
      setSelectedRequirementPlan(params.requirementPlan);
    }
    if (params?.arrivalInspection) {
      setSelectedArrivalInspection(params.arrivalInspection);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Maintenance Plan CRUD Handlers
  const handleSaveMaintenancePlan = (planData: Partial<MaintenancePlan>) => {
    if (currentMaintenancePlan && activeTab === 'maintenance-plan-edit') {
      const updatedPlan: MaintenancePlan = {
        ...currentMaintenancePlan,
        ...planData,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      } as MaintenancePlan;
      setMaintenancePlans((prev) =>
        prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
      );
      showToast(`已更新保养计划: ${updatedPlan.planName}`, 'success');
    } else {
      const newPlan: MaintenancePlan = {
        id: `mp-${Date.now()}`,
        planCode: `DJJH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        planName: planData.planName || '新建保养计划',
        startTime: planData.startTime || new Date().toLocaleDateString('zh-CN') + ' 08:00',
        endTime: planData.endTime || new Date().toLocaleDateString('zh-CN') + ' 18:00',
        approvalStatus: planData.approvalStatus || '无需审批',
        department: planData.department || '动力车间',
        maintenanceGroup: planData.maintenanceGroup || '机修一班',
        cycle: planData.cycle || '30天',
        cycleValue: planData.cycleValue || 30,
        cycleUnit: planData.cycleUnit || '天',
        executor: planData.executor || '张建国',
        enabled: planData.enabled ?? true,
        publishHoursBefore: planData.publishHoursBefore || 12,
        overdueHoursAfter: planData.overdueHoursAfter || 24,
        equipments: planData.equipments || [],
        standards: planData.standards || [],
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      // Descending order - prepend
      setMaintenancePlans((prev) => [newPlan, ...prev]);
      showToast(`已成功创建保养计划: ${newPlan.planName}（按时间降序置顶）`, 'success');
    }
    setActiveTab('maintenance-plan');
  };

  const handleDeleteMaintenancePlan = (id: string) => {
    setMaintenancePlans((prev) => prev.filter((p) => p.id !== id));
    showToast('已删除指定保养计划', 'info');
  };

  const handleBatchDeleteMaintenancePlans = (ids: string[]) => {
    const idSet = new Set(ids);
    setMaintenancePlans((prev) => prev.filter((p) => !idSet.has(p.id)));
    showToast(`已批量删除 ${ids.length} 项保养计划`, 'info');
  };

  const handleToggleMaintenancePlanStatus = (id: string, enabled: boolean) => {
    setMaintenancePlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled } : p))
    );
    showToast(`已${enabled ? '启用' : '停用'}保养计划`, 'info');
  };

  // Maintenance Task Handlers
  const handleExecuteMaintenanceTask = (task: MaintenanceTask) => {
    setCurrentMaintenanceTask(task);
    setActiveTab('maintenance-task-execute');
  };

  const handleSaveMaintenanceTaskStaging = (task: MaintenanceTask) => {
    setMaintenanceTasks((prev) =>
      prev.map((t) => (t.id === task.id ? task : t))
    );
    showToast(`已暂存保养任务进度: ${task.equipmentName}`, 'info');
    setActiveTab('maintenance-task');
  };

  const handleCompleteMaintenanceTask = (task: MaintenanceTask) => {
    setMaintenanceTasks((prev) =>
      prev.map((t) => (t.id === task.id ? task : t))
    );

    // Create completed record on top of Maintenance Record list
    const newRecord: MaintenanceRecordItem = {
      id: `mr-${Date.now()}`,
      taskCode: task.taskCode,
      planCode: task.planCode,
      equipmentName: task.equipmentName,
      equipmentCode: task.equipmentCode,
      maintenanceGroup: task.maintenanceGroup,
      executor: task.executor,
      planTime: task.planTime,
      actualTime: task.actualTime || new Date().toLocaleDateString('zh-CN') + ' ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      status: '已完成',
      conclusion: task.conclusion === '异常' ? '异常' : '正常',
      items: task.items,
      spares: task.spares,
      images: task.images,
    };
    setMaintenanceRecordList((prev) => [newRecord, ...prev]);

    showToast(`保养任务 ${task.equipmentName} 已执行完成，记录已归档（时间降序置顶）`, 'success');
    setActiveTab('maintenance-record');
  };

  const handleReportFaultFromMaintenance = (task: MaintenanceTask) => {
    const newFaultOrder: RepairOrder = {
      id: `ro-${Date.now()}`,
      orderNo: `WX${new Date().toISOString().slice(0, 10).replace(/-/g, '')}099`,
      equipmentName: task.equipmentName,
      equipmentCode: task.equipmentCode,
      faultType: '保养过程发现异常隐患',
      urgency: '紧急',
      reporter: task.executor || '陈伟',
      reportTime: new Date().toLocaleDateString('zh-CN') + ' ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      repairman: '待指派',
      status: '待指派',
      description: `保养中检测异常并自动发起工单，任务编号: ${task.taskCode}`,
      mttrMinutes: 0,
    };
    setRepairOrders((prev) => [newFaultOrder, ...prev]);
    showToast(`已针对【${task.equipmentName}】发起紧急故障报修工单`, 'warning');
    setActiveTab('repair-workorder');
  };

  const handleAddQuickMaintenanceTask = (taskData: Partial<MaintenanceTask>) => {
    const newTask: MaintenanceTask = {
      id: `mt-${Date.now()}`,
      taskCode: taskData.taskCode || `BYRW${Date.now().toString().slice(-8)}`,
      planCode: taskData.planCode || `DJJH${Date.now().toString().slice(-8)}`,
      equipmentName: taskData.equipmentName || '临时保养设备',
      equipmentCode: taskData.equipmentCode || 'EQ-TEMP-001',
      maintenanceGroup: taskData.maintenanceGroup || '机修一班',
      executor: taskData.executor || '张建国',
      planTime: taskData.planTime || new Date().toLocaleDateString('zh-CN') + ' 09:00',
      progress: '0/1',
      status: '待执行',
      conclusion: '正常',
      createTime: new Date().toISOString(),
    };
    setMaintenanceTasks((prev) => [newTask, ...prev]);
    showToast(`已成功创建保养任务: ${newTask.equipmentName}（最新时间置顶）`, 'success');
  };

  const handleViewMaintenanceRecordDetail = (record: MaintenanceRecordItem) => {
    setCurrentMaintenanceRecord(record);
    setActiveTab('maintenance-record-detail');
  };

  // Patrol Plan CRUD
  const handleSavePatrolPlan = (plan: PatrolPlan) => {
    const exists = patrolPlans.some((p) => p.id === plan.id);
    if (exists) {
      setPatrolPlans(patrolPlans.map((p) => (p.id === plan.id ? plan : p)));
      showToast(`已更新巡检计划: ${plan.planCode}（最新时间置顶）`, 'success');
    } else {
      setPatrolPlans([plan, ...patrolPlans]);
      showToast(`已成功创建巡检计划: ${plan.planCode}（最新时间置顶）`, 'success');
    }
    setActiveTab('patrol-plan');
  };

  const handleDeletePatrolPlan = (id: string) => {
    setPatrolPlans(patrolPlans.filter((p) => p.id !== id));
  };

  const handleBatchDeletePatrolPlans = (ids: string[]) => {
    const idSet = new Set(ids);
    setPatrolPlans(patrolPlans.filter((p) => !idSet.has(p.id)));
  };

  const handleTogglePatrolPlanStatus = (id: string) => {
    setPatrolPlans(
      patrolPlans.map((p) => {
        if (p.id === id) {
          const nextState = !p.enabled;
          showToast(`已${nextState ? '启用' : '禁用'}计划: ${p.planCode}`, 'info');
          return { ...p, enabled: nextState };
        }
        return p;
      })
    );
  };

  const handleExportPatrolPlans = () => {
    const headers = '计划编号,巡检区域,执行日期时间,所属部门,周期,上次执行时间,下次执行时间,执行人,状态,审批状态\n';
    const rows = patrolPlans
      .map(
        (p) =>
          `"${p.planCode}","${p.patrolArea}","${p.executionTimeRange}","${p.department}","${p.period}","${p.lastExecutionTime}","${p.nextExecutionTime}","${p.executor}","${p.enabled ? '启用' : '停用'}","${p.approvalStatus}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `巡检计划清单_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('巡检计划数据已成功导出为 CSV 表格', 'success');
  };

  // Inspection Task handlers
  const handleSaveInspectionTask = (task: InspectionTask, isCompleted?: boolean) => {
    const exists = inspectionTasks.some((t) => t.id === task.id);
    if (exists) {
      setInspectionTasks(inspectionTasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      setInspectionTasks([task, ...inspectionTasks]);
    }

    if (isCompleted) {
      // Also generate a completed record in record list (at top / latest)
      const newRec: InspectionRecordTableItem = {
        id: `rec-${Date.now()}`,
        planCode: task.taskCode || task.planCode || 'DJJH202609170086',
        equipmentName: task.equipmentName,
        equipmentCode: task.equipmentCode,
        executor: task.executor,
        checkStatus: task.checkStatus === '异常' ? '异常' : '正常',
        plannedTime: task.plannedTime,
        actualTime: task.actualTime || '2026-09-27 20:35',
        checkedItems: `${task.checkedItemsCount}/${task.totalItemsCount}`,
        status: '已完成',
        department: task.department,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setInspectionRecordList([newRec, ...inspectionRecordList]);
    }
  };

  const handleAddQuickTask = (task: InspectionTask) => {
    setInspectionTasks([task, ...inspectionTasks]);
  };

  // Inspection Plan CRUD
  const handleSaveInspectionPlan = (plan: InspectionPlan) => {
    const exists = inspectionPlans.some((p) => p.id === plan.id);
    if (exists) {
      setInspectionPlans(inspectionPlans.map((p) => (p.id === plan.id ? plan : p)));
      showToast(`已更新点检计划: ${plan.planCode}（最新时间置顶）`, 'success');
    } else {
      setInspectionPlans([plan, ...inspectionPlans]);
      showToast(`已成功创建点检计划: ${plan.planCode}（最新时间置顶）`, 'success');
    }
    setActiveTab('inspection-plan');
  };

  const handleDeleteInspectionPlan = (id: string) => {
    setInspectionPlans(inspectionPlans.filter((p) => p.id !== id));
  };

  const handleBatchDeleteInspectionPlans = (ids: string[]) => {
    const idSet = new Set(ids);
    setInspectionPlans(inspectionPlans.filter((p) => !idSet.has(p.id)));
  };

  const handleTogglePlanStatus = (id: string) => {
    setInspectionPlans(
      inspectionPlans.map((p) => {
        if (p.id === id) {
          const nextState = !p.enabled;
          showToast(`已${nextState ? '启用' : '禁用'}计划: ${p.planCode}`, 'info');
          return { ...p, enabled: nextState };
        }
        return p;
      })
    );
  };

  const handleExportInspectionPlans = () => {
    const headers = '计划编号,点检班组,设备名称,设备编码,所属部门,执行人,开始时间,结束时间,周期,发布时间,超时时间,状态,审批状态\n';
    const rows = inspectionPlans
      .map(
        (p) =>
          `"${p.planCode}","${p.group}","${p.equipmentName}","${p.equipmentCode}","${p.department}","${p.executor}","${p.startTime}","${p.endTime}","${p.period}","提前${p.publishHoursBefore}小时","计划开始后${p.overdueHoursAfter}小时","${p.enabled ? '启用' : '停用'}","${p.approvalStatus}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `点检计划清单_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('点检计划数据已成功导出为 CSV 表格', 'success');
  };

  // Equipment CRUD
  const handleSaveEquipment = (eq: Equipment) => {
    const exists = equipments.some((item) => item.id === eq.id);
    if (exists) {
      setEquipments(equipments.map((item) => (item.id === eq.id ? eq : item)));
      showToast(`已更新设备档案: ${eq.name}（最新时间置顶）`, 'success');
    } else {
      setEquipments([eq, ...equipments]);
      showToast(`已成功录入新设备: ${eq.name}（最新时间置顶）`, 'success');
    }
    setActiveTab('equipment-ledger');
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipments(equipments.filter((item) => item.id !== id));
  };

  const handleBatchDeleteEquipments = (ids: string[]) => {
    const idSet = new Set(ids);
    setEquipments(equipments.filter((item) => !idSet.has(item.id)));
  };

  const handleUpdateEquipmentSpareParts = (eqId: string, parts: SparePartItem[]) => {
    setEquipments(
      equipments.map((eq) =>
        eq.id === eqId
          ? {
              ...eq,
              spareParts: parts,
              updateTime: '2026-09-27 ' + new Date().toTimeString().split(' ')[0],
            }
          : eq
      )
    );
  };

  // Fault Report Handlers
  const handleCreateFaultReport = (newReport: Partial<FaultReportItem>) => {
    const reportItem: FaultReportItem = {
      id: `fr-${Date.now()}`,
      reportNo: `BX${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(100 + Math.random() * 900)}`,
      equipmentName: newReport.equipmentName || '工业生产设备',
      equipmentCode: newReport.equipmentCode || 'EQ-2026-001',
      equipmentCategory: newReport.equipmentCategory || '生产制造设备',
      specification: newReport.specification || newReport.equipmentSpec || '标准工业型号',
      equipmentLevel: newReport.equipmentLevel || 'A',
      faultType: newReport.faultType || '机械故障',
      faultTime: newReport.faultTime || new Date().toISOString().slice(0, 16).replace('T', ' '),
      faultLevel: newReport.faultLevel || '一般故障',
      reportUser: newReport.reportUser || newReport.reporter || '当前值班员',
      reporter: newReport.reporter || newReport.reportUser || '当前值班员',
      reportTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: '待处理',
      description: newReport.description || newReport.faultDescription || '现场设备异常运转',
      faultDescription: newReport.faultDescription || newReport.description || '现场设备异常运转',
      images: newReport.images || newReport.attachments || [],
      handler: newReport.handler || '--',
      createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setFaultReports((prev) => [reportItem, ...prev]);
    showToast(`故障报修单已成功提交: ${reportItem.reportNo}（最新时间置顶）`, 'success');
    setActiveTab('repair-report');
  };

  const handleDeleteFaultReports = (ids: string[]) => {
    setFaultReports((prev) => prev.filter((r) => !ids.includes(r.id)));
    showToast(`已成功删除选中的 ${ids.length} 项故障报修记录`, 'success');
  };

  const handleConfirmProcessFaultReport = (
    reportId: string,
    processData: {
      action: 'transfer_repair' | 'direct_resolve' | 'reject';
      assignedTeam?: string;
      assignee?: string;
      priority?: string;
      remark: string;
      linkedExperienceCode?: string;
    }
  ) => {
    setFaultReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const newStatus =
            processData.action === 'transfer_repair'
              ? '维修中'
              : processData.action === 'direct_resolve'
              ? '已完成'
              : '已驳回';
          return {
            ...r,
            status: newStatus,
          };
        }
        return r;
      })
    );
    const actionLabel =
      processData.action === 'transfer_repair'
        ? '已成功生成派发维修工单'
        : processData.action === 'direct_resolve'
        ? '已现场排查解决归档'
        : '已驳回报修申请';
    showToast(`故障处理完成: ${actionLabel}`, 'success');
    setActiveTab('repair-report');
  };

  const handleViewFaultReportDetail = (report: FaultReportItem) => {
    setCurrentFaultReport(report);
    setActiveTab('repair-report-detail');
  };

  const handleGoToProcessFaultReport = (report: FaultReportItem) => {
    setCurrentFaultReport(report);
    setActiveTab('repair-report-process');
  };

  // Repair Work Order Handlers
  const handleExecuteRepair = (order: RepairOrder) => {
    setCurrentRepairOrder(order);
    setActiveTab('repair-workorder-execute');
  };

  const handleAssignRepairOrder = (orderId: string, assignedGroup: string) => {
    setRepairOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            repairGroup: assignedGroup,
            status: '维修中',
          };
        }
        return o;
      })
    );
    showToast(`工单已成功指派至【${assignedGroup}】，状态更新为维修中`, 'success');
  };

  const handleSaveRepairExecution = (
    orderId: string,
    updatedData: Partial<RepairOrder>,
    isDraft: boolean = false
  ) => {
    setRepairOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            ...updatedData,
          };
        }
        return o;
      })
    );
    if (isDraft) {
      showToast('维修记录与备件消耗已成功暂存', 'info');
    } else {
      showToast('维修方案与备件消耗已确认提交，工单流转至待验收', 'success');
      setActiveTab('repair-workorder');
    }
  };

  const handleQuickCreateRepairTask = () => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const orderNo = `WX${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: RepairOrder = {
      id: `ro-${Date.now()}`,
      orderNo,
      createTime: nowStr,
      reportTime: nowStr,
      equipmentName: '关键工艺输送泵',
      equipmentCode: 'EQ-PUMP-2026',
      equipmentCategory: '动力设备 / 泵类',
      equipmentSpec: 'IS80-65-160',
      equipmentLevel: 'A类（关键设备）',
      installArea: '一车间 / 动力区',
      repairGroup: '机修一班',
      status: '待维修',
      faultType: '机械故障',
      urgency: '紧急',
      reporter: '当前值班长',
      reporterPhone: '138****0000',
      faultReportNo: `BX${new Date().toISOString().slice(0, 10).replace(/-/g, '')}01`,
      faultReportStatus: '待处理',
      faultTime: nowStr,
      faultDescription: '现场急停报警，电机轴承伴有异常高温与剧烈震颤',
      handler: '李强 (高级电工)',
      handleType: '内修',
      handleTime: nowStr,
      handleRemarks: '快速任务派发，已调度机修一组就位抢修。',
      repairSolutionDescription: '',
      repairImages: [],
      sparesConsumed: [],
      repairman: '李强',
      description: '输送泵剧烈振动紧急抢修',
      mttrMinutes: 60,
    };

    setRepairOrders((prev) => [newOrder, ...prev]);
    showToast(`快速维修任务已创建: ${orderNo}（最新时间置顶）`, 'success');
  };

  // Repair Acceptance Handlers
  const handleAcceptSubmit = (updatedItem: RepairAcceptanceItem) => {
    setRepairAcceptances((prev) => {
      const idx = prev.findIndex((item) => item.id === updatedItem.id || item.acceptanceNo === updatedItem.acceptanceNo);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedItem;
        return next;
      }
      return [updatedItem, ...prev];
    });

    // Also sync status with repairOrders
    if (updatedItem.orderNo) {
      setRepairOrders((prev) =>
        prev.map((o) => {
          if (o.orderNo === updatedItem.orderNo) {
            return {
              ...o,
              status: updatedItem.status === '验收通过' ? '已完成' : '待维修',
            };
          }
          return o;
        })
      );
    }
  };

  const handleQuickCreateAcceptance = (item: Partial<RepairAcceptanceItem>) => {
    const newItem = item as RepairAcceptanceItem;
    setRepairAcceptances((prev) => [newItem, ...prev]);
  };

  // Requirement Plan Handlers
  const handleSaveRequirementPlan = (plan: RequirementPlanItem) => {
    setRequirementPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === plan.id || p.planNo === plan.planNo);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = plan;
        return next;
      }
      return [plan, ...prev];
    });
    setSelectedRequirementPlan(plan);
    showToast(`需求计划 ${plan.planNo} 已成功保存`, 'success');
  };

  const handleDeleteRequirementPlan = (id: string) => {
    setRequirementPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('需求计划已删除', 'success');
  };

  // Arrival & Quality Inspection Handlers
  const handleConfirmArrival = (updated: ArrivalInspectionItem) => {
    setArrivalInspections((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === updated.id || i.arrivalNo === updated.arrivalNo || (i.inspectionNo && i.inspectionNo === updated.inspectionNo)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
    setSelectedArrivalInspection(updated);
    setActiveTab('spare-arrival');
    showToast(`到货确认成功: ${updated.arrivalNo || updated.inspectionNo}，已生成质检任务`, 'success');
  };

  const handleSaveQualityInspection = (updated: ArrivalInspectionItem) => {
    setArrivalInspections((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === updated.id || i.arrivalNo === updated.arrivalNo || (i.inspectionNo && i.inspectionNo === updated.inspectionNo)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
    setSelectedArrivalInspection(updated);
    setActiveTab('spare-arrival');
    showToast(`质检完成: ${updated.arrivalNo || updated.inspectionNo}，质检状态已更新`, 'success');
  };

  const handleSaveReinspection = (updated: ArrivalInspectionItem) => {
    setArrivalInspections((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === updated.id || i.arrivalNo === updated.arrivalNo || (i.inspectionNo && i.inspectionNo === updated.inspectionNo)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
    setSelectedArrivalInspection(updated);
    setActiveTab('spare-arrival');
    showToast(`重新质检完成: ${updated.arrivalNo || updated.inspectionNo}，质检记录已存入历史`, 'success');
  };

  // Export CSV
  const handleExportData = () => {
    const headers = '设备名称,设备编码,规格型号,设备分类,安装区域,设备等级,状态,使用部门,负责人,更新时间\n';
    const rows = equipments
      .map(
        (e) =>
          `"${e.name}","${e.code}","${e.spec}","${e.category}","${e.installArea}","${e.grade}","${e.status}","${e.department}","${e.manager}","${e.updateTime}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `工业设备台账清单_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('设备台账数据已成功导出为 CSV 表格', 'success');
  };

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'overview':
        return [{ label: '概览' }];
      case 'equipment-ledger':
        return [{ label: '设备管理' }, { label: '设备台账' }];
      case 'equipment-add':
        return [{ label: '设备管理' }, { label: '设备台账', onClick: () => setActiveTab('equipment-ledger') }, { label: '新增设备' }];
      case 'equipment-edit':
        return [{ label: '设备管理' }, { label: '设备台账', onClick: () => setActiveTab('equipment-ledger') }, { label: '编辑设备' }];
      case 'equipment-detail':
        return [{ label: '设备管理' }, { label: '设备台账', onClick: () => setActiveTab('equipment-ledger') }, { label: '设备详情' }];
      case 'equipment-spare-parts':
        return [{ label: '设备管理' }, { label: '设备台账', onClick: () => setActiveTab('equipment-ledger') }, { label: '设备备件' }];
      case 'inspection-plan':
        return [{ label: '点检管理' }, { label: '点检计划' }];
      case 'inspection-plan-add':
        return [{ label: '点检管理' }, { label: '点检计划', onClick: () => setActiveTab('inspection-plan') }, { label: '新增计划' }];
      case 'inspection-plan-edit':
        return [{ label: '点检管理' }, { label: '点检计划', onClick: () => setActiveTab('inspection-plan') }, { label: '编辑计划' }];
      case 'inspection-plan-detail':
        return [{ label: '点检管理' }, { label: '点检计划', onClick: () => setActiveTab('inspection-plan') }, { label: '详情' }];
      case 'inspection-task':
        return [{ label: '点检管理' }, { label: '点检任务' }];
      case 'inspection-task-execute':
        return [{ label: '点检管理' }, { label: '点检任务', onClick: () => setActiveTab('inspection-task') }, { label: '执行点检任务' }];
      case 'inspection-record':
        return [{ label: '点检管理' }, { label: '点检记录' }];
      case 'inspection-record-detail':
        return [{ label: '点检管理' }, { label: '点检记录', onClick: () => setActiveTab('inspection-record') }, { label: '点检记录详情' }];
      case 'patrol-plan':
        return [{ label: '巡检管理' }, { label: '巡检计划' }];
      case 'patrol-plan-add':
        return [{ label: '巡检管理' }, { label: '巡检计划', onClick: () => setActiveTab('patrol-plan') }, { label: '新增计划' }];
      case 'patrol-plan-edit':
        return [{ label: '巡检管理' }, { label: '巡检计划', onClick: () => setActiveTab('patrol-plan') }, { label: '编辑计划' }];
      case 'patrol-plan-detail':
        return [{ label: '巡检管理' }, { label: '巡检计划', onClick: () => setActiveTab('patrol-plan') }, { label: '详情' }];
      case 'patrol-task':
      case 'patrol-task-execute':
        return [{ label: '巡检管理' }, { label: '巡检任务' }];
      case 'patrol-record':
      case 'patrol-record-detail':
        return [{ label: '巡检管理' }, { label: '巡检记录' }];
      case 'maintenance-plan':
        return [{ label: '保养管理' }, { label: '保养计划' }];
      case 'maintenance-plan-add':
        return [{ label: '保养管理' }, { label: '保养计划', onClick: () => setActiveTab('maintenance-plan') }, { label: '新增计划' }];
      case 'maintenance-plan-edit':
        return [{ label: '保养管理' }, { label: '保养计划', onClick: () => setActiveTab('maintenance-plan') }, { label: '编辑计划' }];
      case 'maintenance-plan-detail':
        return [{ label: '保养管理' }, { label: '保养计划', onClick: () => setActiveTab('maintenance-plan') }, { label: '详情' }];
      case 'maintenance-task':
        return [{ label: '保养管理' }, { label: '保养任务' }];
      case 'maintenance-task-execute':
        return [{ label: '保养管理' }, { label: '保养任务', onClick: () => setActiveTab('maintenance-task') }, { label: '执行保养任务' }];
      case 'maintenance-record':
        return [{ label: '保养管理' }, { label: '保养记录' }];
      case 'maintenance-record-detail':
        return [{ label: '保养管理' }, { label: '保养记录', onClick: () => setActiveTab('maintenance-record') }, { label: '保养记录详情' }];
      case 'repair-report':
        return [{ label: '设备维修' }, { label: '故障报修' }];
      case 'repair-report-add':
        return [{ label: '设备维修' }, { label: '故障报修', onClick: () => setActiveTab('repair-report') }, { label: '新增报修' }];
      case 'repair-report-process':
        return [{ label: '设备维修' }, { label: '故障报修', onClick: () => setActiveTab('repair-report') }, { label: '故障处理' }];
      case 'repair-report-detail':
        return [{ label: '设备维修' }, { label: '故障报修', onClick: () => setActiveTab('repair-report') }, { label: '详情' }];
      case 'repair-workorder':
        return [{ label: '设备维修' }, { label: '维修工单' }];
      case 'repair-workorder-execute':
        return [
          { label: '设备维修' },
          { label: '维修工单', onClick: () => setActiveTab('repair-workorder') },
          { label: '执行维修' },
        ];
      case 'repair-acceptance':
        return [{ label: '设备维修' }, { label: '设备验收' }];
      case 'repair-record-tab':
        return [{ label: '设备维修' }, { label: '维修记录' }];
      case 'repair-experience-tab':
        return [{ label: '设备维修' }, { label: '维修经验库' }];
      case 'spare-parts-ledger':
      case 'spare-management':
        return [{ label: '备品备件' }, { label: '备件台账' }];
      case 'spare-warehouse':
        return [{ label: '备品备件' }, { label: '仓库货位管理' }];
      case 'spare-requirement':
        return [{ label: '备品备件' }, { label: '需求计划' }];
      case 'spare-requirement-add':
        return [
          { label: '备品备件' },
          { label: '需求计划', onClick: () => setActiveTab('spare-requirement') },
          { label: '新增需求计划' },
        ];
      case 'spare-requirement-detail':
        return [
          { label: '备品备件' },
          { label: '需求计划', onClick: () => setActiveTab('spare-requirement') },
          { label: '需求计划详情' },
        ];
      case 'spare-arrival':
      case 'spare-arrival-inspection':
        return [{ label: '备品备件' }, { label: '到货质检' }];
      case 'spare-arrival-confirm':
        return [
          { label: '备品备件' },
          { label: '到货质检', onClick: () => setActiveTab('spare-arrival-inspection') },
          { label: '确认到货' },
        ];
      case 'spare-quality-inspect':
      case 'spare-inspect-execute':
        return [
          { label: '备品备件' },
          { label: '到货质检', onClick: () => setActiveTab('spare-arrival-inspection') },
          { label: '质检' },
        ];
      case 'spare-quality-detail':
      case 'spare-inspect-detail':
        return [
          { label: '备品备件' },
          { label: '到货质检', onClick: () => setActiveTab('spare-arrival-inspection') },
          { label: '质检详情' },
        ];
      case 'spare-quality-reinspect':
      case 'spare-inspect-reinspect':
        return [
          { label: '备品备件' },
          { label: '到货质检', onClick: () => setActiveTab('spare-arrival-inspection') },
          { label: '重新质检' },
        ];
      case 'spare-inbound':
        return [{ label: '备品备件' }, { label: '入库管理' }];
      case 'spare-outbound':
        return [{ label: '备品备件' }, { label: '出库管理' }];
      case 'spare-return':
      case 'spare-returns':
        return [{ label: '备品备件' }, { label: '退货管理' }];
      case 'config-equipment-category':
        return [{ label: '配置管理' }, { label: '设备分类' }];
      case 'config-spare-category':
        return [{ label: '配置管理' }, { label: '备件分类' }];
      case 'config-knowledge-category':
        return [{ label: '配置管理' }, { label: '知识库分类' }];
      case 'config-area-management':
        return [{ label: '配置管理' }, { label: '区域管理' }];
      case 'config-inspection-items':
        return [{ label: '配置管理' }, { label: '点巡检项目' }];
      case 'config-maintenance-standards':
        return [{ label: '配置管理' }, { label: '维保标准' }];
      case 'config-approval':
      case 'config-approval-flow':
        return [{ label: '配置管理' }, { label: '审批流设置' }];
      case 'config-fault-types':
        return [{ label: '配置管理' }, { label: '故障类型' }];
      case 'config-team-management':
        return [{ label: '配置管理' }, { label: '班组管理' }];
      case 'workflow-approval':
      case 'approval-center':
        return [{ label: '工单' }, { label: '工单审批' }];
      case 'config-basic':
        return [{ label: '配置管理' }, { label: '基础配置' }];
      case 'config-equipment':
        return [{ label: '配置管理' }, { label: '设备配置' }];
      case 'config-spare':
        return [{ label: '配置管理' }, { label: '备件配置' }];
      default:
        return [{ label: '概览' }];
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsLoggedIn(true);
          }}
          showToast={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* 1. Global Header */}
      <Header
        userName={currentUser.name}
        currentRole={currentUser.role}
        onNavigate={handleNavigate}
        onLogout={() => {
          setIsLoggedIn(false);
          showToast('已安全退出系统，请重新登录', 'info');
        }}
      />

      {/* 2. Main Layout with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          equipmentCount={equipments.length + 991}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-3 min-w-0">
          {/* Unified Breadcrumb Navigation for all pages */}
          <Breadcrumb items={getBreadcrumbs()} />

          {/* Views Routing */}
          {activeTab === 'overview' && (
            <OverviewView
              equipments={equipments}
              alarmLogs={INITIAL_ALARM_LOGS}
              inspectionRecords={inspectionRecords}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'equipment-ledger' && (
            <EquipmentLedgerView
              equipments={equipments}
              onNavigate={handleNavigate}
              onDeleteEquipment={handleDeleteEquipment}
              onBatchDelete={handleBatchDeleteEquipments}
              onOpenBarcodeModal={(eq) => setBarcodeTarget(eq)}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onExportData={handleExportData}
              showToast={showToast}
            />
          )}

          {activeTab === 'equipment-add' && (
            <EquipmentFormView
              onSave={handleSaveEquipment}
              onCancel={() => setActiveTab('equipment-ledger')}
              showToast={showToast}
            />
          )}

          {activeTab === 'equipment-edit' && (
            <EquipmentFormView
              initialEquipment={currentEquipment}
              onSave={handleSaveEquipment}
              onCancel={() => setActiveTab('equipment-ledger')}
              showToast={showToast}
            />
          )}

          {activeTab === 'equipment-detail' && currentEquipment && (
            <EquipmentDetailView
              equipment={currentEquipment}
              onBack={() => setActiveTab('equipment-ledger')}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'equipment-spare-parts' && currentEquipment && (
            <EquipmentSparePartsView
              equipment={currentEquipment}
              onBack={() => setActiveTab('equipment-ledger')}
              onUpdateEquipmentSpareParts={handleUpdateEquipmentSpareParts}
              showToast={showToast}
            />
          )}

          {/* Inspection Tabs */}
          {activeTab === 'inspection-plan' && (
            <InspectionPlanListView
              plans={inspectionPlans}
              onNavigate={handleNavigate}
              onDeletePlan={handleDeleteInspectionPlan}
              onBatchDeletePlans={handleBatchDeleteInspectionPlans}
              onTogglePlanStatus={handleTogglePlanStatus}
              onExportPlans={handleExportInspectionPlans}
              showToast={showToast}
            />
          )}
          {activeTab === 'inspection-plan-add' && (
            <InspectionPlanAddView
              onSave={handleSaveInspectionPlan}
              onCancel={() => setActiveTab('inspection-plan')}
              showToast={showToast}
            />
          )}
          {activeTab === 'inspection-plan-edit' && (
            <InspectionPlanAddView
              initialPlan={currentInspectionPlan}
              onSave={handleSaveInspectionPlan}
              onCancel={() => setActiveTab('inspection-plan')}
              showToast={showToast}
            />
          )}
          {activeTab === 'inspection-plan-detail' && (
            <InspectionPlanDetailView
              plan={currentInspectionPlan}
              onBack={() => setActiveTab('inspection-plan')}
            />
          )}
          {activeTab === 'inspection-task' && (
            <InspectionTaskListView
              tasks={inspectionTasks}
              onNavigate={handleNavigate}
              onAddTask={handleAddQuickTask}
              showToast={showToast}
            />
          )}
          {activeTab === 'inspection-task-execute' && (
            <InspectionTaskExecuteView
              task={currentInspectionTask}
              onSaveTask={handleSaveInspectionTask}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          )}
          {activeTab === 'inspection-record' && (
            <InspectionRecordListView
              records={inspectionRecordList}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          )}
          {activeTab === 'inspection-record-detail' && (
            <InspectionRecordDetailView
              record={currentInspectionRecord}
              onBack={() => setActiveTab('inspection-record')}
            />
          )}

          {/* Patrol Tabs */}
          {activeTab === 'patrol-plan' && (
            <PatrolPlanListView
              plans={patrolPlans}
              onNavigate={handleNavigate}
              onDeletePlan={handleDeletePatrolPlan}
              onBatchDeletePlans={handleBatchDeletePatrolPlans}
              onTogglePlanStatus={handleTogglePatrolPlanStatus}
              onExportPlans={handleExportPatrolPlans}
              showToast={showToast}
            />
          )}
          {activeTab === 'patrol-plan-add' && (
            <PatrolPlanAddView
              onSave={handleSavePatrolPlan}
              onCancel={() => setActiveTab('patrol-plan')}
              showToast={showToast}
            />
          )}
          {activeTab === 'patrol-plan-edit' && (
            <PatrolPlanAddView
              initialPlan={currentPatrolPlan}
              onSave={handleSavePatrolPlan}
              onCancel={() => setActiveTab('patrol-plan')}
              showToast={showToast}
            />
          )}
          {activeTab === 'patrol-plan-detail' && (
            <PatrolPlanDetailView
              plan={currentPatrolPlan}
              onBack={() => setActiveTab('patrol-plan')}
            />
          )}
          {activeTab === 'patrol-task' && <PatrolView subType="task" showToast={showToast} />}
          {activeTab === 'patrol-record' && <PatrolView subType="record" showToast={showToast} />}

          {/* Maintenance Tabs */}
          {activeTab === 'maintenance-plan' && (
            <MaintenancePlanListView
              plans={maintenancePlans}
              onAddPlan={() => {
                setCurrentMaintenancePlan(null);
                setActiveTab('maintenance-plan-add');
              }}
              onEditPlan={(plan) => {
                setCurrentMaintenancePlan(plan);
                setActiveTab('maintenance-plan-edit');
              }}
              onViewPlanDetail={(plan) => {
                setCurrentMaintenancePlan(plan);
                setActiveTab('maintenance-plan-detail');
              }}
              onDeletePlan={handleDeleteMaintenancePlan}
              onBatchDeletePlans={handleBatchDeleteMaintenancePlans}
              onTogglePlanStatus={handleToggleMaintenancePlanStatus}
            />
          )}
          {activeTab === 'maintenance-plan-add' && (
            <MaintenancePlanAddView
              onSave={handleSaveMaintenancePlan}
              onCancel={() => setActiveTab('maintenance-plan')}
            />
          )}
          {activeTab === 'maintenance-plan-edit' && (
            <MaintenancePlanAddView
              initialPlan={currentMaintenancePlan}
              onSave={handleSaveMaintenancePlan}
              onCancel={() => setActiveTab('maintenance-plan')}
            />
          )}
          {activeTab === 'maintenance-plan-detail' && currentMaintenancePlan && (
            <MaintenancePlanDetailView
              plan={currentMaintenancePlan}
              onBack={() => setActiveTab('maintenance-plan')}
            />
          )}
          {activeTab === 'maintenance-task' && (
            <MaintenanceTaskListView
              tasks={maintenanceTasks}
              onExecuteTask={handleExecuteMaintenanceTask}
              onAddQuickTask={handleAddQuickMaintenanceTask}
            />
          )}
          {activeTab === 'maintenance-task-execute' && currentMaintenanceTask && (
            <MaintenanceTaskExecuteView
              task={currentMaintenanceTask}
              onSaveStaging={handleSaveMaintenanceTaskStaging}
              onComplete={handleCompleteMaintenanceTask}
              onReportFault={handleReportFaultFromMaintenance}
              onBack={() => setActiveTab('maintenance-task')}
            />
          )}
          {activeTab === 'maintenance-record' && (
            <MaintenanceRecordListView
              records={maintenanceRecordList}
              onViewRecordDetail={handleViewMaintenanceRecordDetail}
            />
          )}
          {activeTab === 'maintenance-record-detail' && currentMaintenanceRecord && (
            <MaintenanceRecordDetailView
              record={currentMaintenanceRecord}
              onBack={() => setActiveTab('maintenance-record')}
            />
          )}

          {/* Repair Tabs (Fault Reporting & Workorders) */}
          {activeTab === 'repair-report' && (
            <FaultReportListView
              reports={faultReports}
              onAddReport={() => setActiveTab('repair-report-add')}
              onProcessReport={handleGoToProcessFaultReport}
              onViewDetail={handleViewFaultReportDetail}
              onDeleteReports={handleDeleteFaultReports}
            />
          )}
          {activeTab === 'repair-report-add' && (
            <FaultReportAddView
              onSave={handleCreateFaultReport}
              onCancel={() => setActiveTab('repair-report')}
            />
          )}
          {activeTab === 'repair-report-process' && (
            <FaultReportProcessView
              report={currentFaultReport}
              onConfirmProcess={handleConfirmProcessFaultReport}
              onBack={() => setActiveTab('repair-report')}
            />
          )}
          {activeTab === 'repair-report-detail' && (
            <FaultReportDetailView
              report={currentFaultReport}
              onBack={() => setActiveTab('repair-report')}
              onGoToProcess={handleGoToProcessFaultReport}
            />
          )}
          {activeTab === 'repair-workorder' && (
            <RepairWorkOrderListView
              orders={repairOrders}
              onExecuteRepair={handleExecuteRepair}
              onAssignOrder={handleAssignRepairOrder}
              onQuickCreateTask={handleQuickCreateRepairTask}
            />
          )}
          {activeTab === 'repair-workorder-execute' && (
            <RepairWorkOrderExecuteView
              order={currentRepairOrder}
              onSave={handleSaveRepairExecution}
              onBack={() => setActiveTab('repair-workorder')}
            />
          )}
          {activeTab === 'repair-acceptance' && (
            <RepairAcceptanceView
              acceptances={repairAcceptances}
              repairOrders={repairOrders}
              onAcceptSubmit={handleAcceptSubmit}
              onQuickCreateAcceptance={handleQuickCreateAcceptance}
              showToast={showToast}
            />
          )}

          {/* Spare Parts Ledger (Legacy quick modal view) */}
          {activeTab === 'spare-parts-ledger' && <SparePartsLedgerView showToast={showToast} />}

          {/* 1. Spare Parts Ledger & Management (Screenshots 1, 2, 3) */}
          {activeTab === 'spare-management' && (
            <SparePartsManagementView
              parts={sparePartsLedger}
              onAddPart={(newPart) => {
                setSparePartsLedger((prev) => [newPart, ...prev]);
              }}
              onUpdatePart={(updatedPart) => {
                setSparePartsLedger((prev) =>
                  prev.map((p) => (p.id === updatedPart.id ? updatedPart : p))
                );
              }}
              onDeleteParts={(ids) => {
                setSparePartsLedger((prev) => prev.filter((p) => !ids.includes(p.id)));
              }}
              showToast={showToast}
            />
          )}

          {/* 2. Warehouse & Location Management (Screenshot 4) */}
          {activeTab === 'spare-warehouse' && (
            <WarehouseLocationView
              locations={warehouseLocations}
              onAddLocation={(newLoc) => {
                setWarehouseLocations((prev) => [newLoc, ...prev]);
              }}
              onUpdateLocation={(updatedLoc) => {
                setWarehouseLocations((prev) =>
                  prev.map((l) => (l.id === updatedLoc.id ? updatedLoc : l))
                );
              }}
              onDeleteLocation={(id) => {
                setWarehouseLocations((prev) => prev.filter((l) => l.id !== id));
              }}
              showToast={showToast}
            />
          )}

          {/* 3. Requirement Plans (Screenshots 5, 6, 7) */}
          {activeTab === 'spare-requirement' && (
            <RequirementPlanListView
              plans={requirementPlans}
              onGoToAdd={() => setActiveTab('spare-requirement-add')}
              onGoToDetail={(plan) => {
                setSelectedRequirementPlan(plan);
                setActiveTab('spare-requirement-detail');
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'spare-requirement-add' && (
            <RequirementPlanAddView
              onSave={(newPlan) => {
                handleSaveRequirementPlan(newPlan);
                setActiveTab('spare-requirement');
              }}
              onBack={() => setActiveTab('spare-requirement')}
              showToast={showToast}
            />
          )}

          {activeTab === 'spare-requirement-detail' && (
            <RequirementPlanDetailView
              plan={selectedRequirementPlan}
              onBack={() => setActiveTab('spare-requirement')}
            />
          )}

          {/* 4. Arrival & Quality Inspections (Screenshots 8 to 18) */}
          {(activeTab === 'spare-arrival' || activeTab === 'spare-arrival-inspection') && (
            <ArrivalInspectionListView
              inspections={arrivalInspections}
              onGoToConfirmArrival={(item) => {
                setSelectedArrivalInspection(item);
                setActiveTab('spare-arrival-confirm');
              }}
              onGoToInspect={(item) => {
                setSelectedArrivalInspection(item);
                setActiveTab('spare-quality-inspect');
              }}
              onGoToDetail={(item) => {
                setSelectedArrivalInspection(item);
                setActiveTab('spare-quality-detail');
              }}
              onGoToReinspect={(item) => {
                setSelectedArrivalInspection(item);
                setActiveTab('spare-quality-reinspect');
              }}
              onAddNewInspection={(deliveryNo) => {
                const newInsp: ArrivalInspectionItem = {
                  id: `ai-${Date.now()}`,
                  arrivalNo: `DH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(100 + Math.random() * 900)}`,
                  inspectionNo: `ZJ${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(100 + Math.random() * 900)}`,
                  deliveryNo: deliveryNo || `SH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}01`,
                  purchaseOrderNo: `CG${new Date().toISOString().slice(0, 10).replace(/-/g, '')}01`,
                  deliveryDate: new Date().toISOString().slice(0, 10),
                  supplier: '上海电气成套备件有限公司',
                  itemCount: 2,
                  totalDeliveryQuantity: 10,
                  status: '待确认到货',
                  arrivalStatus: '未到货',
                  inspectionStatus: '未质检',
                  qualifiedTotalAmount: 0,
                  unqualifiedTotalAmount: 0,
                  createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
                  items: [
                    {
                      id: `item-${Date.now()}-1`,
                      spareName: '双列调心滚子轴承',
                      spareCode: 'H04001',
                      category: '轴承/机械传动',
                      spec: '22218-E1-K',
                      brand: 'SKF',
                      unit: '套',
                      supplier: '上海电气成套备件有限公司',
                      purchasedQuantity: 10,
                      arrivalQuantity: 10,
                      unqualifiedReason: '',
                      handlingMethod: '正常入库',
                      unitPrice: 580,
                      qualifiedQuantity: 10,
                      qualifiedAmount: 5800,
                      unqualifiedQuantity: 0,
                      unqualifiedAmount: 0,
                    },
                  ],
                };
                setArrivalInspections((prev) => [newInsp, ...prev]);
                showToast(`已成功新增送货到货质检任务: ${newInsp.arrivalNo || newInsp.inspectionNo}`, 'success');
              }}
              onDeleteInspections={(ids) => {
                setArrivalInspections((prev) => prev.filter((i) => !ids.includes(i.id)));
                showToast(`已删除 ${ids.length} 条质检记录`, 'success');
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'spare-arrival-confirm' && (
            <ArrivalConfirmView
              inspection={selectedArrivalInspection}
              onSave={handleConfirmArrival}
              onCancel={() => setActiveTab('spare-arrival-inspection')}
              showToast={showToast}
            />
          )}

          {activeTab === 'spare-quality-inspect' && (
            <QualityInspectionExecuteView
              inspection={selectedArrivalInspection}
              onSave={handleSaveQualityInspection}
              onCancel={() => setActiveTab('spare-arrival-inspection')}
              showToast={showToast}
            />
          )}

          {activeTab === 'spare-quality-detail' && (
            <QualityInspectionDetailView
              inspection={selectedArrivalInspection}
              onBack={() => setActiveTab('spare-arrival-inspection')}
            />
          )}

          {activeTab === 'spare-quality-reinspect' && (
            <QualityInspectionReinspectView
              inspection={selectedArrivalInspection}
              onSave={handleSaveReinspection}
              onCancel={() => setActiveTab('spare-arrival-inspection')}
              showToast={showToast}
            />
          )}

          {/* 5. Inbound / Outbound / Return & Configurations */}
          {activeTab === 'spare-inbound' && <InboundReceiptView showToast={showToast} />}
          {activeTab === 'spare-outbound' && <OutboundPickingView showToast={showToast} />}
          {(activeTab === 'spare-return' || activeTab === 'spare-returns') && (
            <ReturnGoodsView showToast={showToast} />
          )}

          {/* Dedicated Configuration Management Views */}
          {activeTab === 'config-equipment-category' && (
            <EquipmentCategoryConfigView showToast={showToast} />
          )}
          {activeTab === 'config-spare-category' && (
            <SparePartsCategoryConfigView showToast={showToast} />
          )}
          {activeTab === 'config-knowledge-category' && (
            <KnowledgeCategoryConfigView showToast={showToast} />
          )}
          {activeTab === 'config-area-management' && (
            <AreaManagementConfigView showToast={showToast} />
          )}
          {activeTab === 'config-inspection-items' && (
            <InspectionItemsConfigView showToast={showToast} />
          )}
          {activeTab === 'config-maintenance-standards' && (
            <MaintenanceStandardsConfigView showToast={showToast} />
          )}
          {(activeTab === 'config-approval-flow' || activeTab === 'config-approval') && (
            <ApprovalWorkflowConfigView showToast={showToast} />
          )}
          {(activeTab === 'workflow-approval' || activeTab === 'approval-center') && (
            <WorkOrderApprovalCenterView showToast={showToast} />
          )}
          {activeTab === 'config-fault-types' && (
            <FaultTypesConfigView showToast={showToast} />
          )}
          {activeTab === 'config-team-management' && (
            <TeamManagementConfigView showToast={showToast} />
          )}

          {/* Generic Fallback Configs */}
          {activeTab === 'config-basic' && <GenericConfigView type="basic" showToast={showToast} />}
          {activeTab === 'config-equipment' && <GenericConfigView type="equipment" showToast={showToast} />}
          {activeTab === 'config-spare' && <GenericConfigView type="spare" showToast={showToast} />}
          {activeTab === 'config-approval' && <GenericConfigView type="approval" showToast={showToast} />}
        </main>
      </div>

      {/* Global Modals */}
      <BarcodeModal
        equipment={barcodeTarget}
        onClose={() => setBarcodeTarget(null)}
        showToast={showToast}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          // Add newly imported equipments with top timestamps
          const imported: Equipment[] = [
            {
              id: `eq-imp-${Date.now()}-1`,
              name: '智能变频冷水机组',
              code: 'SB2026092799',
              category: '动力设备/压缩机',
              spec: 'CW-3000-INV',
              grade: 'A',
              tag: '重要设备',
              installArea: '3栋/2层/动力站房',
              status: '使用中',
              department: '动力运行车间',
              manager: '张建国',
              manufacturer: '格力工业装备',
              factoryCode: 'GL-2026-99',
              supplier: '格力工业直营',
              maintenanceDate: '2026-09-30',
              contactPerson: '李工',
              contactPhone: '138****0001',
              updateTime: '2026-09-27 20:10:00',
              createTime: '2026-09-27 20:10:00',
              images: [],
              spareParts: INITIAL_ALL_SPARE_PARTS.slice(0, 2),
            },
          ];
          setEquipments([...imported, ...equipments]);
        }}
        showToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
