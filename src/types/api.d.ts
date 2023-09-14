import { Currency, LineType, Parlay, Sport } from "./bet";

// Parlay

export interface ApiParlay {
  parlay_mid: number;
  currency: Currency;
  bet_amount: number;
  parlay_options: ApiParlayOption[];
  parlay_user_win: null | boolean;
  submit_time: string;
  is_settled: boolean;
}

export interface ApiParlayOption {
  parlay_option_mid: number;
  away_team_name: string;
  cricket_player_image_url: string;
  cricket_player_first_name: string;
  cricket_player_last_name: string;
  athlete_first_name: string;
  athlete_last_name: string;
  home_team_name: string;
  is_over: boolean;
  is_valid: boolean | any;
  match_start_datetime: string;
  parlay_option_mid: number;
  parlay_pick_user_win: null | boolean;
  parlay_type_name: LineType;
  player_team: string;
  predicted_value: number;
  actual_value: number | null;
  sport_name: string;
  display_first_name: string;
  display_last_name: string;
  nickname: string;
  player_team_abbreviation: string;
  away_team_abbreviation: string;
  soccer_competition_display_name?: string;
  cricket_tournament_display_name?: string;
  sport_name: Sport;
  athlete_image_url: string;
  cricket_player_image_url: string;
  away_team_logo_image_url: string;
  home_team_logo_image_url: string;
  league_name: string;
  athlete_player_type: string;
  home_team_abbreviation: string;
  athlete_mid: number;
  cricket_rule_type: string;
  player_team_logo_image_url: string;
}

// User

export interface ApiUserAssets {
  parlays_list: ApiParlay[];
  email: string;
  username: string;
  account_balance: {
    USD: number;
    MBTK: number;
    CRDT: number;
  };
}
export interface PlayerHistory {
  match_start_datetime: string;
  record_type: string;
  value: number;
  opponent_team_abbreviation: string;
  player_team_abbreviation: string;
  cricket_rule_type: string;
}

export interface StatResponse {
  mamba_id: number;
  sid: string;
  first_name: string;
  last_name: string;
  player_history: PlayerHistory[];
  opponent_team_abbreviation: string;
  player_team_abbreviation: string;
}
export interface PlayerStatus {
  date: string;
  record_type: string;
  value: number;
  oponentTeam: string;
}
