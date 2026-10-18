"""Run both development servers and terminate their process groups together."""

import os
import shlex
import signal
import subprocess
import sys
import time
import tomllib
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[1]
    config = tomllib.loads((root / "mise.toml").read_text())
    processes = []
    stopping = False

    def stop(_signum, _frame):
        nonlocal stopping
        stopping = True

    signal.signal(signal.SIGINT, stop)
    signal.signal(signal.SIGTERM, stop)
    result = 0
    dev_tasks = [t for t in config.get("tasks", {}) if t.startswith("dev:")]
    try:
        for task in dev_tasks:
            processes.append(
                subprocess.Popen(
                    shlex.split(config["tasks"][task]["run"]),
                    cwd=root,
                    start_new_session=True,
                )
            )
        while not stopping:
            exited = next((p for p in processes if p.poll() is not None), None)
            if exited is not None:
                result = exited.returncode or 1
                break
            time.sleep(0.2)
    finally:
        for process in processes:
            try:
                os.killpg(process.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
        deadline = time.monotonic() + 5
        for process in processes:
            try:
                process.wait(timeout=max(0.01, deadline - time.monotonic()))
            except subprocess.TimeoutExpired:
                os.killpg(process.pid, signal.SIGKILL)
                process.wait()
    return result


if __name__ == "__main__":
    sys.exit(main())
