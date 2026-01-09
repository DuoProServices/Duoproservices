/**
 * MESSAGES SYSTEM
 * 
 * Client Communication Hub for admin-client messaging
 */

import * as kv from './kv_store.tsx';

export interface Message {
  id: string;
  clientId: string;
  senderId: string;
  senderRole: 'admin' | 'client';
  senderName: string;
  subject: string;
  content: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageThread {
  id: string;
  clientId: string;
  subject: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

/**
 * Send a new message
 */
export async function sendMessage(
  clientId: string,
  senderId: string,
  senderRole: 'admin' | 'client',
  senderName: string,
  subject: string,
  content: string,
  attachments?: Array<{ name: string; url: string; size: number }>
): Promise<Message> {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  const message: Message = {
    id: messageId,
    clientId,
    senderId,
    senderRole,
    senderName,
    subject,
    content,
    attachments,
    isRead: false,
    createdAt: now,
    updatedAt: now
  };

  // Store message
  await kv.set(`message:${messageId}`, message);

  // Add to client's message list
  const messagesKey = `client_messages:${clientId}`;
  const existingMessages = (await kv.get(messagesKey)) || [];
  await kv.set(messagesKey, [...existingMessages, messageId]);

  // Update unread count for recipient
  if (senderRole === 'admin') {
    // Admin sent to client - increment client's unread count
    const unreadKey = `unread_messages:client:${clientId}`;
    const currentUnread = (await kv.get(unreadKey)) || 0;
    await kv.set(unreadKey, currentUnread + 1);
  } else {
    // Client sent to admin - increment admin's unread count
    const unreadKey = `unread_messages:admin:${clientId}`;
    const currentUnread = (await kv.get(unreadKey)) || 0;
    await kv.set(unreadKey, currentUnread + 1);
  }

  return message;
}

/**
 * Get all messages for a client
 */
export async function getClientMessages(clientId: string): Promise<Message[]> {
  const messagesKey = `client_messages:${clientId}`;
  const messageIds = (await kv.get(messagesKey)) || [];

  if (messageIds.length === 0) {
    return [];
  }

  const messages: Message[] = [];
  for (const msgId of messageIds) {
    const message = await kv.get(`message:${msgId}`);
    if (message) {
      messages.push(message);
    }
  }

  // Sort by date (newest first)
  return messages.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(
  messageId: string,
  userRole: 'admin' | 'client',
  clientId: string
): Promise<void> {
  const message = await kv.get(`message:${messageId}`);
  
  if (!message || message.isRead) {
    return; // Already read or doesn't exist
  }

  // Update message
  message.isRead = true;
  message.updatedAt = new Date().toISOString();
  await kv.set(`message:${messageId}`, message);

  // Decrement unread count
  const unreadKey = userRole === 'admin' 
    ? `unread_messages:admin:${clientId}`
    : `unread_messages:client:${clientId}`;
    
  const currentUnread = (await kv.get(unreadKey)) || 0;
  await kv.set(unreadKey, Math.max(0, currentUnread - 1));
}

/**
 * Get unread message count
 */
export async function getUnreadCount(
  clientId: string,
  userRole: 'admin' | 'client'
): Promise<number> {
  const unreadKey = userRole === 'admin'
    ? `unread_messages:admin:${clientId}`
    : `unread_messages:client:${clientId}`;
    
  return (await kv.get(unreadKey)) || 0;
}

/**
 * Get all clients with unread messages (for admin dashboard)
 */
export async function getClientsWithUnreadMessages(): Promise<Array<{ clientId: string; unreadCount: number }>> {
  const unreadMessages = await kv.getByPrefix('unread_messages:admin:');
  
  return unreadMessages
    .map(item => ({
      clientId: item.key.replace('unread_messages:admin:', ''),
      unreadCount: item.value || 0
    }))
    .filter(item => item.unreadCount > 0);
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string, clientId: string): Promise<void> {
  // Remove from storage
  await kv.del(`message:${messageId}`);

  // Remove from client's message list
  const messagesKey = `client_messages:${clientId}`;
  const messageIds = (await kv.get(messagesKey)) || [];
  const updatedIds = messageIds.filter((id: string) => id !== messageId);
  await kv.set(messagesKey, updatedIds);
}
