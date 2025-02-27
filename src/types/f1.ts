export interface Driver {
  driver_number: number;
  name_acronym: string;
  first_name: string;
  last_name: string;
  team_name: string;
  team_color: string;
  headshot_url: string;
  country_code: string;
  session_key: number;
  championship_position?: number;
  fastest_lap_time?: number;
}

export interface LapData {
  driver_number: number;
  lap_number: number;
  lap_duration: number;
  lap_time: string;
  sector_1_time: number;
  sector_2_time: number;
  sector_3_time: number;
  i1_speed: number;
  i2_speed: number;
  st_speed: number;
  session_key: number;
}

export interface PitStop {
  driver_number: number;
  lap_number: number;
  pit_duration: number;
  session_key: number;
  timestamp: string;
}

export interface TeamRadio {
  driver_number: number;
  audio_url: string; // URL to the audio file
  message: string;
  session_key: number;
  timestamp: string;
} 