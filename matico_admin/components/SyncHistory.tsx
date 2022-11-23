import {
  Text,
  Flex,
  Item,
  ListBox,
  StatusLight,
  View,
  Section,
} from "@adobe/react-spectrum";
import React from "react";
import { useSyncHistory } from "../hooks/useSyncHistory";
import { formatDistanceToNow, formatRFC7231, parseJSON } from "date-fns";

interface SyncHistoryProps {
  datasetId: string;
}
export const SyncHistory: React.FC<SyncHistoryProps> = ({ datasetId }) => {
  const { data: syncHistory, error } = useSyncHistory(datasetId);
  const nextScheduled = syncHistory
    ? syncHistory.find((sh: any) =>
        ["Pending", "InProgress"].includes(sh.status)
      )
    : null;
  const historical = syncHistory
    ? syncHistory.filter(
        (sh: any) => !["Pending", "InProgress"].includes(sh.status)
      )
    : [];

  if (!syncHistory) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <ListBox>
        <Section
          title={"Next scheduled sync"}
          items={nextScheduled ? [nextScheduled] : []}
        >
          {(item) => (
            <Item key="pending">
              {item.status === "inProgress"
                ? "Runnning now"
                : formatDistanceToNow(parseJSON(nextScheduled.scheduled_for), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
            </Item>
          )}
        </Section>
      </ListBox>

      <ListBox maxHeight={"size-2400"}>
        <Section items={historical} title="History (last 4 syncs)">
          {historical &&
            historical.slice(0, 5).map((syncAttempt: any, i: number) => (
              <Item key={i}>
                <Text>{formatRFC7231(parseJSON(syncAttempt.finished_at))}</Text>
                <Text slot="description">{syncAttempt.status}</Text>
              </Item>
            ))}
        </Section>
      </ListBox>
    </View>
  );
};
