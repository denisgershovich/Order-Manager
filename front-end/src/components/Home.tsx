import { useMemo, useState } from "react";

import clsx from "clsx";
import { useInfiniteQuery } from "@tanstack/react-query";

import Order from "./Order";
import Switch from "./Switch";
import OrderItems from "./OrderItems";
import Map from "./Map";
import Select from "./Select";
import { OrderStatus, Order as OrderType, type PaginatedResponse } from "../types/api.types";
import { BASE_API_URL, SORT_OPTIONS, sortOrders } from "../utils";
import { SortKey } from "../types/types";
import { Button } from "./ui/button";

const Home = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number>(1);
  const [sortKey, setSortKey] = useState<SortKey>(SortKey.Default);
  const [hasUndeliveredOrdersFilter, setHasUndeliveredOrdersFilter] =
    useState<boolean>(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["orders", { filter: hasUndeliveredOrdersFilter }],
    queryFn: ({ pageParam = 1, queryKey }) => fetchPage({ pageParam, queryKey }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next?.page,
    getPreviousPageParam: (firstPage) => firstPage.previous?.page,
    refetchInterval: INTERVAL_MS,
  });

  const flattenOrders: OrderType[] = useMemo(() => data?.pages.flatMap((page) => page.results) || [], [data?.pages]);

  const sortedOrders = useMemo(() => sortOrders(flattenOrders, sortKey), [flattenOrders, sortKey]);

  const selectedOrder = useMemo(() => flattenOrders.find((order) => order.id === selectedOrderId), [flattenOrders, selectedOrderId]);

  if (isLoading) return <>Loading...</>;

  if (isError) return <div>Error Fetching Data</div>;

  return (
    <section className="flex-grow overflow-auto flex p-4 gap-2 max-h-full">
      <div className="flex flex-col gap-1 grow w-full h-full">
        <div className="flex items-center justify-between">
          <Select
            id="sortKey"
            options={SORT_OPTIONS}
            value={sortKey}
            onChange={(value) => setSortKey(value)}
            label="Sort By:"
            className="flex items-center"
          />

          <Switch
            onToggle={(checked: boolean) =>
              setHasUndeliveredOrdersFilter(checked)
            }
            isChecked={hasUndeliveredOrdersFilter}
            label="Show only undelivered orders"
          />
        </div>

        <ul className="flex flex-col overflow-y-scroll p-2 rounded-lg w-full gap-2 ">
          {sortedOrders.map(({ id, title, orderTime, status }) => (
            <Order
              key={id}
              id={id}
              title={title}
              orderTime={orderTime}
              status={OrderStatus[status as keyof typeof OrderStatus]}
              onOrderClick={() => setSelectedOrderId(id)}
              className={clsx(
                "w-full hover:bg-gray-200 flex justify-between items-start text-left p-2 rounded-lg shadow",
                selectedOrderId === id && "!bg-gray-300",
              )}
            />
          ))}

          {hasNextPage && (
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          )}
        </ul>
      </div>

      <div className="grow flex flex-col w-full">
        <OrderItems
          className="flex flex-col grow w-full h-full py-1.5"
          subItems={selectedOrder?.subItems || []}
        />

        <div className="flex grow w-full h-full">
          <Map
            lat={selectedOrder?.location.lat ?? 1}
            lng={selectedOrder?.location.lng ?? 1}
          />
        </div>
      </div>
    </section>
  );
};

const fetchPage = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam: number;
  queryKey: (string | {
    filter: boolean;
  })[];
}): Promise<PaginatedResponse> => {
  const { filter } = queryKey[1] as {
    filter: boolean;
  }

  const url = new URL(`${BASE_API_URL}/orders`);

  const params: Record<string, string> = {
    page: pageParam.toString(),
    limit: "10",
    ...(filter && {
      filter: "notDelivered",
    }),
  };

  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString());

  if (!response.ok) throw new Error("Error fetching data");

  return response.json();
};

const INTERVAL_MS = 10000;

export default Home;
