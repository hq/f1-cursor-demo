import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  getLapDataForDriver, 
  getPitStopsForDriver, 
  getTeamRadioForDriver,
  getDrivers
} from '~/lib/api';
import type { Driver, LapData, PitStop, TeamRadio } from '~/types/f1';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Skeleton } from '~/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { formatTime, formatOrdinal, formatDate } from '~/utils/formatters';
import { Layout } from '~/components/layout/Layout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function DriverDetail() {
  const router = useRouter();
  const { driverId } = router.query;
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [lapData, setLapData] = useState<LapData[]>([]);
  const [pitStops, setPitStops] = useState<PitStop[]>([]);
  const [teamRadio, setTeamRadio] = useState<TeamRadio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDriverData = async () => {
      if (!driverId || typeof driverId !== 'string') return;
      
      try {
        setLoading(true);
        // Fetch driver info
        const drivers = await getDrivers();
        const currentDriver = drivers.find(d => d.driver_number.toString() === driverId);
        
        if (!currentDriver) {
          setError('Driver not found');
          return;
        }
        
        setDriver(currentDriver);
        
        // Fetch additional data in parallel
        const [lapDataResult, pitStopsResult, teamRadioResult] = await Promise.all([
          getLapDataForDriver(currentDriver.driver_number),
          getPitStopsForDriver(currentDriver.driver_number),
          getTeamRadioForDriver(currentDriver.driver_number)
        ]);
        
        setLapData(lapDataResult);
        setPitStops(pitStopsResult);
        setTeamRadio(teamRadioResult);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch driver data:', err);
        setError('Failed to load driver data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    void fetchDriverData();
  }, [driverId]);
  
  // Prepare data for speed graphs
  const prepareSpeedData = () => {
    return lapData.map(lap => ({
      lap: lap.lap_number,
      i1_speed: lap.i1_speed,
      i2_speed: lap.i2_speed,
      st_speed: lap.st_speed,
    }));
  };
  
  // Prepare data for lap time graphs
  const prepareLapTimeData = () => {
    return lapData.map(lap => ({
      lap: lap.lap_number,
      lap_time: lap.lap_duration,
      sector_1: lap.sector_1_time,
      sector_2: lap.sector_2_time,
      sector_3: lap.sector_3_time,
    }));
  };
  
  if (loading) {
    return (
      <Layout title="Loading Driver Data...">
        <div className="container mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64" />
            <div className="mt-4 flex items-center">
              <Skeleton className="mr-4 h-24 w-24 rounded-full" />
              <div>
                <Skeleton className="mb-2 h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          
          <Skeleton className="mb-8 h-12 w-full" />
          
          <div className="mb-8">
            <Skeleton className="mb-4 h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
          
          <div className="mb-8">
            <Skeleton className="mb-4 h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !driver) {
    return (
      <Layout title="Driver Not Found">
        <div className="container mx-auto">
          <div className="rounded-lg bg-red-100 p-4 text-red-800">
            {error ?? 'Driver not found'}
          </div>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              Back to Drivers
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout 
      title={`${driver.first_name} ${driver.last_name} - F1 Driver Profile`}
      description={`Formula One driver profile for ${driver.first_name} ${driver.last_name} - 2024 Season`}
    >
      <div className="container mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              ← Back to Drivers
            </Button>
          </Link>
          
          {/* Driver Header */}
          <div className="rounded-lg bg-white p-6 shadow-sm" style={{ borderLeft: `6px solid ${driver.team_color ?? '#333'}` }}>
            <div className="flex flex-col items-start md:flex-row md:items-center">
              <Avatar className="mb-4 h-24 w-24 md:mb-0 md:mr-6">
                <AvatarImage src={driver.headshot_url} alt={`${driver.first_name} ${driver.last_name}`} />
                <AvatarFallback className="text-xl">
                  {driver.name_acronym}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-3xl font-bold">
                  {driver.first_name} {driver.last_name}
                </h1>
                <p className="text-xl text-neutral-600">
                  {driver.team_name} | #{driver.driver_number}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
                    Position: {formatOrdinal(driver.championship_position)}
                  </div>
                  <div className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
                    Fastest Lap: {formatTime(driver.fastest_lap_time)}
                  </div>
                  <div className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
                    Country: {driver.country_code}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab navigation for different data sections */}
        <Tabs defaultValue="telemetry" className="mb-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            <TabsTrigger value="lapAnalysis">Lap Analysis</TabsTrigger>
            <TabsTrigger value="pitStops">Pit Stops</TabsTrigger>
            {teamRadio.length > 0 && (
              <TabsTrigger value="teamRadio">Team Radio</TabsTrigger>
            )}
          </TabsList>
          
          {/* Telemetry Tab */}
          <TabsContent value="telemetry" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Speed Telemetry</CardTitle>
              </CardHeader>
              <CardContent>
                {lapData.length > 0 ? (
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareSpeedData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lap" label={{ value: 'Lap Number', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="i1_speed" name="Intermediate 1 Speed" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="i2_speed" name="Intermediate 2 Speed" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="st_speed" name="Speed Trap" stroke="#ff7300" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center text-neutral-500">No telemetry data available for this driver.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Lap Analysis Tab */}
          <TabsContent value="lapAnalysis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lap Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {lapData.length > 0 ? (
                  <>
                    <div className="mb-8 h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prepareLapTimeData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="lap" label={{ value: 'Lap Number', position: 'insideBottomRight', offset: -10 }} />
                          <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => formatTime(Number(value))} />
                          <Legend />
                          <Line type="monotone" dataKey="lap_time" name="Lap Time" stroke="#ff0000" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="sector_1" name="Sector 1" stroke="#8884d8" />
                          <Line type="monotone" dataKey="sector_2" name="Sector 2" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="sector_3" name="Sector 3" stroke="#ffc658" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8 overflow-x-auto">
                      <h3 className="mb-4 text-xl font-bold">Detailed Lap Times</h3>
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Lap</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Sector 1</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Sector 2</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Sector 3</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Total Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white">
                          {lapData.map((lap) => (
                            <tr key={lap.lap_number}>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">{lap.lap_number}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatTime(lap.sector_1_time)}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatTime(lap.sector_2_time)}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatTime(lap.sector_3_time)}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-neutral-900">{formatTime(lap.lap_duration)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-neutral-500">No lap data available for this driver.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pit Stops Tab */}
          <TabsContent value="pitStops" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pit Stop Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {pitStops.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Lap</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Pit Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white">
                        {pitStops.map((pit, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">{pit.lap_number}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatTime(pit.pit_duration)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatDate(pit.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-neutral-500">No pit stop data available for this driver.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Team Radio Tab (Optional) */}
          {teamRadio.length > 0 && (
            <TabsContent value="teamRadio" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Radio Communications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamRadio.map((radio, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-neutral-500">{formatDate(radio.timestamp)}</span>
                        </div>
                        <p className="mb-2">{radio.message}</p>
                        {radio.audio_url && (
                          <audio controls className="w-full">
                            <source src={radio.audio_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
} 