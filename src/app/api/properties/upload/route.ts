import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const location = formData.get('location') as string;
    const bedrooms = parseInt(formData.get('bedrooms') as string);
    const bathrooms = parseInt(formData.get('bathrooms') as string);
    const video_url = formData.get('video_url') as string;
    const user_id = formData.get('user_id') as string;
    const files = formData.getAll('images') as File[];

    const image_urls: string[] = [];

    for (const file of files) {
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
      }

      const url = supabase.storage
        .from('property-images')
        .getPublicUrl(filename).data.publicUrl;

      image_urls.push(url);
    }

    const { data: insertData, error: insertError } = await supabase
      .from('properties')
      .insert([
        {
          title,
          description,
          price,
          location,
          bedrooms,
          bathrooms,
          video_url,
          image_urls,
          user_id,
          status: 'pending'
        }
      ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Property insert failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Property uploaded successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
