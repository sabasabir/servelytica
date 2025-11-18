import React, { useState, useEffect } from 'react';
import { X, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { tagService } from '@/services/blogService';
import { Tag } from '@/types/Blog';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 5,
  placeholder = 'Add tags...',
  className = ''
}) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const tags = await tagService.getTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (tag: Tag) => {
    if (selectedTags.length >= maxTags) {
      return;
    }

    if (!selectedTags.find(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };

  const handleCreateTag = async () => {
    const name = inputValue.trim();
    if (!name) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newTag: Tag = {
      id: `temp-${Date.now()}`,
      name,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    handleAddTag(newTag);
  };

  const filteredTags = availableTags.filter(tag => {
    const isSelected = selectedTags.find(t => t.id === tag.id);
    const matchesSearch = tag.name.toLowerCase().includes(inputValue.toLowerCase());
    return !isSelected && matchesSearch;
  });

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge 
            key={tag.id} 
            variant="secondary" 
            className="pl-2 pr-1 py-1 flex items-center gap-1"
          >
            <Hash className="h-3 w-3" />
            <span>{tag.name}</span>
            <button
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {selectedTags.length < maxTags && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="w-full"
            />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search tags..." 
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandEmpty>
                {inputValue && (
                  <button
                    onClick={handleCreateTag}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Create "{inputValue}"
                  </button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map(tag => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleAddTag(tag)}
                    className="cursor-pointer"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    <span>{tag.name}</span>
                    {tag.description && (
                      <span className="text-xs text-gray-500 ml-2">
                        {tag.description}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      <p className="text-xs text-gray-500">
        {selectedTags.length}/{maxTags} tags selected
      </p>
    </div>
  );
};

export default TagInput;