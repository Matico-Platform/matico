import pyarrow.parquet as pq
import s3fs
import pandas as pd 
from zipfile import ZipFile
import numpy as np
import json
s3 = s3fs.S3FileSystem()

with open('state_lookup.json','r') as f:
    states = json.load(f)

states_inv = {v: k for k, v in states.items()} 

with ZipFile("./us_covid_atlas_data_2022-10-11.zip") as zf:
    cases = pd.read_csv(zf.open("data/covid_confirmed_nyt-2022-10-11.csv"),dtype={"fips":'str'})
    cases.fips = cases.fips.astype('str').str.pad(width=5, side='left', fillchar='0')
    cases = cases.melt(id_vars="fips", var_name="date", value_name='cases').fillna(0)
    cases.cases= cases.cases.astype(np.int32)

    deaths = pd.read_csv(zf.open("data/covid_deaths_nyt-2022-10-11.csv"))
    deaths.fips = deaths.fips.astype("str").str.pad(width=5, side='left', fillchar='0')
    deaths = deaths.melt(id_vars="fips", var_name="date", value_name='deaths').fillna(0)
    deaths.deaths = deaths.deaths.astype(np.int32)

    combined = pd.merge(cases,deaths, on=['fips','date'])

    vaccinations = pd.read_csv(zf.open('data/vaccination_fully_vaccinated_cdc-2022-10-11.csv'))
    vaccinations.fips = vaccinations.fips.astype('str').str.pad(width=5, side='left', fillchar='0')
    vaccinations = vaccinations.melt(id_vars="fips", var_name="date", value_name='vaccinations').fillna(0)
    vaccinations.vaccinations = vaccinations.vaccinations.astype(np.int32)

    combined = pd.merge(combined,vaccinations, on=['fips','date'])
    combined = combined.assign(state = combined.fips.str[0:2].apply(lambda x: states_inv[x]) )
    combined.fips = combined.fips.astype(np.int32)

for (state,df) in combined.groupby('state'):
    df.reset_index().drop(columns=['index']).to_feather(f"covid/{state}.feather", compression='uncompressed')
