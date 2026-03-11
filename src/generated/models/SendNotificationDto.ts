/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationPayloadDto } from './NotificationPayloadDto';
export type SendNotificationDto = {
    device_ids?: Array<string>;
    notification: NotificationPayloadDto;
    data?: Record<string, any>;
    android?: Record<string, any>;
    webpush?: Record<string, any>;
    apns?: Record<string, any>;
    fcmOptions?: Record<string, any>;
};

