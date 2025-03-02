import os
import sys
import print_html
import generate_barcode
import json


def fill_template(invoice, barcode_image_path) -> str:
    """
    fills the preset template and saves the new file to the same directory by name: invoice_sticker_[id].
    returns the created file path
    """

    template_path = os.path.abspath("./src/assets/html/invoice_sticker_template.html")
    template_dir = os.path.dirname(template_path)
    try:
        barcode_image_rpath = os.path.relpath(
            barcode_image_path, start=template_dir
        ).replace("\\", "/")
        html = open(template_path).read()

        # replacing placeholders
        html = html.replace("DATA_INVOICE_ID", str(invoice.get("invoice_id")))
        html = html.replace(
            "DATA_STORAGE_NAME", str(invoice.get("storage_name")).capitalize()
        )
        html = html.replace("DATA_PHARMACIST_NAME", str(invoice.get("pharmacist")))
        html = html.replace("DATA_STATEMENT", str(invoice.get("statement")))
        html = html.replace("DATA_DATE", str(invoice.get("date")))
        html = html.replace("DATA_SENT_AT", str(invoice.get("done_at")))
        html = html.replace("DATA_PACKER_NAME", str(invoice.get("packer_name")))
        html = html.replace(
            "DATA_NUMBER_OF_PACKAGES", str(invoice.get("number_of_packages"))
        )
        html = html.replace("DATA_NET_PRICE", str(invoice.get("net_price")))
        html = html.replace(
            "BARCODE_IMAGE_PATH",
            barcode_image_rpath,
        )
    except Exception as e:
        print(f"Error while filling sticker template for invoice : {invoice['id']}")
        raise e

    try:
        output_path = os.path.dirname(template_path)
        output_path = os.path.join(
            output_path, f"invoice_sticker_{invoice.get("id")}.html"
        )

        with open(output_path, "w", encoding="utf-8") as fp:
            fp.write(html)

        print(f'html template saved as "{output_path}"')
        return output_path
    except Exception as e:
        print(f"Error while saving template for invoice : {id}")
        raise e


def generate_sticker(invoice) -> str:
    """
    Generates an image to be printed as a sticker for the given invoice.
    generates the barcode image & the html filled template.
    returns the html file path
    """
    try:
        invoice_id = invoice.get("invoice_id")

        print("progress: 40%", flush=True)

        barcode_path = generate_barcode.generate_barcode(invoice_id)

        print("progress: 60%", flush=True)

        html_path = fill_template(invoice, barcode_path)
        return html_path
    except Exception as e:
        print(
            f"Error accured while generating the sticker for invoice : {invoice['id']}"
        )
        raise e


def get_invoice_data(input: str) -> dict:
    """Parses the JSON invoice data and returns the data dict."""
    try:
        invoice: dict = json.loads(input)
        return invoice
    except json.JSONDecodeError:
        print("Invalid JSON format.")
        return
    except Exception as e:
        print("Error accured while parsing the invoice data")
        raise e


def main():
    if len(sys.argv) < 2:
        print("Please provide the invoice data as an argument.")
        return

    invoice_json = sys.argv[1]

    invoice = get_invoice_data(invoice_json)

    print("progress: 20%", flush=True)

    sticker_html_path = generate_sticker(invoice)

    print_html.print_html(sticker_html_path)


if __name__ == "__main__":
    main()
