import pdfplumber
import pandas as pd
import arabic_reshaper
from bidi.algorithm import get_display


# Function to reshape and apply Bidi algorithm for correct Arabic display
def reshape_arabic_text(text):
    print(text)
    # Reshape Arabic text for correct character joining
    reshaped_text = arabic_reshaper.reshape(text)
    # Apply the Bidi algorithm for right-to-left display
    bidi_text = get_display(reshaped_text)
    return bidi_text

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
            # Iterate through the DataFrame and apply the reshaping function to all text cells
            for column in df.columns:
                df[column] = df[column].apply(lambda x: reshape_arabic_text(str(x)) if isinstance(x, str) else x)
            return df
        else:
            print("No table found on the page.")
            return None

def main():
    # Provide the path to your PDF file
    pdf_path = "ad.pdf"  # Replace with your PDF file path

    # Extract the table
    table_df = extract_table_from_pdf(pdf_path)

    # If table is found, show the DataFrame
    if table_df is not None:
        print(table_df)
        # Optionally save the table to a CSV file
        table_df.to_csv("extracted_invoice.csv", index=False, encoding="utf-8")

if __name__ == "__main__":
    main()
