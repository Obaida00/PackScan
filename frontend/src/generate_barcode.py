import sys
import barcode
from barcode.writer import ImageWriter

def generate_barcode(invoice_id):
    """
    Generates a barcode image for the given invoice ID.
    Returns the barcode instance.
    """
    code128 = barcode.get_barcode_class('code128')
    barcode_instance = code128(invoice_id, writer=ImageWriter())
    return barcode_instance

def main():    
    if len(sys.argv) < 2:
        print("Please provide the invoice id as an argument.")
        sys.exit(1)
        
    invoice_id = sys.argv[1]
    
    barcode_instance = generate_barcode(invoice_id)
    image_path = f"./barcodes/barcode_{invoice_id}"
    barcode_instance.save(image_path)
    print(f"Barcode saved as {image_path}.png")
    
if __name__ == "__main__":
    main()
