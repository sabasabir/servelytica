import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyRequestsLists = () => {
  const {user: currentAuthUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentAuthUser?.id) {
      fetchConnectionRequests();
    }
  }, [currentAuthUser?.id, activeTab]);


  const fetchConnectionRequests = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'received') {
        const response = await fetch(`/api/connection-requests/received/${currentAuthUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch received requests');
        const data = await response.json();
        setReceivedRequests(data || []);

      } else if(activeTab === 'sent') {
        const response = await fetch(`/api/connection-requests/sent/${currentAuthUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch sent requests');
        const data = await response.json();
        setSentRequests(data || []);
      } else {
        //  for connections getting
        const response = await fetch(`/api/connections/${userProfile?.id}`);
        if (!response.ok) throw new Error('Failed to fetch connections');
        const data = await response.json();
        setConnections(data || []);
      }
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId, userProfileId) => {
    try {
      // Create connection
      const connResponse = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user1Id: userProfile?.id,
          user2Id: userProfileId,
        }),
      });

      if (!connResponse.ok) throw new Error('Failed to create connection');

      // Delete connection request
      const delResponse = await fetch(`/api/connection-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (!delResponse.ok) throw new Error('Failed to delete request');

      // Refresh the requests list
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/connection-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to reject request');

      // Refresh the requests list
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/connection-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel request');

      // Refresh the requests list
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error cancelling request:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Connection Requests</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received Requests
            {receivedRequests.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {receivedRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent Requests
            {sentRequests.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {sentRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'connections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Connections
            {sentRequests.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {sentRequests.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'connections' && connections.length > 0 ? (
            connections.map((request) => (
              <RequestCard 
                key={request.id}
                request={request}
                type="connections"
                formatDate={formatDate}
              />
            ))) : null
        }

        {activeTab === 'received' ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map((request) => (
              <RequestCard 
                key={request.id}
                request={request}
                type="received"
                onAccept={(userProfileId) => handleAcceptRequest(request.id, userProfileId)}
                onReject={() => handleRejectRequest(request.id)}
                formatDate={formatDate}
              />
            ))
          ) : (
            <EmptyState message="No received requests" />
          )
        ) : (
          sentRequests.length > 0 ? (
            sentRequests.map((request) => (
              <RequestCard 
                key={request.id}
                request={request}
                type="sent"
                onCancel={() => handleCancelRequest(request.id)}
                formatDate={formatDate}
              />
            ))
          ) : (
            <EmptyState message="No sent requests" />
          )
        )}
      </div>
    </div>
  );
};

const RequestCard = ({ request, type, onAccept, onReject, onCancel, formatDate }: any) => {
    const [currProfile, setCurrProfile] = useState(null);
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    const profile = type === 'received' ? request?.sender : request?.receiver;

    // console.log({currProfile, userProfile})

    useEffect(() => {
        // if (request?.receiver_id) {
        if (request?.id) {
            const fetchReceiverProfile = async () => {
                // console.log(type === 'connections' ? 'id' : 'user_id', type === 'received' ? request.sender_id : type === 'sent' ? request.receiver_id : request.user1_id === userProfile?.id ? request.user2_id : request.user1_id)
                try {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq(type === 'connections' ? 'id' : 'user_id', type === 'received' ? request.sender_id : type === 'sent' ? request.receiver_id : request.user1_id === userProfile?.id ? request.user2_id : request.user1_id)
                        .single();
                    if (!error && profile) {
                        setCurrProfile(profile);
                    }
                } catch (err) {
                    console.error('Error fetching receiver profile:', err);
                }
            };
            fetchReceiverProfile();
        }
    }, [request, type]);

    // Extra body for connections type
    const ConnectionsBody = () => (
        <div className="p-4">
            <div className="flex justify-between items-center mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                </span>
                <span className="text-xs text-gray-500">{formatDate(request.connection_date)}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{profile?.rating || 'N/A'}</span>
                </div>
                <button
                    onClick={() => navigate('/chat')}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Message
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            {/* Card Header */}
            <div className="flex items-center p-4 border-b border-gray-100">
                <div className="flex-shrink-0 mr-4">
                    {currProfile?.avatar_url || request?.receiver?.avatar_url ? (
                        <img
                            src={currProfile?.avatar_url || request?.receiver?.avatar_url}
                            alt={currProfile?.full_name || request?.receiver?.username}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                            {(currProfile?.display_name || request?.receiver?.display_name)?.charAt(0)?.toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">{currProfile?.display_name || request?.receiver?.display_name}</h3>
                </div>
            </div>

            {/* Card Body */}
            {type === 'connections' ? (
                <ConnectionsBody />
            ) : (
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : request.status === 'accepted'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(request.created_at)}</span>
                    </div>

                    {request.message && user?.id !== request?.sender_id && (
                        <p className="text-sm text-gray-600 mb-4 italic">"{request.message}"</p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{profile?.rating || 'N/A'}</span>
                        </div>

                        {request.status === 'accepted' && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Message
                                </button>
                            </div>
                        )}

                        {type === 'received' && request.status === 'pending' && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onAccept(currProfile?.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={onReject}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                        {type === 'sent' && request.status === 'pending' && (
                            <button
                                onClick={onCancel}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel Request
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const EmptyState = ({ message }) => (
  <div className="col-span-full py-12 text-center">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">{message}</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by searching for players to connect with.</p>
    <div className="mt-6">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => window.location.href = '/players'}
      >
        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Browse Players
      </button>
    </div>
  </div>
);

export default MyRequestsLists;