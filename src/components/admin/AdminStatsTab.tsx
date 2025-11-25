import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Video, BookOpen, BarChart3 } from "lucide-react";

const AdminStatsTab = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoaches: 0,
    totalVideos: 0,
    totalBlogPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Get total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total coaches
        const { count: coachesCount } = await supabase
          .from('coach_profiles')
          .select('*', { count: 'exact', head: true });

        // Get total videos
        const { count: videosCount } = await supabase
          .from('videos')
          .select('*', { count: 'exact', head: true });

        // Get total blog posts
        const { count: blogCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalUsers: usersCount || 0,
          totalCoaches: coachesCount || 0,
          totalVideos: videosCount || 0,
          totalBlogPosts: blogCount || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Total Coaches",
      value: stats.totalCoaches,
      icon: BarChart3,
      color: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Total Videos",
      value: stats.totalVideos,
      icon: Video,
      color: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Total Blog Posts",
      value: stats.totalBlogPosts,
      icon: BookOpen,
      color: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={stat.color}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`${stat.textColor} h-5 w-5`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatsTab;
