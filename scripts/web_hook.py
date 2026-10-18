"""Run Vite+ on only the frontend files selected by prek."""

import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
web = root / "apps" / "web"
command = ["pnpm", "exec", "vp", sys.argv[1]]
if sys.argv[1] == "fmt":
    command.append("--check")
command.extend(str((root / filename).relative_to(web)) for filename in sys.argv[2:])
sys.exit(subprocess.call(command, cwd=web))
