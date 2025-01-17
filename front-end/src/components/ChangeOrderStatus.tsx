import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import Select from "./Select";
import { OrderStatus } from "../types/api.types";
import { BASE_API_URL, statusOptions } from "../utils";


const ChangeOrderStatus = ({
  id,
  currentStatus,
}: {
  id: number;
  currentStatus: OrderStatus;
}) => {
  const queryClient = useQueryClient();

  const updateOrderStatus = async (status: string) => {
    const response = await fetch(
      `${BASE_API_URL}/orders/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      console.error("Failed to update status", id);
    }

    return response.json();
  };

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleStatusChange = useCallback((value: string) => updateStatus(value), [updateStatus])

  return (
    <Select
      id="orderStatus"
      options={statusOptions}
      value={currentStatus}
      onChange={handleStatusChange}
      label="Update status"
      disabled={isPending}
    />
  );
};

export default ChangeOrderStatus;
