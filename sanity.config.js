import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemaTypes";
import { fetchFromSteamAction } from "@/sanity/actions/fetchFromSteamAction";

export default defineConfig({
  name: "default",
  title: "MossGames",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // fetchFromSteamAction self-guards on document type ("game") and on
    // steamUrl being set — see sanity/actions/fetchFromSteamAction.js.
    actions: (prev) => [...prev, fetchFromSteamAction],
  },
});
