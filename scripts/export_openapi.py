"""Export the FastAPI OpenAPI schema for @hey-api/openapi-ts."""

import json
import sys
from pathlib import Path

from api.main import app

root = Path(__file__).resolve().parents[1]


def main() -> int:
    openapi_content = app.openapi()
    for path_data in openapi_content.get("paths", {}).values():
        for operation in path_data.values():
            tags = operation.get("tags")
            operation_id = operation.get("operationId")
            if tags and isinstance(operation_id, str):
                prefix = f"{tags[0]}-"
                if operation_id.startswith(prefix):
                    operation["operationId"] = operation_id.removeprefix(prefix)

    output_path = root / "apps" / "web" / "openapi.json"
    output_path.write_text(json.dumps(openapi_content, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
