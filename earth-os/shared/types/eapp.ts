/**
 * .eapp Package Format Specification
 * Standard format for EarthOS applications
 */

export interface EAppManifest {
  /**
   * Unique application identifier
   * Format: lowercase alphanumeric with hyphens
   */
  id: string;

  /**
   * Human-readable application name
   */
  name: string;

  /**
   * Semantic version string
   * Format: major.minor.patch
   */
  version: string;

  /**
   * Application description
   */
  description: string;

  /**
   * Author name
   */
  author: string;

  /**
   * Application icon (relative path to PNG file)
   */
  icon: string;

  /**
   * Required permissions
   * Available: camera, storage, network, location, contacts, calendar, microphone
   */
  permissions: string[];

  /**
   * Minimum EarthOS version required
   */
  requiredVersion: string;

  /**
   * Whether this app can be uninstalled
   * Protected apps include: camera, appstore, browser, aichat, settings, files
   */
  protected: boolean;

  /**
   * Entry point file (JavaScript/TypeScript)
   */
  entryPoint: string;

  /**
   * Keywords for app store search
   */
  keywords?: string[];

  /**
   * Homepage URL
   */
  homepage?: string;

  /**
   * License type
   */
  license?: string;
}

/**
 * .eapp Package Structure
 *
 * myapp.eapp (ZIP archive)
 * ├── manifest.json       (Required - see above)
 * ├── app/
 * │   ├── index.js       (Main entry point)
 * │   └── [other files]
 * ├── permissions.json    (Optional - detailed permissions)
 * ├── icon.png           (Required - 256x256)
 * ├── install.js         (Optional - installation script)
 * └── README.md          (Optional - app documentation)
 */

export interface EAppPackageStructure {
  'manifest.json': EAppManifest;
  'app/index.js': string; // Application code
  'permissions.json'?: {
    runtime: string[];
    installation: string[];
  };
  'icon.png': string; // Base64 or file path
  'install.js'?: string; // Installation script
  'README.md'?: string; // Documentation
}

/**
 * Installation Hook
 * Optional install.js file that runs during app installation
 */
export interface InstallationHooks {
  /**
   * Runs before app is installed
   */
  beforeInstall?: () => Promise<void>;

  /**
   * Runs during installation
   */
  onInstall?: () => Promise<void>;

  /**
   * Runs after app is installed
   */
  afterInstall?: () => Promise<void>;

  /**
   * Runs before app is uninstalled
   */
  beforeUninstall?: () => Promise<void>;

  /**
   * Runs during uninstall
   */
  onUninstall?: () => Promise<void>;

  /**
   * Runs after app is uninstalled
   */
  afterUninstall?: () => Promise<void>;
}

/**
 * Example manifest.json
 */
export const EXAMPLE_MANIFEST: EAppManifest = {
  id: 'com-example-myapp',
  name: 'My App',
  version: '1.0.0',
  description: 'My first EarthOS app',
  author: 'Developer Name',
  icon: 'icon.png',
  permissions: ['storage', 'network'],
  requiredVersion: '1.0.0',
  protected: false,
  entryPoint: 'app/index.js',
  keywords: ['utility', 'productivity'],
  homepage: 'https://example.com',
  license: 'MIT',
};

/**
 * How to create an .eapp package
 *
 * 1. Create your app directory structure
 * 2. Create manifest.json in root
 * 3. Create app/ directory with index.js entry point
 * 4. Add icon.png (256x256)
 * 5. Zip everything into myapp.eapp
 *
 * Commands:
 * $ mkdir myapp
 * $ cd myapp
 * $ npm init -y
 * $ mkdir app
 * $ echo 'export default { name: "My App" };' > app/index.js
 * $ cp /path/to/icon.png .
 * $ cat > manifest.json << EOF
 * {
 *   "id": "myapp",
 *   "name": "My App",
 *   ...
 * }
 * $ zip -r ../myapp.eapp .
 */
