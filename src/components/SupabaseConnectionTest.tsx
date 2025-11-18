import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [testData, setTestData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Check if we can get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setErrorMessage(`Session error: ${sessionError.message}`);
          setConnectionStatus('error');
          return;
        }
        
        console.log('Session test passed:', session);
        
        // Test 2: Try to fetch from a table (profiles is usually safe)
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        
        if (fetchError) {
          // It's okay if we get permission denied - it means connection works
          if (fetchError.message.includes('permission') || fetchError.message.includes('denied')) {
            console.log('Connection successful (permission denied is expected when not logged in)');
            setConnectionStatus('connected');
            setTestData({ message: 'Connected but requires authentication' });
          } else {
            setErrorMessage(`Fetch error: ${fetchError.message}`);
            setConnectionStatus('error');
          }
        } else {
          setConnectionStatus('connected');
          setTestData(data);
          console.log('Fetched data:', data);
        }
        
        // Test 3: Check if realtime is working
        const channel = supabase.channel('test-channel');
        channel.on('presence', { event: 'sync' }, () => {
          console.log('Realtime connection established');
        });
        
        channel.subscribe((status) => {
          console.log('Channel subscription status:', status);
        });
        
        // Clean up
        setTimeout(() => {
          channel.unsubscribe();
        }, 2000);
        
      } catch (error: any) {
        setErrorMessage(`Connection error: ${error.message}`);
        setConnectionStatus('error');
        console.error('Supabase connection error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: connectionStatus === 'connected' ? '#10b981' : connectionStatus === 'error' ? '#ef4444' : '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
        Supabase Connection Test
      </h3>
      <div style={{ fontSize: '14px' }}>
        <p>Status: <strong>{connectionStatus}</strong></p>
        {errorMessage && (
          <p style={{ marginTop: '5px', fontSize: '12px' }}>
            Error: {errorMessage}
          </p>
        )}
        {testData && (
          <p style={{ marginTop: '5px', fontSize: '12px' }}>
            {JSON.stringify(testData).substring(0, 100)}...
          </p>
        )}
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;