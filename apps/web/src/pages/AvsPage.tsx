/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { request } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import GetAvssQuery from "@repo/graphql/queries/avss.gql";
import { Accordion, AccordionTab } from "primereact/accordion";
import { AVS, AVSSQueryResponse } from "../lib/types";
// const endpoint =
//   "https://subgraph.satsuma-prod.com/027e731a6242/eigenlabs/eigen-graph-testnet-holesky/api";
const endpoint = import.meta.env.VITE_SUBGRAPH_ENDPOINT;

const useAvss = () => {
  return useQuery<AVSSQueryResponse>({
    queryKey: ["avss"],
    queryFn: () => request(endpoint, GetAvssQuery),
  });
};

const AvsPage: React.FC = () => {
  const { data, error, isLoading } = useAvss();
  const [updatedData, setUpdatedData] = useState<any>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      const avssWithMetadata = await Promise.all(
        data?.avss.map(async (avs: AVS) => {
          try {
            if (!avs.metadataURI) return avs;
            const response = await fetch(avs.metadataURI);
            const metadata = await response.json();
            return { ...avs, metadata };
          } catch (err) {
            console.error(`Error fetching metadata for ${avs.id}:`, err);
            return { ...avs, metadata: null };
          }
        }) ?? []
      );
      setUpdatedData({ ...data, avss: avssWithMetadata });
    };

    fetchMetadata();
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Accordion>
        {updatedData?.avss.map((avs: AVS) => (
          <AccordionTab
            header={
              <div>
                <p>{avs?.metadata?.name || avs?.id}</p>
              </div>
            }
          >
            <img
              className="h-[3em]"
              src={avs?.metadata?.logo}
              alt={avs?.metadata?.name}
            />
            <p>{avs?.metadata?.description}</p>
            <p>{avs?.metadata?.website}</p>
            <p>{avs?.metadata?.twitter}</p>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default AvsPage;
