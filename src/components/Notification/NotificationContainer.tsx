import React, { FC } from 'react';
import { NotificationSetReferenceLayerLocale } from './NotificationSetReferenceLayerLocale';
import {
    useNotificationMessage2Display,
    NotificationType,
} from './useNotificationMessage';

export const NotificationContainer: FC = () => {
    // return <Notification message={message}/>;

    const notification2Display = useNotificationMessage2Display();

    if (!notification2Display) {
        return null;
    }

    return (
        <div className=" absolute bottom-6 z-10 w-full flex justify-center pointer-events-none">
            {notification2Display ===
                NotificationType.SET_REFERENCE_LAYER_LOCALE && (
                <NotificationSetReferenceLayerLocale />
            )}
        </div>
    );
};
