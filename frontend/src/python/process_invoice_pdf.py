import pdfplumber
import pandas as pd
from bidi.algorithm import get_display
import sys
import json
import unicodedata


def normalize_arabic_text(text):
    """
    normalizes the arabic text to avoid font rendering or character encoding issues
    """
    return unicodedata.normalize("NFKC", text)


def decode_unicode(input_json):
    """
    Decode Unicode-encoded strings in a JSON object.
    use when debugging cause it displays the arabic text instead of the unicoded characters

    Args:
        input_json (str): JSON string with Unicode characters.

    Returns:
        str: Decoded JSON string with readable Arabic text.
    """
    decoded = json.loads(input_json)
    return json.dumps(decoded, ensure_ascii=False, indent=4)


def extract_table_from_pdf(pdf_path):
    """
    Extract table from the first page of a PDF file.

    Args:
        pdf_path (str): Path to the PDF file

    Returns:
        pandas.DataFrame: Extracted table data
    """
    # Open the PDF file
    with pdfplumber.open(pdf_path) as pdf:
        # Extract the table from the first page
        page = pdf.pages[0]

        # Extract the table from the page
        table = page.extract_table()
        if table:
            # Convert the table into a pandas DataFrame for better structure
            df = pd.DataFrame(table[1:], columns=table[0])
            return df
        else:
            print("No table found on the page.")
            return None


def process_table_to_json(df: pd.DataFrame):
    """
    Convert the DataFrame to a JSON-formatted list of products.

    Args:
        df (pandas.DataFrame): Input DataFrame with product information

    Returns:
        str: JSON-formatted string of products
        int: the total net price for the invoice
    """
    # List to store processed products
    products = []

    net_price = 0

    # Iterate through each row in the DataFrame
    for _, row in df.iterrows():
        try:
            if row.iloc[3] == "يفاصلا":
                net_price = int(float(str(row["نايبلا"]).replace(",", "")))
            unit_price = str(row["يدارفﻹا"]).replace(",", "")
            total_price = str(row["يلامجﻹا"]).replace(",", "")
            name = row["فنصلا"]
            name = normalize_arabic_text(name[::-1])
            # Create a product dictionary
            product = {
                "name": name,
                "total_count": int(row.iloc[10]),
                "unit_price": int(float(unit_price)),
                "total_price": int(float(total_price)),
            }

            products.append(product)
        except:
            continue

    # Return JSON-formatted output
    return products, net_price


def extract_invoice_details(pdf_path):
    """
    Extract the invoice ID and pharmacist name from the line containing "البيان".

    Args:
        pdf_path (str): Path to the PDF file

    Returns:
        dict: Dictionary containing 'id' and 'pharmacist' fields
    """
    with pdfplumber.open(pdf_path) as pdf:
        # Open the first page
        page = pdf.pages[0]

        # Extract all text from the page
        text = page.extract_text()

        if text:
            # Split text into lines
            lines = text.split("\n")

            # Find the line containing important data
            date_start = ":خيراتلا"
            pharmacist_start = ":ديسلا"
            statement_start = ":نايبلا"

            date = ""
            pharmacist = ""
            statement = ""
            id = 0

            storage = "mo"
            for line in lines:
                if "SUB-ADvanced" in line:
                    storage = "ad"

                if statement_start in line:
                    parts = line.split(" ")
                    id = next((part for part in parts if part.isdigit()), "")
                    statement = " ".join(
                        part
                        for part in parts
                        if (part != id and part != statement_start)
                    )

                if pharmacist_start in line:
                    sections = line.split(date_start)
                    pharmacist_parts = sections[1].split(" ")
                    pharmacist = " ".join(
                        part
                        for part in pharmacist_parts
                        if (part != id and part != pharmacist_start)
                    )
                    date_parts = sections[0].split(" ")
                    date = " ".join(
                        part
                        for part in date_parts
                        if (part != id and part != pharmacist_start)
                    )

            statement = normalize_arabic_text(statement[::-1].strip())
            pharmacist = normalize_arabic_text(pharmacist[::-1].strip())

            return {
                "id": int(id),
                "storage": storage,
                "statement": statement,
                "pharmacist": pharmacist,
                "date": date.strip(),
            }
    return {"err": "invalid request"}


def main():
    """
    Main function to extract and process PDF table
    """
    # Check if file path is provided as a command-line argument
    if len(sys.argv) < 2:
        print("Please provide the PDF file path as an argument.")
        return

    # Get the file path from command-line arguments
    file_path = sys.argv[1]

    try:
        # Extract the table
        table_df = extract_table_from_pdf(file_path)
        # Extract invoice details
        details = extract_invoice_details(file_path)
        # Process the table into JSON
        items, net_price = (
            process_table_to_json(table_df) if table_df is not None else []
        )
        # Combine details and items into final JSON
        output = {
            "id": details["id"],
            "statement": details["statement"],
            "storage": details["storage"],
            "pharmacist": details["pharmacist"],
            "date": details["date"],
            "net_price": net_price,
            "items": items,
        }
        # print(decode_unicode(json.dumps(output)))
        print(json.dumps(output))

    except Exception as e:
        print(f"An error occurred: {e}")
        raise e


if __name__ == "__main__":
    main()
