import React, { useEffect, useState } from 'react';
import { supabase, auth } from '@/lib/supabase';

const AuthDebug: React.FC = () => {
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    const checkEverything = async () => {
      try {
        // Check session
        const session = await auth.getSession();
        setStatus((prev: any) => ({ ...prev, session: session ? 'Found' : 'None' }));

        // Check user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        setStatus((prev: any) => ({ 
          ...prev, 
          authUser: user ? user.email : 'None',
          authError: userError?.message 
        }));

        // Check profile
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setStatus((prev: any) => ({ 
            ...prev, 
            profile: profile ? 'Found' : 'Not Found',
            profileError: profileError?.message 
          }));
        }

        // Check permissions function
        const { data: perms, error: permError } = await supabase.rpc('get_user_permissions', {
          user_uuid: user?.id || '00000000-0000-0000-0000-000000000000'
        });
        
        setStatus((prev: any) => ({ 
          ...prev, 
          permissions: perms?.length || 0,
          permError: permError?.message 
        }));

      } catch (err: any) {
        setStatus((prev: any) => ({ ...prev, error: err.message }));
      }
    };

    checkEverything();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      <div className="bg-white p-6 rounded-lg">
        <pre className="text-sm">{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AuthDebug;
