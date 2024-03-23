import yfinance as yf
import pandas as pd
import numpy as np
import talib

def get_stock_data(symbol, start_date, end_date):
    data = yf.download(symbol, start=start_date, end=end_date)
    return data

def generate_signals(data):
    data['SMA_50'] = talib.SMA(data['Close'], timeperiod=50)
    data['SMA_200'] = talib.SMA(data['Close'], timeperiod=200)
    data['Signal'] = 0
    data.loc[data['SMA_50'] > data['SMA_200'], 'Signal'] = 1
    data.loc[data['SMA_50'] < data['SMA_200'], 'Signal'] = -1
    return data

def algo_trading(symbol):
    start_date = '2021-01-01'
    end_date = '2021-12-31'
    
    data = get_stock_data(symbol, start_date, end_date)
    
    data = generate_signals(data)
    
    # Implement your trading strategy here based on the generated signals
    
    # Example strategy: Buy when Signal is 1, Sell when Signal is -1
    positions = []
    for i in range(len(data)):
        if data['Signal'][i] == 1:
            positions.append('Buy')
        elif data['Signal'][i] == -1:
            positions.append('Sell')
        else:
            positions.append('Hold')
    
    data['Positions'] = positions
    
    return data

symbol = 'AAPL'  # Replace with your desired stock symbol
result = algo_trading(symbol)
print(result[['Close', 'SMA_50', 'SMA_200', 'Signal', 'Positions']])