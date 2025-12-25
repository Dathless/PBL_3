import React from "react";
import { Bell, Package, Tag, Info, CreditCard, Star, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/contexts/notification-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export const NotificationPopover: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case "ORDER":
                return <Package className="h-4 w-4 text-blue-500" />;
            case "PROMOTION":
                return <Tag className="h-4 w-4 text-orange-500" />;
            case "PAYMENT":
                return <CreditCard className="h-4 w-4 text-green-500" />;
            case "REVIEW":
                return <Star className="h-4 w-4 text-yellow-500" />;
            default:
                return <Info className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-cyan-600 hover:text-cyan-700"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4 text-center">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col p-4 border-b last:border-0 hover:bg-slate-50 transition-colors relative group",
                                        !notification.isRead && "bg-cyan-50/30"
                                    )}
                                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">{getIcon(notification.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-sm mb-1", !notification.isRead ? "font-semibold" : "font-medium")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-2">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="absolute bottom-4 right-4 text-cyan-600">
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-top text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
