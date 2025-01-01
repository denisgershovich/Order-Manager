import { useMemo, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import Order from "./Order";
import Switch from "./Switch";
import OrderItems from "./OrderItems";
import Map from "./Map";
import Select from "./Select";
import { Order as OrderType, type PaginatedResponse } from "../types/api.types";

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
  } = useInfiniteQuery({
    queryKey: ["orders", { filter: hasUndeliveredOrdersFilter }],
    queryFn: ({ pageParam = 1, queryKey }) =>
      fetchPage({ pageParam, queryKey }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next?.page || undefined,
    getPreviousPageParam: (firstPage) => firstPage.previous?.page || undefined,
    refetchInterval: INTERVAL_MS,
  });

  const flattenOrders: OrderType[] = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data?.pages],
  );

  const sortedOrders = useMemo(() => {
    if (!sortKey) return flattenOrders;

    return [...flattenOrders].sort((a, b) => {
      switch (sortKey) {
        case SortKey.Title:
          return a.title.localeCompare(b.title);
        case SortKey.Status:
          return a.status.localeCompare(b.status);
        case SortKey.OrderTime:
          return (
            new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
          );
        default:
          return 0;
      }
    });
  }, [flattenOrders, sortKey]);

  const selectedOrder = useMemo(() => {
    return flattenOrders.find((order) => order.id === selectedOrderId);
  }, [flattenOrders, selectedOrderId]);

  if (isLoading) return <>Loading...</>;

  if (isError) return <div>Error fetching data</div>;

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
              className={`w-full ${
                selectedOrderId === id
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
              className={`py-2 px-4 rounded-lg font-semibold w-10${
                isFetchingNextPage
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
}: {
  pageParam: number;
  queryKey: any;
}): Promise<PaginatedResponse> => {
  const [, { filter }] = queryKey;

  const url = new URL("http://localhost:3000/api/orders");

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

enum SortKey {
  Title = "Title",
  OrderTime = "Order Time",
  Status = "Status",
}

const SORT_OPTIONS = ["Default (Unsorted)", ...Object.values(SortKey)];
const INTERVAL_MS = 9000;

export default Home;
