import os
import json
import threading
import time
import shutil

def convert_json_to_netscape(json_file, txt_file):
    """Convert Chrome-style cookies.json → Netscape cookies.txt"""
    with open(json_file, "r", encoding="utf-8") as f:
        cookies = json.load(f)

    with open(txt_file, "w", encoding="utf-8") as f:
        f.write("# Netscape HTTP Cookie File\n")
        f.write("# This file is generated automatically.\n")
        for c in cookies:
            domain = c.get("domain", "")
            flag = "TRUE" if domain.startswith(".") else "FALSE"
            path = c.get("path", "/")
            secure = "TRUE" if c.get("secure") else "FALSE"
            expiration = str(c.get("expirationDate", "0")).split(".")[0]
            name = c.get("name", "")
            value = c.get("value", "")
            f.write("\t".join([domain, flag, path, secure, expiration, name, value]) + "\n")

def refresh_cookies():
    """Refresh cookies.json → cookies.txt if exists"""
    base_dir = os.path.dirname(__file__)
    cookies_json = os.path.join(base_dir, "cookies.json")
    cookies_txt = os.path.join(base_dir, "cookies.txt")

    if os.path.exists(cookies_json):
        try:
            convert_json_to_netscape(cookies_json, cookies_txt)
            print("[CookieRefresher] Cookies refreshed successfully.")
        except Exception as e:
            print(f"[CookieRefresher] Failed to refresh cookies: {e}")
    else:
        print("[CookieRefresher] cookies.json not found. Skipping refresh.")

def _auto_refresh(interval_minutes: int):
    """Loop that refreshes cookies at regular intervals"""
    while True:
        refresh_cookies()
        time.sleep(interval_minutes * 60)

def start_auto_refresh(interval_minutes: int = 30):
    """Starts a background thread for auto-refresh"""
    thread = threading.Thread(
        target=_auto_refresh, args=(interval_minutes,), daemon=True
    )
    thread.start()
    print(f"[CookieRefresher] Auto refresh started (every {interval_minutes} min).")