import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { API_ENDPOINTS } from "../../config/api";
import { supabase } from "../utils/supabaseClient";
import { toast } from "sonner";

interface Message {
  id: string;
  clientId: string;
  senderId: string;
  senderRole: 'admin' | 'client';
  senderName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

export function AdminMessageDialog({ 
  open, 
  onOpenChange, 
  clientId, 
  clientName 
}: AdminMessageDialogProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open && clientId) {
      fetchMessages();
    }
  }, [open, clientId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;

      const response = await fetch(
        API_ENDPOINTS.messages(clientId),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;

      const response = await fetch(
        API_ENDPOINTS.messagesSend,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId,
            senderId: 'admin',
            senderRole: 'admin',
            senderName: 'Tax Advisor',
            subject: 'Admin Response',
            content: newMessage,
          })
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      setNewMessage('');
      toast.success('Message sent successfully!');
      await fetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t("messages.title")} - {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Messages List */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto space-y-4 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t("messages.noMessages")}</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isFromAdmin = msg.senderRole === 'admin';
                const date = new Date(msg.createdAt);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                
                let dateLabel = date.toLocaleDateString();
                if (date.toDateString() === today.toDateString()) {
                  dateLabel = t("messages.today");
                } else if (date.toDateString() === yesterday.toDateString()) {
                  dateLabel = t("messages.yesterday");
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        isFromAdmin
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">
                          {isFromAdmin ? t("messages.admin") : msg.senderName}
                        </span>
                        <span className={`text-xs ${isFromAdmin ? 'text-blue-100' : 'text-gray-500'}`}>
                          {dateLabel} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t("messages.writeMessage")}
              className="flex-1 min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="h-[80px]"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t("messages.send")}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}