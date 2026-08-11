import type { NextConfig } from "next";
import path from "node:path";
import { createRequire } from "node:module";
import webpack from "webpack";

const require = createRequire(import.meta.url);

const UNIVER_PACKAGES = [
  "core",
  "data-validation",
  "design",
  "docs",
  "docs-hyper-link",
  "docs-hyper-link-ui",
  "docs-ui",
  "drawing",
  "drawing-ui",
  "engine-formula",
  "engine-render",
  "find-replace",
  "rpc",
  "sheets",
  "sheets-conditional-formatting",
  "sheets-conditional-formatting-ui",
  "sheets-data-validation",
  "sheets-data-validation-ui",
  "sheets-drawing",
  "sheets-drawing-ui",
  "sheets-filter",
  "sheets-filter-ui",
  "sheets-find-replace",
  "sheets-formula",
  "sheets-formula-ui",
  "sheets-hyper-link",
  "sheets-hyper-link-ui",
  "sheets-note",
  "sheets-note-ui",
  "sheets-numfmt",
  "sheets-numfmt-ui",
  "sheets-sort",
  "sheets-sort-ui",
  "sheets-table",
  "sheets-table-ui",
  "sheets-thread-comment",
  "sheets-thread-comment-ui",
  "sheets-ui",
  "slides",
  "slides-ui",
  "themes",
  "thread-comment",
  "thread-comment-ui",
  "ui",
] as const;

/** Force one physical copy of each @univerjs package (redi breaks with duplicates). */
function univerPackageRoot(name: string): string {
  const entry = require.resolve(`@univerjs/${name}`);
  return path.resolve(path.dirname(entry), "../..");
}

function univerWebpackAliases(): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const name of UNIVER_PACKAGES) {
    try {
      const root = univerPackageRoot(name);
      // Exact import — single ESM bundle copy (fixes redi "already exists" warnings).
      aliases[`@univerjs/${name}$`] = path.join(root, "lib/es/index.js");
      // Locale JSON modules live under lib/es/locale/.
      aliases[`@univerjs/${name}/locale/`] = path.join(root, "lib/es/locale/");
      // Package CSS lives under lib/*.css at the package root.
      aliases[`@univerjs/${name}/lib/`] = path.join(root, "lib/");
    } catch {
      /* optional peer — skip if not installed */
    }
  }
  // icons uses dist/esm (require.resolve picks a missing dist/cjs path).
  try {
    aliases["@univerjs/icons$"] = require.resolve(
      "@univerjs/icons/dist/esm/index.js",
    );
  } catch {
    /* optional */
  }
  return aliases;
}

function resolveSchnsrwWasm(): string {
  try {
    const pkg = path.dirname(require.resolve("@schnsrw/core/package.json"));
    return path.join(pkg, "wasm/s1engine_wasm_bg.wasm");
  } catch {
    return path.join(
      __dirname,
      "node_modules/@schnsrw/core/wasm/s1engine_wasm_bg.wasm",
    );
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: false,
  reactCompiler: true,
  // Suite SDKs ship as source / mixed React 18 types; webpack already validates the graph.
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    "@hex/docs",
    "@hex/sheets",
    "@hex/slides",
    "@hex/pdf",
    "@casualoffice/pdf",
    "@casualoffice/docs",
    "@casualoffice/sheets",
  ],
  turbopack: {},
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      ...univerWebpackAliases(),
      "s1engine_wasm_bg.wasm": resolveSchnsrwWasm(),
      "@univerjs/docs-mention-ui": path.resolve(
        __dirname,
        "packages/stubs/docs-mention-ui",
      ),
      "node:fs": false,
      "node:https": false,
      "node:http": false,
      "node:path": false,
      "node:crypto": false,
      "node:stream": false,
      "node:url": false,
      "node:zlib": false,
      "node:buffer": false,
      "node:util": false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        path: false,
        crypto: false,
        stream: false,
        zlib: false,
        net: false,
        tls: false,
        child_process: false,
        buffer: false,
        util: false,
        url: false,
      };
    }

    config.module.rules.push(
      {
        test: /\.wasm$/,
        type: "asset/resource",
      },
      {
        test: /\.ttf$/,
        type: "asset/resource",
      },
    );

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    );

    return config;
  },
};

export default nextConfig;
