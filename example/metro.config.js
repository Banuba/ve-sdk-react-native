// example/metro.config.js

const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const rootDir = path.resolve(__dirname, '..');

const defaultConfig = getDefaultConfig(__dirname);

// Modules to force Metro to resolve from the root node_modules
const extraNodeModules = {
  'react': path.join(rootDir, 'node_modules', 'react'),
  'react-native': path.join(rootDir, 'node_modules', 'react-native'),
};

module.exports = {
  ...defaultConfig,

  projectRoot: path.resolve(__dirname),
  watchFolders: [path.resolve(__dirname), rootDir],

  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules,
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(rootDir, 'node_modules'),
    ],
  },

  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
        unstable_disableReactNativeCodegen: true
      },
    }),
  },
};
