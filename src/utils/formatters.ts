/**
 * Format a time value in seconds to a human-readable format
 */
export const formatTime = (timeInSeconds?: number): string => {
  if (!timeInSeconds) return 'N/A';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get the correct suffix for a number (1st, 2nd, 3rd, etc.)
 */
export const getNumberSuffix = (number: number): string => {
  if (!number) return '';
  
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }
  
  switch (lastDigit) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

/**
 * Format a number with its corresponding suffix
 */
export const formatOrdinal = (number?: number): string => {
  if (!number) return 'N/A';
  return `${number}${getNumberSuffix(number)}`;
};

/**
 * Convert milliseconds to seconds
 */
export const msToSeconds = (ms: number): number => {
  return ms / 1000;
};

/**
 * Convert seconds to milliseconds
 */
export const secondsToMs = (seconds: number): number => {
  return seconds * 1000;
}; 