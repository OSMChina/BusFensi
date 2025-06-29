import { PointWGS84 } from "../../utils/geo/types";

/**
 * Defines the options for the OSRM route request.
 */
interface OsrmRouteOptions {
  /** The mode of transportation. Defaults to 'driving'. */
  profile?: 'driving' | 'bike' | 'foot';
  /** A list of road classes to avoid (e.g., 'motorway', 'toll'). */
  exclude?: string[];
  /** Search for alternative routes. */
  alternatives?: boolean | number;
  /** Return route steps for each route leg. */
  steps?: boolean;
  /** Returned route geometry format. */
  geometries?: 'polyline' | 'polyline6' | 'geojson';
  /** Add overview geometry to the response. */
  overview?: 'simplified' | 'full' | false;
}

/**
 * Represents the successful response from the OSRM Route service.
 * The structure is based on the provided OSRM API documentation.
 */
interface OsrmRouteResponse {
  code: 'Ok' | string;
  message?: string;
  routes: Array<{
    geometry: object; // Can be a string (polyline) or a GeoJSON object
    legs: Array<{
      summary: string;
      weight: number;
      duration: number;
      distance: number;
      steps: object[]; // Define more specific type if steps are requested
    }>;
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
  }>;
  waypoints: Array<{
    hint: string;
    distance: number;
    name: string;
    location: [number, number]; // [longitude, latitude]
  }>;
}


/**
 * Fetches a route from the OSRM API given a set of waypoints and options.
 *
 * @param waypoints An array of Waypoint objects, where the first is the start, the last is the end,
 * and any intermediate points are stops along the route. Must contain at least two waypoints.
 * @param options Optional parameters to customize the route request, such as profile and restrictions.
 * @param osrmBaseUrl The base URL of the OSRM server. Defaults to the public OSRM demo server.
 * @returns A Promise that resolves to the OSRM route response JSON object.
 * @throws Will throw an error if the network request fails or if OSRM returns an error.
 */
export async function getOsrmRoute(
  waypoints: PointWGS84[],
  options: OsrmRouteOptions = {},
  osrmBaseUrl: string = 'http://router.project-osrm.org'
): Promise<OsrmRouteResponse> {

  if (waypoints.length < 2) {
    throw new Error("You must provide at least two waypoints (a start and an end).");
  }

  // Set default profile if not provided
  const profile = options.profile || 'driving';

  // Format coordinates into {longitude},{latitude};... string
  const coordinatesString = waypoints
    .map(wp => `${wp.lon},${wp.lat}`)
    .join(';');

  // Construct the base URL
  const requestUrl = new URL(`/route/v1/${profile}/${coordinatesString}`, osrmBaseUrl);

  // Add query parameters from options
  const params = new URLSearchParams();
  if (options.alternatives !== undefined) {
    params.append('alternatives', String(options.alternatives));
  }
  if (options.steps !== undefined) {
    params.append('steps', String(options.steps));
  }
  if (options.geometries) {
    params.append('geometries', options.geometries);
  }
  if (options.overview) {
    params.append('overview', String(options.overview));
  }
  if (options.exclude && options.exclude.length > 0) {
    params.append('exclude', options.exclude.join(','));
  }

  requestUrl.search = params.toString();

  try {
    const response = await fetch(requestUrl.toString());

    if (!response.ok) {
      // OSRM returns 400 for invalid requests, with a JSON error message
      const errorData = await response.json();
      throw new Error(`OSRM API Error: ${errorData.message || response.statusText}`);
    }

    const data: OsrmRouteResponse = await response.json();

    if (data.code !== 'Ok') {
        throw new Error(`OSRM routing failed with code: ${data.code}. Message: ${data.message}`);
    }

    return data;

  } catch (error) {
    console.error("Failed to fetch OSRM route:", error);
    throw error;
  }
}

// --- Example Usage ---

// async function main() {
//   // Define waypoints for a route in Berlin.
//   // Start: Brandenburg Gate, Stop: Reichstag Building, End: Berlin Cathedral
//   const routeWaypoints: PointWGS84[] = [
//     { lon: 13.3777, lat: 52.5163 }, // Brandenburg Gate
//     { lon: 13.3761, lat: 52.5186 }, // Reichstag Building
//     { lon: 13.4011, lat: 52.5192 }  // Berlin Cathedral
//   ];

//   // Define options, including a path restriction to avoid motorways.
//   const routeOptions: OsrmRouteOptions = {
//     profile: 'driving',
//     steps: true,
//     geometries: 'geojson',
//     overview: 'full',
//     exclude: ['motorway']
//   };

//   try {
//     console.log("Requesting route from OSRM...");
//     const routeData = await getOsrmRoute(routeWaypoints, routeOptions);

//     console.log("Successfully retrieved route!");

//     // Print out the main route's duration and distance
//     const mainRoute = routeData.routes[0];
//     const durationMinutes = (mainRoute.duration / 60).toFixed(2);
//     const distanceKm = (mainRoute.distance / 1000).toFixed(2);

//     console.log(`\nRoute Details:`);
//     console.log(`- Duration: ${durationMinutes} minutes`);
//     console.log(`- Distance: ${distanceKm} km`);

//     // You can now use the full 'routeData' object, for example, to draw the route on a map
//     // using the GeoJSON geometry.
//     // console.log("\nFull response:", JSON.stringify(routeData, null, 2));

//   } catch (error) {
//     console.error("An error occurred during the example usage:", error);
//   }
// }

// // Run the example
// main();