import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Save, 
  Eye, 
  Clock, 
  Hash, 
  Image as ImageIcon,
  FileText,
  Search,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TagInput from './TagInput';
import ImageUploadInput from '@/components/ImageUploadInput';
import { useAuth } from '@/contexts/AuthContext';
import { articleService, categoryService, tagService } from '@/services/blogService';
import { Article, Category, Tag } from '@/types/Blog';
import { toast } from 'sonner';

interface EnhancedArticleEditorProps {
  article?: Article;
  onSave?: (article: Article) => void;
  onCancel?: () => void;
}

const EnhancedArticleEditor: React.FC<EnhancedArticleEditorProps> = ({
  article,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Article fields
  const [title, setTitle] = useState(article?.title || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [content, setContent] = useState(article?.content || '');
  const [categoryId, setCategoryId] = useState(article?.category_id || '');
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || '');
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft');
  
  // SEO fields
  const [seoTitle, setSeoTitle] = useState(article?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(article?.seo_description || '');
  const [seoKeywords, setSeoKeywords] = useState(article?.seo_keywords?.join(', ') || '');
  
  // Calculated fields
  const [readTime, setReadTime] = useState(article?.read_time || 0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    loadCategories();
    if (article?.tags) {
      setSelectedTags(article.tags);
    }
  }, []);

  useEffect(() => {
    // Calculate read time and word count
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    setWordCount(words);
    setReadTime(Math.ceil(words / 200));
  }, [content]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSave = async (saveStatus: 'draft' | 'published') => {
    if (!title || !content || !categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to save articles');
      return;
    }

    setLoading(true);
    try {
      const articleData: Partial<Article> = {
        title,
        excerpt,
        content,
        category_id: categoryId,
        featured_image: featuredImage,
        status: saveStatus,
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt,
        seo_keywords: seoKeywords.split(',').map(k => k.trim()).filter(k => k),
        read_time: readTime,
        author_id: user.id
      };

      if (saveStatus === 'published' && !article?.published_at) {
        articleData.published_at = new Date().toISOString();
      }

      let savedArticle: Article;
      if (article?.id) {
        savedArticle = await articleService.updateArticle(article.id, articleData);
      } else {
        savedArticle = await articleService.createArticle(articleData);
      }

      // Add tags
      if (selectedTags.length > 0) {
        const tagIds = selectedTags.map(t => t.id);
        await tagService.addTagsToArticle(savedArticle.id, tagIds);
      }

      toast.success(
        saveStatus === 'published' 
          ? 'Article published successfully!' 
          : 'Article saved as draft'
      );

      onSave?.(savedArticle);
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {article ? 'Edit Article' : 'Create New Article'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('draft')}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave('published')}
                disabled={loading}
              >
                Publish
              </Button>
              {onCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {previewMode ? (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{title || 'Untitled'}</h1>
              {featuredImage && (
                <img 
                  src={featuredImage} 
                  alt={title}
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Badge>{categories.find(c => c.id === categoryId)?.name}</Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span>{wordCount} words</span>
              </div>
              {excerpt && (
                <p className="text-lg text-gray-600">{excerpt}</p>
              )}
              <Separator />
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <div className="flex gap-2">
                {selectedTags.map(tag => (
                  <Badge key={tag.id} variant="secondary">
                    <Hash className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <Tabs defaultValue="content" className="w-full">
              <TabsList>
                <TabsTrigger value="content">
                  <FileText className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <Search className="h-4 w-4 mr-2" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter article title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary of the article"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <div className="mt-1 border rounded-lg">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      className="h-96"
                    />
                  </div>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-gray-500 pb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {readTime} min read
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 pb-2">
                    {wordCount} words
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <TagInput
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                    maxTags={10}
                    className="mt-1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div>
                  <Label>Featured Image</Label>
                  <ImageUploadInput
                    image={featuredImage}
                    setImage={setFeaturedImage}
                    label="Upload or enter image URL"
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Page title for search engines (default: article title)"
                    maxLength={60}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo-description">SEO Description</Label>
                  <Textarea
                    id="seo-description"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Page description for search engines"
                    maxLength={160}
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo-keywords">SEO Keywords</Label>
                  <Input
                    id="seo-keywords"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="Comma-separated keywords"
                    className="mt-1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Article Status</Label>
                    <p className="text-sm text-gray-500">
                      Current status: <Badge>{status}</Badge>
                    </p>
                  </div>
                  <Switch
                    checked={status === 'published'}
                    onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')}
                  />
                </div>

                {article?.published_at && (
                  <div>
                    <Label>Published Date</Label>
                    <p className="text-sm text-gray-500">
                      {new Date(article.published_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {article && (
                  <div>
                    <Label>Statistics</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold">
                            {article.views || 0}
                          </div>
                          <p className="text-xs text-gray-500">Views</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold">
                            {article.likes_count || 0}
                          </div>
                          <p className="text-xs text-gray-500">Likes</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold">
                            {article.comments_count || 0}
                          </div>
                          <p className="text-xs text-gray-500">Comments</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedArticleEditor;