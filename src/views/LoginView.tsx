import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; role: string; avatar?: string }) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, showToast }) => {
  const [username, setUsername] = useState('zhangxiaodao');
  const [password, setPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showToast('请输入账号和密码', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('登录成功！欢迎进入工业设备智能管控系统', 'success');
      onLoginSuccess({
        name: username === 'zhangxiaodao' ? '张小刀' : username,
        role: '高级设备主管',
      });
    }, 400);
  };

  const handleQuickLogin = (roleName: string, name: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`已登录为：${name} (${roleName})`, 'success');
      onLoginSuccess({
        name,
        role: roleName,
      });
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden select-none">
      {/* Subtle Background Glow & Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(37,99,235,0.2),rgba(15,23,42,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Simple Brand Header */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white">工业设备智能管控系统</h1>
            <p className="text-[11px] text-slate-400">Industrial Equipment Management System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>系统服务正常运行</span>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-7 md:p-8 text-slate-800 border border-slate-100">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">账号登录</h2>
              <p className="text-xs text-slate-500 mt-1.5">请输入您的工号或用户名进入管理后台</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium">登录账号 / 工号</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入账号 (如: zhangxiaodao)"
                    className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-medium">登录密码</label>
                  <span className="text-blue-600 hover:underline cursor-pointer text-[11px]">
                    忘记密码?
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码 (默认: 123456)"
                    className="w-full h-10 pl-9 pr-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-slate-600 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>记住账号状态</span>
                </label>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  安全加密登录
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>立 即 登 录</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Fast Demo Switchers */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 text-center mb-2.5">
                快捷测试角色一键登录：
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('高级设备主管', '张小刀')}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-md text-[11px] text-slate-700 font-medium transition-colors text-center cursor-pointer"
                >
                  张小刀 (主管)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('系统管理员', '李工')}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-md text-[11px] text-slate-700 font-medium transition-colors text-center cursor-pointer"
                >
                  李工 (管理员)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('车间维保班长', '赵班长')}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-md text-[11px] text-slate-700 font-medium transition-colors text-center cursor-pointer"
                >
                  赵班长 (维保班)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-[11px] text-slate-500 z-10">
        <span>© 2026 工业设备智能管控系统 · 工业互联网平台</span>
      </footer>
    </div>
  );
};
