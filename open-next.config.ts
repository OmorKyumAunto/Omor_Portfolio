import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Every page is prerendered at build time and nothing revalidates on demand,
 * so the prerendered payloads are served straight from Workers static assets.
 *
 * Without an incremental cache override the Worker has no way to read those
 * payloads and every statically-generated dynamic route (/work/[slug]) 404s.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
