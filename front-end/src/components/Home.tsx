import { useMemo, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import Order from "./Order";
import Switch from "./Switch";
import OrderItems from "./OrderItems";
import Map from "./Map";
import Select from "./Select";
import { Order as OrderType, type PaginatedResponse } from "../types/api.types";
import { BASE_API_URL, SORT_OPTIONS, sortOrders } from "../utils";
import { SortKey } from "../types/types";

const Home = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number>(1);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [hasUndeliveredOrdersFilter, setHasUndeliveredOrdersFilter] =
    useState<boolean>(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    dataUpdatedAt
  } = useInfiniteQuery({
    queryKey: ["orders", { filter: hasUndeliveredOrdersFilter }],
    queryFn: ({ pageParam = 1, queryKey }) => {
      const lastFetchedAt: string = String(dataUpdatedAt)

      return fetchPage({ pageParam, queryKey, lastFetchedAt })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next?.page || undefined,
    getPreviousPageParam: (firstPage) => firstPage.previous?.page || undefined,
    refetchInterval: INTERVAL_MS,
  });

  const flattenOrders: OrderType[] = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data?.pages],
  );

  const sortedOrders = useMemo(() => sortOrders(flattenOrders, sortKey), [flattenOrders, sortKey]);

  const selectedOrder = useMemo(() => flattenOrders.find((order) => order.id === selectedOrderId), [flattenOrders, selectedOrderId]);

  if (isLoading) return <>Loading...</>;

  if (isError) return <div>Error Fetching Data</div>;

  return (
    <div className="flex border p-2 gap-2">
      <div className="flex flex-col grow w-full max-h-[90vh] ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Select
              id="sortKey"
              options={SORT_OPTIONS}
              value={sortKey || ""}
              onChange={(e) =>
                setSortKey(e.target.value ? (e.target.value as SortKey) : null)
              }
              label="Sort By:"
            />
          </div>

          <Switch
            onToggle={(checked: boolean) =>
              setHasUndeliveredOrdersFilter(checked)
            }
            isChecked={hasUndeliveredOrdersFilter}
            label="Show only undelivered orders"
          />
        </div>

        <ul className="flex flex-col overflow-y-scroll ">
          {sortedOrders.map(({ id, title, orderTime, status }) => (
            <li
              key={id}
              className={`w-full ${selectedOrderId === id
                ? "bg-blue-300"
                : "bg-gray-200 hover:bg-opacity-0"
                }`}>
              <Order
                id={id}
                title={title}
                orderTime={orderTime}
                status={status}
                onOrderClick={() => setSelectedOrderId(id)}
                className="w-full flex flex-col items-start text-left p-2"
              />
            </li>
          ))}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className={`py-2 px-4 rounded-lg font-semibold w-10${isFetchingNextPage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:outline-none"
                }`}>
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </button>
          )}
        </ul>
      </div>

      <div className="grow flex flex-col w-full">
        <div className="flex grow w-full h-full">
          <OrderItems subItems={selectedOrder?.subItems || []} />
        </div>

        <div className="flex grow w-full h-full">
          <Map
            lat={selectedOrder?.location.lat ?? 1}
            lng={selectedOrder?.location.lng ?? 1}
          />
        </div>
      </div>
    </div>
  );
};

const fetchPage = async ({
  pageParam = 1,
  queryKey,
  lastFetchedAt
}: {
  pageParam: number;
  queryKey: (string | {
    filter: boolean;
  })[];
  lastFetchedAt: string;

}): Promise<PaginatedResponse> => {

  const { filter } = queryKey[1] as {
    filter: boolean;
  }

  const url = new URL(`${BASE_API_URL}/orders`);

  const params: Record<string, string> = {
    page: pageParam.toString(),
    limit: "10",
    lastFetchedAt,
    ...(filter && {
      filter: "notDelivered",
    }),
  };

  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString());

  if (!response.ok) throw new Error("Error fetching data");

  return response.json();
};

const INTERVAL_MS = 8000;

export default Home;
