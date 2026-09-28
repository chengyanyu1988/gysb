import React, { useState } from 'react';
import { User, Bell, ChevronDown, ShieldCheck, LogOut, Settings, HelpCircle, Layers } from 'lucide-react';
import { MainTab } from './Sidebar';

interface HeaderProps {
  currentRole?: string;
  userName?: string;
  onNavigate?: (tab: MainTab, params?: any) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole = '系统管理员',
  userName = '张小刀',
  onNavigate,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand Logo & Platform Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Geometric Colorful Logo Mark */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L4 8V24L16 30L28 24V8L16 2Z" fill="#1E40AF" />
              <path d="M16 2L28 8V24L16 30V2Z" fill="#2563EB" opacity="0.85" />
              <path d="M16 16L4 8L16 2L28 8L16 16Z" fill="#EF4444" opacity="0.9" />
              <path d="M16 16L28 8V24L16 30V16Z" fill="#3B82F6" />
              <circle cx="16" cy="16" r="3.5" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-slate-800 tracking-tight font-sans leading-none">
              工业互联网平台
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase font-mono mt-0.5">
              GONGYEHULIANWANGPINGTAI
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Real-time sync badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>实时同步中 · 最新数据已置顶</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="通知中心"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">系统提醒 (按时间降序)</span>
                <span className="text-xs text-blue-600 cursor-pointer">全部已读</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-medium text-amber-600">维保到期提醒</span>
                    <span>2026-09-27 20:00</span>
                  </div>
                  <p className="text-xs text-slate-700">20000L 蒸压釜已完成二级保养，数据已同步。</p>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-medium text-red-600">故障报修派单</span>
                    <span>2026-09-27 16:35</span>
                  </div>
                  <p className="text-xs text-slate-700">不锈钢储罐发生法兰微漏，已指派张建国维修。</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 overflow-hidden">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-sm">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-medium text-slate-800">{userName}</p>
                <p className="text-xs text-slate-400">工号: GY-88092 | {currentRole}</p>
              </div>
              <button
                onClick={() => { setShowUserMenu(false); }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 text-xs"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" /> 权限信息
              </button>
              <button
                onClick={() => { setShowUserMenu(false); }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 text-xs"
              >
                <Settings className="w-4 h-4 text-slate-400" /> 个人设置
              </button>
              <button
                onClick={() => { setShowUserMenu(false); }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 text-xs"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" /> 帮助手册
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-xs font-medium"
              >
                <LogOut className="w-4 h-4 text-rose-500" /> 切换账号 / 退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
