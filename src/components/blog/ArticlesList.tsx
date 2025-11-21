
import ArticleCard from "@/components/blog/ArticleCard";
import { Box, Typography, Pagination, PaginationItem } from "@mui/material";
import { motion } from "framer-motion";

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

interface ArticlesListProps {
  articles: Article[];
}

const ArticlesList = ({ articles }: ArticlesListProps) => {
  return (
    <>
      {articles.length > 0 ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </Box>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={3}
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 600,
                  fontSize: "13px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 126, 0, 0.2)",
                  color: "#1a365d",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 126, 0, 0.1)",
                    borderColor: "rgba(255, 126, 0, 0.3)",
                  },
                },
                "& .Mui-selected": {
                  background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%) !important",
                  color: "white !important",
                  border: "none !important",
                },
              }}
            />
          </Box>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              background: "white",
              borderRadius: "16px",
              border: "2px solid rgba(255, 126, 0, 0.15)",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#1a365d", mb: 1 }}>
              NO POSTS FOUND
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "#94a3b8" }}>
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        </motion.div>
      )}
    </>
  );
};

export default ArticlesList;
