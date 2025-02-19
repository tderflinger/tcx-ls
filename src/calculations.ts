export function calculateAccumulatedTimeMinutes(min: number): number {
  return Math.trunc(min / 60);
}

export function calculateAccumulatedTimeSeconds(time: number): number | string {
  const seconds = Math.trunc(time - Math.trunc(time / 60) * 60);

  if (seconds < 10) {
    return "0" + seconds;
  }

  return seconds;
}

export function calculateAccumulatedDistance(distance: number): string {
  return (distance / 1000).toFixed(2);
}

export function calculateAltituteAscent(altitudeMin: number, altitudeMax: number): string {
  return (altitudeMax - altitudeMin).toFixed(2);
}
