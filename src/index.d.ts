/// <reference types="node" />
import type { BuildOptions } from 'esbuild';

interface CypressFileObject {
  filePath: string;
  outputPath: string;
  shouldWatch: boolean;
}
declare type CypressPlugin = (file: CypressFileObject & NodeJS.EventEmitter) => Promise<string> | string;

interface BundleOnceParams {
  filePath: string;
  outputPath: string;
  esBuildUserOptions: BuildOptions;
}

/**
 * Bundles the files only once.
 *
 * @param {BundleOnceParams} params
 * @returns {Promise<void>}
 */
declare function bundleOnce({ filePath, outputPath, esBuildUserOptions, }: BundleOnceParams): Promise<void>;


/**
 * Pass ESBuild options to be applied to each spec file
 *
 * @example
 *
 * const bundler = createBundler({
 *  define: {
 *    "process.env.NODE_ENV": '"development"'
 *  }
 * });
 * on('file:preprocessor', bundler)
 *
 * @param {BuildOptions} esBuildUserOptions
 * @returns
 */
declare function createBundler(esBuildUserOptions?: BuildOptions): CypressPlugin;

declare namespace createBundler {
  export { BundleOnceParams, BuildOptions, CypressFileObject, CypressPlugin };
}

export = createBundler;
