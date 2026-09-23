import { rbpnDealers } from "./rbpnDealers";
import { getLocationByName } from "./phLocations";

// Haversine distance between two lat/lng points, in kilometers.
function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius, km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Finds the RBPN dealer to route a customer's inquiry to, based on their
 * chosen location (a name from phLocations.js).
 *
 * Because each of the 19 designated dealer areas shares its exact
 * coordinates with the matching entry in phLocations (e.g. "Cavite" →
 * "Cavite", "Camarines Sur" → the Naga/Bicol dealer's coordinates), picking
 * the nearest dealer by straight-line distance naturally reproduces an
 * "exact match" (distance ~0) whenever the customer's area IS one of the 19
 * — no separate exact-match step is needed. Anywhere else, it's a genuine
 * nearest-dealer fallback.
 *
 * Returns { dealer, distanceKm, exact } or null if the location name isn't
 * recognized at all.
 */
export function matchDealer(locationName) {
  const location = getLocationByName(locationName);
  if (!location) return null;

  let best = null;
  for (const dealer of rbpnDealers) {
    const d = distanceKm(location.lat, location.lng, dealer.lat, dealer.lng);
    if (!best || d < best.distanceKm) {
      best = { dealer, distanceKm: d };
    }
  }

  return {
    dealer: best.dealer,
    distanceKm: Math.round(best.distanceKm),
    exact: best.distanceKm < 5, // within ~5km counts as the same area
  };
}
