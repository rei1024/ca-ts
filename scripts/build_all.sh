set -e

# Check if the first argument is 'publish'
SHOULD_PUBLISH=false
if [ "$1" == "publish" ]; then
  SHOULD_PUBLISH=true
  echo "Publish mode enabled."
else
  echo "Publish mode disabled. To publish, run the script with the 'publish' argument."
fi

ROOT="$(pwd)"

# Function to build and optionally publish a package
build_and_publish() {
    local package_name=$1
    echo "--- Processing $package_name ---"
    cd "./packages/$package_name"
    deno run -A "../../scripts/build-npm.ts" "$package_name"

    if $SHOULD_PUBLISH; then
        echo "Publishing $package_name..."
        cd npm_dist
        npm publish --access public
        echo "$package_name published successfully."
    else
        echo "Skipping npm publish for $package_name."
    fi

    # Return to the root directory
    cd "$ROOT"
    echo "--- Finished $package_name ---"
}

# Process each package
build_and_publish pattern
build_and_publish rule
build_and_publish rle
build_and_publish rule-format
build_and_publish algo

echo "All packages processed."
