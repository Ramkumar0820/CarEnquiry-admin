"use client"

const DemoPage = (context) => {

  const params = context.searchParams


  return (
    <div>
      {params.id}
    </div>
  );
};

export default DemoPage;
