export const DEFAULT_ICON = "/images/mockmemes/RACC.webp";

export const ROUNDS = [
  {
    round: 4,
    status: "Upcoming Battle",
    state: "waiting",
    metrics: { mcap: "$0", volume: "$0", memes: 0, traders: 0, loserIssuance: "$0" },
    topShare: 42,
    startTime: "05/27 00:00",
    endTime: "05/28 01:00",
  },
  {
    round: 3,
    status: "Current Battle",
    state: "active",
    metrics: { mcap: "$120.00K", volume: "$40K", memes: 12, traders: 80, loserIssuance: "$10K" },
    topShare: 38,
    startTime: "05/24 00:00",
    endTime: "05/25 01:00",
  },
  {
    round: 2,
    status: "Completed",
    state: "ended",
    metrics: { mcap: "$200.00K", volume: "$100K", memes: 30, traders: 150, loserIssuance: "$25K" },
    topShare: 51,
    startTime: "05/21 00:00",
    endTime: "05/22 01:00",
  },
  {
    round: 1,
    status: "Completed",
    state: "ended",
    metrics: { mcap: "$90.00K", volume: "$20K", memes: 8, traders: 40, loserIssuance: "$5K" },
    topShare: 42,
    startTime: "05/18 00:00",
    endTime: "05/19 01:00",
  }
]; 