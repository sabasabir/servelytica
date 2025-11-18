// import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/integrations/supabase/client';
// import React, { useState, useEffect, useRef } from 'react';

// const ChatPage = () => {
//   const {user: userData, userProfile: user} = useAuth();
// //   const {user} = useAuth();
//   const [activeChat, setActiveChat] = useState(null);
//   const [chats, setChats] = useState([]);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [connectedPlayers, setConnectedPlayers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
// //   const [user, setUser] = useState(null);
//   const messagesEndRef = useRef(null);

//     //  console.log({chats})

// //   console.log({user, userData})

//   // Fetch user profile on component mount
// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (user) {
// //         const { data: profile } = await supabase
// //           .from('profiles')
// //           .select('*')
// //           .eq('id', user.id)
// //           .single();
// //         setUser(profile);
// //       }
// //     };
// //     fetchUser();
// //   }, []);

//   // Fetch user's connections and chat rooms
//   useEffect(() => {
//     const fetchConnectionsAndChats = async () => {
//       if (!user) return;
      
//       // Fetch connections
//       const { data: connections } = await supabase
//         .from('connections')
//         .select(`
//           id,
//           user1:profiles!user1_id(*),
//           user2:profiles!user2_id(*)
//         `)
//         .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
//         .eq('status', 'active');

     

//       setConnectedPlayers(connections || []);

//       // Fetch chat rooms user is participating in
//       const { data: chatParticipants } = await supabase
//         .from('chat_participants')
//         .select(`
//           chat_room_id,
//           chat_rooms (
//             id,
//             name,
//             type_id,
//             chat_types (name),
//             messages (id, content, created_at, sender_id),
//             direct_chat_connections (connection_id)
//           )
//         `)
//         .eq('user_id', user.id);

//         // console.log({chatParticipants})

//       const formattedChats = (chatParticipants || []).map(participant => {
//         const chat = participant.chat_rooms; 
//         let chatName = chat.name;
//         let chatImage = null;
        
//         // For direct chats, get the other participant's name
//         if (chat.chat_types.name === 'direct') {
//             const connection = connections.find(c => c.id === chat.direct_chat_connections?.connection_id);
            
//             if (connection) {
//             //   console.log({connection, user})
//             const otherUser = connection.user1.id === user.id ? connection.user2 : connection.user1;
//             chatName = otherUser.full_name || otherUser.username;
//             chatImage = otherUser.avatar_url;
//           }
//         }
        
//         return {
//           id: chat.id,
//           name: chatName,
//           type: chat.chat_types.name,
//           image: chatImage,
//           lastMessage: chat.messages.length > 0 ? chat.messages[0] : null
//         };
//       });

      

//       setChats(formattedChats);
//     };

//     fetchConnectionsAndChats();
//   }, [user]);

//   // Fetch messages for active chat
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!activeChat) return;
      
//       const { data } = await supabase
//         .from('messages')
//         .select(`
//           id,
//           content,
//           created_at,
//           sender_id,
//           profiles (username, avatar_url)
//         `)
//         .eq('chat_room_id', activeChat.id)
//         .order('created_at', { ascending: true });

        
//         // console.log({messages: data, activeChat})

//       setMessages(data || []);
//     };

//     fetchMessages();

//     // Set up real-time subscription for new messages
//     const messageSubscription = supabase
//       .channel('messages')
//       .on('postgres_changes', {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'messages',
//         filter: `chat_room_id=eq.${activeChat?.id}`
//       }, payload => {
//         setMessages(prev => [...prev, payload.new]);
//       })
//       .subscribe();

//       console.log({messageSubscription})

//     return () => {
//       supabase.removeChannel(messageSubscription);
//     };
//   }, [activeChat]);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim() || !activeChat || !user) return;

//     const { error } = await supabase
//       .from('messages')
//       .insert([
//         {
//           content: message,
//           sender_id: user.id,
//           chat_room_id: activeChat.id,
//           message_type: 'text'
//         }
//       ]);

//     if (!error) {
//       setMessage('');
//     }
//   };

//   const filteredChats = chats.filter(chat => 
//     chat?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
//   );

//   const filteredPlayers = connectedPlayers.filter(player => {
//     const otherUser = player.user1_id === user.id ? player.user2 : player.user1;
//     return otherUser.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
//            otherUser.full_name?.toLowerCase().includes(searchTerm?.toLowerCase());
//   });

// //   console.log({filteredChats, filteredPlayers, searchTerm})


//   const createDirectChat = async (connectionId) => {
//     // Check if chat already exists for this connection
//     const { data: existingChat } = await supabase
//       .from('direct_chat_connections')
//       .select('chat_room_id')
//       .eq('connection_id', connectionId)
//       .single();

//     if (existingChat) {
//       setActiveChat(chats.find(chat => chat.id === existingChat.chat_room_id));
//       return;
//     }

//     // Create new chat room
//     const { data: chatRoom } = await supabase
//       .from('chat_rooms')
//       .insert([{ type_id: 1 }]) // 1 for direct chat
//       .select()
//       .single();

      
//       // Link to connection
//       await supabase
//       .from('direct_chat_connections')
//       .insert([{ chat_room_id: chatRoom.id, connection_id: connectionId }]);
      
//       // Add both users as participants
//       const connection = connectedPlayers.find(c => c.id === connectionId);
     
//       await supabase
//       .from('chat_participants')
//       .insert([
//           { chat_room_id: chatRoom.id, user_id: user.id },
//           { chat_room_id: chatRoom.id, user_id: connection?.user1?.id === user.id ? connection?.user2?.id : connection?.user1?.id }
//         ]);

//     // Update local state
//     const otherUser = connection.user1_id === user.id ? connection.user2 : connection.user1;
//     const newChat = {
//       id: chatRoom.id,
//       name: otherUser.full_name || otherUser.username,
//       type: 'direct',
//       image: otherUser.avatar_url
//     };

//     setChats(prev => [...prev, newChat]);
//     setActiveChat(newChat);
//   };

//   const createGroupChat = async (name, participantIds) => {
//     // Create new group chat room
//     const { data: chatRoom } = await supabase
//       .from('chat_rooms')
//       .insert([{ name, type_id: 2 }]) // 2 for group chat
//       .select()
//       .single();

//     // Add participants
//     const participants = participantIds.map(userId => ({
//       chat_room_id: chatRoom.id,
//       user_id: userId
//     }));
    
//     // Add creator as admin
//     participants[0].role = 'admin';
    
//     await supabase
//       .from('chat_participants')
//       .insert(participants);

//     // Update local state
//     const newChat = {
//       id: chatRoom.id,
//       name,
//       type: 'group'
//     };

//     setChats(prev => [...prev, newChat]);
//     setActiveChat(newChat);
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/3 lg:w-1/4 border-r border-gray-200 bg-white flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
//           <div className="mt-4 relative">
//             <input
//               type="text"
//               placeholder="Search chats or players..."
//               className="w-full p-2 pl-8 border border-gray-300 rounded-md"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <svg className="w-4 h-4 absolute left-2 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//             </svg>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {/* Chat list */}
//           <div className="p-2">
//             <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Chats</h3>
//             {filteredChats.map(chat => (
//               <div
//                 key={chat.id}
//                 className={`p-3 flex items-center rounded-md cursor-pointer mb-1 ${activeChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
//                 onClick={() => setActiveChat(chat)}
//               >
//                 <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
//                   {chat.image ? (
//                     <img src={chat.image} alt={chat.name} className="h-10 w-10 rounded-full" />
//                   ) : (
//                     chat.name?.charAt(0).toUpperCase()
//                   )}
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-gray-900">{chat.name}</p>
//                   {chat.lastMessage && (
//                     <p className="text-xs text-gray-500 truncate max-w-xs">
//                       {chat.lastMessage.sender_id === user.id ? 'You: ' : ''}
//                       {chat.lastMessage.content}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Connected players */}
//           <div className="p-2 border-t border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Connected Players</h3>
//             {filteredPlayers.map(player => {
//               const otherUser = player.user1_id === user.id ? player.user2 : player.user1;
//               return (
//                 <div
//                   key={player.id}
//                   className="p-3 flex items-center rounded-md cursor-pointer hover:bg-gray-50 mb-1"
//                   onClick={() => createDirectChat(player.id)}
//                 >
//                   <div className="flex-shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
//                     {otherUser.avatar_url ? (
//                       <img src={otherUser.avatar_url} alt={otherUser.username} className="h-10 w-10 rounded-full" />
//                     ) : (
//                       otherUser.username?.charAt(0).toUpperCase()
//                     )}
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm font-medium text-gray-900">{otherUser.full_name || otherUser.username}</p>
//                     <p className="text-xs text-gray-500">{otherUser.skill_level} • {otherUser.play_style}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col">
//         {activeChat ? (
//           <>
//             <div className="border-b border-gray-200 p-4 flex items-center bg-white">
//               <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
//                 {activeChat.image ? (
//                   <img src={activeChat.image} alt={activeChat.name} className="h-10 w-10 rounded-full" />
//                 ) : (
//                   activeChat.name?.charAt(0).toUpperCase()
//                 )}
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">{activeChat.name}</h2>
//                 <p className="text-xs text-gray-500">
//                   {activeChat.type === 'direct' ? 'Direct message' : 'Group chat'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//               {messages.map(msg => (
//                 <div
//                   key={msg.id}
//                   className={`flex mb-4 ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${msg.sender_id === user.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow'}`}
//                   >
//                     {msg.sender_id !== user.id && (
//                       <p className="text-xs font-medium">{msg.profiles.username}</p>
//                     )}
//                     <p>{msg.content}</p>
//                     <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
//                       {new Date(msg.created_at).toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="border-t border-gray-200 p-4 bg-white">
//               <form onSubmit={handleSendMessage} className="flex">
//                 <input
//                   type="text"
//                   placeholder="Type your message..."
//                   className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   Send
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center bg-gray-50">
//             <div className="text-center">
//               <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
//               </svg>
//               <h3 className="mt-4 text-lg font-medium text-gray-900">No chat selected</h3>
//               <p className="mt-2 text-sm text-gray-500">Select a chat from the sidebar or start a new conversation with a connected player.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


//! v2


import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect, useRef } from 'react';

const ChatPage = () => {
  const {user: userData, userProfile: user} = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);


  console.log({messages})

  // Fetch user's connections and chat rooms
  useEffect(() => {
    const fetchConnectionsAndChats = async () => {
      if (!user) return;
      
      // Fetch connections
      const { data: connections } = await supabase
        .from('connections')
        .select(`
          id,
          user1:profiles!user1_id(*),
          user2:profiles!user2_id(*)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active');

      setConnectedPlayers(connections || []);

      // Fetch chat rooms user is participating in
      const { data: chatParticipants } = await supabase
        .from('chat_participants')
        .select(`
          chat_room_id,
          chat_rooms (
            id,
            name,
            type_id,
            chat_types (name),
            messages (id, content, created_at, sender_id),
            direct_chat_connections (connection_id)
          )
        `)
        .eq('user_id', user.id);

      const formattedChats = (chatParticipants || []).map(participant => {
        const chat = participant.chat_rooms; 
        let chatName = chat.name;
        let chatImage = null;
        
        // For direct chats, get the other participant's name
        if (chat.chat_types.name === 'direct') {
            const connection = connections.find(c => c.id === chat.direct_chat_connections?.connection_id);
            
            if (connection) {
            const otherUser = connection.user1.id === user.id ? connection.user2 : connection.user1;
            chatName = otherUser.full_name || otherUser.username;
            chatImage = otherUser.avatar_url;
          }
        }
        
        return {
          id: chat.id,
          name: chatName,
          type: chat.chat_types.name,
          image: chatImage,
          lastMessage: chat.messages.length > 0 ? chat.messages[0] : null
        };
      });

      setChats(formattedChats);
    };

    fetchConnectionsAndChats();
  }, [user]);

  // Fetch messages for active chat
  const fetchMessages = async () => {
    if (!activeChat) return;
    
    console.log('📥 Fetching messages for chat:', activeChat.name, 'ID:', activeChat.id);

    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        sender_id,
        profiles (username, avatar_url)
      `)
      .eq('chat_room_id', activeChat.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching messages:', error);
    } else {
      console.log('📨 Fetched messages:', data?.length || 0, 'messages');
      console.log('📋 Messages data:', data);
    }

    setMessages(data || []);
  };

  useEffect(() => {
  fetchMessages();

  console.log('🔌 Setting up real-time subscription for chat:', activeChat?.id);
  
  if (!activeChat?.id) return; // Early return if no active chat
  
  console.log('❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥 Setting up real-time subscription for chat:', activeChat);


//   .channel(`messages:${activeChat.id}`) // Unique channel name
  const channel = supabase
    .channel(`messages`) // Unique channel name
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_room_id=eq.${activeChat.id}`
      },
      async (payload) => {
        console.log('📨 Real-time update received:', payload);
        setMessages((prev) => [...prev, {...payload?.new, profiles: {username: activeChat.name, avatar_url: user?.image}}]);
        // try {
        //   const { data: newMessage, error } = await supabase
        //     .from('messages')
        //     // .select(`
        //     //   id,
        //     //   content,
        //     //   created_at,
        //     //   sender_id,
        //     //   profiles (username, avatar_url)
        //     // `)
        //     .select(`
        //       *
        //     `)
        //     .eq('id', payload.new.id)
        //     .single();

        //   if (error) {
        //     console.error('Error fetching message details:', error);
        //     return;
        //   }

        //   if (newMessage) {
        //     console.log('✅ Adding new message to state:', newMessage);
        //     setMessages(prev => {
        //       // Prevent duplicates
        //       if (prev.some(msg => msg.id === newMessage.id)) {
        //         return prev;
        //       }
        //       return [...prev, newMessage];
        //     });
        //   }
        // } catch (err) {
        //   console.error('Error processing real-time update:', err);
        // }
      }
    )
    .subscribe((status) => {
      console.log('📡 Channel subscription status:', status);
    });

//     const channel = supabase
//   .channel('messages')
//   .on('system', { event: 'disconnect' }, () => console.log('❌ Disconnected'))
//   .on('system', { event: 'reconnect' }, () => console.log('🔁 Reconnected'))
//   .on('system', { event: 'error' }, (error) => console.error('❌ Channel error:', error))


  console.log('🧹 Cleaning up channel subscription', {channel});
 
  return () => {
    supabase.removeChannel(channel);
  };
}, [activeChat?.id]); // Use specific dependency




  
//   useEffect(() => {

//     fetchMessages();

//     console.log('🔌 Setting up real-time subscription for chat:', activeChat?.id);

//     // Set up real-time subscription for new messages - FIXED VERSION
//     const messageSubscription = supabase
//       .channel('messages')
//       .on('postgres_changes', {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'messages',
//         filter: `chat_room_id=eq.${activeChat?.id}`
//       }, async (payload) => {
//         // Fetch the complete message with profile data
//         const { data: newMessage, error:msgErr } = await supabase
//           .from('messages')
//           .select(`
//             id,
//             content,
//             created_at,
//             sender_id,
//             profiles (username, avatar_url)
//           `)
//           .eq('id', payload.new.id)
//           .single();
//           console.log({newMessage, msgErr})

//         if (newMessage) {
//           setMessages(prev => [...prev, newMessage]);
//         }
//       })
//       .subscribe();

//       console.log({messageSubscription})


//     return () => {
//       supabase.removeChannel(messageSubscription);
//     };
//   }, [activeChat]);



  // Scroll to bottom when new messages arrive
  
  
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

// !  messages submitting

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || !user) return;

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          content: message,
          sender_id: user.id,
          chat_room_id: activeChat.id,
          message_type: 'text'
        }
      ]); 

      console.log({error, data});
      fetchMessages();

    if (!error) {
      setMessage('');
    }
  };

  const filteredChats = chats.filter(chat => 
    chat?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const filteredPlayers = connectedPlayers.filter(player => {
    const otherUser = player.user1_id === user.id ? player.user2 : player.user1;
    return otherUser.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
           otherUser.full_name?.toLowerCase().includes(searchTerm?.toLowerCase());
  });

  const createDirectChat = async (connectionId) => {
    // Check if chat already exists for this connection
    const { data: existingChat } = await supabase
      .from('direct_chat_connections')
      .select('chat_room_id')
      .eq('connection_id', connectionId)
      .single();

    if (existingChat) {
      setActiveChat(chats.find(chat => chat.id === existingChat.chat_room_id));
      return;
    }

    // Create new chat room
    const { data: chatRoom } = await supabase
      .from('chat_rooms')
      .insert([{ type_id: 1 }]) // 1 for direct chat
      .select()
      .single();

    // Link to connection
    await supabase
      .from('direct_chat_connections')
      .insert([{ chat_room_id: chatRoom.id, connection_id: connectionId }]);
      
    // Add both users as participants
    const connection = connectedPlayers.find(c => c.id === connectionId);
     
    await supabase
      .from('chat_participants')
      .insert([
        { chat_room_id: chatRoom.id, user_id: user.id },
        { chat_room_id: chatRoom.id, user_id: connection?.user1?.id === user.id ? connection?.user2?.id : connection?.user1?.id }
      ]);

    // Update local state
    const otherUser = connection.user1_id === user.id ? connection.user2 : connection.user1;
    const newChat = {
      id: chatRoom.id,
      name: otherUser.full_name || otherUser.username,
      type: 'direct',
      image: otherUser.avatar_url
    };

    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat);
  };

  const createGroupChat = async (name, participantIds) => {
    // Create new group chat room
    const { data: chatRoom } = await supabase
      .from('chat_rooms')
      .insert([{ name, type_id: 2 }]) // 2 for group chat
      .select()
      .single();

    // Add participants
    const participants = participantIds.map(userId => ({
      chat_room_id: chatRoom.id,
      user_id: userId
    }));
    
    // Add creator as admin
    participants[0].role = 'admin';
    
    await supabase
      .from('chat_participants')
      .insert(participants);

    // Update local state
    const newChat = {
      id: chatRoom.id,
      name,
      type: 'group'
    };

    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 lg:w-1/4 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search chats or players..."
              className="w-full p-2 pl-8 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-2 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Chat list */}
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Chats</h3>
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`p-3 flex items-center rounded-md cursor-pointer mb-1 ${activeChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {chat.image ? (
                    <img src={chat.image} alt={chat.name} className="h-10 w-10 rounded-full" />
                  ) : (
                    chat.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{chat.name}</p>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {chat.lastMessage.sender_id === user.id ? 'You: ' : ''}
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Connected players */}
          <div className="p-2 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Connected Players</h3>
            {filteredPlayers.map(player => {
              const otherUser = player.user1_id === user.id ? player.user2 : player.user1;
              return (
                <div
                  key={player.id}
                  className="p-3 flex items-center rounded-md cursor-pointer hover:bg-gray-50 mb-1"
                  onClick={() => createDirectChat(player.id)}
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {otherUser.avatar_url ? (
                      <img src={otherUser.avatar_url} alt={otherUser.username} className="h-10 w-10 rounded-full" />
                    ) : (
                      otherUser.username?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{otherUser.full_name || otherUser.username}</p>
                    {/* <p className="text-xs text-gray-500">{otherUser.skill_level} • {otherUser.play_style}</p> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center bg-white">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {activeChat.image ? (
                  <img src={activeChat.image} alt={activeChat.name} className="h-10 w-10 rounded-full" />
                ) : (
                  activeChat.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{activeChat.name}</h2>
                <p className="text-xs text-gray-500">
                  {activeChat.type === 'direct' ? 'Direct message' : 'Group chat'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${msg.sender_id === user.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow'}`}
                  >
                    {/* {msg.sender_id !== user.id && (
                      <p className="text-xs font-medium">{msg.profiles.username}</p>
                    )} */}
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No chat selected</h3>
              <p className="mt-2 text-sm text-gray-500">Select a chat from the sidebar or start a new conversation with a connected player.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;