/// <reference types="node" />
import { BuildOptions } from 'esbuild';

export interface CypressFileObject {
  filePath: string;
  outputPath: string;
  shouldWatch: boolean;
}
export declare type CypressPlugin = (file: CypressFileObject & NodeJS.EventEmitter) => Promise<string> | string;

export interface BundleOnceParams {
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
export declare const bundleOnce: ({ filePath, outputPath, esBuildUserOptions, }: BundleOnceParams) => Promise<void>;


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
export declare const createBundler: (esBuildUserOptions?: BuildOptions) => CypressPlugin;
