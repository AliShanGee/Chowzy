import React, { useEffect, useCallback } from 'react';
import addNotification, { Notifications } from 'react-push-notification';

export const NotificationProvider = ({ children }) => {
    return (
        <>
            <Notifications />
            {children}
        </>
    );
};

export const usePushNotification = () => {
    const sendNotification = useCallback((title, message, options = {}) => {
        addNotification({
            title: title || 'Food Delivery App',
            message: message || 'You have a new notification',
            duration: options.duration || 4000,
            icon: options.icon || '/logo192.png',
            native: options.native || false,
            onClick: options.onClick || (() => {}),
        });
    }, []);

    const sendDeliveryReminder = useCallback((orderDetails) => {
        const { delivery_date, delivery_time, items } = orderDetails;
        const itemNames = items ? items.slice(0, 2).join(', ') : 'Your order';
        
        sendNotification(
            '🚚 Delivery Reminder',
            `${itemNames}${items && items.length > 2 ? ' and more' : ''} scheduled for ${delivery_date} at ${delivery_time}`,
            { duration: 6000 }
        );
    }, [sendNotification]);

    const sendOrderStatusUpdate = useCallback((status, orderId) => {
        const statusMessages = {
            scheduled: 'Your order has been scheduled!',
            preparing: 'Your food is being prepared! 🍳',
            out_for_delivery: 'Your order is out for delivery! 🚴',
            delivered: 'Your order has been delivered! ✅',
            cancelled: 'Your order has been cancelled.',
        };

        sendNotification(
            'Order Update',
            statusMessages[status] || `Order #${orderId} status: ${status}`,
            { duration: 5000 }
        );
    }, [sendNotification]);

    return {
        sendNotification,
        sendDeliveryReminder,
        sendOrderStatusUpdate
    };
};

export default usePushNotification;
