set -e

ROOT="$(pwd)"

cd ./packages/pattern
deno run -A ../../scripts/build-npm.ts pattern
cd npm_dist
npm publish --access public
cd $ROOT

# cd ./packages/rule
# deno run -A ../../scripts/build-npm.ts rule
# cd $ROOT

# cd ./packages/rle
# deno run -A ../../scripts/build-npm.ts rle
# cd $ROOT
