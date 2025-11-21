import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Box, Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const PlayerProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        if (!username) {
          setError('Player not found');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (fetchError || !data) {
          setError('Player not found');
        } else {
          setPlayerData(data);
        }
      } catch (err) {
        setError('Failed to load player profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [username]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#ff7e00' }} />
        </Box>
        <Footer />
      </Box>
    );
  }

  if (error || !playerData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ textAlign: 'center', p: 4, borderRadius: '16px' }}>
              <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 800, mb: 2 }}>
                Player Not Found
              </Typography>
              <Typography sx={{ color: '#64748b' }}>
                {error || 'The player profile you are looking for does not exist.'}
              </Typography>
            </Card>
          </motion.div>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 6, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography
                sx={{
                  fontSize: { xs: '24px', md: '32px' },
                  fontWeight: 800,
                  color: '#1a365d',
                  mb: 2,
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                {playerData?.display_name || playerData?.username}
              </Typography>
              
              <Typography sx={{ color: '#64748b', mb: 4 }}>
                <strong>Username:</strong> @{playerData?.username}
              </Typography>

              {playerData?.bio && (
                <Typography sx={{ color: '#475569', mb: 3, lineHeight: 1.6 }}>
                  {playerData.bio}
                </Typography>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mt: 4 }}>
                <Box sx={{ p: 3, background: 'rgba(255, 126, 0, 0.08)', borderRadius: '12px' }}>
                  <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1, fontWeight: 600 }}>
                    SPORT
                  </Typography>
                  <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1a365d' }}>
                    {playerData?.sport_id || 'Not specified'}
                  </Typography>
                </Box>
                
                <Box sx={{ p: 3, background: 'rgba(255, 126, 0, 0.08)', borderRadius: '12px' }}>
                  <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1, fontWeight: 600 }}>
                    MEMBER SINCE
                  </Typography>
                  <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1a365d' }}>
                    {playerData?.created_at ? new Date(playerData.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
      <Footer />
    </Box>
  );
};

export default PlayerProfilePage;
