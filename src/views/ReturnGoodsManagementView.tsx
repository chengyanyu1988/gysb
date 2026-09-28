import React, { useState } from 'react';
import { ReturnGoodsOrder } from '../types';
import { INITIAL_RETURN_GOODS_ORDERS } from '../data/mockData';
import { ReturnGoodsListView } from './ReturnGoodsListView';
import { ReturnGoodsAddView } from './ReturnGoodsAddView';
import { ReturnGoodsDetailView } from './ReturnGoodsDetailView';

interface ReturnGoodsManagementViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const ReturnGoodsManagementView: React.FC<ReturnGoodsManagementViewProps> = ({
  showToast,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'detail'>('list');
  const [orders, setOrders] = useState<ReturnGoodsOrder[]>(
    // 默认按最新时间降序排列
    [...INITIAL_RETURN_GOODS_ORDERS].sort(
      (a, b) =>
        new Date(b.createTime.replace(/-/g, '/')).getTime() -
        new Date(a.createTime.replace(/-/g, '/')).getTime()
    )
  );
  const [selectedOrder, setSelectedOrder] = useState<ReturnGoodsOrder | null>(null);

  const handleSaveOrder = (newOrder: ReturnGoodsOrder) => {
    // 新增退货单置顶 (最新时间)
    const updated = [newOrder, ...orders].map((item, idx) => ({
      ...item,
      orderNo: idx + 1,
    }));
    setOrders(updated);
    setViewMode('list');
    showToast(`退货申请单 ${newOrder.returnNo} 已成功创建并提交审批`, 'success');
  };

  const handleDeleteOrders = (ids: string[]) => {
    const updated = orders
      .filter((o) => !ids.includes(o.id))
      .map((item, idx) => ({
        ...item,
        orderNo: idx + 1,
      }));
    setOrders(updated);
    showToast(`已成功删除 ${ids.length} 条退货单记录`, 'success');
  };

  if (viewMode === 'add') {
    return (
      <ReturnGoodsAddView
        onSave={handleSaveOrder}
        onCancel={() => setViewMode('list')}
        showToast={showToast}
      />
    );
  }

  if (viewMode === 'detail' && selectedOrder) {
    return (
      <ReturnGoodsDetailView
        order={selectedOrder}
        onBack={() => setViewMode('list')}
        showToast={showToast}
      />
    );
  }

  return (
    <ReturnGoodsListView
      orders={orders}
      onGoToAdd={() => setViewMode('add')}
      onGoToDetail={(order) => {
        setSelectedOrder(order);
        setViewMode('detail');
      }}
      onDeleteOrders={handleDeleteOrders}
      showToast={showToast}
    />
  );
};
