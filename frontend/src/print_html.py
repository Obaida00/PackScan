import base64
import os
from selenium import webdriver


def print_html(html_path):
    html_path = "file:///" + html_path

    width_px, height_px = 550, 450

    # Convert pixels to inches (Chrome uses 96px per inch)
    width_in = width_px / 96
    height_in = height_px / 96

    try:
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")  # Run in headless mode (no UI)

        # try this after linking to the printer and selecting the printer as the default printer
        # options.add_argument("--kiosk-printing")

        driver = webdriver.Chrome(options=options)
        driver.get(html_path)

        # Use the CDP command to print the page with custom dimensions
        pdf = driver.execute_cdp_cmd(
            "Page.printToPDF",
            {
                "printBackground": True,
                "paperWidth": width_in,
                "paperHeight": height_in,
                "marginTop": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "marginRight": 0,
            },
        )

        output_path = "./src/assets/html/out.pdf"
        output_path = os.path.abspath(output_path)
        with open(output_path, "wb") as f:
            f.write(base64.b64decode(pdf["data"]))

        print("output saved to ", output_path)
        driver.quit()
        return
    except:
        print(f"Error while printing sticker for invoice : {id}")
        return
