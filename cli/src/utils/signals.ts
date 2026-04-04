/**
 * Signal Handling for AutoSpec CLI
 * Handles SIGINT/SIGTERM: kill child processes, clean temp files, print resume hint.
 */

import type { ChildProcess } from 'child_process';

let activeChildren: ChildProcess[] = [];
let cleanupCallbacks: (() => Promise<void>)[] = [];
let srsPath: string = '';

export function registerChildProcess(child: ChildProcess): void {
  activeChildren.push(child);
}

export function unregisterChildProcess(child: ChildProcess): void {
  activeChildren = activeChildren.filter(c => c !== child);
}

export function registerCleanup(callback: () => Promise<void>): void {
  cleanupCallbacks.push(callback);
}

export function setSrsPath(path: string): void {
  srsPath = path;
}

export function setupSignalHandlers(): void {
  const handler = async (signal: string) => {
    console.log(`\n\n  Generation interrupted (${signal}).`);

    // Kill active child processes
    for (const child of activeChildren) {
      try {
        child.kill('SIGTERM');
      } catch {
        // Process may already be dead
      }
    }

    // Run cleanup callbacks (temp files, etc.)
    for (const cleanup of cleanupCallbacks) {
      try {
        await cleanup();
      } catch {
        // Best effort cleanup
      }
    }

    if (srsPath) {
      console.log(`  Resume from where you left off:`);
      console.log(`    autospec generate ${srsPath}\n`);
    }

    process.exit(1);
  };

  process.on('SIGINT', () => handler('SIGINT'));
  process.on('SIGTERM', () => handler('SIGTERM'));
}
