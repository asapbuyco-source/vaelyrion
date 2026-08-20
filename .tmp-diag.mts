import { supabase } from './server/config/supabase';

const main = async () => {
  const { count: cats, error: e0 } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  console.log('categories:', cats, e0?.message || '');

  const { count: active, error: e1 } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active');
  console.log('products status=active:', active, e1?.message || '');

  const { count: withCat, error: e2 } = await supabase.from('products').select('*', { count: 'exact', head: true }).not('category_id', 'is', null);
  console.log('products with category_id:', withCat, e2?.message || '');

  const { data: catList } = await supabase.from('categories').select('id, name, slug');
  console.log('categories list:', JSON.stringify(catList?.slice(0, 10), null, 2));

  const { data: sample } = await supabase.from('products').select('id, name, slug, status, category_id, selling_price, created_at').limit(5);
  console.log('sample products:', JSON.stringify(sample, null, 2));

  const { data: orphans } = await supabase.from('products').select('id, name').is('category_id', null).limit(5);
  console.log('products with NULL category_id:', orphans?.length);

  const { data: withCatData } = await supabase.from('products').select('id, name').not('category_id', 'is', null).limit(5);
  console.log('products with category_id (sample):', withCatData?.length);
};
main();