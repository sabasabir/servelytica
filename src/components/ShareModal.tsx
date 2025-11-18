import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  X,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle
} from 'lucide-react';

const ShareModal = ({ isOpen, onClose, blogPath }) => {
  const [copied, setCopied] = useState(false);

  // Construct full URL from current location and blog path
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${blogPath}` 
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=Check out this blog post!`,
      color: 'hover:bg-sky-50 hover:text-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this blog post: ${fullUrl}`)}`,
      color: 'hover:bg-green-50 hover:text-green-600'
    }
  ];

  const handleSocialShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Share this post</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Social Share Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Share on social media</h3>
            <div className="grid grid-cols-2 gap-3">
              {shareLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={social.name}
                    onClick={() => handleSocialShare(social.url)}
                    className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 transition-all ${social.color}`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium text-sm">{social.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copy Link Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Or copy link</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
                <input
                  type="text"
                  value={fullUrl}
                  readOnly
                  className="w-full bg-transparent text-sm text-gray-600 outline-none"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className={`p-3 rounded-lg border transition-all ${
                  copied 
                    ? 'bg-green-50 border-green-200 text-green-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">Link copied to clipboard!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;