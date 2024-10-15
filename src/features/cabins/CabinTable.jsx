import { useCabins } from 'features/cabins/useCabins';
import { useSearchParams } from 'react-router-dom';
import { Suspense } from 'react';
import CabinRow from 'features/cabins/CabinRow';
import Spinner from 'ui/Spinner';
import Table from 'ui/Table';
import Menus from 'ui/Menus';
import Empty from 'ui/Empty';

// v1
// const TableHeader = styled.header`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;

//   background-color: var(--color-grey-50);
//   border-bottom: 1px solid var(--color-grey-100);
//   text-transform: uppercase;
//   letter-spacing: 0.4px;
//   font-weight: 600;
//   color: var(--color-grey-600);
//   padding: 1.6rem 2.4rem;
// `;


export default function CabinTable() {
  const { cabins } = useCabins();
  const [searchParams] = useSearchParams();

  // if (isLoading) return <Spinner />;
  // if (!cabins) return <Empty resource={'cabins'} />;

  // 1) Filter
  const filterValue = searchParams.get('discount') || 'all';

  let filteredCabins;
  if (filterValue === 'all') {
    filteredCabins = cabins;
  } else if (filterValue === 'no-discount') {
      filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  } else if (filterValue === 'with-discount') {
      filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  }

  // 2) SortBy
  const sortBy = searchParams.get('sortBy') || 'startDate-asc';
  const [field, direction] = sortBy.split('-');
  const modifier = direction === 'asc' ? 1 : -1;

  // .sort((a, b) => a[field].localeCompare(b[field]) * modifier);

  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns='9.6rem 0.8fr 2fr 1fr 1fr 3.2rem'>
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        {/* {cabins.map((cabin) => (
            <CabinRow key={cabin.id} cabin={cabin} />
          ))} */}

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}