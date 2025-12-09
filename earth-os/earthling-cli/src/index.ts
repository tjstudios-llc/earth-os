#!/usr/bin/env ts-node

/**
 * EarthOS Command Line Interface
 * Manage devices, apps, updates, and more from the command line
 */

import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import { cryptoUtils } from '../../shared/utils/crypto';

const program = new Command();

program.name('earthos').description('EarthOS CLI - Manage your EarthOS devices').version('1.0.0');

// Configuration
const DAEMON_URL = process.env.DAEMON_URL || 'http://localhost:3002';
const SHELL_URL = process.env.SHELL_URL || 'http://localhost:3003';
const APPSTORE_URL = process.env.APPSTORE_URL || 'http://localhost:3004';
const UPDATER_URL = process.env.UPDATER_URL || 'http://localhost:3005';
const SIMULATOR_URL = process.env.SIMULATOR_URL || 'http://localhost:3006';

// ============ DEVICE COMMANDS ============

program
  .command('device:register')
  .description('Register a new device')
  .argument('<name>', 'Device name')
  .action(async (name) => {
    try {
      console.log(chalk.blue('🌍 Registering device...'));
      const response = await axios.post(`${DAEMON_URL}/register-device`, { deviceName: name });

      if (response.data.success) {
        console.log(chalk.green('✓ Device registered successfully!'));
        console.log(chalk.cyan(`Device ID: ${response.data.data.deviceId}`));
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

program
  .command('device:list')
  .description('List all devices')
  .action(async () => {
    try {
      console.log(chalk.blue('📋 Fetching devices...'));
      // In a real scenario, this would fetch from a devices registry
      console.log(chalk.green('✓ Devices fetched'));
      console.log(chalk.gray('(Device registry not yet implemented)'));
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

program
  .command('device:info')
  .description('Get device information')
  .argument('<deviceId>', 'Device ID')
  .action(async (deviceId) => {
    try {
      console.log(chalk.blue('ℹ️  Fetching device info...'));
      const response = await axios.get(`${DAEMON_URL}/system/config`, {
        params: { deviceId },
      });

      if (response.data.success) {
        const config = response.data.data;
        console.log(chalk.green('✓ Device info:'));
        console.log(chalk.cyan(`  Name: ${config.deviceName}`));
        console.log(chalk.cyan(`  Theme: ${config.theme}`));
        console.log(chalk.cyan(`  OS Version: ${config.osVersion}`));
        console.log(chalk.cyan(`  Auto Sync: ${config.autoSync}`));
        console.log(chalk.cyan(`  Auto Update: ${config.autoUpdate}`));
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

// ============ APP COMMANDS ============

program
  .command('app:list')
  .description('List installed apps on a device')
  .argument('<deviceId>', 'Device ID')
  .action(async (deviceId) => {
    try {
      console.log(chalk.blue('📱 Fetching installed apps...'));
      const response = await axios.get(`${DAEMON_URL}/apps/list`, {
        params: { deviceId },
      });

      if (response.data.success) {
        const apps = response.data.data;
        console.log(chalk.green(`✓ Found ${apps.length} app(s):`));
        apps.forEach((app: any) => {
          const icon = app.protected ? '🔒' : '📦';
          console.log(chalk.cyan(`  ${icon} ${app.name} v${app.version}`));
        });
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

program
  .command('app:install')
  .description('Install an app')
  .argument('<deviceId>', 'Device ID')
  .argument('<appId>', 'App ID')
  .argument('[version]', 'App version (default: 1.0.0)')
  .action(async (deviceId, appId, version = '1.0.0') => {
    try {
      console.log(chalk.blue('📥 Installing app...'));
      const response = await axios.post(`${DAEMON_URL}/apps/install`, {
        deviceId,
        appId,
        name: appId.charAt(0).toUpperCase() + appId.slice(1),
        version,
        icon: `${appId}.png`,
      });

      if (response.data.success) {
        console.log(chalk.green(`✓ App installed: ${appId} v${version}`));
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

program
  .command('app:remove')
  .description('Remove an app')
  .argument('<deviceId>', 'Device ID')
  .argument('<appId>', 'App ID')
  .action(async (deviceId, appId) => {
    try {
      console.log(chalk.blue('🗑️  Removing app...'));
      const response = await axios.delete(`${DAEMON_URL}/apps/remove`, {
        params: { deviceId, appId },
      });

      if (response.data.success) {
        console.log(chalk.green(`✓ App removed: ${appId}`));
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

// ============ STORE COMMANDS ============

program
  .command('store:browse')
  .description('Browse available apps')
  .action(async () => {
    try {
      console.log(chalk.blue('🛒 Browsing app store...'));
      const response = await axios.get(`${APPSTORE_URL}/apps`);

      if (response.data.success) {
        const apps = response.data.data;
        console.log(chalk.green(`✓ Found ${apps.length} app(s):`));
        apps.forEach((app: any) => {
          console.log(chalk.cyan(`  ${app.name} - ${app.description}`));
          console.log(chalk.gray(`    ID: ${app.id} | Size: ${(app.size / 1024 / 1024).toFixed(1)}MB`));
        });
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

program
  .command('store:search')
  .description('Search for apps')
  .argument('<query>', 'Search query')
  .action(async (query) => {
    try {
      console.log(chalk.blue(`🔍 Searching for "${query}"...`));
      const response = await axios.get(`${APPSTORE_URL}/apps/search`, {
        params: { q: query },
      });

      if (response.data.success) {
        const apps = response.data.data;
        if (apps.length === 0) {
          console.log(chalk.yellow('No apps found'));
        } else {
          console.log(chalk.green(`✓ Found ${apps.length} result(s):`));
          apps.forEach((app: any) => {
            console.log(chalk.cyan(`  ${app.name} - ${app.description}`));
          });
        }
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

// ============ UPDATE COMMANDS ============

program
  .command('update:check')
  .description('Check for OS updates')
  .argument('<deviceId>', 'Device ID')
  .argument('[version]', 'Current version (default: 1.0.0)')
  .action(async (deviceId, version = '1.0.0') => {
    try {
      console.log(chalk.blue('🔄 Checking for updates...'));
      const response = await axios.get(`${UPDATER_URL}/updates/check`, {
        params: { deviceId, currentVersion: version },
      });

      if (response.data.success) {
        const { isUpdateAvailable, latestVersion } = response.data.data;
        if (isUpdateAvailable) {
          console.log(chalk.green(`✓ Update available: v${latestVersion}`));
        } else {
          console.log(chalk.green('✓ System is up to date'));
        }
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

// ============ SIMULATOR COMMANDS ============

program
  .command('sim:spawn')
  .description('Spawn a virtual device')
  .argument('[name]', 'Device name')
  .action(async (name = 'Virtual Device') => {
    try {
      console.log(chalk.blue('🎮 Spawning virtual device...'));
      const response = await axios.post(`${SIMULATOR_URL}/devices/spawn`, { name });

      if (response.data.success) {
        const device = response.data.data;
        console.log(chalk.green('✓ Device spawned!'));
        console.log(chalk.cyan(`  Device ID: ${device.deviceId}`));
        console.log(chalk.cyan(`  Name: ${device.name}`));
        console.log(chalk.cyan(`  Status: ${device.status}`));
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

program
  .command('sim:list')
  .description('List virtual devices')
  .action(async () => {
    try {
      console.log(chalk.blue('📋 Listing virtual devices...'));
      const response = await axios.get(`${SIMULATOR_URL}/devices`);

      if (response.data.success) {
        const devices = response.data.data;
        if (devices.length === 0) {
          console.log(chalk.yellow('No virtual devices running'));
        } else {
          console.log(chalk.green(`✓ ${devices.length} device(s) running:`));
          devices.forEach((device: any) => {
            console.log(chalk.cyan(`  ${device.name} (${device.deviceId})`));
            console.log(chalk.gray(`    Status: ${device.status} | Uptime: ${device.uptime}s`));
          });
        }
      } else {
        console.log(chalk.red(`✗ Error: ${response.data.error}`));
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Error: ${error.message}`));
    }
  });

// ============ UTILITY COMMANDS ============

program
  .command('generate-device-id')
  .description('Generate a new device ID')
  .action(() => {
    const deviceId = cryptoUtils.generateDeviceId();
    console.log(chalk.green('Generated Device ID:'));
    console.log(chalk.cyan(deviceId));
  });

program
  .command('health')
  .description('Check service health')
  .action(async () => {
    try {
      const services = [
        { name: 'Daemon', url: `${DAEMON_URL}/health` },
        { name: 'Shell', url: `${SHELL_URL}/health` },
        { name: 'App Store', url: `${APPSTORE_URL}/health` },
        { name: 'Updater', url: `${UPDATER_URL}/health` },
        { name: 'Simulator', url: `${SIMULATOR_URL}/health` },
      ];

      console.log(chalk.blue('🏥 Checking service health...\n'));

      for (const service of services) {
        try {
          const response = await axios.get(service.url, { timeout: 2000 });
          console.log(chalk.green(`✓ ${service.name}`));
        } catch {
          console.log(chalk.red(`✗ ${service.name}`));
        }
      }
    } catch (error) {
      console.log(chalk.red(`✗ Error: ${error}`));
    }
  });

program.parse(process.argv);
