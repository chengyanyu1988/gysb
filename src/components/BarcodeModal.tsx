import React from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import { Equipment } from '../types';

interface BarcodeModalProps {
  equipment: Equipment | null;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ equipment, onClose, showToast }) => {
  if (!equipment) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">设备标识卡 / 条码打印</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Industrial Tag Preview Card */}
          <div className="border-2 border-slate-800 rounded-lg p-4 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
              <span className="font-bold text-sm tracking-wider">工业设备电子档案卡</span>
              <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                {equipment.grade}级
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div>
                  <span className="text-slate-500">设备名称: </span>
                  <span className="font-bold text-slate-900">{equipment.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">设备编码: </span>
                  <span className="font-mono font-bold text-slate-800">{equipment.code}</span>
                </div>
                <div>
                  <span className="text-slate-500">规格型号: </span>
                  <span className="font-mono text-slate-700">{equipment.spec}</span>
                </div>
                <div>
                  <span className="text-slate-500">安装区域: </span>
                  <span className="text-slate-700">{equipment.installArea}</span>
                </div>
                <div>
                  <span className="text-slate-500">责任人员: </span>
                  <span className="font-medium text-slate-800">{equipment.manager}</span>
                </div>
              </div>

              {/* QR Code Graphic */}
              <div className="w-24 h-24 border border-slate-300 p-1 bg-white shrink-0 flex flex-col items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="white" />
                  {/* Outer corners */}
                  <rect x="5" y="5" width="28" height="28" fill="black" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="black" />

                  <rect x="67" y="5" width="28" height="28" fill="black" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="black" />

                  <rect x="5" y="67" width="28" height="28" fill="black" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="black" />

                  {/* Random QR bits */}
                  <rect x="40" y="10" width="8" height="8" fill="black" />
                  <rect x="52" y="15" width="8" height="8" fill="black" />
                  <rect x="40" y="30" width="8" height="8" fill="black" />
                  <rect x="15" y="45" width="8" height="8" fill="black" />
                  <rect x="30" y="45" width="8" height="8" fill="black" />
                  <rect x="45" y="45" width="10" height="10" fill="black" />
                  <rect x="65" y="45" width="8" height="8" fill="black" />
                  <rect x="80" y="45" width="8" height="8" fill="black" />
                  <rect x="40" y="65" width="10" height="10" fill="black" />
                  <rect x="60" y="65" width="8" height="8" fill="black" />
                  <rect x="75" y="65" width="8" height="8" fill="black" />
                  <rect x="45" y="80" width="8" height="8" fill="black" />
                  <rect x="65" y="80" width="12" height="8" fill="black" />
                </svg>
                <span className="text-[8px] font-mono text-slate-500 mt-0.5">扫码即检</span>
              </div>
            </div>

            {/* Barcode line */}
            <div className="pt-2 border-t border-dashed border-slate-300 text-center">
              <div className="h-7 w-full flex items-center justify-between px-2">
                {[2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2].map((w, idx) => (
                  <span
                    key={idx}
                    className="bg-black inline-block h-full"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-slate-600 mt-1 block">
                *{equipment.code}*
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium"
          >
            关闭
          </button>
          <button
            onClick={() => {
              showToast(`已向标签打印机发送打印任务: ${equipment.code}`, 'success');
              onClose();
            }}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium flex items-center gap-1 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印标签</span>
          </button>
        </div>
      </div>
    </div>
  );
};
