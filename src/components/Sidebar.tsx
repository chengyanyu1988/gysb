import React, { useState } from 'react';
import {
  Home,
  Sliders,
  ClipboardList,
  FileCheck,
  Wrench,
  Hammer,
  Package,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

export type MainTab =
  | 'overview'
  | 'equipment-ledger'
  | 'equipment-add'
  | 'equipment-edit'
  | 'equipment-detail'
  | 'equipment-spare-parts'
  | 'inspection-plan'
  | 'inspection-plan-add'
  | 'inspection-plan-edit'
  | 'inspection-plan-detail'
  | 'inspection-task'
  | 'inspection-task-execute'
  | 'inspection-record'
  | 'inspection-record-detail'
  | 'patrol-plan'
  | 'patrol-plan-add'
  | 'patrol-plan-edit'
  | 'patrol-plan-detail'
  | 'patrol-task'
  | 'patrol-task-execute'
  | 'patrol-record'
  | 'patrol-record-detail'
  | 'maintenance-plan'
  | 'maintenance-plan-add'
  | 'maintenance-plan-edit'
  | 'maintenance-plan-detail'
  | 'maintenance-task'
  | 'maintenance-task-execute'
  | 'maintenance-record'
  | 'maintenance-record-detail'
  | 'repair-report'
  | 'repair-report-add'
  | 'repair-report-process'
  | 'repair-report-detail'
  | 'repair-workorder'
  | 'repair-workorder-execute'
  | 'repair-acceptance'
  | 'repair-record-tab'
  | 'repair-experience-tab'
  | 'spare-parts-ledger'
  | 'spare-management'
  | 'spare-warehouse'
  | 'spare-requirement'
  | 'spare-requirement-add'
  | 'spare-requirement-detail'
  | 'spare-arrival'
  | 'spare-arrival-inspection'
  | 'spare-arrival-confirm'
  | 'spare-quality-inspect'
  | 'spare-inspect-execute'
  | 'spare-quality-detail'
  | 'spare-inspect-detail'
  | 'spare-quality-reinspect'
  | 'spare-inspect-reinspect'
  | 'spare-inbound'
  | 'spare-outbound'
  | 'spare-return'
  | 'spare-returns'
  | 'workflow-approval'
  | 'approval-center'
  | 'config-basic'
  | 'config-equipment'
  | 'config-spare'
  | 'config-approval'
  | 'config-approval-flow'
  | 'config-equipment-category'
  | 'config-spare-category'
  | 'config-knowledge-category'
  | 'config-area-management'
  | 'config-inspection-items'
  | 'config-maintenance-standards'
  | 'config-fault-types'
  | 'config-team-management';

interface SidebarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  equipmentCount?: number;
}

interface MenuGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  children: {
    key: MainTab;
    label: string;
    badge?: number;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, equipmentCount = 1001 }) => {
  // Track open state for collapsible groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    equipment: true,
    inspection: true,
    patrol: true,
    maintenance: true,
    repair: true,
    spare: true,
    workflow: true,
    config: true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuGroups: MenuGroup[] = [
    {
      key: 'equipment',
      label: '设备管理',
      icon: <Sliders className="w-4 h-4" />,
      children: [
        { key: 'equipment-ledger', label: '设备台账' }
      ]
    },
    {
      key: 'inspection',
      label: '点检管理',
      icon: <ClipboardList className="w-4 h-4" />,
      children: [
        { key: 'inspection-plan', label: '点检计划' },
        { key: 'inspection-task', label: '点检任务' },
        { key: 'inspection-record', label: '点检记录' }
      ]
    },
    {
      key: 'patrol',
      label: '巡检管理',
      icon: <FileCheck className="w-4 h-4" />,
      children: [
        { key: 'patrol-plan', label: '巡检计划' },
        { key: 'patrol-task', label: '巡检任务' },
        { key: 'patrol-record', label: '巡检记录' }
      ]
    },
    {
      key: 'maintenance',
      label: '保养管理',
      icon: <Wrench className="w-4 h-4" />,
      children: [
        { key: 'maintenance-plan', label: '保养计划' },
        { key: 'maintenance-task', label: '保养任务', badge: 2 },
        { key: 'maintenance-record', label: '保养记录' }
      ]
    },
    {
      key: 'repair',
      label: '设备维修',
      icon: <Hammer className="w-4 h-4" />,
      children: [
        { key: 'repair-report', label: '故障报修' },
        { key: 'repair-workorder', label: '维修工单', badge: 1 },
        { key: 'repair-acceptance', label: '设备验收' },
        { key: 'repair-record-tab', label: '维修记录' },
        { key: 'repair-experience-tab', label: '经验库' },
      ]
    },
    {
      key: 'spare',
      label: '备品备件',
      icon: <Package className="w-4 h-4" />,
      children: [
        { key: 'spare-management', label: '备件管理' },
        { key: 'spare-warehouse', label: '仓库货位管理' },
        { key: 'spare-requirement', label: '需求计划' },
        { key: 'spare-arrival-inspection', label: '到货质检' },
        { key: 'spare-inbound', label: '收货入库' },
        { key: 'spare-parts-ledger', label: '库存管理' },
        { key: 'spare-outbound', label: '领用出库' },
        { key: 'spare-returns', label: '退货管理' },
      ]
    },
    {
      key: 'workflow',
      label: '工单',
      icon: <FileCheck className="w-4 h-4" />,
      children: [
        { key: 'workflow-approval', label: '工单审批', badge: 3 },
      ]
    },
    {
      key: 'config',
      label: '配置管理',
      icon: <Database className="w-4 h-4" />,
      children: [
        { key: 'config-equipment-category', label: '设备分类' },
        { key: 'config-spare-category', label: '备件分类' },
        { key: 'config-knowledge-category', label: '知识库分类' },
        { key: 'config-area-management', label: '区域管理' },
        { key: 'config-inspection-items', label: '点巡检项目' },
        { key: 'config-maintenance-standards', label: '维保标准' },
        { key: 'config-fault-types', label: '故障类型' },
        { key: 'config-team-management', label: '班组管理' },
        { key: 'config-approval-flow', label: '审批流设置' },
      ]
    }
  ];

  return (
    <aside className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none overflow-y-auto min-h-[calc(100vh-3.5rem)] text-[13px]">
      {/* System Sub-Brand Title */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-2">
        <h2 className="font-semibold text-slate-800 text-[14px] tracking-tight">
          工业设备智能管控系统
        </h2>
      </div>

      {/* Menu List */}
      <nav className="p-2 space-y-1">
        {/* Overview (Direct Item) */}
        <button
          onClick={() => onSelectTab('overview')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-left transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>概览</span>
        </button>

        {/* Group Menus */}
        {menuGroups.map((group) => {
          const isOpen = !!openGroups[group.key];
          const hasActiveChild = group.children.some(c => c.key === activeTab);

          return (
            <div key={group.key} className="pt-1">
              <button
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 transition-colors ${
                  hasActiveChild ? 'text-blue-600 font-medium' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={hasActiveChild ? 'text-blue-600' : 'text-slate-500'}>
                    {group.icon}
                  </span>
                  <span>{group.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="pl-6 pr-1 py-0.5 space-y-0.5">
                  {group.children.map((sub) => {
                    const isSubActive =
                      activeTab === sub.key ||
                      (sub.key === 'equipment-ledger' &&
                        (activeTab === 'equipment-add' ||
                          activeTab === 'equipment-edit' ||
                          activeTab === 'equipment-detail' ||
                          activeTab === 'equipment-spare-parts')) ||
                      (sub.key === 'inspection-plan' &&
                        (activeTab === 'inspection-plan-add' ||
                          activeTab === 'inspection-plan-edit' ||
                          activeTab === 'inspection-plan-detail')) ||
                      (sub.key === 'inspection-task' &&
                        activeTab === 'inspection-task-execute') ||
                      (sub.key === 'inspection-record' &&
                        activeTab === 'inspection-record-detail') ||
                      (sub.key === 'patrol-plan' &&
                        (activeTab === 'patrol-plan-add' ||
                          activeTab === 'patrol-plan-edit' ||
                          activeTab === 'patrol-plan-detail')) ||
                      (sub.key === 'patrol-task' &&
                        activeTab === 'patrol-task-execute') ||
                      (sub.key === 'patrol-record' &&
                        activeTab === 'patrol-record-detail') ||
                      (sub.key === 'maintenance-plan' &&
                        (activeTab === 'maintenance-plan-add' ||
                          activeTab === 'maintenance-plan-edit' ||
                          activeTab === 'maintenance-plan-detail')) ||
                      (sub.key === 'maintenance-task' &&
                        activeTab === 'maintenance-task-execute') ||
                      (sub.key === 'maintenance-record' &&
                        activeTab === 'maintenance-record-detail') ||
                      (sub.key === 'repair-report' &&
                        (activeTab === 'repair-report-add' ||
                          activeTab === 'repair-report-process' ||
                          activeTab === 'repair-report-detail')) ||
                      (sub.key === 'repair-workorder' &&
                        activeTab === 'repair-workorder-execute') ||
                      (sub.key === 'spare-requirement' &&
                        (activeTab === 'spare-requirement-add' ||
                          activeTab === 'spare-requirement-detail')) ||
                      (sub.key === 'spare-arrival-inspection' &&
                        (activeTab === 'spare-arrival-confirm' ||
                          activeTab === 'spare-inspect-execute' ||
                          activeTab === 'spare-inspect-detail' ||
                          activeTab === 'spare-inspect-reinspect'));

                    return (
                      <button
                        key={sub.key}
                        onClick={() => onSelectTab(sub.key)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left transition-colors ${
                          isSubActive
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {sub.badge && (
                          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold">
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Summary Bar */}
      <div className="mt-auto p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="text-[11px] text-slate-500 flex items-center justify-between">
          <span>在线受控设备:</span>
          <span className="font-semibold text-blue-600 font-mono">{equipmentCount} 台</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1">
          系统版本: v2.6.4 (2026.09)
        </div>
      </div>
    </aside>
  );
};
