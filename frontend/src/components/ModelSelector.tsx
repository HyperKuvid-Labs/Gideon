import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Cpu, Zap, Clock, Check, Search, X } from 'lucide-react';
import ApiKeyDialog from './ApiKeyDialog';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
  speed: 'Fast' | 'Medium' | 'Slow';
  contextLength: string;
  isNew?: boolean;
  category: 'main' | 'local';
}

export const models: Model[] = [
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Google's most advanced multimodal model with exceptional reasoning capabilities",
    badge: "NEW",
    speed: "Medium",
    contextLength: "1M tokens",
    isNew: true,
    category: "main",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Google's most advanced model for fast responses with multimodal understanding",
    badge: "NEW",
    speed: "Fast",
    contextLength: "1M tokens",
    isNew: true,
    category: "main",
  },
  {
    id: "claude-4.0-sonnet",
    name: "Claude 4.0 Sonnet",
    provider: "Anthropic",
    description: "Anthropic's flagship reasoning model with superior analytical capabilities",
    badge: "Popular",
    speed: "Fast",
    contextLength: "200K tokens",
    category: "main",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    description: "DeepSeek's most advanced model for long-term memory and complex reasoning",
    badge: "NEW",
    speed: "Medium",
    contextLength: "128K tokens",
    category: "main",
  },
  {
    id: "gemma3_27b",
    name: "Gemma 3",
    provider: "Google",
    description: "Lightweight and efficient multimodal model optimized for performance",
    speed: "Fast",
    contextLength: "128K tokens",
    category: "local",
  },
  {
    id: "llama-3.3",
    name: "LlaMA 3.3",
    provider: "Meta",
    description: "Meta's multilingual, instruction-tuned 70B model with top-tier performance",
    speed: "Medium",
    contextLength: "128K tokens",
    category: "local",
  },
  {
    id: "deepseek-r1-70b",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "DeepSeek's most advanced model for long-term memory and complex reasoning",
    speed: "Fast",
    contextLength: "128K tokens",
    category: "local",
  },
  {
    id: "phi4-14b",
    name: "Phi 4",
    provider: "Microsoft",
    description: "State-of-the-art open model from Microsoft with excellent efficiency",
    speed: "Fast",
    contextLength: "16K tokens",
    category: "local",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

const ModelSelector = ({ selectedModel, onModelSelect }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [selectedModelForApiKey, setSelectedModelForApiKey] = useState<Model | null>(null);

  const selectedModelData = useMemo(() =>
    models.find(m => m.id === selectedModel),
    [selectedModel]
  );

  const filteredModels = useMemo(() =>
    models.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  const mainModels = useMemo(() =>
    filteredModels.filter(m => m.category === 'main'),
    [filteredModels]
  );

  const localModels = useMemo(() =>
    filteredModels.filter(m => m.category === 'local'),
    [filteredModels]
  );

  const allFilteredModels = useMemo(() =>
    [...mainModels, ...localModels],
    [mainModels, localModels]
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('gidvion-selected-model');
    if (saved && models.find(m => m.id === saved) && saved !== selectedModel) {
      onModelSelect(saved);
    }
  }, []);

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('gidvion-selected-model', selectedModel);
    }
  }, [selectedModel]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev =>
          prev < allFilteredModels.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev =>
          prev > 0 ? prev - 1 : allFilteredModels.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && allFilteredModels[focusedIndex]) {
          handleModelSelect(allFilteredModels[focusedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  }, [isOpen, focusedIndex, allFilteredModels]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleModelSelect = useCallback((modelId: string) => {
    if (modelId === selectedModel) return;
    
    const model = models.find(m => m.id === modelId);
    if (model && (model.provider === 'Anthropic' || model.provider === 'DeepSeek')) {
      const storedKey = sessionStorage.getItem(`apiKey_${model.provider.toLowerCase()}`);
      if (!storedKey) {
        setSelectedModelForApiKey(model);
        setShowApiKeyDialog(true);
        return;
      }
    }

    onModelSelect(modelId);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  }, [selectedModel, onModelSelect]);

  const handleApiKeySubmit = (apiKey: string) => {
    if (selectedModelForApiKey) {
      sessionStorage.setItem(`apiKey_${selectedModelForApiKey.provider.toLowerCase()}`, apiKey);
      onModelSelect(selectedModelForApiKey.id);
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
      setSelectedModelForApiKey(null);
    }
  };

  const getSpeedIcon = useCallback((speed: string) => {
    switch (speed) {
      case 'Fast': return <Zap className="w-4 h-4 text-gray-600" />;
      case 'Medium': return <Cpu className="w-4 h-4 text-gray-600" />;
      case 'Slow': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  }, []);

  const ModelItem = ({ model, index }: { model: Model; index: number }) => {
    const isSelected = selectedModel === model.id;
    const isFocused = focusedIndex === index;

    return (
      <div
        onClick={() => handleModelSelect(model.id)}
        className={`p-3 cursor-pointer rounded transition-colors duration-200 ${
          isSelected
            ? "bg-gray-100 border-l-2 border-black"
            : isFocused
            ? "bg-gray-50"
            : "hover:bg-gray-50"
        }`}
        role="option"
        aria-selected={isSelected}
        tabIndex={-1}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-black text-sm truncate">{model.name}</span>
              {model.badge && (
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-0.5 ${
                    model.badge === "NEW" 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {model.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">{model.description}</p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                {getSpeedIcon(model.speed)}
                <span className="text-gray-600">{model.speed}</span>
              </div>
              <span className="text-gray-600">{model.contextLength}</span>
              <span className="text-gray-600">{model.provider}</span>
            </div>
          </div>
          {isSelected && <Check className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />}
        </div>
      </div>
    );
  };

  return (
    <div className="relative font-inter">
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="justify-between w-full h-11 px-3 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors bg-white text-left"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select AI model"
      >
        <div className="text-left min-w-0 flex-1">
          <div className="font-medium text-black text-sm truncate">{selectedModelData?.name || 'Select Model'}</div>
          <div className="text-xs text-gray-500 truncate">{selectedModelData?.provider || 'Choose your AI assistant'}</div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-gray-500 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
        >
          {/* Search Header - Notion style */}
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFocusedIndex(-1);
                }}
                className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors text-sm"
                autoComplete="off"
                role="searchbox"
                aria-label="Search models"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFocusedIndex(-1);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Model Lists - Notion style */}
          <div className="p-2">
            {mainModels.length > 0 && (
              <div className="mb-4">
                <h3 className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Featured Models</h3>
                <div className="space-y-1">
                  {mainModels.map((model, index) => (
                    <ModelItem key={model.id} model={model} index={index} />
                  ))}
                </div>
              </div>
            )}

            {localModels.length > 0 && (
              <div>
                <h3 className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Local Models</h3>
                <p className='text-xs text-gray-400 px-2 pb-2'>For faster inference</p>
                <div className="space-y-1">
                  {localModels.map((model, index) => (
                    <ModelItem key={model.id} model={model} index={mainModels.length + index} />
                  ))}
                </div>
              </div>
            )}

            {filteredModels.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-black mb-1">No models found</p>
                <p className="text-xs text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ApiKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => {
          setShowApiKeyDialog(false);
          setSelectedModelForApiKey(null);
        }}
        onSubmit={handleApiKeySubmit}
        modelName={selectedModelForApiKey?.name || ''}
        provider={selectedModelForApiKey?.provider || ''}
      />
    </div>
  );
};

export default ModelSelector;
