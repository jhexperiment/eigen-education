/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import request from "graphql-request";
import {
  StakerQueryResponse,
  Deposit,
  Withdrawal,
  Strategy,
  Operator,
} from "../lib/types";
import { useQuery } from "@tanstack/react-query";
import GetStakerDepositWithdraw from "@repo/graphql/queries/staker_deposit_withdrawl.gql";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { classNames } from "primereact/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";

const endpoint = import.meta.env.VITE_SUBGRAPH_ENDPOINT;

/**
 * Use Staker Deposit Withdrawl
 *
 * Fetch the staker deposit and withdrawl data
 */
const useStakerDepositWithdrawl = ($address: string) => {
  return useQuery<StakerQueryResponse>({
    queryKey: ["staker", $address],
    queryFn: () =>
      request(endpoint, GetStakerDepositWithdraw, { address: $address }),
  });
};

/**
 * Format Date
 *
 * Format the date to a human readable format
 */
const formatDate = (date: string) => {
  return new Date(Number(date) * 1000).toLocaleDateString();
};

/**
 * Date Filter Template
 *
 * Display a date filter
 */
const dateFilterTemplate = (options: any) => {
  return (
    <Calendar
      value={options.value}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      dateFormat="mm/dd/yy"
      placeholder="mm/dd/yyyy"
      mask="99/99/9999"
    />
  );
};

/**
 * Ellipsis
 *
 * Display an ellipsis tooltip for the value
 */
const ellipsis = (value: string) => {
  if (!value) return "";
  return value?.substring(0, 6) + "..." + value?.substring(value.length - 4);
};

/**
 * Handle Copy
 *
 * Copy the value to the clipboard
 */
const handleCopy = (value: string, toast: any) => {
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
        {ellipsis(value)}
      </span>
      <i
        className="ml-[0.5rem] pi pi-copy"
        onClick={() => handleCopy(value, toast)}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

/**
 * Operator Body Template
 *
 * Display the operator name from the metadata cache, otherwise display the operator id with an ellipsis tooltip
 */
const operatorBodyTemplate = (
  operator: Operator | undefined,
  metadataCache: any
) => {
  if (operator?.metadataURI && metadataCache[operator?.metadataURI]?.name) {
    return metadataCache[operator.metadataURI].name;
  }

  if (!operator?.id) return "";

  return (
    <div className="flex items-center gap-2">
      <Tooltip target=".ellipsis-tooltip" />
      <span
        className="ellipsis-tooltip"
        data-pr-tooltip={operator.id}
        data-pr-position="top"
      >
        {ellipsis(operator.id)}
      </span>
    </div>
  );
};

/**
 * Strategies Body Template
 *
 * Display the strategy names
 */
const strategiesBodyTemplate = (strategies: Strategy[]) => {
  const strategyNames = strategies?.map((strategy) => strategy.token?.symbol);
  return <div>{strategyNames?.join(", ")}</div>;
};

/**
 * Shares Body Template
 *
 * Display the shares in a shorter format
 */
const sharesBodyTemplate = (shares: string, decimals: number) => {
  const sharesFormatted =
    (BigInt(shares) * BigInt(10 ** decimals)) / BigInt(10 ** decimals);
  const sharesFormattedDecimal = Number(sharesFormatted) / 10 ** decimals;
  return <div>{sharesFormattedDecimal.toFixed(6)}</div>;
};

/**
 * Boolean Body Template
 *
 * Display a boolean value as a check or cross icon
 */
const booleanBodyTemplate = (bool: boolean) => {
  return (
    <i
      className={classNames("pi", {
        "true-icon pi-check-circle": bool,
        "false-icon pi-times-circle": !bool,
      })}
      style={{
        color: bool ? "var(--green-500)" : "var(--red-500)",
      }}
    ></i>
  );
};

/**
 * Boolean Filter Template
 *
 * Display a boolean filter
 */
const booleanFilterTemplate = (
  title: string,
  options: ColumnFilterElementTemplateOptions
) => {
  return (
    <div className="flex align-items-center gap-2">
      <label htmlFor="verified-filter" className="font-bold mr-[0.5rem]">
        {title}
      </label>
      <TriStateCheckbox
        id="verified-filter"
        value={options.value}
        onChange={(e: TriStateCheckboxChangeEvent) =>
          options.filterCallback(e.value)
        }
      />
    </div>
  );
};

/**
 * Staker Page
 */
const StakerPage: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useParams();
  const toast = useRef<Toast>(null);

  const [addressState, setAddressState] = useState(address);

  if (!address) return <p>No address provided</p>;

  const { data, error } = useStakerDepositWithdrawl(address);

  const [metadataCache, setMetadataCache] = useState<any>({});

  const [updatedData, setUpdatedData] = useState<any>(null);

  const [filters] = useState({
    blockTimestamp: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    start_blockTimestamp: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    blockNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "strategy.token.symbol": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    completed: { value: null, matchMode: FilterMatchMode.EQUALS },
    "operator.metadata.name": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    shares_withdrawn: { value: null, matchMode: FilterMatchMode.EQUALS },
    "strategy.address": { value: null, matchMode: FilterMatchMode.CONTAINS },
    transactionHash: { value: null, matchMode: FilterMatchMode.CONTAINS },
    start_transactionHash: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setUpdatedData(data);

    /**
     * Fetch Metadata
     *
     * Fetch metadata for all operators in the withdrawals
     */
    const fetchMetadata = async () => {
      const metadataMap: Record<string, any> = {};

      const metadataURIs = Array.from(
        new Set(
          data?.staker?.withdrawals?.map(
            (withdrawal: Withdrawal) => withdrawal?.operator?.metadataURI
          ) || []
        )
      );

      await Promise.all(
        metadataURIs.map(async (metadataURI: string | undefined) => {
          let timeoutId: number | null = null;
          try {
            if (!metadataURI) return;
            if (metadataCache[metadataURI]) {
              metadataMap[metadataURI] = metadataCache[metadataURI];
              return;
            }
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), 2000);

            const response = await fetch(metadataURI, {
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const metadata = await response.json();
            metadataMap[metadataURI] = metadata;
          } catch (err) {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            if (metadataURI) {
              metadataCache[metadataURI] = {};
            }
            console.error(`Error fetching metadata for ${metadataURI}:`, err);
          }
        }) ?? []
      );

      setMetadataCache(metadataMap);
      setUpdatedData(data);
    };

    fetchMetadata();
  }, [data]);

  /**
   * Handle Search
   *
   * Load the staker page for the given address
   */
  const handleSearch = () => {
    if (addressState !== address) {
      navigate(`/staker/${addressState}`);
    }
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

      <div className="flex items-center gap-2">
        <Button
          text
          icon="pi pi-arrow-left"
          onClick={() => navigate("/stakers")}
        />
        <h2 className="mx-[1.5rem]">Staker:</h2>
        <div className="p-inputgroup flex-1">
          <Button icon="pi pi-search" className="" onClick={handleSearch} />
          <InputText
            className="w-[30rem]"
            placeholder="Address"
            value={addressState}
            onChange={(e) => setAddressState(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      <Accordion multiple activeIndex={[0, 1]}>
        <AccordionTab
          header={
            updatedData
              ? `Deposits (${updatedData?.staker?.depositCount})`
              : "Deposits"
          }
        >
          <DataTable
            value={updatedData?.staker?.deposits}
            tableStyle={{ minWidth: "50rem" }}
            sortMode="multiple"
            filters={filters}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No deposits found."
            loading={!updatedData}
          >
            <Column
              field="strategy.token.symbol"
              header="Asset"
              sortable
              filter
              filterField="strategy.token.symbol"
              filterPlaceholder="Search"
            ></Column>
            <Column
              field="shares"
              header="Shares"
              body={(rowData: Deposit) =>
                sharesBodyTemplate(
                  rowData.shares || "",
                  rowData?.strategy?.token?.decimals || 18
                )
              }
            ></Column>
            <Column
              field="transactionHash"
              header="Transaction Hash"
              body={(rowData: Deposit) =>
                ellipsisBodyTemplate(rowData.transactionHash || "", toast)
              }
              sortable
              filter
              filterField="transactionHash"
              filterPlaceholder="Search"
            ></Column>
            <Column
              field="blockNumber"
              header="Block Number"
              sortable
              filter
              filterField="blockNumber"
              filterPlaceholder="Search"
            ></Column>
            <Column
              field="blockTimestamp"
              header="Block Timestamp"
              body={(rowData: Deposit) =>
                rowData.blockTimestamp ? formatDate(rowData.blockTimestamp) : ""
              }
              dataType="date"
              sortable
              filter
              filterElement={dateFilterTemplate}
            ></Column>
          </DataTable>
        </AccordionTab>

        <AccordionTab
          header={
            updatedData
              ? `Withdrawals (${updatedData?.staker?.withdrawalCount})`
              : "Withdrawals"
          }
        >
          <DataTable
            value={updatedData?.staker?.withdrawals}
            tableStyle={{ minWidth: "50rem" }}
            sortMode="multiple"
            filters={filters}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No withdrawals found."
            loading={!updatedData}
          >
            <Column
              field="strategies.token.symbol"
              header="Asset"
              body={(rowData: Withdrawal) =>
                rowData.strategies
                  ? strategiesBodyTemplate(rowData.strategies)
                  : ""
              }
              sortable
            ></Column>
            <Column
              field="shares"
              header="Shares"
              body={(rowData: Withdrawal) =>
                sharesBodyTemplate(
                  rowData.shares?.[0] || "",
                  rowData?.strategies?.[0]?.token?.decimals || 18
                )
              }
            ></Column>
            <Column
              field="operator.metadata.name"
              header="Operator"
              body={(rowData: Withdrawal) =>
                operatorBodyTemplate(rowData?.operator, metadataCache)
              }
              sortable
              filter
              filterField="operator.metadata.name"
              filterPlaceholder="Search"
            ></Column>
            <Column
              field="completed"
              header="Completed"
              dataType="boolean"
              body={(rowData: Withdrawal) =>
                booleanBodyTemplate(!!rowData.completed)
              }
              filter
              filterField="completed"
              filterPlaceholder="Search"
              filterElement={(options) =>
                booleanFilterTemplate("Completed", options)
              }
            ></Column>
            <Column
              field="shares_withdrawn"
              header="Shares Withdrawn"
              body={(rowData: Withdrawal) =>
                booleanBodyTemplate(!!rowData.shares_withdrawn)
              }
              dataType="boolean"
              filter
              filterField="shares_withdrawn"
              filterPlaceholder="Search"
              filterElement={(options) =>
                booleanFilterTemplate("Shares Withdrawn", options)
              }
            ></Column>
            <Column
              field="start_transactionHash"
              header="Transaction Hash"
              body={(rowData: Withdrawal) =>
                ellipsisBodyTemplate(rowData.start_transactionHash || "", toast)
              }
              sortable
              filter
              filterField="start_transactionHash"
              filterPlaceholder="Search"
            ></Column>
            <Column
              field="start_blockNumber"
              header="Block Number"
              sortable
              filter
              filterField="blockNumber"
              filterPlaceholder="Search"
            ></Column>
            <Column
              field="start_blockTimestamp"
              header="Block Timestamp"
              body={(rowData: Withdrawal) =>
                rowData.start_blockTimestamp
                  ? formatDate(rowData.start_blockTimestamp)
                  : ""
              }
              dataType="date"
              sortable
              filter
              filterElement={dateFilterTemplate}
            ></Column>
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default StakerPage;
