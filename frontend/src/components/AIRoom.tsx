import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles, Download, Share2, Heart, Copy,
  Palette, Wand2, Image as ImageIcon, Loader2,
  RefreshCw, Settings, Grid3X3, List, Eye,
  Zap, Stars, WandSparkles, Brush
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { generateImage } from '@/api/chatService';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  liked: boolean;
}

const ImageStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSettings, setShowSettings] = useState(false);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Style suggestions (like music genres in Suno)
  const stylePrompts = [
    'photorealistic portrait', 'digital art', 'oil painting', 'watercolor',
    'cyberpunk aesthetic', 'minimalist design', 'vintage photography',
    'abstract expressionism', 'anime style', 'concept art', 'surreal landscape',
    'street photography', 'macro photography', 'architectural visualization',
    'fantasy illustration', 'retro futurism', 'hyperrealistic', 'impressionist',
    'pop art', 'noir style', 'steampunk', 'art nouveau', 'bauhaus design'
  ];

  // GSAP animations on mount
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    // Subtle floating elements animation
    floatingElementsRef.current.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: -10,
          duration: 3 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.1
        });
      }
    });
  }, []);

  // Generate images handler
  const handleGenerateImages = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please describe what you want to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateImage(prompt);
      
      // Convert base64 images to GeneratedImage objects
      const newImages: GeneratedImage[] = response.images.map((imageData: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        prompt: prompt,
        imageUrl: imageData,
        timestamp: new Date(),
        liked: false
      }));

      setGeneratedImages(prev => [...newImages, ...prev]);

      // Animate new images in
      if (imagesRef.current) {
        gsap.fromTo(imagesRef.current.children,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
      }

      toast({
        title: "Images Generated!",
        description: `Created ${newImages.length} images successfully`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle like
  const toggleLike = (imageId: string) => {
    setGeneratedImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, liked: !img.liked } : img
      )
    );
  };

  // Download image
  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-${prompt.slice(0, 20)}-${Date.now()}.png`;
    link.click();
  };

  // Copy prompt
  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard",
    });
  };

  // Add style to prompt
  const addStyleToPrompt = (style: string) => {
    setPrompt(prev => prev ? `${prev}, ${style}` : style);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white text-black relative overflow-hidden font-inter"
    >
      {/* Subtle background elements - Notion style */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            ref={el => floatingElementsRef.current[i] = el}
            className="absolute w-1 h-1 bg-gray-200 rounded-full opacity-30"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header - Notion style */}
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-medium text-black">Image Studio</h1>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Transform your ideas into visual reality with AI-powered image generation
            </p>
          </div>
        </div>

        {/* Generation Interface */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Prompt Input - Notion style */}
          <div className="mb-8">
            <div className="relative">
              <Input
                ref={promptRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="w-full h-12 text-base bg-white border-gray-200 text-black placeholder-gray-400 pr-24 focus:border-gray-400 focus:ring-0 rounded-md"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerateImages();
                  }
                }}
              />
              <Button
                onClick={handleGenerateImages}
                disabled={isGenerating}
                className="absolute right-2 top-2 h-8 px-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 text-sm rounded"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Style Suggestions - Notion style */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Style suggestions</h3>
            <div className="flex flex-wrap gap-2">
              {stylePrompts.slice(0, 12).map((style, index) => (
                <button
                  key={index}
                  onClick={() => addStyleToPrompt(style)}
                  className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 transition-colors"
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* View Controls - Notion style */}
          {generatedImages.length > 0 && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-medium text-black">
                  Generated Images
                </h2>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                  {generatedImages.length}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'grid' 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'list' 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Images Grid - Notion style */}
          {generatedImages.length > 0 ? (
            <div
              ref={imagesRef}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "space-y-4"
              }
            >
              {generatedImages.map((image, index) => (
                <Card key={image.id} className="group bg-white border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      
                      {/* Overlay - Notion style */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => toggleLike(image.id)}
                            size="sm"
                            className={`p-2 rounded ${
                              image.liked
                                ? 'bg-black text-white'
                                : 'bg-white/90 text-black hover:bg-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${image.liked ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <Button
                            onClick={() => downloadImage(image.imageUrl, image.prompt)}
                            size="sm"
                            className="p-2 bg-white/90 text-black hover:bg-white rounded"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            onClick={() => copyPrompt(image.prompt)}
                            size="sm"
                            className="p-2 bg-white/90 text-black hover:bg-white rounded"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            onClick={() => setSelectedImage(image)}
                            size="sm"
                            className="p-2 bg-white/90 text-black hover:bg-white rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-black mb-2 line-clamp-2 leading-relaxed">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {image.timestamp.toLocaleTimeString()}
                        </p>
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                          AI Generated
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !isGenerating && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">No images yet</h3>
              <p className="text-gray-600 text-sm">
                Enter a prompt above and click generate to create your first AI image
              </p>
            </div>
          )}

          {/* Loading Animation - Notion style */}
          {isGenerating && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Creating images</h3>
              <p className="text-gray-600 text-sm mb-6">
                AI is generating 4 unique images for you
              </p>
              
              {/* Progress placeholders */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
