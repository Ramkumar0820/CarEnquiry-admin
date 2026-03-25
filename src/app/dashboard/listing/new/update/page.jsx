"use client";
import dynamic from 'next/dynamic';

const AddListing = dynamic(() => import('@/components/block/updateList'), {
  ssr: false 
});

export default function App(context) {
  

  const params = context.searchParams

  return (
    <div className="">
      <AddListing listingId={params.id} />
    </div>
  );
}
