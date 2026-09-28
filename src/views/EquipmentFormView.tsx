import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Image as ImageIcon, ArrowLeft, Upload, Check } from 'lucide-react';
import { Equipment, EquipmentGrade, EquipmentStatus, EquipmentTag } from '../types';

interface EquipmentFormViewProps {
  initialEquipment?: Equipment | null;
  onSave: (equipment: Equipment) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const EquipmentFormView: React.FC<EquipmentFormViewProps> = ({
  initialEquipment,
  onSave,
  onCancel,
  showToast,
}) => {
  const isEdit = Boolean(initialEquipment);

  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    code: '',
    spec: '',
    category: '',
    installArea: '',
    grade: 'A',
    tag: '重要设备',
    manufacturer: '',
    factoryCode: '',
    supplier: '',
    maintenanceDate: '2026-09-10',
    contactPerson: '',
    contactPhone: '',
    status: '使用中',
    department: '',
    manager: '',
    images: [],
    spareParts: [],
  });

  useEffect(() => {
    if (initialEquipment) {
      setFormData(initialEquipment);
    } else {
      // Auto-generate code for convenient quick test
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setFormData((prev) => ({
        ...prev,
        code: `SB202609${randomSuffix}`,
        maintenanceDate: '2026-09-30',
      }));
    }
  }, [initialEquipment]);

  const handleChange = (field: keyof Equipment, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSampleImage = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    ];
    const nextImg = sampleImages[(formData.images?.length || 0) % sampleImages.length];
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), nextImg],
    }));
    showToast('已上传设备图片', 'success');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      showToast('请输入设备名称', 'error');
      return;
    }
    if (!formData.code?.trim()) {
      showToast('请输入设备编码', 'error');
      return;
    }
    if (!formData.spec?.trim()) {
      showToast('请输入规格型号', 'error');
      return;
    }
    if (!formData.category) {
      showToast('请选择设备分类', 'error');
      return;
    }
    if (!formData.installArea) {
      showToast('请选择安装区域', 'error');
      return;
    }

    // Now timestamp (2026-09-27)
    const nowStr = '2026-09-27 ' + new Date().toTimeString().split(' ')[0];

    const finalEquipment: Equipment = {
      id: initialEquipment?.id || `eq-${Date.now()}`,
      name: formData.name || '',
      code: formData.code || '',
      category: formData.category || '通用机械设备',
      spec: formData.spec || '',
      grade: (formData.grade as EquipmentGrade) || 'A',
      tag: (formData.tag as EquipmentTag) || '重要设备',
      installArea: formData.installArea || '1栋/3楼/303号',
      status: (formData.status as EquipmentStatus) || '使用中',
      department: formData.department || '生产A厂',
      manager: formData.manager || '张建国',
      manufacturer: formData.manufacturer || '供方科技',
      factoryCode: formData.factoryCode || formData.code || '',
      supplier: formData.supplier || '供方科技',
      maintenanceDate: formData.maintenanceDate || '2026-09-30',
      contactPerson: formData.contactPerson || '张建国',
      contactPhone: formData.contactPhone || '182****1256',
      updateTime: nowStr, // Always set newest time for descending sort!
      createTime: initialEquipment?.createTime || nowStr,
      images: formData.images || [],
      spareParts: initialEquipment?.spareParts || [],
    };

    onSave(finalEquipment);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Top Header with Back and Submit Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="返回"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? '编辑设备' : '新增设备'}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium transition-colors"
          >
            返回
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors"
          >
            提交
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-8 text-xs">
        {/* 1. 设备基础信息 Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">设备基础信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* * 设备名称 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>设备名称:
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="请输入设备名称"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.name || '').length}/100
                </span>
              </div>
            </div>

            {/* * 设备编码 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>设备编码:
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value)}
                  placeholder="请输入设备编码"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14 font-mono"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.code || '').length}/100
                </span>
              </div>
            </div>

            {/* * 规格型号 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>规格型号:
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.spec || ''}
                  onChange={(e) => handleChange('spec', e.target.value)}
                  placeholder="请输入规格型号"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14 font-mono"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.spec || '').length}/100
                </span>
              </div>
            </div>

            {/* * 设备分类 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>设备分类:
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择设备类型</option>
                <option value="前处理设备/蒸馏设备">前处理设备/蒸馏设备</option>
                <option value="泵类设备/离心泵">泵类设备/离心泵</option>
                <option value="仪表仪器/传感器">仪表仪器/传感器</option>
                <option value="动力设备/电机">动力设备/电机</option>
                <option value="存储设备/储罐">存储设备/储罐</option>
                <option value="动力设备/压缩机">动力设备/压缩机</option>
                <option value="包装设备/灌装机">包装设备/灌装机</option>
                <option value="分离设备/离心机">分离设备/离心机</option>
                <option value="换热设备/换热器">换热设备/换热器</option>
                <option value="电气设备/控制柜">电气设备/控制柜</option>
                <option value="阀门设备/调节阀">阀门设备/调节阀</option>
              </select>
            </div>

            {/* * 安装区域 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>安装区域:
              </label>
              <select
                value={formData.installArea || ''}
                onChange={(e) => handleChange('installArea', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择设备安装区域</option>
                <option value="1栋/3楼/303号">1栋/3楼/303号</option>
                <option value="2栋/1层/5号车间">2栋/1层/5号车间</option>
                <option value="3栋/2层/动力站房">3栋/2层/动力站房</option>
                <option value="4栋/1层/原料仓库">4栋/1层/原料仓库</option>
                <option value="5栋/1层/成品包装间">5栋/1层/成品包装间</option>
              </select>
            </div>

            {/* Empty grid filler on 3-col */}
            <div className="hidden lg:block"></div>

            {/* * 设备等级 (Radio) */}
            <div className="flex items-center gap-6 pt-2">
              <span className="text-slate-700 font-medium">
                <span className="text-rose-500 mr-1">*</span>设备等级:
              </span>
              <div className="flex items-center gap-4">
                {(['A', 'B', 'C'] as EquipmentGrade[]).map((grade) => (
                  <label key={grade} className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="grade"
                      checked={formData.grade === grade}
                      onChange={() => handleChange('grade', grade)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{grade}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* * 设备标记 (Radio) */}
            <div className="flex items-center gap-6 pt-2 md:col-span-2">
              <span className="text-slate-700 font-medium">
                <span className="text-rose-500 mr-1">*</span>设备标记:
              </span>
              <div className="flex items-center gap-4">
                {(['重要设备', '一般设备', '特种设备'] as EquipmentTag[]).map((tag) => (
                  <label key={tag} className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="tag"
                      checked={formData.tag === tag}
                      onChange={() => handleChange('tag', tag)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 设备出厂信息 Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">设备出厂信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* 生产厂商 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">生产厂商:</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.manufacturer || ''}
                  onChange={(e) => handleChange('manufacturer', e.target.value)}
                  placeholder="请输入设备生产厂商"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.manufacturer || '').length}/100
                </span>
              </div>
            </div>

            {/* 出厂编码 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">出厂编码:</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.factoryCode || ''}
                  onChange={(e) => handleChange('factoryCode', e.target.value)}
                  placeholder="请输入设备出厂编码"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14 font-mono"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.factoryCode || '').length}/100
                </span>
              </div>
            </div>

            {/* 供应商 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">供应商:</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.supplier || ''}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  placeholder="请输入设备供应商"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.supplier || '').length}/100
                </span>
              </div>
            </div>

            {/* 维保日期 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">维保日期:</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.maintenanceDate || ''}
                  onChange={(e) => handleChange('maintenanceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* 联系人 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">联系人:</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.contactPerson || ''}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  placeholder="请输入供应商联系人姓名"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.contactPerson || '').length}/100
                </span>
              </div>
            </div>

            {/* 联系方式 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">联系方式:</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={formData.contactPhone || ''}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="请输入供应商联系人联系方式"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden pr-14 font-mono"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                  {(formData.contactPhone || '').length}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 设备使用信息 Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">设备使用信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* * 设备状态 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>设备状态:
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择设备状态</option>
                <option value="使用中">使用中</option>
                <option value="闲置中">闲置中</option>
                <option value="维修中">维修中</option>
                <option value="已停用">已停用</option>
                <option value="已报废">已报废</option>
              </select>
            </div>

            {/* * 使用部门 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>使用部门:
              </label>
              <select
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择设备使用部门</option>
                <option value="生产A厂">生产A厂</option>
                <option value="一分厂/第一车间">一分厂/第一车间</option>
                <option value="动力运行车间">动力运行车间</option>
                <option value="包装与物流中心">包装与物流中心</option>
                <option value="品质质检中心">品质质检中心</option>
              </select>
            </div>

            {/* * 负责人 */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <span className="text-rose-500 mr-1">*</span>负责人:
              </label>
              <select
                value={formData.manager || ''}
                onChange={(e) => handleChange('manager', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
              >
                <option value="">请选择设备负责人</option>
                <option value="赵工">赵工</option>
                <option value="张建国">张建国</option>
                <option value="李敏">李敏</option>
                <option value="王强">王强</option>
                <option value="赵敏">赵敏</option>
                <option value="陈浩">陈浩</option>
                <option value="孙丽">孙丽</option>
                <option value="周凯">周凯</option>
                <option value="吴杰">吴杰</option>
                <option value="郑霞">郑霞</option>
                <option value="刘伟">刘伟</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. 附件 Section (Screenshot 3 Bottom) */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">附件</h3>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Upload Button */}
            <div
              onClick={handleAddSampleImage}
              className="w-28 h-28 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/70 hover:bg-blue-50/50 transition-all text-slate-500 hover:text-blue-600"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs">上传图片</span>
            </div>

            {/* Uploaded image slots */}
            {formData.images && formData.images.map((imgUrl, idx) => (
              <div key={idx} className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200 group bg-slate-100">
                <img src={imgUrl} alt={`附件 ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="删除图片"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Empty placeholder slots matching Screenshot 3 */}
            {(!formData.images || formData.images.length === 0) && (
              <>
                <div className="w-28 h-28 rounded-lg border border-slate-200 bg-slate-100/70 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="w-28 h-28 rounded-lg border border-slate-200 bg-slate-100/70 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="w-28 h-28 rounded-lg border border-slate-200 bg-slate-100/70 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
