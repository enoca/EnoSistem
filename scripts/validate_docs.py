#!/usr/bin/env python3
"""Validate documentation structure: HTML head, workflow JSON, internal links."""
import json
import re
import sys
from pathlib import Path

REPO = Path("/Users/osmancagrigenc/Downloads/Enoca Projects")
HTML_FILES = [
    REPO / "KEP_Proje Dokümanı/ENOCA-KEP-Proje-Ozeti.html",
    REPO / "Connector_Proje Dokümanı/enoca_connector_sunum.html",
    REPO / "Enoprice_Proje Dokümanı/EnoPrice_Ozet.html",
    REPO / "EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html",
    REPO / "Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html",
]
MAIN_MD = REPO / "ENOCA_AI_Otomasyon_Dokumantasyonu.md"
WORKFLOW_GLOB = REPO / "n8n-docker/workflows/**/*.json"

errors = 0

def check_html(p):
    global errors
    if not p.exists():
        print(f"MISSING: {p}"); errors += 1; return
    t = p.read_text(encoding="utf-8")
    for key in ["<title>", '<meta name="description"', '<html lang="tr">', '<meta charset="UTF-8">']:
        if key not in t:
            print(f"FAIL {p.name}: missing {key}"); errors += 1
        else:
            print(f"OK   {p.name}: {key}")

def check_main_md():
    global errors
    if "(internal)" in MAIN_MD.read_text(encoding="utf-8"):
        print("FAIL main md: still has (internal) placeholders"); errors += 1
    else:
        print("OK   main md: no (internal) placeholders")

def check_workflows():
    global errors
    for f in WORKFLOW_GLOB.parent.glob("**/*.json"):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            for key in ["name", "nodes", "connections"]:
                if key not in data:
                    print(f"FAIL {f.relative_to(REPO)}: missing {key}"); errors += 1
                    return
            print(f"OK   {f.relative_to(REPO)}")
        except json.JSONDecodeError as e:
            print(f"FAIL {f.relative_to(REPO)}: invalid JSON ({e})"); errors += 1

if __name__ == "__main__":
    for p in HTML_FILES:
        check_html(p)
    check_main_md()
    check_workflows()
    print(f"\n{'OK' if errors == 0 else 'FAIL'}: {errors} errors")
    sys.exit(0 if errors == 0 else 1)
