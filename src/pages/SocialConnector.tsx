
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
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

// Mock user membership - In a real app, this would come from your auth context
const userMembership: MembershipType = "Free"; // Set to "Free", "Advanced", or "Pro" for testing

const SocialConnector = () => {
  const {user, userProfile} = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showContactRequestDialog, setShowContactRequestDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

//   console.log({user})

  // Fetch players with "player" role from Supabase
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);

        const connectedUserIds = [];
        // First get all user IDs with player role
        const { data: connections, error: connectionsError } = await supabase
            .from('connections')
            .select('user1_id: user1_id (user_id), user2_id: user2_id (user_id)')
            .or(`user1_id.eq.${userProfile?.id},user2_id.eq.${userProfile?.id}`);

            // console.log({connections})
        if (connectionsError) {
          console.error('Error fetching connections:', connectionsError);
          return;
        }

        if (connectionsError) {
          console.error('Error fetching connections:', connectionsError);
          return;
        }

        const { data: requestsAll, error: requestsError } = await supabase
            .from('connection_requests')
            .select("*")
            .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`);
            // .select('user1_id: user1_id (user_id), user2_id: user2_id (user_id)')
 
            // console.log({requestsAll})

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

        // console.log({ playerRoles }); 
    const playerUserIds = playerRoles
        ?.map(role => role?.user_id)
        ?.filter(
            id =>
                id !== user?.id &&
                !connectedUserIds.includes(id)
        );


    //    const playerUserIds = playerRoles
    //     ?.filter(role => role?.user_id !== user?.id)
    //     ?.map(role => role?.user_id); 
    //     console.log({playerUserIds})

        // Then get profiles for those users
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

        //   console.log({data})

        if (error) {
          console.error('Error fetching players:', error);
          return;
        }

        // console.log({data})

        // Transform data to Player format
        const transformedPlayers: Player[] = (data || []).map((profile, index) => ({
          id: profile?.user_id,
          name: profile.display_name || 'Player',
          level: profile.playing_experience || 'Beginner',
          location: profile.location || 'Location not specified',
          distance: "Unknown distance",
          rating: Math.floor(Math.random() * 1000) + 1200, // Random rating for now
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
  }, [ user?.id, userProfile?.id]);

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactRequest = (player: Player) => {
    // Check if user has required membership
    if (canConnectWithPlayers(userMembership)) {
      setSelectedPlayer(player);
      setShowContactForm(true);
    } else {
        setSelectedPlayer(player);
        setShowContactRequestDialog(true);
        // setShowContactForm(true);
        // Show upgrade dialog for free users
    //   setShowUpgradeDialog(true);
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-tt-blue">Connect with Players</h1>
            <p className="text-muted-foreground mt-2">Find table tennis players near you to practice with</p>
          </div>
          <Button className="bg-tt-orange text-white hover:bg-orange-600">
            <User className="mr-2 h-4 w-4" /> Create Your Profile
          </Button>
        </div>

        <MyRequestsLists />

        {userMembership === "Free" && <MembershipBanner />}

        <div className="flex flex-col space-y-6">
          {/* Search and filter section */}
          <SearchAndFilters 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          {/* Players list */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading players...</p>
            </div>
          ) : (
            <PlayersList 
              players={filteredPlayers} 
              userMembership={userMembership} 
              onContactRequest={handleContactRequest} 
            />
          )}

          {/* Contact form modal */}
          {showContactForm && selectedPlayer && (
            <ContactForm 
              player={selectedPlayer} 
              onClose={() => setShowContactForm(false)} 
              onSubmit={handleSendMessage}
            />
          )}

          {showContactRequestDialog && selectedPlayer && (
            <ConnectRequestModal 
              player={selectedPlayer} 
              onClose={() => setShowContactRequestDialog(false)} 
              onSubmit={handleSendMessage}
            />
          )}

          {/* Upgrade membership dialog */}
          <UpgradeDialog 
            isOpen={showUpgradeDialog} 
            onOpenChange={setShowUpgradeDialog} 
            selectedPlayer={selectedPlayer}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialConnector;
