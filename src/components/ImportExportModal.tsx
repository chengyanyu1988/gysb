import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Equipment } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedCount: number) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportSuccess, showToast }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateImport = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onImportSuccess(5);
      showToast('成功批量导入 5 条设备台账记录！', 'success');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 text-xs">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm">批量导入设备台账</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            onClick={() => setFileName('工业设备台账导入模板_2026.xlsx')}
            className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-6 bg-amber-50/40 hover:bg-amber-50/80 cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-colors"
          >
            <FileSpreadsheet className="w-10 h-10 text-amber-600" />
            <div>
              <p className="font-semibold text-slate-800">
                {fileName ? fileName : '点击选择或拖拽 Excel 文件至此处'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">支持 .xlsx, .xls 格式文件，单次最大 5MB</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg text-slate-600 space-y-1">
            <p className="font-medium text-slate-700">导入须知:</p>
            <p>1. 请确保设备名称、设备编码、规格型号等必填项完整；</p>
            <p>2. 如遇重复编码，系统将以最新导入的时间数据覆盖更新。</p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => showToast('已下载最新的标准 Excel 导入模板', 'info')}
            className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下载导入模板</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSimulateImport}
              disabled={isUploading}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium shadow-xs"
            >
              {isUploading ? '导入中...' : '开始导入'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
