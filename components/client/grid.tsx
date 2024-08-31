'use client';
import { SelectDocuments } from '@/lib/schema/documents';
import { capitalize } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import DocCard from './docCard';

type GridProps = {
  data: SelectDocuments[];
};

const Grid: FC<GridProps> = ({ data }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(300px,2fr))'
      }}
      className="bg-white gap-4"
    >
      {data.length === 0 ? (
        <div className="text-center font-bold sm:text-[1vw] p-4">No Items</div>
      ) : (
        data.map((item, index) => <DocCard {...item} key={item.id} />)
      )}
    </div>
  );
};

export default Grid;
