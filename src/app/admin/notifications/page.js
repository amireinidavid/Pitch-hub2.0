"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fetchUserNotificationsAction } from "@/actions";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  async function loadNotifications() {
    try {
      setLoading(true);
      // Get user role from your profile system
      const userRole = "admin"; // Replace with actual role fetch
      const result = await fetchUserNotificationsAction(user.id, userRole);
      
      if (result.success) {
        setNotifications(result.notifications);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load notifications",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        ));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  function getNotificationIcon(type) {
    switch (type) {
      case 'investment_submitted':
      case 'investment_approved':
      case 'investment_rejected':
        return <Mail className="h-5 w-5" />;
      case 'payment_pending':
      case 'payment_confirmed':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  }

  function getNotificationColor(type) {
    switch (type) {
      case 'investment_approved':
        return 'bg-green-500/20 text-green-400';
      case 'investment_rejected':
        return 'bg-red-500/20 text-red-400';
      case 'payment_pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400">Stay updated with your investment journey</p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          {notifications.filter(n => !n.read).length} Unread
        </Badge>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`
                  bg-[#1e293b]/50 backdrop-blur-sm border-white/5
                  hover:bg-[#1e293b]/70 transition-all duration-300
                  ${!notification.read && "border-l-4 border-l-blue-500"}
                `}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={getNotificationColor(notification.type)}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(notification.createdAt), 'PPp')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-none">
                        New
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-300 whitespace-pre-line">
                      {notification.message}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-gray-300"
                        onClick={() => markAsRead(notification._id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as read
                      </Button>
                    )}
                    {notification.link && (
                      <Link href={notification.link}>
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                          Take Action
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No notifications yet</h3>
            <p className="text-gray-400 mt-1">
              We'll notify you when there are updates about your investments
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 