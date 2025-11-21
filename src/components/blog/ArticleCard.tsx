
import { Link } from "react-router-dom";
import { Card as MuiCard, CardContent as MuiCardContent, Box, Typography, Chip, Button } from "@mui/material";
import { Clock, Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import ShareModal from "../ShareModal";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  likes?: number;
  comments?: number;
}

interface ArticleCardProps {
  article: Article;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1516542108649-c52a66bda791?w=800&h=450&fit=crop";

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes || 0);
  const [openShareOptions, setOpenShareOptions] = useState<{ open: boolean; id: number | null } | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const imageUrl = article.image && !imageError ? article.image : DEFAULT_IMAGE;

  return (
    <>
      {openShareOptions?.open && (
        <ShareModal
          isOpen={openShareOptions.open}
          onClose={() => setOpenShareOptions(null)}
          blogPath={`/blog/post/${openShareOptions?.id}`}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <MuiCard
          sx={{
            borderRadius: "16px",
            border: "2px solid rgba(255, 126, 0, 0.15)",
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 126, 0, 0.05) 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            mb: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 16px 48px rgba(255, 126, 0, 0.25)",
              borderColor: "rgba(255, 126, 0, 0.3)",
              transform: "translateY(-4px)",
            },
          }}
        >
          {/* Author Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(255, 126, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {article.author.charAt(0).toUpperCase()}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "13px", color: "#1a365d", textTransform: "capitalize" }}>
                {article.author}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>{article.date}</Typography>
            </Box>
            <Chip
              label={article.category}
              size="small"
              sx={{
                background: "linear-gradient(135deg, #1a365d 0%, #2d5a8c 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: "11px",
                textTransform: "uppercase",
              }}
            />
          </Box>

          {/* Article Image */}
          <Link to={`/blog/post/${article.id}`}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%",
                overflow: "hidden",
                background: "#f0f0f0",
              }}
            >
              <img
                src={imageUrl}
                alt={article.title}
                onError={() => setImageError(true)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </Box>

            {/* Content */}
            <MuiCardContent sx={{ pt: 3, pb: 2 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#1a365d",
                  mb: 1.5,
                  fontFamily: '"Poppins", "Sora", sans-serif',
                  textTransform: "capitalize",
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#ff7e00" },
                }}
              >
                {article.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#64748b",
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.excerpt}
              </Typography>
            </MuiCardContent>
          </Link>

          {/* Footer Actions */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid rgba(255, 126, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleLike}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: liked ? "#ff7e00" : "#94a3b8",
                  transition: "color 0.3s ease",
                  textTransform: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  "&:hover": { color: "#ff7e00" },
                }}
              >
                <Heart size={16} fill={liked ? "#ff7e00" : "none"} />
                {likeCount}
              </Button>

              <Link to={`/blog/post/${article.id}#comments`} style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#94a3b8",
                    transition: "color 0.3s ease",
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    "&:hover": { color: "#ff7e00" },
                  }}
                >
                  <MessageCircle size={16} />
                  {article.comments || 0}
                </Button>
              </Link>

              <Button
                onClick={() => setOpenShareOptions({ open: true, id: article.id })}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#94a3b8",
                  transition: "color 0.3s ease",
                  textTransform: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  "&:hover": { color: "#ff7e00" },
                }}
              >
                <Share2 size={16} />
              </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>
              <Clock size={14} />
              {article.readTime}
            </Box>
          </Box>
        </MuiCard>
      </motion.div>
    </>
  );
};

export default ArticleCard;
