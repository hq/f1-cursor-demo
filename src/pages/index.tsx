import { useEffect, useState } from "react";
import { getDrivers } from "~/lib/api";
import type { Driver } from "~/types/f1";
import { DriverCard } from "~/components/DriverCard";
import { Skeleton } from "~/components/ui/skeleton";
import { Layout } from "~/components/layout/Layout";

export default function Home() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const driverData = await getDrivers();
        
        // Sort drivers by championship position
        const sortedDrivers = [...driverData].sort((a, b) => {
          // Handle undefined positions
          if (a.championship_position === undefined) return 1;
          if (b.championship_position === undefined) return -1;
          return a.championship_position - b.championship_position;
        });
        
        setDrivers(sortedDrivers);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch drivers:', err);
        setError('Failed to load drivers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    void fetchDrivers();
  }, []);

  // Function to render driver card skeletons while loading
  const renderSkeletons = () => {
    return Array(10)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="h-full w-full">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-4 w-24" />
            <div className="my-4 flex justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ));
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            F1 Driver Standings <span className="text-red-600">2024</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Driver statistics and performance tracker
          </p>
        </header>

        {error && (
          <div className="mb-8 rounded-lg bg-red-100 p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? renderSkeletons()
            : drivers.map((driver) => (
                <DriverCard key={driver.driver_number} driver={driver} />
              ))}
        </div>
      </div>
    </Layout>
  );
}
