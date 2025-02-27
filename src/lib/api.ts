import axios from 'axios';
import { Driver, LapData, PitStop, TeamRadio } from '~/types/f1';
import { mockDrivers, generateMockLapData, generateMockPitStops, generateMockTeamRadio } from './mockData';

const BASE_URL = 'https://api.openf1.org/v1';

// Configuration for API usage
const config = {
  useMockData: true, // Set to true to use mock data instead of real API
  mockDataOnFailure: true // Use mock data as fallback when API fails
};

// Get session keys for the 2024 season
export const get2024SessionKeys = async (): Promise<number[]> => {
  try {
    if (config.useMockData) {
      return [9001]; // Mock session key
    }
    
    const response = await axios.get(`${BASE_URL}/sessions?year=2024`);
    return response.data.map((session: any) => session.session_key);
  } catch (error) {
    console.error('Failed to fetch 2024 session keys:', error);
    if (config.mockDataOnFailure) {
      console.log('Using mock session keys');
      return [9001]; // Mock session key
    }
    return [];
  }
};

// Get all drivers for the 2024 season
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    if (config.useMockData) {
      console.log('Using mock driver data');
      return mockDrivers;
    }
    
    const sessionKeys = await get2024SessionKeys();
    if (sessionKeys.length === 0) {
      throw new Error('No session keys available');
    }

    const requests = sessionKeys.map(sessionKey => 
      axios.get(`${BASE_URL}/drivers?session_key=${sessionKey}`)
    );

    const responses = await Promise.all(requests);
    const allDrivers: Driver[] = responses.flatMap(response => response.data);

    // Remove duplicates by driver_number
    const uniqueDrivers = Array.from(
      new Map(allDrivers.map(driver => [driver.driver_number, driver])).values()
    );

    // Get championship standings
    const championshipData = await getDriverChampionshipStandings();
    
    // Get fastest lap times for all drivers
    const driverFastestLaps = await Promise.all(
      uniqueDrivers.map(async (driver) => {
        const fastestLap = await getFastestLapForDriver(driver.driver_number);
        return {
          ...driver,
          championship_position: championshipData.find(d => d.driver_number === driver.driver_number)?.position,
          fastest_lap_time: fastestLap
        };
      })
    );
    
    return driverFastestLaps;
  } catch (error) {
    console.error('Failed to fetch drivers:', error);
    if (config.mockDataOnFailure) {
      console.log('Using mock driver data as fallback');
      return mockDrivers;
    }
    return [];
  }
};

// Get driver championship standings
export const getDriverChampionshipStandings = async (): Promise<{ driver_number: number; position: number }[]> => {
  try {
    // This endpoint is hypothetical and may need to be adjusted based on actual API availability
    const response = await axios.get(`${BASE_URL}/championship/drivers?year=2024`);
    return response.data.map((item: any) => ({
      driver_number: item.driver_number,
      position: item.position
    }));
  } catch (error) {
    console.error('Failed to fetch championship standings:', error);
    // Return mock championship data
    return mockDrivers.map(driver => ({
      driver_number: driver.driver_number,
      position: driver.championship_position || 0
    }));
  }
};

// Get fastest lap time for a driver
export const getFastestLapForDriver = async (driverNumber: number): Promise<number | undefined> => {
  try {
    if (config.useMockData) {
      const driver = mockDrivers.find(d => d.driver_number === driverNumber);
      return driver?.fastest_lap_time;
    }
    
    const sessionKeys = await get2024SessionKeys();
    if (sessionKeys.length === 0) {
      throw new Error('No session keys available');
    }

    const requests = sessionKeys.map(sessionKey => 
      axios.get(`${BASE_URL}/laps?driver_number=${driverNumber}&session_key=${sessionKey}`)
    );

    const responses = await Promise.all(requests);
    const allLaps: LapData[] = responses.flatMap(response => response.data);

    if (allLaps.length === 0) {
      throw new Error('No lap data available');
    }

    // Find the fastest lap
    return Math.min(...allLaps.map(lap => lap.lap_duration));
  } catch (error) {
    console.error(`Failed to fetch fastest lap for driver ${driverNumber}:`, error);
    if (config.mockDataOnFailure) {
      const driver = mockDrivers.find(d => d.driver_number === driverNumber);
      return driver?.fastest_lap_time;
    }
    return undefined;
  }
};

// Get lap data for a specific driver
export const getLapDataForDriver = async (driverNumber: number): Promise<LapData[]> => {
  try {
    if (config.useMockData) {
      return generateMockLapData(driverNumber);
    }
    
    const sessionKeys = await get2024SessionKeys();
    if (sessionKeys.length === 0) {
      throw new Error('No session keys available');
    }

    const requests = sessionKeys.map(sessionKey => 
      axios.get(`${BASE_URL}/laps?driver_number=${driverNumber}&session_key=${sessionKey}`)
    );

    const responses = await Promise.all(requests);
    const lapData = responses.flatMap(response => response.data);
    
    if (lapData.length === 0) {
      throw new Error('No lap data available');
    }
    
    return lapData;
  } catch (error) {
    console.error(`Failed to fetch lap data for driver ${driverNumber}:`, error);
    if (config.mockDataOnFailure) {
      return generateMockLapData(driverNumber);
    }
    return [];
  }
};

// Get pit stops for a specific driver
export const getPitStopsForDriver = async (driverNumber: number): Promise<PitStop[]> => {
  try {
    if (config.useMockData) {
      return generateMockPitStops(driverNumber);
    }
    
    const sessionKeys = await get2024SessionKeys();
    if (sessionKeys.length === 0) {
      throw new Error('No session keys available');
    }

    const requests = sessionKeys.map(sessionKey => 
      axios.get(`${BASE_URL}/pit?driver_number=${driverNumber}&session_key=${sessionKey}`)
    );

    const responses = await Promise.all(requests);
    const pitStops = responses.flatMap(response => response.data);
    
    if (pitStops.length === 0) {
      throw new Error('No pit stop data available');
    }
    
    return pitStops;
  } catch (error) {
    console.error(`Failed to fetch pit stops for driver ${driverNumber}:`, error);
    if (config.mockDataOnFailure) {
      return generateMockPitStops(driverNumber);
    }
    return [];
  }
};

// Get team radio for a specific driver
export const getTeamRadioForDriver = async (driverNumber: number): Promise<TeamRadio[]> => {
  try {
    if (config.useMockData) {
      return generateMockTeamRadio(driverNumber);
    }
    
    const sessionKeys = await get2024SessionKeys();
    if (sessionKeys.length === 0) {
      throw new Error('No session keys available');
    }

    const requests = sessionKeys.map(sessionKey => 
      axios.get(`${BASE_URL}/team_radio?driver_number=${driverNumber}&session_key=${sessionKey}`)
    );

    const responses = await Promise.all(requests);
    const teamRadio = responses.flatMap(response => response.data);
    
    if (teamRadio.length === 0) {
      throw new Error('No team radio data available');
    }
    
    return teamRadio;
  } catch (error) {
    console.error(`Failed to fetch team radio for driver ${driverNumber}:`, error);
    if (config.mockDataOnFailure) {
      return generateMockTeamRadio(driverNumber);
    }
    return [];
  }
}; 