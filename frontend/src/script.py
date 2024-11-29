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
            # Create a product dictionary
            # Adjust column indices as needed based on your specific PDF layout
            product = {
                "name": get_display(row[13]),  # Product name (column index 1)
                "quantity": row[10],  # Quantity (column index 2)
                "price": row[8]  # Individual price (column index 4)
            }
            
            products.append(product)
        except:
            continue

    # Return JSON-formatted output
    return json.dumps({
        "products": products
    })

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
        # If table is found, process and output JSON
        if table_df is not None:
            json_output = process_table_to_json(table_df)
            print(json_output)
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
