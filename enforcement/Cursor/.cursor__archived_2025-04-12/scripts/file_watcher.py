#!/usr/bin/env python3
"""
File Watcher - Auto-trigger enforcer on file changes.
Enables fully autonomous Two-Brain operation.

Last Updated: 2025-12-04
"""

import time
import subprocess
import sys
from pathlib import Path
from typing import Set

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    WATCHDOG_AVAILABLE = True
except ImportError:
    WATCHDOG_AVAILABLE = False
    print("⚠️ watchdog library not installed")
    print("   Install with: pip install watchdog")
    print("   File watcher will not work without it")


class EnforcerTrigger(FileSystemEventHandler):
    """Trigger enforcer when code files change."""
    
    # Code file extensions to watch
    CODE_EXTENSIONS = {".ts", ".tsx", ".py", ".js", ".jsx", ".mdc"}
    
    # Directories to ignore
    IGNORE_DIRS = {
        "node_modules",
        ".git",
        ".cursor/enforcement",  # Don't watch enforcement files themselves
        ".cursor/context_manager",  # Don't watch context manager files
        "dist",
        "build",
        ".next",
        "__pycache__",
        ".pytest_cache"
    }
    
    def __init__(self, debounce_seconds: int = 5, project_root: Path = None):
        self.debounce_seconds = debounce_seconds
        self.last_trigger = 0
        self.project_root = project_root or Path.cwd()
        
        # Find fix loop script
        possible_paths = [
            self.project_root / ".cursor" / "enforcement" / "fix_loop.py",
            self.project_root / ".cursor" / "scripts" / "fix_loop.py",
        ]
        for path in possible_paths:
            if path.exists():
                self.fix_loop_script = path
                break
        else:
            # Fallback: use enforcer directly
            self.fix_loop_script = None
            enforcer_paths = [
                self.project_root / ".cursor" / "enforcement" / "auto-enforcer.py",
                self.project_root / ".cursor" / "scripts" / "auto-enforcer.py",
            ]
            for path in enforcer_paths:
                if path.exists():
                    self.enforcer_script = path
                    break
            else:
                raise FileNotFoundError("Could not find fix_loop.py or auto-enforcer.py")
        
        self.triggered_files: Set[Path] = set()
    
    def _should_ignore(self, file_path: Path) -> bool:
        """Check if file should be ignored."""
        # Check if in ignored directory
        for part in file_path.parts:
            if part in self.IGNORE_DIRS:
                return True
        
        # Check extension
        if file_path.suffix not in self.CODE_EXTENSIONS:
            return True
        
        return False
    
    def on_modified(self, event):
        """Handle file modification events."""
        if event.is_directory:
            return
        
        file_path = Path(event.src_path)
        
        # Normalize path relative to project root
        try:
            rel_path = file_path.relative_to(self.project_root)
        except ValueError:
            # File outside project root, ignore
            return
        
        # Check if should ignore
        if self._should_ignore(rel_path):
            return
        
        # Debounce (avoid triggering too frequently)
        now = time.time()
        if now - self.last_trigger < self.debounce_seconds:
            return
        
        self.last_trigger = now
        self.triggered_files.add(rel_path)
        
        print(f"\n📝 File changed: {rel_path}")
        print("🔄 Triggering auto-enforcer...")
        
        # Run fix loop (which runs enforcer → LLM → enforcer)
        self._run_fix_loop()
    
    def _run_fix_loop(self):
        """Run the autonomous fix loop."""
        
        if self.fix_loop_script:
            script = self.fix_loop_script
            args = [sys.executable, str(script), "--skip-initial-audit"]
        elif hasattr(self, 'enforcer_script'):
            script = self.enforcer_script
            args = [sys.executable, str(script)]  # No "audit" command needed
        else:
            print("❌ No fix loop or enforcer script found")
            return
        
        try:
            # Run in background (non-blocking)
            process = subprocess.Popen(
                args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=self.project_root
            )
            
            print(f"   Started: {script.name}")
            print(f"   Process ID: {process.pid}")
            print("   (Running in background)")
            
            # Don't wait for completion (non-blocking)
            # The process will complete on its own
            
        except Exception as e:
            print(f"❌ Failed to start fix loop: {e}")


def main():
    """Run file watcher."""
    
    if not WATCHDOG_AVAILABLE:
        print("❌ Cannot run file watcher without watchdog library")
        print("   Install with: pip install watchdog")
        sys.exit(1)
    
    print("👁️  VeroField File Watcher")
    print("   Watching for code changes...")
    print("   Will auto-trigger enforcer on modifications\n")
    
    project_root = Path.cwd()
    
    # Watch directories
    watch_paths = [
        project_root / "apps",
        project_root / "libs",
        project_root / "frontend",
        project_root / "VeroFieldMobile",
    ]
    
    # Filter to only existing paths
    watch_paths = [p for p in watch_paths if p.exists()]
    
    if not watch_paths:
        print("⚠️ No watchable directories found")
        print("   Expected: apps/, libs/, frontend/, or VeroFieldMobile/")
        sys.exit(1)
    
    # Create observer
    event_handler = EnforcerTrigger(debounce_seconds=5, project_root=project_root)
    observer = Observer()
    
    # Schedule watches
    for path in watch_paths:
        observer.schedule(event_handler, str(path), recursive=True)
        print(f"✓ Watching: {path}")
    
    # Start watching
    observer.start()
    print("\n🟢 File watcher active")
    print("   Press Ctrl+C to stop\n")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping file watcher...")
        observer.stop()
    
    observer.join()
    print("✅ File watcher stopped")


if __name__ == "__main__":
    main()
