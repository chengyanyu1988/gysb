import React from 'react';
import { Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const firstItem = items[0];
  const restItems = items.slice(1);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 select-none">
      <div className="flex items-center gap-1 text-slate-700 font-medium">
        <Home className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {firstItem.onClick ? (
          <button
            onClick={firstItem.onClick}
            className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
          >
            {firstItem.label}
          </button>
        ) : (
          <span
            className={
              items.length === 1
                ? 'text-slate-800 font-medium'
                : 'text-slate-700 font-medium'
            }
          >
            {firstItem.label}
          </span>
        )}
      </div>
      {restItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="text-slate-400">/</span>
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span
              className={
                idx === restItems.length - 1
                  ? 'text-slate-800 font-medium'
                  : 'text-slate-600'
              }
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
