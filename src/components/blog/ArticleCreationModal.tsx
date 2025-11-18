import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, ChevronDown, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ImageUploadInput from '../ImageUploadInput';

const ArticleCreationModal = ({ isOpen, onClose, onArticleCreated }) => {
  const { userProfile } = useAuth();
  const [title, setTitle] = useState('');
//   const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


    useEffect(() => {
    if (!content) return;

    // Convert HTML -> plain text
    // const tempElement = document.createElement("div");
    // tempElement.innerHTML = content;
    // const text = tempElement.textContent || tempElement.innerText || "";

    // // Count words
    // const words = text.trim().split(/\s+/).length;

    // // Average reading speed ~200 words/min
    // const minutes = Math.ceil(words / 200);

    // setReadTime(minutes);

    
    const handler = setTimeout(() => {
      // Convert HTML -> plain text
      const tempElement = document.createElement("div");
      tempElement.innerHTML = content;
      const text = tempElement.textContent || tempElement.innerText || "";

      // Count words
      const words = text.trim().split(/\s+/).length;

      // Average reading speed ~200 words/min
      const minutes = Math.ceil(words / 200);

      setReadTime(minutes);
    }, 3000); // 3s debounce

    // Cleanup if content changes before 3s
    return () => clearTimeout(handler);
  }, [content]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setError('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!userProfile) {
        throw new Error('You must be logged in to create articles');
      }

      // Insert article
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            title,
            excerpt: "",
            content,
            category_id: categoryId,
            image,
            read_time: readTime,
            author_id: userProfile.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Call success callback
      if (onArticleCreated) {
        onArticleCreated(data);
      }

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating article:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    // setExcerpt('');
    setContent('');
    setCategoryId('');
    setImage('');
    setReadTime(0);
    setError('');
  };

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

   const handleValueChange = (value) => {
    setCategoryId(value);
    // If you need the numeric ID elsewhere, you can convert it:
    const numericId = parseInt(value);
    console.log('Selected category ID:', numericId);
  };


  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl z-50 p-6">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-gray-800">
              Create New Article
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                className="h-64 mb-12"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {/* <Select.Root value={categoryId?.toString()} onValueChange={(value) => setCategoryId(parseInt(value))}>
                  <Select.Trigger
                    id="category"
                    className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Select.Value placeholder="Select a category" />
                    <Select.Icon>
                      <ChevronDown size={16} />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200">
                      <Select.ScrollUpButton />
                      <Select.Viewport>
                        {categories.map((category) => (
                          <Select.Item
                            key={category.id}
                            value={category?.id?.toString()}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                          >
                            <Select.ItemText>{category.name}</Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      <Select.ScrollDownButton />
                    </Select.Content>
                  </Select.Portal>
                </Select.Root> */}
                <Select.Root value={categoryId} onValueChange={handleValueChange}>
        <Select.Trigger
          id="category"
          className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[40px]"
        >
          <Select.Value placeholder="Select a category" />
          <Select.Icon>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>
        
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
              <ChevronDown size={16} className="rotate-180" />
            </Select.ScrollUpButton>
            
            <Select.Viewport className="p-1">
              {categories.map((category) => (
                <Select.Item
                  key={category.id}
                  value={category.id.toString()}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded-sm outline-none focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700"
                >
                  <Select.ItemText>{category.name}</Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
              <ChevronDown size={16} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
              </div>

              {/* <div>
                <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  id="readTime"
                  min="1"
                  value={readTime}
                  onChange={(e) => setReadTime(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div> */}
            </div>

            <div>
              {/* <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              /> */}
              <ImageUploadInput image={image} setImage={setImage} label="Image URL or Upload" />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Article'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ArticleCreationModal;