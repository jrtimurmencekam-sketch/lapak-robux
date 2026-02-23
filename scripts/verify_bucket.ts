import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgwlnyjbgkmbfnoaprtc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnd2xueWpiZ2ttYmZub2FwcnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTUwNTIsImV4cCI6MjA4NzMzMTA1Mn0.TCT_l1Id6R605AmxhTd7yhG4Yp2RoxO3Z0e56zA0yq8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching buckets...');
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  
  const paymentBucket = data?.find(b => b.name === 'payment_proofs');
  
  if (!paymentBucket) {
     console.log('Creating payment_proofs bucket as public...');
     // Note: anon key might not have permission to create buckets unless RLS allows it
     // This often requires service_role key.
     const { data: cd, error: ce } = await supabase.storage.createBucket('payment_proofs', { public: true });
     console.log('Create result:', cd, ce);
  } else {
     console.log('payment_proofs bucket exists. is public?', paymentBucket.public);
     if (!paymentBucket.public) {
       console.log('Updating to public...');
       const { data: ud, error: ue } = await supabase.storage.updateBucket('payment_proofs', { public: true });
       console.log('Update result:', ud, ue);
     }
  }
}
run();
