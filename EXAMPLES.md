# TrioChat Push SDK - Complete Examples

## Table of Contents
- [Setup](#setup)
- [Basic Usage](#basic-usage)
- [Platform-Specific Notifications](#platform-specific-notifications)
- [Advanced Examples](#advanced-examples)

## Setup

### Production Environment
```typescript
import { TrioChatNotificationClient } from '@triochat/trio-push';

const client = new TrioChatNotificationClient({
  token: process.env.TRIO_PUSH_TOKEN!
});
```

### Development Environment
```typescript
const devClient = new TrioChatNotificationClient({
  token: process.env.TRIO_PUSH_TOKEN_DEV!,
  is_dev: true  // Uses dev API endpoint
});
```

## Basic Usage

### 1. Register a Device
```typescript
import { TrioPushPlatform } from '@triochat/trio-push';

const result = await client.registerDevice({
  fcm_token: 'firebase-token-from-device',
  platform: TrioPushPlatform.IOS,
  metadata: {
    user_id: 'user-123',
    app_version: '2.0.0',
    device_model: 'iPhone 14'
  }
});

console.log('Device registered:', result.device_id);
```

### 2. Get All Devices
```typescript
const devices = await client.getDevices();

// Filter by platform
const iosDevices = devices.filter(d => d.platform === TrioPushPlatform.IOS);
const androidDevices = devices.filter(d => d.platform === TrioPushPlatform.ANDROID);

// Find device by user
const userDevice = devices.find(d => d.metadata?.user_id === 'user-123');
```

### 3. Send Basic Notification
```typescript
await client.sendNotification({
  device_ids: ['device-123', 'device-456'],
  notification: {
    title: 'New Message',
    body: 'You have a new message from John'
  }
});
```

## Platform-Specific Notifications

### Android Notification with Full Configuration

```typescript
await client.sendNotification({
  device_ids: ['android-device-1'],
  notification: {
    title: 'New Message',
    body: 'You have a new message'
  },
  android: {
    // Message priority
    priority: 'high',
    
    // Time to live (in milliseconds)
    ttl: 86400000, // 24 hours
    
    // Collapse key for message grouping
    collapseKey: 'chat_messages',
    
    // Android-specific notification options
    notification: {
      channelId: 'chat_messages',
      sound: 'default',
      color: '#FF5722',
      icon: 'ic_notification',
      tag: 'chat_tag',
      
      // Click action
      clickAction: 'OPEN_CHAT_ACTIVITY',
      
      // Badge count
      notificationCount: 5,
      
      // Vibration pattern (in milliseconds)
      vibrateTimingsMillis: [0, 500, 200, 500],
      
      // LED settings
      lightSettings: {
        color: '#FF5722',
        lightOnDurationMillis: 300,
        lightOffDurationMillis: 1000
      },
      
      // Sticky notification
      sticky: true,
      
      // Priority
      priority: 'high',
      
      // Visibility
      visibility: 'public'
    }
  },
  data: {
    action: 'open_chat',
    chat_id: '789',
    message_id: '123'
  }
});
```

### iOS (APNs) Notification with Full Configuration

```typescript
await client.sendNotification({
  device_ids: ['ios-device-1'],
  notification: {
    title: 'New Message',
    body: 'You have a new message'
  },
  apns: {
    // APNs headers
    headers: {
      'apns-priority': '10',
      'apns-expiration': '0'
    },
    
    // APNs payload
    payload: {
      aps: {
        // Alert configuration
        alert: {
          title: 'New Message',
          subtitle: 'From John',
          body: 'Hey, check this out!',
          
          // Localization
          titleLocKey: 'NOTIFICATION_TITLE',
          titleLocArgs: ['John'],
          locKey: 'NOTIFICATION_BODY',
          locArgs: ['message'],
          
          // Launch image
          launchImage: 'chat_icon'
        },
        
        // Badge count
        badge: 5,
        
        // Sound
        sound: 'default',
        // OR critical sound
        // sound: {
        //   critical: true,
        //   name: 'critical_alert.caf',
        //   volume: 1.0
        // },
        
        // Content available for background updates
        contentAvailable: true,
        
        // Mutable content (for notification extensions)
        mutableContent: true,
        
        // Category for action buttons
        category: 'MESSAGE_CATEGORY',
        
        // Thread ID for grouping
        threadId: 'chat-789'
      },
      
      // Custom data
      chatId: '789',
      messageId: '123'
    },
    
    // FCM options for iOS
    fcmOptions: {
      analyticsLabel: 'ios_chat_notification',
      imageUrl: 'https://example.com/image.jpg'
    }
  },
  data: {
    action: 'open_chat',
    chat_id: '789'
  }
});
```

### Web Push Notification with Full Configuration

```typescript
await client.sendNotification({
  device_ids: ['web-device-1'],
  notification: {
    title: 'New Update',
    body: 'Check out the new features'
  },
  webpush: {
    // Web push headers
    headers: {
      'TTL': '86400',
      'Urgency': 'high'
    },
    
    // Notification options
    notification: {
      title: 'New Update Available',
      body: 'Click to explore new features',
      icon: '/icons/notification-icon.png',
      image: '/images/feature-preview.jpg',
      badge: '/icons/badge.png',
      
      // Direction
      dir: 'ltr',
      
      // Language
      lang: 'en-US',
      
      // Tag for grouping
      tag: 'update_notification',
      
      // Require user interaction
      requireInteraction: true,
      
      // Renotify on update
      renotify: true,
      
      // Vibration pattern
      vibrate: [200, 100, 200],
      
      // Action buttons
      actions: [
        {
          action: 'view',
          title: 'View Now',
          icon: '/icons/view.png'
        },
        {
          action: 'dismiss',
          title: 'Later',
          icon: '/icons/dismiss.png'
        }
      ],
      
      // Custom data
      data: {
        url: '/updates',
        timestamp: Date.now()
      }
    },
    
    // FCM options for web
    fcmOptions: {
      link: 'https://app.example.com/updates'
    }
  }
});
```

## Advanced Examples

### Multi-Platform Notification

Send a notification that works across all platforms with platform-specific customizations:

```typescript
await client.sendNotification({
  device_ids: ['ios-1', 'android-1', 'web-1'],
  
  // Base notification (fallback)
  notification: {
    title: 'New Message',
    body: 'You have a new message from John',
    imageUrl: 'https://example.com/avatar.jpg'
  },
  
  // Custom data payload
  data: {
    action: 'open_chat',
    chat_id: '789',
    message_id: '123',
    sender_id: 'john-456'
  },
  
  // Android customization
  android: {
    priority: 'high',
    notification: {
      channelId: 'chat_messages',
      sound: 'message_tone',
      color: '#2196F3',
      clickAction: 'OPEN_CHAT',
      tag: 'chat_789'
    }
  },
  
  // iOS customization
  apns: {
    payload: {
      aps: {
        alert: {
          title: 'New Message',
          subtitle: 'From John',
          body: 'Hey, check this out!'
        },
        badge: 1,
        sound: 'message.caf',
        threadId: 'chat-789'
      }
    }
  },
  
  // Web customization
  webpush: {
    notification: {
      icon: '/icons/message.png',
      badge: '/icons/badge.png',
      requireInteraction: true
    },
    fcmOptions: {
      link: 'https://app.example.com/chat/789'
    }
  },
  
  // Analytics label
  fcmOptions: {
    analyticsLabel: 'chat_message_notification'
  }
});
```

### Broadcast to All Devices

```typescript
// Omit device_ids to send to all devices in workspace
await client.sendNotification({
  notification: {
    title: '📢 System Announcement',
    body: 'Scheduled maintenance tonight at 2 AM'
  },
  android: { priority: 'normal' },
  apns: {
    payload: {
      aps: {
        sound: 'default',
        badge: 0
      }
    }
  }
});
```

### Silent Data Notification (Background Update)

```typescript
// iOS
await client.sendNotification({
  device_ids: ['ios-device-1'],
  notification: {
    title: '',
    body: ''
  },
  apns: {
    payload: {
      aps: {
        contentAvailable: true,
        badge: 0
      },
      // Custom data
      updateType: 'sync',
      lastSync: Date.now()
    }
  },
  data: {
    silent: 'true',
    action: 'background_sync'
  }
});

// Android
await client.sendNotification({
  device_ids: ['android-device-1'],
  notification: {
    title: '',
    body: ''
  },
  android: {
    priority: 'normal',
    data: {
      type: 'background_sync',
      timestamp: String(Date.now())
    }
  }
});
```

### Rich Notification with Image

```typescript
await client.sendNotification({
  device_ids: ['device-1'],
  notification: {
    title: 'Photo from John',
    body: 'Check out my vacation photos!',
    imageUrl: 'https://example.com/photos/vacation.jpg'
  },
  android: {
    notification: {
      imageUrl: 'https://example.com/photos/vacation.jpg',
      clickAction: 'OPEN_PHOTO'
    }
  },
  apns: {
    fcmOptions: {
      imageUrl: 'https://example.com/photos/vacation.jpg'
    },
    payload: {
      aps: {
        mutableContent: true,
        category: 'PHOTO_CATEGORY'
      }
    }
  }
});
```

### Localized Notification

```typescript
await client.sendNotification({
  device_ids: ['device-1'],
  notification: {
    title: 'New Message',
    body: 'You have %d new messages'
  },
  android: {
    notification: {
      titleLocKey: 'notification_title_new_message',
      bodyLocKey: 'notification_body_message_count',
      bodyLocArgs: ['5']
    }
  },
  apns: {
    payload: {
      aps: {
        alert: {
          titleLocKey: 'NOTIFICATION_TITLE',
          locKey: 'MESSAGE_COUNT',
          locArgs: ['5']
        }
      }
    }
  }
});
```

### Critical Alert (iOS)

```typescript
await client.sendNotification({
  device_ids: ['ios-device-1'],
  notification: {
    title: '🚨 Emergency Alert',
    body: 'Immediate action required'
  },
  apns: {
    headers: {
      'apns-priority': '10'
    },
    payload: {
      aps: {
        alert: {
          title: '🚨 Emergency Alert',
          body: 'Immediate action required'
        },
        sound: {
          critical: true,
          name: 'emergency.caf',
          volume: 1.0
        },
        badge: 1
      }
    }
  }
});
```

## Error Handling

```typescript
import { TrioPushError } from '@triochat/trio-push';

try {
  const result = await client.sendNotification({
    device_ids: ['device-123'],
    notification: { title: 'Test', body: 'Test message' }
  });
  
  console.log(`✓ Sent to ${result.success_count} devices`);
  
  if (result.failure_count > 0) {
    console.warn(`✗ Failed to send to ${result.failure_count} devices`);
    result.results?.forEach(r => {
      if (!r.success) {
        console.error(`  Device ${r.device_id}: ${r.error}`);
      }
    });
  }
} catch (error) {
  if (error instanceof TrioPushError) {
    console.error('API Error:', {
      message: error.message,
      statusCode: error.statusCode,
      response: error.response
    });
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Usage

```typescript
import type {
  SendNotificationRequest,
  AndroidConfig,
  ApnsConfig,
  WebpushConfig,
  Device
} from '@triochat/trio-push';

// Type-safe notification builder
function buildChatNotification(
  deviceIds: string[],
  message: string,
  chatId: string
): SendNotificationRequest {
  const androidConfig: AndroidConfig = {
    priority: 'high',
    notification: {
      channelId: 'chat',
      sound: 'default'
    }
  };
  
  const apnsConfig: ApnsConfig = {
    payload: {
      aps: {
        sound: 'default',
        badge: 1
      }
    }
  };
  
  return {
    device_ids: deviceIds,
    notification: {
      title: 'New Message',
      body: message
    },
    data: { chat_id: chatId },
    android: androidConfig,
    apns: apnsConfig
  };
}

// Use it
const notification = buildChatNotification(
  ['device-1', 'device-2'],
  'Hello!',
  '789'
);

await client.sendNotification(notification);
```
