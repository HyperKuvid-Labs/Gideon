import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Cpu, Cloud } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  badge: string;
  badgeColor: string;
}

const models: Model[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Lightning fast responses',
    icon: Zap,
    badge: 'Fast',
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Balanced performance',
    icon: Target,
    badge: 'Accurate',
    badgeColor: 'bg-black text-white border-black'
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Advanced reasoning',
    icon: Cloud,
    badge: 'Popular',
    badgeColor: 'bg-gray-800 text-white border-gray-800'
  },
  {
    id: 'gemini-ollama',
    name: 'Gemini via Ollama',
    description: 'Local processing power',
    icon: Cpu,
    badge: 'Fast',
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-200'
  }
];

interface ModelTabsProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

const ModelTabs = ({ selectedModel, onModelSelect }: ModelTabsProps) => {
  const selectedModelData = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div className="w-full font-inter">
      <Tabs value={selectedModel} onValueChange={onModelSelect} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-50 border border-gray-200 rounded-lg h-auto p-1">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <TabsTrigger
                key={model.id}
                value={model.id}
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100 flex flex-col gap-2 p-3 h-auto text-gray-600 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium truncate">{model.name}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0.5 ${
                    selectedModel === model.id 
                      ? 'bg-black text-white border-black' 
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {model.badge}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {models.map((model) => (
          <TabsContent key={model.id} value={model.id} className="mt-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <model.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black text-sm">{model.name}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{model.description}</p>
              </div>
              <Badge 
                variant="outline" 
                className="bg-gray-100 text-gray-700 border-gray-200 text-xs"
              >
                {model.badge}
              </Badge>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ModelTabs;
