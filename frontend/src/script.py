import pdfplumber
import pandas as pd
from bidi.algorithm import get_display
import sys
import json


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
    """
    # List to store processed products
    products = []

    # Iterate through each row in the DataFrame
    for _, row in df.iterrows():
        try:
            price = str(row.iloc[8]).replace(",", "")
            name = row.iloc[13]
            # Create a product dictionary
            product = {
                "name": name[::-1],
                "total_count": int(row.iloc[10]),
                "price": int(float(price)),
            }

            products.append(product)
        except:
            continue

    # Return JSON-formatted output
    return products


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

            # Find the line containing "البيان"
            start = ":نايبلا"

            storage = "mo"
            for line in lines:
                if "SUB-ADvanced" in line:
                    storage = "ad"
                if start in line:
                    parts = line.split(" ")
                    # Assume the ID is the first numeric value, and the rest is the pharmacist name
                    id = next((part for part in parts if part.isdigit()), "")
                    name = " ".join(
                        part for part in parts if (part != id and part != start)
                    )
                    return {
                        "id": int(id),
                        "storage": storage,
                        "pharmacist": name[::-1].strip(),
                    }
    return {"err": "invalid request"}


def main():
    """
    Main function to extract and process PDF table
    """
    # Check if file path is provided as a command-line argument
    if len(sys.argv) < 2:
        print("Please provide the PDF file path as an argument.")
        sys.exit(1)

    # Get the file path from command-line arguments
    file_path = sys.argv[1]

    try:
        # Extract the table
        table_df = extract_table_from_pdf(file_path)
        # Extract invoice details
        details = extract_invoice_details(file_path)
        # Process the table into JSON
        items = process_table_to_json(table_df) if table_df is not None else []
        # Combine details and items into final JSON
        output = {
            "id": details["id"],
            "pharmacist": details["pharmacist"],
            "storage": details["storage"],
            "items": items,
        }
        print(json.dumps(output))

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
