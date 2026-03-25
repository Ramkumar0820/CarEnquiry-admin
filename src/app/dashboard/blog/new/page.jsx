"use client"
import dynamic from 'next/dynamic';

const AddBlog = dynamic(() => import('@/components/block/addBlog'), {
  ssr: false 
});

export default function App() {
  return (
    <div className="">
      <AddBlog></AddBlog>
    </div>
  );
}