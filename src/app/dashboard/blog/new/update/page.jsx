"use client";
import dynamic from 'next/dynamic';

const UpdateBlog = dynamic(() => import('@/components/block/updateBlog'), {
  ssr: false 
});

export default function App(context) {
  

  const params = context.searchParams

  return (
    <div className="">
      <UpdateBlog BlogId={params.id} />
    </div>
  );
}
