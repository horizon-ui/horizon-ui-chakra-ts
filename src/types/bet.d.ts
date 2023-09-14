import { ImageSourcePropType } from "react-native";

export type Sport = "cricket" | "soccer";

export type OverUnder = "over" | "under";

export type LineType =
  | "Run"
  | "Wicket"
  | "Boundary"
  | "Shots"
  | "Goals Scored"
  | "Goalie Saved"
  | "Goals Allowed";

export type LineEntity = "player" | "team";

export type SortBy = "date" | "stat";

export type Currency = "USD" | "MBTK" | "CRDT";

export type Theme = "light" | "dark";

export interface Pick {
  game: string;
  name: string;
  displayFirstName?: string;
  displayLastName?: string;
  nickname?: string;
  type: LineType;
  overUnder: OverUnder;
  predictedValue: number;
  date: string;
  playerTeam: string;
  homeTeam: string;
  awayTeam: string;
  sport?: Sport;
  lineId?: number;
  win?: boolean;
  actualValue?: number;
  imageUrl?: { uri: string };
  isValid?: boolean | any;
  league_name?: string;
  cricket_rule_type?: string;
  home_team_abbreviation?: string;
  away_team_abbreviation?: string;
}

export interface Parlay {
  id: number;
  active: boolean;
  date: string;
  totalBet: number;
  currency: Currency;
  picks: { [lineId: number]: Pick };
  totalWinnings?: number;
  win?: boolean;
}

export interface Line {
  sport: Sport;
  id: number;
  game: string;
  name: string;
  displayFirstName?: string;
  displayLastName?: string;
  nickname?: string;
  type: LineType;
  entity: LineEntity;
  amount: number;
  date: string;
  imageUrl?: { uri: string };
  playerTeam: string;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  homeTeamAbbr: string;
  awayTeamAbbr: string;
  homeTeamLogo?: { uri: string };
  awayTeamLogo?: { uri: string };
  playerPosition?: string;
  athleteMid: number;
  leagueAbbriviation: string;
  playerTeamLogo: { uri: string };
}

export interface Cart {
  picks: { [lineId: number]: Pick };
  amount: number;
}

export type PlayingFor = "tokens" | "cash" | undefined;

export type Notifications = {
  [key: string]: NotificationType;
};

export type NotificationType = {
  date: string;
  body: string;
  header: string;
  id: string | null;
};
