import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Info, AlertCircle } from 'lucide-react';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
  modelName: string;
  provider: string;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  modelName,
  provider
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }
    
    // Basic validation for different providers
    if (provider === 'Anthropic' && !apiKey.startsWith('sk-ant-')) {
      setError('Claude API key should start with "sk-ant-"');
      return;
    }
    
    if (provider === 'DeepSeek' && !apiKey.startsWith('sk-')) {
      setError('DeepSeek API key should start with "sk-"');
      return;
    }

    onSubmit(apiKey);
    setApiKey('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setApiKey('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !error && apiKey.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
        {/* Header - Notion style */}
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-lg font-medium text-black">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <Key className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-black">API Key Required</div>
              <div className="text-sm font-normal text-gray-600 mt-1">
                {modelName} from {provider}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Information Alert - Notion style */}
          <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-800 leading-relaxed">
                To use <span className="font-medium">{modelName}</span> from {provider}, please enter your API key.
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Your key will be stored securely in your browser's local storage.
              </p>
            </div>
          </div>
          
          {/* API Key Input - Notion style */}
          <div className="space-y-3">
            <Label 
              htmlFor="apiKey" 
              className="text-sm font-medium text-gray-800"
            >
              API Key
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (error) setError(''); // Clear error on input
                }}
                onKeyPress={handleKeyPress}
                placeholder={`Enter your ${provider} API key`}
                className="w-full h-11 bg-white border-gray-200 text-black placeholder-gray-400 focus:border-gray-400 focus:ring-0 pr-12 font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                onClick={() => setShowKey(!showKey)}
                tabIndex={-1}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Help text */}
            <p className="text-xs text-gray-500 leading-relaxed">
              {provider === 'Anthropic' && 'Your Claude API key should start with "sk-ant-"'}
              {provider === 'DeepSeek' && 'Your DeepSeek API key should start with "sk-"'}
              {!['Anthropic', 'DeepSeek'].includes(provider) && `Enter your ${provider} API key from your account dashboard`}
            </p>
          </div>
          
          {/* Error Alert - Notion style */}
          {error && (
            <div className="flex gap-3 p-3 bg-red-50 rounded border border-red-100">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
        
        {/* Footer - Notion style */}
        <DialogFooter className="pt-4 border-t border-gray-100 gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!apiKey.trim() || !!error}
            className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
          >
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
