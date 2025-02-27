import type { FC } from 'react';
import Link from 'next/link';
import type { Driver } from '~/types/f1';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { formatTime, formatOrdinal } from '~/utils/formatters';

interface DriverCardProps {
  driver: Driver;
}

export const DriverCard: FC<DriverCardProps> = ({ driver }) => {
  // Function to get a border color based on team color
  const getTeamBorderStyle = () => {
    if (!driver.team_color) return {};
    
    return {
      borderTop: `4px solid ${driver.team_color}`,
    };
  };

  return (
    <Link 
      href={`/driver/${driver.driver_number}`} 
      className="block transition-transform hover:scale-105"
    >
      <Card className="h-full overflow-hidden" style={getTeamBorderStyle()}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {driver.first_name} {driver.last_name}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold">
              {driver.driver_number}
            </div>
          </div>
          <CardDescription className="text-sm text-neutral-500">
            {driver.team_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mb-4 flex justify-center">
            <Avatar className="h-32 w-32 rounded-full">
              <AvatarImage src={driver.headshot_url} alt={`${driver.first_name} ${driver.last_name}`} />
              <AvatarFallback className="text-2xl">
                {driver.name_acronym}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-neutral-100 p-2">
              <p className="text-xs text-neutral-500">Position</p>
              <p className="text-lg font-bold">{formatOrdinal(driver.championship_position)}</p>
            </div>
            <div className="rounded-lg bg-neutral-100 p-2">
              <p className="text-xs text-neutral-500">Fastest Lap</p>
              <p className="text-lg font-bold">{formatTime(driver.fastest_lap_time)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 text-xs text-neutral-500">
          <div className="flex w-full items-center justify-between">
            <span>#{driver.driver_number}</span>
            <span>{driver.country_code}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}; 