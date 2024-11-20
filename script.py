import pdfplumber
import pandas as pd
from bidi.algorithm import get_display

def extract_table_from_pdf(pdf_path):
    # Open the PDF file
    with pdfplumber.open(pdf_path) as pdf:
        # Iterate through pages (assuming the table is on the first page)
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

def main(pdf_path: str):
    # Provide the path to your PDF file

    # Extract the table
    table_df = extract_table_from_pdf(pdf_path)

    # If table is found, show the DataFrame
    if table_df is not None:
        print(table_df)
        # Optionally save the table to a CSV file
        table_df.to_csv("extracted_invoice.csv", index=False, encoding="utf-8")

if __name__ == "__main__":
    main("./ad.pdf")
