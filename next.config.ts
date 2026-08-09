import type { NextConfig } from "next";
import path from "node:path";
import { createRequire } from "node:module";
import webpack from "webpack";

const require = createRequire(import.meta.url);

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
