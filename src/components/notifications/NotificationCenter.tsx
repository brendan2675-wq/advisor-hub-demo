import { useState } from 'react';
import { Bell, X, Check, Archive, ArchiveRestore, ChevronRight, Clock, AlertCircle, AlertTriangle, Info, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications, Notification, NotificationPriority } from '@/hooks/useNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const priorityConfig: Record<NotificationPriority, { color: string; bgColor: string; icon: typeof AlertCircle }> = {
  critical: { color: 'bg-destructive', bgColor: 'bg-destructive/10', icon: AlertCircle },
  important: { color: 'bg-orange-500', bgColor: 'bg-orange-500/10', icon: AlertTriangle },
  info: { color: 'bg-primary', bgColor: 'bg-primary/10', icon: Info },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

interface NotificationItemProps {
  notification: Notification;
  onAction: () => void;
  onArchive: () => void;
  onMarkRead: () => void;
  showUnarchive?: boolean;
  onUnarchive?: () => void;
}

function NotificationItem({ 
  notification, 
  onAction, 
  onArchive, 
  onMarkRead,
  showUnarchive,
  onUnarchive 
}: NotificationItemProps) {
  const config = priorityConfig[notification.priority];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "p-4 border-b border-border transition-colors duration-200",
        !notification.read && "bg-muted/30",
        "hover:bg-muted/50"
      )}
    >
      <div className="flex gap-3">
        {/* Priority indicator */}
        <div className="flex-shrink-0 mt-1">
          <div className={cn("w-2 h-2 rounded-full", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={cn(
                  "text-sm font-medium text-foreground",
                  !notification.read && "font-semibold"
                )}>
                  {notification.title}
                </h4>
                {notification.isGrouped && notification.groupCount && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    <Users className="w-3 h-3 mr-1" />
                    {notification.groupCount}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {notification.description}
              </p>
              
              {/* Grouped items preview */}
              {notification.groupItems && notification.groupItems.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {notification.groupItems.slice(0, 3).map((item, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                  {notification.groupItems.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{notification.groupItems.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(notification.timestamp)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {notification.actionLabel && (
              <button
                onClick={onAction}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                  config.bgColor,
                  notification.priority === 'critical' && "text-destructive hover:bg-destructive/20",
                  notification.priority === 'important' && "text-orange-600 hover:bg-orange-500/20",
                  notification.priority === 'info' && "text-primary hover:bg-primary/20"
                )}
              >
                {notification.actionLabel}
                <ChevronRight className="w-3 h-3 inline ml-1" />
              </button>
            )}
            
            {!notification.read && (
              <button
                onClick={onMarkRead}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
                title="Mark as read"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            
            {showUnarchive ? (
              <button
                onClick={onUnarchive}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
                title="Unarchive"
              >
                <ArchiveRestore className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onArchive}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
                title="Archive"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'forYou' | 'all' | 'archived'>('forYou');
  
  const {
    forYouNotifications,
    activeNotifications,
    archivedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    unarchiveNotification,
    executeAction,
    getDailyDigest,
  } = useNotifications();

  const digest = getDailyDigest();

  const tabs = [
    { id: 'forYou' as const, label: 'For You', count: forYouNotifications.length },
    { id: 'all' as const, label: 'All', count: activeNotifications.length },
    { id: 'archived' as const, label: 'Archived', count: archivedNotifications.length },
  ];

  const currentNotifications = 
    activeTab === 'forYou' ? forYouNotifications :
    activeTab === 'all' ? activeNotifications :
    archivedNotifications;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="btn-icon relative" id="notification-button">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {/* Daily Digest */}
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Daily Summary:</span>{' '}
              {digest.message}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium transition-colors relative",
                  activeTab === tab.id 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                    activeTab === tab.id ? "bg-primary/10" : "bg-muted"
                  )}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-220px)]">
          {currentNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div>
              {currentNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onAction={() => {
                    executeAction(notification);
                    setIsOpen(false);
                  }}
                  onArchive={() => archiveNotification(notification.id)}
                  onMarkRead={() => markAsRead(notification.id)}
                  showUnarchive={activeTab === 'archived'}
                  onUnarchive={() => unarchiveNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
