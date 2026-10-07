import json

path = "package.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

data["name"] = "frame-per"
data["description"] = "Frame PER - Modern UI Framework (CSS & JS)"
data["scripts"]["build:js"] = "terser src/js/framePER.js -o dist/framePER.min.js -c -m --source-map \"url='framePER.min.js.map'\""
data["scripts"]["build:js-copy"] = "node -e \"require('fs').copyFileSync('src/js/framePER.js', 'dist/framePER.js')\""
data["scripts"]["build"] = "npm run build:sass && npm run build:postcss && npm run build:js-copy && npm run build:js"

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("package.json updated.")
