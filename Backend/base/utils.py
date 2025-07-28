import pandas as pd

def get_home_loans_data(file_path: str):
    try:
        # Read Excel
        df = pd.read_excel(file_path)

        # Fix typo if present
        if 'Intresent rate' in df.columns:
            df.rename(columns={'Intresent rate': 'Interest Rate'}, inplace=True)

        # Validate columns
        if 'Bank Name' not in df.columns or 'Interest Rate' not in df.columns:
            return {"error": "Required columns not found in Excel file."}
        # Handle NaN values
        df['Interest Rate'] = df['Interest Rate'].fillna(0)

        # Convert to Python dict
        data = df[['Bank Name', 'Interest Rate']].to_dict(orient='records')
        # send data in yml
        return {"home_loans": data}
    except Exception as e:
        return {"error": str(e)}