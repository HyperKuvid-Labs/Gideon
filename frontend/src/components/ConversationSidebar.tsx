import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Trash2, Bot, User, Clock, Search, Filter, Menu, X } from 'lucide-react';

interface Conversation {
  id: number;
  room_name: string;
  last_message_at: string;
  last_message?: string;
  ai_model: string;
  type: string;
  aiEnabled: boolean;
}

interface HistoryViewProps {
  conversations: Conversation[];
  currentConversationId: number | null;
  onConversationSelect: (conversationId: number) => void;
  onDeleteConversation: (conversationId: number) => Promise<void>;
  onNewConversation: () => Promise<void>;
  onCollapse: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({
  conversations,
  currentConversationId,
  onConversationSelect,
  onDeleteConversation,
  onNewConversation,
  onCollapse
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterModel, setFilterModel] = React.useState<string>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter conversations based on search and model filter
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.room_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.last_message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.ai_model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesModel = filterModel === 'all' || conversation.ai_model === filterModel;
    
    return matchesSearch && matchesModel;
  });

  // Get unique models for filter
  const uniqueModels = [...new Set(conversations.map(c => c.ai_model))];

  // Group conversations by date
  const groupedConversations = filteredConversations.reduce((groups, conversation) => {
    const date = new Date(conversation.last_message_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      groupKey = 'This Week';
    } else {
      groupKey = 'Older';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(conversation);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="h-full bg-white border-r border-gray-200 font-inter">
      {/* Header - Notion style */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onCollapse}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-black">Conversations</h2>
                <p className="text-xs text-gray-600">
                  {conversations.length} total • {filteredConversations.length} shown
                </p>
              </div>
            </div>
          </div>

          {/* New Chat Button - Notion style */}
          <Button 
            onClick={onNewConversation}
            size="sm"
            className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5 h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
        </div>

        {/* Search and Filters - Notion style */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded text-black placeholder-gray-400 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          {/* Model Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded text-black text-sm px-2 py-1.5 focus:outline-none focus:border-gray-400"
            >
              <option value="all">All Models</option>
              {uniqueModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conversations List - Notion style */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedConversations).length === 0 ? (
          /* Empty State - Notion style */
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-black mb-2">
              {searchQuery || filterModel !== 'all' ? 'No matching conversations' : 'No conversations yet'}
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {searchQuery || filterModel !== 'all' ? 'Try adjusting your search or filter' : 'Start a new chat to begin'}
            </p>
            <Button
              onClick={onNewConversation}
              size="sm"
              className="bg-black text-white hover:bg-gray-800 text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        ) : (
          /* Grouped Conversations - Notion style */
          <div className="p-2">
            {Object.entries(groupedConversations).map(([group, groupConversations]) => (
              <div key={group} className="mb-6">
                <h3 className="text-xs font-medium text-gray-500 mb-3 px-2 uppercase tracking-wide">
                  {group}
                </h3>
                <div className="space-y-1">
                  {groupConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`relative rounded-lg cursor-pointer group transition-all duration-200 p-3 mx-1 ${
                        currentConversationId === conversation.id 
                          ? 'bg-gray-100 border-l-2 border-black' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onConversationSelect(conversation.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="mt-0.5">
                            {conversation.aiEnabled ? (
                              <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                                <Bot className="w-3 h-3 text-gray-600" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-black truncate leading-5">
                              {conversation.room_name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {conversation.ai_model}
                            </p>
                          </div>
                        </div>

                        {/* Delete Button - Notion style */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-600 rounded transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Last Message */}
                      {conversation.last_message && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed ml-8">
                          {conversation.last_message}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs ml-8">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(conversation.last_message_at)}</span>
                        </div>
                        {conversation.type && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {conversation.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
