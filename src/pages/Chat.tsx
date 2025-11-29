import { useParams } from "react-router-dom";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Send, Users, Sparkles, Bot } from "lucide-react";

export function Chat() {
  const { tripId } = useParams<{ tripId: string }>();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = useQuery(api.messages.getTripMessages, { tripId: tripId as any });
  const participants = useQuery(api.messages.getTripParticipants, { tripId: tripId as any });
  const sendMessage = useMutation(api.messages.sendMessage);
  const trip = useQuery(api.trips.getTripById, { tripId: tripId as any });
  const chatWithAI = useAction(api.ai.chatWithAI);
  
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        tripId: tripId as any,
        content: message,
      });
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  const handleAskAI = async () => {
    if (!aiMessage.trim()) return;
    
    setIsAiLoading(true);
    try {
      const context = trip ? `Trip to ${trip.destination} from ${trip.startDate} to ${trip.endDate}. Budget: ₹${trip.budget}. Interests: ${trip.interests.join(', ')}.` : '';
      
      const response = await chatWithAI({
        message: aiMessage,
        context: context,
      });
      
      // Send AI response as a system message
      await sendMessage({
        tripId: tripId as any,
        content: `🤖 AI Assistant: ${response}`,
      });
      
      setAiMessage("");
      toast.success("AI response added to chat!");
    } catch (error: any) {
      toast.error("Failed to get AI response");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{trip.destination}</h1>
              <p className="text-sm text-gray-600">Trip Chat</p>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{participants?.length || 0} members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        {/* Participants Sidebar */}
        <div className="w-64 bg-white border-r p-4">
          <h3 className="font-medium text-gray-900 mb-4">Participants</h3>
          <div className="space-y-3">
            {participants?.map((participant) => (
              <div key={participant.userId} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                  <p className="text-xs text-gray-500">{participant.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages?.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.type === "system" ? "justify-center" : "justify-start"}`}
              >
                {msg.type === "system" ? (
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {msg.sender.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <p className="text-sm text-gray-900">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.sender.name} • {new Date(msg._creationTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Assistant Section */}
          <div className="border-t bg-gradient-to-r from-purple-50 to-blue-50 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">AI Travel Assistant</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAskAI(); }} className="flex space-x-2">
              <input
                type="text"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Ask AI about your trip, places to visit, budget tips..."
                className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              />
              <button
                type="submit"
                disabled={!aiMessage.trim() || isAiLoading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isAiLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
