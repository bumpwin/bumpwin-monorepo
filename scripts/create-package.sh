#!/bin/bash

# Check arguments
if [ -z "$1" ]; then
  echo "Usage: $0 <package-name>"
  exit 1
fi

PACKAGE_NAME=$1
PACKAGE_DIR="packages/$PACKAGE_NAME"

# Check if directory already exists
if [ -d "$PACKAGE_DIR" ]; then
  echo "Package directory $PACKAGE_DIR already exists."
  exit 1
fi

# Create directories
mkdir -p "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/src"
cd "$PACKAGE_DIR"

# Create package.json
cat > package.json << EOF
{
  "name": "@workspace/$PACKAGE_NAME",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup"
  }
}
EOF

# Create tsup.config.ts
cat > tsup.config.ts << EOF
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  target: "esnext",
  dts: true,
  clean: true,
});
EOF

# Create basic index.ts
cat > index.ts << EOF
// $PACKAGE_NAME package

export const hello = () => {
  console.log("Hello from @workspace/$PACKAGE_NAME");
};
EOF

# Create .gitignore
cat > .gitignore << EOF
node_modules
.DS_Store
dist
EOF

echo "Package @workspace/$PACKAGE_NAME created successfully in $PACKAGE_DIR"