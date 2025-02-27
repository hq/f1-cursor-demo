import type { Driver, LapData, PitStop, TeamRadio } from '~/types/f1';

/**
 * Mock driver data for when the API is unavailable
 */
export const mockDrivers: Driver[] = [
  {
    driver_number: 1,
    name_acronym: 'VER',
    first_name: 'Max',
    last_name: 'Verstappen',
    team_name: 'Red Bull Racing',
    team_color: '#0600EF',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
    country_code: 'NLD',
    session_key: 9001,
    championship_position: 1,
    fastest_lap_time: 92.532
  },
  {
    driver_number: 11,
    name_acronym: 'PER',
    first_name: 'Sergio',
    last_name: 'Perez',
    team_name: 'Red Bull Racing',
    team_color: '#0600EF',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',
    country_code: 'MEX',
    session_key: 9001,
    championship_position: 5,
    fastest_lap_time: 93.124
  },
  {
    driver_number: 44,
    name_acronym: 'HAM',
    first_name: 'Lewis',
    last_name: 'Hamilton',
    team_name: 'Mercedes',
    team_color: '#00D2BE',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    country_code: 'GBR',
    session_key: 9001,
    championship_position: 4,
    fastest_lap_time: 92.987
  },
  {
    driver_number: 63,
    name_acronym: 'RUS',
    first_name: 'George',
    last_name: 'Russell',
    team_name: 'Mercedes',
    team_color: '#00D2BE',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    country_code: 'GBR',
    session_key: 9001,
    championship_position: 7,
    fastest_lap_time: 93.201
  },
  {
    driver_number: 16,
    name_acronym: 'LEC',
    first_name: 'Charles',
    last_name: 'Leclerc',
    team_name: 'Ferrari',
    team_color: '#DC0000',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
    country_code: 'MON',
    session_key: 9001,
    championship_position: 2,
    fastest_lap_time: 92.634
  },
  {
    driver_number: 55,
    name_acronym: 'SAI',
    first_name: 'Carlos',
    last_name: 'Sainz',
    team_name: 'Ferrari',
    team_color: '#DC0000',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
    country_code: 'ESP',
    session_key: 9001,
    championship_position: 3,
    fastest_lap_time: 92.765
  },
  {
    driver_number: 4,
    name_acronym: 'NOR',
    first_name: 'Lando',
    last_name: 'Norris',
    team_name: 'McLaren',
    team_color: '#FF8700',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    country_code: 'GBR',
    session_key: 9001,
    championship_position: 6,
    fastest_lap_time: 93.089
  },
  {
    driver_number: 81,
    name_acronym: 'PIA',
    first_name: 'Oscar',
    last_name: 'Piastri',
    team_name: 'McLaren',
    team_color: '#FF8700',
    headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
    country_code: 'AUS',
    session_key: 9001,
    championship_position: 8,
    fastest_lap_time: 93.245
  }
];

/**
 * Generate mock lap data for a driver
 */
export const generateMockLapData = (driverNumber: number): LapData[] => {
  const lapCount = 30 + Math.floor(Math.random() * 20); // Random number of laps between 30 and 50
  const laps: LapData[] = [];
  
  for (let lap = 1; lap <= lapCount; lap++) {
    // Generate slightly variable lap times to make the data more realistic
    const baseLapTime = 90 + Math.random() * 5; // Between 90 and 95 seconds
    const sector1 = baseLapTime * 0.3 + (Math.random() * 0.5); // ~30% of lap time with some variation
    const sector2 = baseLapTime * 0.4 + (Math.random() * 0.5); // ~40% of lap time with some variation
    const sector3 = baseLapTime * 0.3 + (Math.random() * 0.5); // ~30% of lap time with some variation
    
    laps.push({
      driver_number: driverNumber,
      lap_number: lap,
      lap_duration: Number((sector1 + sector2 + sector3).toFixed(3)),
      lap_time: `${Math.floor(baseLapTime / 60)}:${Math.floor(baseLapTime % 60).toString().padStart(2, '0')}.${Math.floor((baseLapTime % 1) * 1000).toString().padStart(3, '0')}`,
      sector_1_time: Number(sector1.toFixed(3)),
      sector_2_time: Number(sector2.toFixed(3)),
      sector_3_time: Number(sector3.toFixed(3)),
      i1_speed: 270 + Math.floor(Math.random() * 30), // Between 270 and 300 km/h
      i2_speed: 250 + Math.floor(Math.random() * 40), // Between 250 and 290 km/h
      st_speed: 280 + Math.floor(Math.random() * 40), // Between 280 and 320 km/h
      session_key: 9001
    });
  }
  
  return laps;
};

/**
 * Generate mock pit stop data for a driver
 */
export const generateMockPitStops = (driverNumber: number): PitStop[] => {
  const pitStops: PitStop[] = [];
  const raceDate = new Date('2024-03-15T14:00:00Z'); // Hypothetical race date
  
  // Most drivers have 1-3 pit stops per race
  const numberOfPitStops = 1 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numberOfPitStops; i++) {
    // Generate pit stops at appropriate lap intervals
    const lap = 10 + (i * 15) + Math.floor(Math.random() * 10);
    
    // Time elapsed since race start (in milliseconds)
    const timeElapsed = lap * 90 * 1000 + Math.floor(Math.random() * 60000);
    const timestamp = new Date(raceDate.getTime() + timeElapsed).toISOString();
    
    pitStops.push({
      driver_number: driverNumber,
      lap_number: lap,
      pit_duration: 20 + Math.random() * 10, // Between 20 and 30 seconds
      session_key: 9001,
      timestamp
    });
  }
  
  return pitStops;
};

/**
 * Generate mock team radio communications for a driver
 */
export const generateMockTeamRadio = (driverNumber: number): TeamRadio[] => {
  const teamRadio: TeamRadio[] = [];
  const raceDate = new Date('2024-03-15T14:00:00Z'); // Hypothetical race date
  
  // Random number of radio messages, typically 3-8
  const numberOfMessages = 3 + Math.floor(Math.random() * 6);
  
  const possibleMessages = [
    "Box this lap, confirm.",
    "Great job, keep pushing.",
    "We need to manage these tires until the end.",
    "You're P2, gap to leader is 4.5 seconds.",
    "We're looking at a two-stop strategy.",
    "Yellow flag in sector 2, be careful.",
    "Rain expected in 10 minutes.",
    "Push now, we need to build a gap.",
    "Car behind is 1.2 seconds and closing."
  ];
  
  for (let i = 0; i < numberOfMessages; i++) {
    // Random lap for the message
    const lap = 1 + Math.floor(Math.random() * 50);
    
    // Time elapsed since race start (in milliseconds)
    const timeElapsed = lap * 90 * 1000 + Math.floor(Math.random() * 60000);
    const timestamp = new Date(raceDate.getTime() + timeElapsed).toISOString();
    
    // Pick a random message
    const messageIndex = Math.floor(Math.random() * possibleMessages.length);
    
    teamRadio.push({
      driver_number: driverNumber,
      audio_url: "https://example.com/audio/placeholder.mp3", // Placeholder URL for audio
      message: possibleMessages[messageIndex]!,
      session_key: 9001,
      timestamp
    });
  }
  
  return teamRadio;
}; 