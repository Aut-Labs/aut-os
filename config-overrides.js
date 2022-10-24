const path = require('path');
const { alias } = require('react-app-rewire-alias');
const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
      fs: false,
      net: false,
      tls: false,
      bufferutil: false,
      'utf-8-validate': false,
    });

    config.ignoreWarnings = [/Failed to parse source map/];
    config.resolve.fallback = fallback;

    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ]);

    config.module.rules.unshift({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    const modifiedConfig = alias({
      '@assets': path.resolve(__dirname, './src/assets'),
      '@auth': path.resolve(__dirname, './src/auth'),
      '@api': path.resolve(__dirname, './src/api'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/redux'),
      '@components': path.resolve(__dirname, './src/components'),
    })(config);

    return modifiedConfig;
  },
};
