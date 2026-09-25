export const MAX_TOUR_CONSTRAINT_POIS = 5;

export function tourConstraintIds(value: string): string[] {
  return [...new Set(value.split(',').map((id) => id.trim()).filter(Boolean))]
    .slice(0, MAX_TOUR_CONSTRAINT_POIS);
}

export function updateTourConstraint(value: string, index: number, poiId: string): string {
  const ids = tourConstraintIds(value);
  if (index < 0 || index >= MAX_TOUR_CONSTRAINT_POIS || index > ids.length) return ids.join(',');
  if (!poiId) ids.splice(index, 1);
  else if (index === ids.length) ids.push(poiId);
  else ids[index] = poiId;
  return [...new Set(ids)].slice(0, MAX_TOUR_CONSTRAINT_POIS).join(',');
}
