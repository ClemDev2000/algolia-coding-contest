import { ReactNode } from 'react';
import { Configure, Index } from 'react-instantsearch-core';

export function ConfigureIndexProducts({ children }: { children: ReactNode }) {
  return (
    <Index indexName={process.env.NEXT_PUBLIC_INDEX_PRODUCTS}>
      <Configure hitsPerPage={200} />
      {children}
    </Index>
  );
}
