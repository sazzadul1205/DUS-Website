// Playground

// React
import React from 'react';
import { Head } from '@inertiajs/react';

//  layouts
import PublicLayout from '../layouts/PublicLayout';

const Playground = ({
  topbarData,
  navbarData,
  footerData,
  storageUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pageData,
}) => {


  return (
    <PublicLayout
      topBarData={topbarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="Playground" />


    </PublicLayout>
  );
};

export default Playground;