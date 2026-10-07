import os
import re

# 1. Scrub SCSS
components_dir = "src/scss/components"
for file in os.listdir(components_dir):
    if file.endswith(".scss"):
        path = os.path.join(components_dir, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        if file not in ["_buttons.scss", "_badges.scss", "_alerts.scss", "_toasts.scss", "_loader.scss"]:
            content = content.replace("background-color: var(--white);", "background-color: var(--bg-surface);")
            content = content.replace("background: var(--white);", "background: var(--bg-surface);")
            content = content.replace("background-color: white;", "background-color: var(--bg-surface);")
            content = content.replace("color: var(--black);", "color: var(--text-main);")
            content = content.replace("color: var(--texto);", "color: var(--text-muted);")
            
            # Additional cleanup for borders
            content = re.sub(r'border-[a-z]+:\s*1px solid rgba\(0,\s*0,\s*0,\s*0\.[0-9]+\);', 'border: 1px solid var(--border-color);', content)
            content = re.sub(r'border:\s*1px solid rgba\(0,\s*0,\s*0,\s*0\.[0-9]+\);', 'border: 1px solid var(--border-color);', content)
            
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)

# Specific fixes for accordion which has a weird padding/background bug
acc_path = "src/scss/components/_accordions.scss"
with open(acc_path, "r", encoding="utf-8") as f:
    acc = f.read()
# Make sure backgrounds are clean and transparent to inherit surface
acc = acc.replace("background-color: var(--bg-surface);", "background-color: transparent;")
acc = acc.replace("background-color: rgba(0,0,0,0.02);", "background-color: rgba(128,128,128,0.05);")
acc = acc.replace("background-color: rgba(0,0,0,0.05);", "background-color: rgba(128,128,128,0.1);")
acc = acc.replace("border: 1px solid var(--border-color);", "border: 1px solid var(--border-color);")
with open(acc_path, "w", encoding="utf-8") as f:
    f.write(acc)

# Specific fixes for tabs
tabs_path = "src/scss/components/_tabs.scss"
with open(tabs_path, "r", encoding="utf-8") as f:
    tabs = f.read()
tabs = re.sub(r'border-bottom: 2px solid rgba\(0,0,0,0\.1\);', 'border-bottom: 2px solid var(--border-color);', tabs)
with open(tabs_path, "w", encoding="utf-8") as f:
    f.write(tabs)

# 2. Scrub HTML
html_dir = "demo"
for file in os.listdir(html_dir):
    if file.endswith(".html"):
        path = os.path.join(html_dir, file)
        with open(path, "r", encoding="utf-8") as f:
            html = f.read()
        
        # Ruthlessly remove hardcoded classes that break dark mode
        html = re.sub(r'\bbg-white\b', 'bg-surface', html)
        html = re.sub(r'style="background:\s*#f8fafc;\s*color:\s*#0f172a;"', '', html)
        html = re.sub(r'style="background:\s*white.*?"', '', html)
        
        # Specifically fix the navbar in components.html which had "bg-white border-bottom"
        if file == "components.html":
            html = html.replace('class="bg-surface border-bottom p-y-3"', 'class="bg-surface border-bottom p-y-3" style="border-bottom: 1px solid var(--border-color);"')
            # Also accordion in HTML might have bg-surface hardcoded inside inner divs
            html = html.replace('bg-surface', 'bg-surface').replace('class="accordion-body p-4 text-muted bg-surface"', 'class="accordion-body p-4 text-muted"')
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)

print("Scrub completed.")
