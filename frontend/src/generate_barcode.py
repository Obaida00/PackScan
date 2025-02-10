import os
import barcode
from barcode.writer import ImageWriter


def generate_barcode(id):
    """
    Generates a barcode image for the given invoice ID.
    Returns the barcode instance.
    """
    try:
        invoice_id = str(id)
        code128 = barcode.get_barcode_class("code128")
        barcode_instance = code128(invoice_id, writer=ImageWriter())

        options = {
            "module_width": 1,
            "module_height": 15.0,
            "font_size": 12,
            "text_distance": 5,
            "quiet_zone": 10,
        }
        image_path = f"./barcodes/barcode_{invoice_id}"
        image_path = os.path.abspath(image_path)
        barcode_instance.save(f"{image_path}", options)
        print(f'Barcode saved as "{image_path}.png"')
        return image_path + ".png"
    except Exception as e:
        print(f"Error while generating the barcode for invoice : {id}")
        raise e
