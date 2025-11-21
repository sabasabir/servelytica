
import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { MembershipType, canConnectWithPlayers } from "@/utils/membershipUtils";
import SearchAndFilters from "@/components/social/SearchAndFilters";
import MembershipBanner from "@/components/social/MembershipBanner";
import PlayersList from "@/components/social/PlayersList";
import ContactForm from "@/components/social/ContactForm";
import UpgradeDialog from "@/components/social/UpgradeDialog";
import { Player } from "@/components/social/PlayerCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import MyRequestsLists from "@/components/social/MyRequestsLists";
import ConnectRequestModal from "@/components/social/ConnectRequestModal";

const userMembership: MembershipType = "Free";

const SocialConnector = () => {
  const { user, userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showContactRequestDialog, setShowContactRequestDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);

        const connectedUserIds = [];
        const { data: connections, error: connectionsError } = await supabase
          .from('connections')
          .select('user1_id: user1_id (user_id), user2_id: user2_id (user_id)')
          .or(`user1_id.eq.${userProfile?.id},user2_id.eq.${userProfile?.id}`);

        if (connectionsError) {
          console.error('Error fetching connections:', connectionsError);
          return;
        }

        const { data: requestsAll, error: requestsError } = await supabase
          .from('connection_requests')
          .select("*")
          .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`);

        if (requestsError) {
          console.error('Error fetching connection requests:', requestsError);
          return;
        }

        const connectIds: string[] = (connections || []).map(conn => {
          if (conn.user1_id?.user_id === user?.id) return conn.user2_id?.user_id;
          if (conn.user2_id?.user_id === user?.id) return conn.user1_id?.user_id;
          return null;
        }).filter(Boolean);

        const requestIds: string[] = (requestsAll || []).map(req => {
          if (req.sender_id === user?.id) return req.receiver_id;
          if (req.receiver_id === user?.id) return req.sender_id;
          return null;
        }).filter(Boolean);

        connectedUserIds.push(...connectIds, ...requestIds);

        const { data: playerRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'player');

        if (rolesError) {
          console.error('Error fetching player roles:', rolesError);
          return;
        }

        if (!playerRoles || playerRoles.length === 0) {
          setPlayers([]);
          return;
        }

        const playerUserIds = playerRoles
          ?.map(role => role?.user_id)
          ?.filter(id => id !== user?.id && !connectedUserIds.includes(id));

        const { data, error } = await supabase
          .from('profiles')
          .select(`
            user_id,
            display_name,
            username,
            avatar_url,
            bio,
            location,
            playing_experience,
            preferred_play_style
          `)
          .in('user_id', playerUserIds);

        if (error) {
          console.error('Error fetching players:', error);
          return;
        }

        const transformedPlayers: Player[] = (data || []).map((profile) => ({
          id: profile?.user_id,
          name: profile.display_name || 'Player',
          level: profile.playing_experience || 'Beginner',
          location: profile.location || 'Location not specified',
          distance: "Unknown distance",
          rating: Math.floor(Math.random() * 1000) + 1200,
          playStyle: profile.preferred_play_style || 'All-round',
          image: profile.avatar_url || "/placeholder.svg"
        }));

        setPlayers(transformedPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && userProfile?.id) {
      fetchPlayers();
    }
  }, [user?.id, userProfile?.id]);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactRequest = (player: Player) => {
    if (canConnectWithPlayers(userMembership)) {
      setSelectedPlayer(player);
      setShowContactForm(true);
    } else {
      setSelectedPlayer(player);
      setShowContactRequestDialog(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: `Your connection request was sent to ${selectedPlayer?.name}`,
    });
    setShowContactForm(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <Box component="main" sx={{ flex: 1, py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 8 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ff7e00",
                    letterSpacing: "2px",
                    mb: 2,
                    textTransform: "uppercase",
                    fontFamily: '"Poppins", "Sora", sans-serif',
                  }}
                >
                  COMMUNITY
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "28px", md: "40px" },
                    fontWeight: 800,
                    color: "#1a365d",
                    mb: 2,
                    fontFamily: '"Poppins", "Sora", sans-serif',
                    textTransform: "uppercase",
                  }}
                >
                  CONNECT WITH PLAYERS
                </Typography>
                <Typography sx={{ fontSize: "16px", color: "#64748b", maxWidth: "600px" }}>
                  Find table tennis players near you to practice with and build your network
                </Typography>
              </Box>
              <Button
                onClick={() => navigate("/profile")}
                sx={{
                  background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "13px",
                  textTransform: "uppercase",
                  px: 3,
                  py: 1.5,
                  borderRadius: "10px",
                  cursor: "pointer",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ff6b00 0%, #ff8800 100%)",
                    boxShadow: "0 8px 20px rgba(255, 126, 0, 0.4)",
                  },
                }}
              >
                <User size={16} sx={{ mr: 1 }} /> CREATE YOUR PROFILE
              </Button>
            </Box>
          </motion.div>

          {/* My Requests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <MyRequestsLists />
          </motion.div>

          {/* Membership Banner */}
          {userMembership === "Free" && <MembershipBanner />}

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Search Section */}
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              {/* Players List */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
                  <CircularProgress sx={{ color: "#ff7e00" }} />
                </Box>
              ) : (
                <PlayersList
                  players={filteredPlayers}
                  userMembership={userMembership}
                  onContactRequest={handleContactRequest}
                />
              )}
            </Box>
          </motion.div>

          {/* Contact Form Modal */}
          {showContactForm && selectedPlayer && (
            <ContactForm
              player={selectedPlayer}
              onClose={() => setShowContactForm(false)}
              onSubmit={handleSendMessage}
            />
          )}

          {/* Contact Request Dialog */}
          {showContactRequestDialog && selectedPlayer && (
            <ConnectRequestModal
              player={selectedPlayer}
              onClose={() => setShowContactRequestDialog(false)}
              onSubmit={handleSendMessage}
            />
          )}

          {/* Upgrade Dialog */}
          <UpgradeDialog
            isOpen={showUpgradeDialog}
            onOpenChange={setShowUpgradeDialog}
            selectedPlayer={selectedPlayer}
          />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default SocialConnector;
