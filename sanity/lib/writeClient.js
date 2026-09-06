import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Server-only — never import this from a Client Component or anything that
// ships to the browser (unlike sanity/lib/client.js's read client). Used by
// app/api/sanity/import-steam/route.js to upload assets and patch documents,
// which SANITY_API_READ_TOKEN can't do.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
