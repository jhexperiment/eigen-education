/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import React, { useRef, useState } from "react";
import {
  Staker,
  StakersQueryResponse,
  SubgraphErrorResponse,
} from "../lib/types";
import GetStakersQuery from "@repo/graphql/queries/stakers.gql";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { FilterMatchMode, SortOrder } from "primereact/api";
import { Toast } from "primereact/toast";
const endpoint = import.meta.env.VITE_SUBGRAPH_ENDPOINT;

/**
 * Use Stakers
 *
 * Fetch stakers from the subgraph
 */
const useStakers = (
  skip: number = 0,
  first: number = 100,
  orderBy: string = "depositCount",
  orderDirection: number = -1,
  filters: any = {}
) => {
  let transformedFilters = undefined;
  if (filters?.address?.value) {
    transformedFilters = Object.entries(filters).reduce(
      (acc: Record<string, string>, [key, filter]: [string, any]) => {
        if (filter.matchMode === "equals" && filter.value) {
          acc[key] = filter.value;
        }
        return acc;
      },
      {}
    );
  }
  return useQuery<StakersQueryResponse>({
    queryKey: [
      "stakers",
      skip,
      first,
      orderBy,
      orderDirection,
      transformedFilters,
    ],
    queryFn: () =>
      request(endpoint, GetStakersQuery, {
        skip,
        first,
        orderBy,
        orderDirection: orderDirection === 1 ? "asc" : "desc",
        where: transformedFilters,
      }),
  });
};

/**
 * Handle Copy
 *
 * Copy the value to the clipboard
 */
const handleCopy = (value: string, toast: any, event: React.MouseEvent) => {
  event.stopPropagation();
  navigator.clipboard.writeText(value).then(() => {
    toast.current?.show({
      severity: "success",
      summary: "Copied",
      detail: "Text copied to clipboard",
    });
  });
};

/**
 * Ellipsis Body Template
 *
 * Display an ellipsis tooltip for the value
 */
const ellipsisBodyTemplate = (value: string, toast: any) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip target=".ellipsis-tooltip" />
      <span
        className="ellipsis-tooltip"
        data-pr-tooltip={value}
        data-pr-position="top"
      >
        {value?.substring(0, 6)}...
        {value?.substring(value.length - 4)}
      </span>
      <i
        className="ml-[0.5rem] pi pi-copy"
        onClick={(event) => handleCopy(value, toast, event)}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

/**
 * Stakers Page
 *
 * Display a list of stakers
 */
const StakersPage: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: "depositCount",
    sortOrder: SortOrder.DESC,
    filters: {
      address: { value: null, matchMode: FilterMatchMode.EQUALS },
    },
  });

  const { data, error, isLoading } = useStakers(
    lazyState.first,
    lazyState.rows,
    lazyState.sortField || undefined,
    lazyState.sortOrder || undefined,
    lazyState.filters
  ) as {
    data: StakersQueryResponse | undefined;
    error: SubgraphErrorResponse | null;
    isLoading: boolean;
  };
  const navigate = useNavigate();

  /**
   * Handle Row Select
   *
   * Navigate to the staker page
   */
  const onRowSelect = (event: any) => {
    navigate(`/staker/${event.data.address}`);
  };

  /**
   * Handle Table Pagination
   *
   * Update the lazy state
   */
  const onPage = (event: any) => {
    setLazyState(event);
  };

  /**
   * Handle Table Sort
   *
   * Update the lazy state
   */
  const onSort = (event: any) => {
    setLazyState(event);
  };

  /**
   * Handle Table Filter
   *
   * Update the lazy state
   */
  const onFilter = (event: any) => {
    console.log(event);
    setLazyState(event);
  };

  /**
   * Handle Error
   *
   * Show an error toast if there is an error
   */
  if (error) {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error?.response?.errors?.[0]?.message,
    });
  }

  return (
    <div>
      <Toast ref={toast} />

      <DataTable
        lazy
        first={lazyState.first}
        rows={10}
        value={data?.stakers}
        selectionMode="single"
        onRowSelect={onRowSelect}
        tableStyle={{ minWidth: "50rem" }}
        sortMode="single"
        paginator
        totalRecords={100000}
        emptyMessage="No Stakers found."
        onPage={onPage}
        onSort={onSort}
        sortField={lazyState.sortField || undefined}
        sortOrder={lazyState.sortOrder || undefined}
        onFilter={onFilter}
        filters={lazyState.filters}
        loading={isLoading}
      >
        <Column
          field="address"
          header="Address"
          body={(rowData: Staker) =>
            ellipsisBodyTemplate(rowData.address || "", toast)
          }
          sortable
          filter
          filterField="address"
          filterPlaceholder="Search"
          showFilterMenuOptions={false}
        ></Column>
        <Column field="depositCount" header="Deposit Count" sortable></Column>
        <Column
          field="withdrawalCount"
          header="Withdrawal Count"
          sortable
        ></Column>
        <Column
          field="delegationCount"
          header="Delegation Count"
          sortable
        ></Column>
        <Column field="operatorCount" header="Operator Count" sortable></Column>
      </DataTable>
    </div>
  );
};

export default StakersPage;
