from playwright.sync_api import sync_playwright
import json, os, time, threading

COOKIE_FILE = os.path.join(os.path.dirname(__file__), "cookies.json")

def refresh_cookies():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        page.wait_for_timeout(8000)

        cookies = context.cookies()
        with open(COOKIE_FILE, "w") as f:
            json.dump(cookies, f)

        print("✅ Cookies refreshed")
        browser.close()

def start_auto_refresh(interval_minutes=30):
    def loop():
        while True:
            try:
                refresh_cookies()
            except Exception as e:
                print("Cookie refresh error:", e)
            time.sleep(interval_minutes * 60)

    t = threading.Thread(target=loop, daemon=True)
    t.start()
