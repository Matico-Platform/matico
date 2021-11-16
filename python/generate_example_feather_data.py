import pandas as pd 
from pathlib import Path
import numpy as np
import sys

if (Path('./data/taxi.feather').exists()):
    print("Already processed ")
    sys.exit(0) 

if (not Path('./data/taxi.csv').exists()):
    print("downloading")
    taxi_data = pd.read_csv("https://s3.amazonaws.com/nyc-tlc/trip+data/yellow_tripdata_2014-01.csv")
    taxi_data.to_csv("./data/taxi.csv", index=False)
else:
    taxi_data = pd.read_csv('./data/taxi.csv')

taxi_data.columns = [c.strip() for c in taxi_data.columns]
print(taxi_data.columns)
taxi_data.vendor_id = pd.Categorical(taxi_data.vendor_id)
taxi_data.rate_code = pd.Categorical(taxi_data.rate_code)
taxi_data.store_and_fwd_flag = pd.Categorical(taxi_data.store_and_fwd_flag)
taxi_data.payment_type= pd.Categorical(taxi_data.payment_type)
taxi_data.pickup_datetime = pd.to_datetime(taxi_data.pickup_datetime)
taxi_data.dropoff_datetime = pd.to_datetime(taxi_data.dropoff_datetime)


taxi_data.passenger_count = taxi_data.passenger_count.astype(np.int16)

float_32_cols=[
    "trip_distance",
    "pickup_longitude",
    "pickup_latitude",
    "dropoff_longitude",
    "dropoff_latitude",
    "fare_amount",
    "surcharge",
    "mta_tax",
    "tip_amount",
    "tolls_amount",
    "total_amount"
    ]
taxi_data[float_32_cols] = taxi_data[float_32_cols].astype(np.float32)


print("Saving to feather")
taxi_data.to_feather('./data/taxi.feather',compression='lz4')

taxi_data[['pickup_latitude','pickup_longitude', 'trip_distance','total_amount','passenger_count']].to_feather("./data/taxi_small.feather",compression='lz4')
