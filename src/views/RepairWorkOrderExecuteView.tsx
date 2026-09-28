import React, { useState } from 'react';
import {
  Home,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Image as ImageIcon,
  BookOpen,
  Search,
  RotateCcw,
  X,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { RepairOrder, RepairSpareConsumptionItem, FaultExperienceItem } from '../types';
import { INITIAL_FAULT_EXPERIENCES, INITIAL_REPAIR_SPARES_CATALOG } from '../data/mockData';

interface RepairWorkOrderExecuteViewProps {
  order: RepairOrder | null;
  onSave: (orderId: string, updatedData: Partial<RepairOrder>, isDraft?: boolean) => void;
  onBack: () => void;
}

export const RepairWorkOrderExecuteView: React.FC<RepairWorkOrderExecuteViewProps> = ({
  order,
  onSave,
  onBack,
}) => {
  // Default demo fallback if no order selected
  const activeOrder: RepairOrder = order || {
    id: 'ro-demo',
    orderNo: 'WX202511030001',
    equipmentName: '1# 数控车床 (CNC-01)',
    equipmentCode: 'EQ-CNC-2023-001',
    equipmentCategory: '生产设备 / 机加工设备',
    equipmentSpec: 'CK6150',
    equipmentLevel: 'A类（关键设备）',
    installArea: '一车间 / 精加工区',
    repairGroup: '机修一班',
    status: '维修中',
    faultReportNo: 'BX20260915008',
    faultReportStatus: '验收完成',
    reportTime: '2026-09-15 09:30:00',
    reporter: '张伟',
    reporterPhone: '138****9678',
    faultType: '电气故障',
    faultTime: '2026-09-15 09:25:00',
    urgency: '正常',
    faultDescription: '机床主轴启动时变频器报错“过流”，主轴无法旋转，伴有焦糊味，导致生产线停机',
    handleType: '内修',
    handler: '李强 (高级电工)',
    handleTime: '2026-09-15 10:45:00',
    handleRemarks: '经检查发现主轴电机线圈短路烧毁。已更换备用主轴电机，并重置变频器参数，试车运行正常。',
    createTime: '2026-09-15 09:35:00',
  };

  // State
  const [solutionDesc, setSolutionDesc] = useState(
    activeOrder.repairSolutionDescription || ''
  );
  const [images, setImages] = useState<string[]>(
    activeOrder.repairImages && activeOrder.repairImages.length > 0
      ? activeOrder.repairImages
      : []
  );

  // Spares Consumption List (Screenshot 6)
  const [sparesList, setSparesList] = useState<RepairSpareConsumptionItem[]>(
    activeOrder.sparesConsumed && activeOrder.sparesConsumed.length > 0
      ? activeOrder.sparesConsumed
      : [
          {
            id: 'rsc-1',
            spareName: '深沟球轴承',
            spareCode: 'A07651',
            category: '机械类/轴承类/滚动轴承',
            spec: '6205-2RS',
            brand: '人本轴承',
            stock: 850,
            unit: '个',
            supplier: '上海人本机电',
            consumedQuantity: 4,
          },
          {
            id: 'rsc-2',
            spareName: '三角皮带',
            spareCode: 'B02301',
            category: '传动类/皮带类/V带',
            spec: 'SPB-2120',
            brand: '三力士',
            stock: 320,
            unit: '根',
            supplier: '浙江三力士股份',
            consumedQuantity: 2,
          },
          {
            id: 'rsc-3',
            spareName: '接近开关',
            spareCode: 'C05102',
            category: '电气类/传感器/电感式',
            spec: 'NBN4-12GM40-E2',
            brand: '倍加福 (P+F)',
            stock: 150,
            unit: '个',
            supplier: '苏州倍加福工业',
            consumedQuantity: 1,
          },
          {
            id: 'rsc-4',
            spareName: '电磁阀线圈',
            spareCode: 'C05205',
            category: '电气类/气动元件/线圈',
            spec: '24VDC 12W',
            brand: 'SMC',
            stock: 80,
            unit: '个',
            supplier: 'SMC(中国)有限公司',
            consumedQuantity: 3,
          },
          {
            id: 'rsc-5',
            spareName: '液压油滤芯',
            spareCode: 'D08101',
            category: '液压类/过滤元件/滤芯',
            spec: '0160D010BN4HC',
            brand: '贺德克 (HYDAC)',
            stock: 45,
            unit: '个',
            supplier: '苏州贺德克液压',
            consumedQuantity: 2,
          },
          {
            id: 'rsc-6',
            spareName: '光电传感器',
            spareCode: 'C05108',
            category: '电气类/传感器/光电式',
            spec: 'E3Z-D61',
            brand: '欧姆龙 (OMRON)',
            stock: 200,
            unit: '个',
            supplier: '欧姆龙自动化',
            consumedQuantity: 1,
          },
          {
            id: 'rsc-7',
            spareName: '气动接头',
            spareCode: 'D09203',
            category: '气动类/连接件/直通',
            spec: 'PC8-02',
            brand: '亚德客 (AirTAC)',
            stock: 1200,
            unit: '个',
            supplier: '宁波亚德客自动化',
            consumedQuantity: 10,
          },
          {
            id: 'rsc-8',
            spareName: '交流接触器',
            spareCode: 'C04105',
            category: '电气类/低压电器/接触器',
            spec: 'LC1D25M7C',
            brand: '施耐德 (Schneider)',
            stock: 60,
            unit: '个',
            supplier: '施耐德电气(中国)',
            consumedQuantity: 1,
          },
        ]
  );

  // Experience Modal
  const [showExpModal, setShowExpModal] = useState(false);
  const [expCategory, setExpCategory] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Add Spares Modal (Screenshot 7)
  const [showAddSpareModal, setShowAddSpareModal] = useState(false);
  const [spareSearchName, setSpareSearchName] = useState('');
  const [spareSearchCode, setSpareSearchCode] = useState('');
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>(['rc-1']);

  // Handlers
  const handleRemoveSpare = (id: string) => {
    setSparesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setSparesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, consumedQuantity: Math.max(1, qty) } : item))
    );
  };

  const handleSelectExperience = (exp: FaultExperienceItem) => {
    const text = `${exp.description}。处理措施：${exp.solution}`;
    setSolutionDesc(text.slice(0, 200));
    setShowExpModal(false);
  };

  const handleConfirmAddSpares = () => {
    const toAdd = INITIAL_REPAIR_SPARES_CATALOG.filter((item) =>
      selectedCatalogIds.includes(item.id)
    );
    const formatted: RepairSpareConsumptionItem[] = toAdd.map((item, idx) => ({
      id: `rsc-add-${Date.now()}-${idx}`,
      spareName: item.name,
      spareCode: item.code,
      category: item.category,
      spec: item.spec,
      brand: item.brand,
      stock: item.stock,
      unit: item.unit,
      supplier: item.supplier,
      consumedQuantity: 1,
    }));

    setSparesList((prev) => [...prev, ...formatted]);
    setShowAddSpareModal(false);
  };

  const handleUploadSampleImage = () => {
    const demoImgs = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
    ];
    if (images.length < 10) {
      setImages((prev) => [...prev, demoImgs[prev.length % demoImgs.length]]);
    }
  };

  const handleSubmit = (isDraft: boolean) => {
    onSave(
      activeOrder.id,
      {
        repairSolutionDescription: solutionDesc,
        repairImages: images,
        sparesConsumed: sparesList,
        status: isDraft ? '维修中' : '待验收',
      },
      isDraft
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Header Bar (Screenshot 4 Top) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">执行维修</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              返回
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-xs"
            >
              暂存
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
            >
              确认处理
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* SECTION 1: 设备信息 (Screenshot 4) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">设备信息</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 text-xs bg-slate-50/70 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">设备名称:</span>
                <span className="font-semibold text-slate-800">{activeOrder.equipmentName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">设备编码:</span>
                <span className="font-mono text-slate-700 font-medium">{activeOrder.equipmentCode}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">设备分类:</span>
                <span className="text-slate-700">{activeOrder.equipmentCategory || '生产设备 / 机加工设备'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">规格型号:</span>
                <span className="text-slate-700">{activeOrder.equipmentSpec || 'CK6150'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">设备等级:</span>
                <span className="text-slate-700">{activeOrder.equipmentLevel || 'A类（关键设备）'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">执行安装区域:</span>
                <span className="text-slate-700">{activeOrder.installArea || '一车间 / 精加工区'}</span>
              </div>
            </div>
          </section>

          {/* SECTION 2: 故障内容 (Screenshot 4) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">故障内容</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 text-xs bg-slate-50/70 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">报修单号:</span>
                <span className="font-mono text-slate-800 font-medium">{activeOrder.faultReportNo || 'BX20260915008'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">状&nbsp;&nbsp;&nbsp;&nbsp;态:</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {activeOrder.faultReportStatus || '验收完成'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">报修时间:</span>
                <span className="text-slate-700">{activeOrder.reportTime || '2026-09-15 09:30:00'}</span>
              </div>

              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">报修人:</span>
                <span className="font-medium text-slate-800">{activeOrder.reporter || '张伟'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">报修人手机:</span>
                <span className="text-slate-700">{activeOrder.reporterPhone || '138****9678'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">故障类型:</span>
                <span className="text-slate-700">{activeOrder.faultType || '电气故障'}</span>
              </div>

              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">故障时间:</span>
                <span className="text-slate-700">{activeOrder.faultTime || '2026-09-15 09:25:00'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">紧急程度:</span>
                <span className="text-slate-700">{activeOrder.urgency || '正常'}</span>
              </div>
              <div></div>

              <div className="md:col-span-3 flex items-start pt-1">
                <span className="text-slate-500 w-28 shrink-0">故障描述:</span>
                <span className="text-slate-700 leading-relaxed">
                  {activeOrder.faultDescription ||
                    '机床主轴启动时变频器报错“过流”，主轴无法旋转，伴有焦糊味，导致生产线停机'}
                </span>
              </div>

              <div className="md:col-span-3 flex items-center">
                <span className="text-slate-500 w-28 shrink-0">上传附件:</span>
                <span className="text-slate-400">--</span>
              </div>
            </div>
          </section>

          {/* SECTION 3: 处理内容 (Screenshot 4) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">处理内容</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 text-xs bg-slate-50/70 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">处理类型:</span>
                <span className="text-slate-700">{activeOrder.handleType || '内修'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">处理人:</span>
                <span className="font-medium text-slate-800">{activeOrder.handler || '李强 (高级电工)'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">处理时间:</span>
                <span className="text-slate-700">{activeOrder.handleTime || '2026-09-15 10:45:00'}</span>
              </div>

              <div className="md:col-span-3 flex items-start pt-1">
                <span className="text-slate-500 w-28 shrink-0">备&nbsp;&nbsp;&nbsp;&nbsp;注:</span>
                <span className="text-slate-700 leading-relaxed">
                  {activeOrder.handleRemarks ||
                    '经检查发现主轴电机线圈短路烧毁。已更换备用主轴电机，并重置变频器参数，试车运行正常。'}
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 4: 维修内容 (Screenshot 4 & 5) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">维修内容</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 text-xs bg-slate-50/70 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">维修单号:</span>
                <span className="font-mono text-slate-800 font-medium">{activeOrder.orderNo}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">维修状态:</span>
                <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {activeOrder.status}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 w-28 shrink-0">建单时间:</span>
                <span className="text-slate-700">{activeOrder.createTime || '2026-09-15 09:35:00'}</span>
              </div>
            </div>
          </section>

          {/* SECTION 5: 维修方案 (Screenshot 5) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">维修方案</h3>
            </div>

            <div className="space-y-5 text-xs">
              {/* Fault description with experience button */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700">
                    <span className="text-red-500">*</span> 故障描述:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowExpModal(true)}
                    className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded font-medium transition-colors"
                  >
                    +从经验库选择
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={solutionDesc}
                    onChange={(e) => setSolutionDesc(e.target.value.slice(0, 200))}
                    placeholder="请输入故障描述及实施维修方案..."
                    className="w-full max-w-2xl px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                  <div className="text-right text-[11px] text-slate-400 max-w-2xl mt-0.5">
                    {solutionDesc.length}/200
                  </div>
                </div>
              </div>

              {/* Upload attachments (Screenshot 5) */}
              <div className="space-y-2">
                <span className="font-medium text-slate-700 block">
                  <span className="text-red-500">*</span> 上传附件:
                </span>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Upload Box */}
                  <button
                    type="button"
                    onClick={handleUploadSampleImage}
                    className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-blue-600 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs">上传图片</span>
                  </button>

                  {/* Render uploaded or demo images */}
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs"
                    >
                      <img src={img} alt={`维修现场 ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Placeholder box when empty */}
                  {images.length === 0 && (
                    <>
                      <div className="w-28 h-28 border border-slate-200 bg-slate-100/70 rounded-lg flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div className="w-28 h-28 border border-slate-200 bg-slate-100/70 rounded-lg flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    </>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  *支持上传JPG/JPEG/PNG图片,单张图片大小不超过20M,最多上传10张图片
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: 备件消耗 (Screenshot 6) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800">备件消耗</h3>
            </div>

            <div className="space-y-3">
              <div>
                <button
                  type="button"
                  onClick={() => setShowAddSpareModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加备件</span>
                </button>
              </div>

              {/* Spares Table (Screenshot 6) */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3">备件名称</th>
                      <th className="py-2.5 px-3">备件编码</th>
                      <th className="py-2.5 px-3">备件分类</th>
                      <th className="py-2.5 px-3">规格型号</th>
                      <th className="py-2.5 px-3">品牌</th>
                      <th className="py-2.5 px-3">库存数量</th>
                      <th className="py-2.5 px-3">单位</th>
                      <th className="py-2.5 px-3">供应商</th>
                      <th className="py-2.5 px-3 text-center w-24">消耗数量</th>
                      <th className="py-2.5 px-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sparesList.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-8 text-center text-slate-400">
                          暂无消耗备件记录，请点击上方【添加备件】
                        </td>
                      </tr>
                    ) : (
                      sparesList.map((spare, idx) => (
                        <tr key={spare.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{spare.spareName}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{spare.spareCode}</td>
                          <td className="py-2.5 px-3 text-slate-600">{spare.category}</td>
                          <td className="py-2.5 px-3 text-slate-700">{spare.spec}</td>
                          <td className="py-2.5 px-3 text-slate-700">{spare.brand}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">{spare.stock}</td>
                          <td className="py-2.5 px-3 text-slate-600">{spare.unit}</td>
                          <td className="py-2.5 px-3 text-slate-600">{spare.supplier}</td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={1}
                              value={spare.consumedQuantity}
                              onChange={(e) => handleUpdateQuantity(spare.id, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSpare(spare.id)}
                              className="text-blue-600 hover:text-red-600 font-medium hover:underline text-xs"
                            >
                              移除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 故障经验库选择弹窗 (Experience Modal) */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                故障经验库选择
              </h3>
              <button
                onClick={() => setShowExpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="按设备分类筛选"
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="按故障描述筛选"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                {INITIAL_FAULT_EXPERIENCES.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => handleSelectExperience(exp)}
                    className="p-3 hover:bg-blue-50/50 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-800">
                        [{exp.expCode}] {exp.category}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        引用经验
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-medium text-slate-700">现象：</span>
                      {exp.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">方案：</span>
                      {exp.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowExpModal(false)}
                className="px-4 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加备件弹窗 (Screenshot 7: 新增备件选择弹窗) */}
      {showAddSpareModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">新增</h3>
              <button
                onClick={() => setShowAddSpareModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filter (Screenshot 7 Top) */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">备件名称:</span>
                  <input
                    type="text"
                    placeholder="请输入备件名称"
                    value={spareSearchName}
                    onChange={(e) => setSpareSearchName(e.target.value)}
                    className="w-44 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600">备件编码:</span>
                  <input
                    type="text"
                    placeholder="请输入备件编码"
                    value={spareSearchCode}
                    onChange={(e) => setSpareSearchCode(e.target.value)}
                    className="w-44 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpareSearchName('');
                      setSpareSearchCode('');
                    }}
                    className="flex items-center gap-1 px-4 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* Spares Selection Table (Screenshot 7 Middle) */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            INITIAL_REPAIR_SPARES_CATALOG.length > 0 &&
                            selectedCatalogIds.length === INITIAL_REPAIR_SPARES_CATALOG.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCatalogIds(INITIAL_REPAIR_SPARES_CATALOG.map((c) => c.id));
                            } else {
                              setSelectedCatalogIds([]);
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-2.5 px-3 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3">备件名称</th>
                      <th className="py-2.5 px-3">备件编码</th>
                      <th className="py-2.5 px-3">备件分类</th>
                      <th className="py-2.5 px-3">规格型号</th>
                      <th className="py-2.5 px-3">品牌</th>
                      <th className="py-2.5 px-3">库存数量</th>
                      <th className="py-2.5 px-3">单位</th>
                      <th className="py-2.5 px-3">供应商</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {INITIAL_REPAIR_SPARES_CATALOG.map((cat, idx) => {
                      const isSelected = selectedCatalogIds.includes(cat.id);
                      return (
                        <tr
                          key={cat.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCatalogIds((prev) => [...prev, cat.id]);
                                } else {
                                  setSelectedCatalogIds((prev) => prev.filter((id) => id !== cat.id));
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{cat.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{cat.code}</td>
                          <td className="py-2.5 px-3 text-slate-600">{cat.category}</td>
                          <td className="py-2.5 px-3 text-slate-700">{cat.spec}</td>
                          <td className="py-2.5 px-3 text-slate-700">{cat.brand}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">{cat.stock}</td>
                          <td className="py-2.5 px-3 text-slate-600">{cat.unit}</td>
                          <td className="py-2.5 px-3 text-slate-600">{cat.supplier}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom selection indicator and pagination (Screenshot 7 Bottom) */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div>
                  当前已选 <span className="font-bold text-red-500">{selectedCatalogIds.length}</span> 项数据/共计{' '}
                  <span className="font-bold text-slate-700">{INITIAL_REPAIR_SPARES_CATALOG.length}</span> 项数据
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-1 rounded border border-slate-200 text-slate-400 cursor-not-allowed">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-medium">1</span>
                  <button className="p-1 rounded border border-slate-200 text-slate-400 cursor-not-allowed">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <select className="ml-1 px-1.5 py-0.5 border border-slate-200 rounded text-xs bg-white">
                    <option>10条/页</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowAddSpareModal(false)}
                className="px-5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSpares}
                className="px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
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
