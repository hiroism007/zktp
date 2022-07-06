/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
            config.plugins.push(
                new webpack.ProvidePlugin({
                    global: "global",
                }),
                new webpack.ProvidePlugin({
                    Buffer: ["buffer", "Buffer"],
                })
            );

            config.resolve.fallback = {
                fs: false,
                stream: false,
                crypto: false,
                os: false,
                readline: false,
                ejs: false,
                buffer: require.resolve("buffer"),
                assert: require.resolve("assert"),
                path: false,
            };

            return config;
        }

        return config;
    },
};

module.exports = nextConfig;
