import { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp, TabType } from '@/context/AppContext';
import { clients } from '@/data/mockData';

export type NotificationPriority = 'critical' | 'important' | 'info';

export interface Notification {
  id: string;
  priority: NotificationPriority;
  title: string;
  description: string;
  timestamp: Date;
  category: string;
  actionLabel?: string;
  actionType?: 'navigate' | 'generate' | 'schedule' | 'view';
  actionTarget?: string;
  isGrouped?: boolean;
  groupCount?: number;
  groupItems?: string[];
  read: boolean;
  archived: boolean;
}

export function useNotifications() {
  const { selectedClient, contextMode, setActiveTab, setSelectedClient } = useApp();
  const [archivedIds, setArchivedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('dash-archived-notifications');
    return stored ? JSON.parse(stored) : [];
  });
  const [readIds, setReadIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('dash-read-notifications');
    return stored ? JSON.parse(stored) : [];
  });
  const [dismissedCategories, setDismissedCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem('dash-dismissed-notification-categories');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('dash-archived-notifications', JSON.stringify(archivedIds));
  }, [archivedIds]);

  useEffect(() => {
    localStorage.setItem('dash-read-notifications', JSON.stringify(readIds));
  }, [readIds]);

  useEffect(() => {
    localStorage.setItem('dash-dismissed-notification-categories', JSON.stringify(dismissedCategories));
  }, [dismissedCategories]);

  const allNotifications = useMemo<Notification[]>(() => {
    const now = new Date();
    const notifications: Notification[] = [];

    // Critical notifications
    notifications.push({
      id: 'critical-compliance-1',
      priority: 'critical',
      title: 'Regulatory Compliance Due',
      description: 'Annual compliance review due in 3 days for 2 clients',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      category: 'compliance',
      actionLabel: 'View Details',
      actionType: 'navigate',
      actionTarget: 'reports',
      isGrouped: true,
      groupCount: 2,
      groupItems: ['Sarah Chen', 'Michael Roberts'],
      read: readIds.includes('critical-compliance-1'),
      archived: archivedIds.includes('critical-compliance-1'),
    });

    notifications.push({
      id: 'critical-market-1',
      priority: 'critical',
      title: 'Significant Market Movement',
      description: 'ASX 200 down 3.2% - affecting 12 client portfolios',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      category: 'market',
      actionLabel: 'View Impact',
      actionType: 'navigate',
      actionTarget: 'portfolio',
      isGrouped: true,
      groupCount: 12,
      read: readIds.includes('critical-market-1'),
      archived: archivedIds.includes('critical-market-1'),
    });

    // Important notifications
    notifications.push({
      id: 'important-reviews-1',
      priority: 'important',
      title: 'Quarterly Reviews Due',
      description: '5 clients need quarterly portfolio reviews',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      category: 'review',
      actionLabel: 'Schedule Reviews',
      actionType: 'schedule',
      isGrouped: true,
      groupCount: 5,
      groupItems: ['John Smith', 'Sarah Chen', 'Michael Roberts', 'Emma Wilson', 'David Thompson'],
      read: readIds.includes('important-reviews-1'),
      archived: archivedIds.includes('important-reviews-1'),
    });

    notifications.push({
      id: 'important-rebalance-1',
      priority: 'important',
      title: 'Rebalancing Threshold Reached',
      description: '3 portfolios have drifted >10% from target allocation',
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      category: 'rebalance',
      actionLabel: 'Generate Report',
      actionType: 'generate',
      isGrouped: true,
      groupCount: 3,
      groupItems: ['Sarah Chen', 'Emma Wilson', 'David Thompson'],
      read: readIds.includes('important-rebalance-1'),
      archived: archivedIds.includes('important-rebalance-1'),
    });

    notifications.push({
      id: 'important-tax-1',
      priority: 'important',
      title: 'Tax Opportunities Expiring',
      description: '3 tax loss harvesting opportunities closing this month',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      category: 'tax',
      actionLabel: 'View Opportunities',
      actionType: 'navigate',
      actionTarget: 'gains',
      isGrouped: true,
      groupCount: 3,
      read: readIds.includes('important-tax-1'),
      archived: archivedIds.includes('important-tax-1'),
    });

    notifications.push({
      id: 'important-report-1',
      priority: 'important',
      title: 'Report Requested',
      description: 'John Smith requested performance report 2 days ago',
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      category: 'report',
      actionLabel: 'Generate Report',
      actionType: 'generate',
      read: readIds.includes('important-report-1'),
      archived: archivedIds.includes('important-report-1'),
    });

    // Informational notifications
    notifications.push({
      id: 'info-milestone-1',
      priority: 'info',
      title: 'Performance Milestone',
      description: 'Sarah Chen\'s portfolio reached $5M milestone',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      category: 'milestone',
      actionLabel: 'View Portfolio',
      actionType: 'view',
      read: readIds.includes('info-milestone-1'),
      archived: archivedIds.includes('info-milestone-1'),
    });

    notifications.push({
      id: 'info-feature-1',
      priority: 'info',
      title: 'New Feature Available',
      description: 'AI-powered tax optimization suggestions now available',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      category: 'feature',
      actionLabel: 'Learn More',
      actionType: 'view',
      read: readIds.includes('info-feature-1'),
      archived: archivedIds.includes('info-feature-1'),
    });

    notifications.push({
      id: 'info-market-1',
      priority: 'info',
      title: 'Weekly Market Insights',
      description: 'Technology sector outperformed by 4.2% this week',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      category: 'insights',
      actionLabel: 'Read More',
      actionType: 'view',
      read: readIds.includes('info-market-1'),
      archived: archivedIds.includes('info-market-1'),
    });

    notifications.push({
      id: 'info-education-1',
      priority: 'info',
      title: 'Educational Content',
      description: 'New guide: Understanding CGT discount rules',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      category: 'education',
      actionLabel: 'View Guide',
      actionType: 'view',
      read: readIds.includes('info-education-1'),
      archived: archivedIds.includes('info-education-1'),
    });

    return notifications;
  }, [archivedIds, readIds]);

  // AI-filtered "For You" notifications (excludes dismissed categories and prioritizes)
  const forYouNotifications = useMemo(() => {
    return allNotifications
      .filter(n => !n.archived && !dismissedCategories.includes(n.category))
      .sort((a, b) => {
        const priorityOrder = { critical: 0, important: 1, info: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }, [allNotifications, dismissedCategories]);

  const activeNotifications = useMemo(() => {
    return allNotifications.filter(n => !n.archived);
  }, [allNotifications]);

  const archivedNotifications = useMemo(() => {
    return allNotifications.filter(n => n.archived);
  }, [allNotifications]);

  const unreadCount = useMemo(() => {
    return forYouNotifications.filter(n => !n.read).length;
  }, [forYouNotifications]);

  const markAsRead = useCallback((id: string) => {
    setReadIds(prev => [...new Set([...prev, id])]);
  }, []);

  const markAllAsRead = useCallback(() => {
    const allIds = allNotifications.map(n => n.id);
    setReadIds(allIds);
  }, [allNotifications]);

  const archiveNotification = useCallback((id: string) => {
    setArchivedIds(prev => [...new Set([...prev, id])]);
  }, []);

  const unarchiveNotification = useCallback((id: string) => {
    setArchivedIds(prev => prev.filter(i => i !== id));
  }, []);

  const dismissCategory = useCallback((category: string) => {
    setDismissedCategories(prev => [...new Set([...prev, category])]);
  }, []);

  const executeAction = useCallback((notification: Notification) => {
    markAsRead(notification.id);
    
    switch (notification.actionType) {
      case 'navigate':
        if (notification.actionTarget) {
          setActiveTab(notification.actionTarget as TabType);
        }
        break;
      case 'generate':
        // Simulate report generation
        console.log('Generating report for:', notification.title);
        break;
      case 'schedule':
        // Simulate scheduling
        console.log('Opening scheduler for:', notification.title);
        break;
      case 'view':
        // View details
        if (notification.groupItems && notification.groupItems.length > 0) {
          const clientName = notification.groupItems[0];
          const client = clients.find(c => c.name === clientName);
          if (client) {
            setSelectedClient(client);
          }
        }
        break;
    }
  }, [markAsRead, setActiveTab, clients, setSelectedClient]);

  const getDailyDigest = useCallback(() => {
    const critical = forYouNotifications.filter(n => n.priority === 'critical').length;
    const important = forYouNotifications.filter(n => n.priority === 'important').length;
    return {
      critical,
      important,
      total: forYouNotifications.length,
      message: `Today: ${critical} critical, ${important} important items need attention`,
    };
  }, [forYouNotifications]);

  return {
    forYouNotifications,
    activeNotifications,
    archivedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    unarchiveNotification,
    dismissCategory,
    executeAction,
    getDailyDigest,
  };
}
