import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { notificationApi, Notification } from "@/lib/api";
import { useAuth } from "./auth-context";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    refreshNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const refreshNotifications = useCallback(async () => {
        if (!isAuthenticated || !user?.id) return;
        setLoading(true);
        try {
            const [notifs, count] = await Promise.all([
                notificationApi.getByUser(user.id),
                notificationApi.getUnreadCount(user.id),
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        refreshNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(refreshNotifications, 30000);
        return () => clearInterval(interval);
    }, [refreshNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;
        try {
            await notificationApi.markAllAsRead(user.id);
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await notificationApi.delete(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            // Re-fetch unread count to be accurate
            const count = await notificationApi.getUnreadCount(user!.id);
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                refreshNotifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
