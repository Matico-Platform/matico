import pandas as pd
import geopandas as gp
import numpy as np

rows = 20
category_vars = np.random.choice(["dog","cat","bird"], size=rows)
parseable_numbers = [str(a) for a in np.random.normal(size=rows)]
numbers = np.random.normal(size=rows)
numerical_categorical = np.random.choice(3, size=rows)
start_date = np.datetime64("2021-01-01 00:00:00")
dates = start_date + (np.random.normal(size=rows) * 24 * 60 * 60 * 30).astype(int)

lats = np.random.normal(size=rows)*180 - 90
lngs = np.random.normal(size=rows)*360- 180

points = gp.points_from_xy(lngs,lats);
points_wkb = gp.GeoSeries(points, crs="epsg:4326").to_wkb(hex=True);

base_df = pd.DataFrame({"category_vars": category_vars, 
                        "parseable_numbers" : parseable_numbers, 
                        "numerical_categorical": numerical_categorical,
                        "numbers": numbers,
                        "dates":dates
                        })

base_df.assign(lats = lats, lngs=lngs).to_csv("csv_data_with_lat_lng.csv", index=False)
base_df.assign(wkb = points_wkb).to_csv("csv_data_with_wkb.csv", index=False)

gp.GeoDataFrame(base_df, geometry=points, crs="epsg:4326").to_file("geojson_data.geojson", driver="GeoJSON")
