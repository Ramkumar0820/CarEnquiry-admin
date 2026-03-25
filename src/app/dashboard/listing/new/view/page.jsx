'use client';
import dynamic from 'next/dynamic';

const ViewList = dynamic(() => import('@/components/block/viewList'), {
  ssr: false 
});

export default function App(context) {
  

  const params = context.searchParams

  return (
    <div className="">
      <ViewList listingId={params.id} />
    </div>
  );
}
