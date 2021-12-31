GET /datasets
Returns a pageinated list of datasets in JSON-API format, accepts a page object.

POST /datasets
Creates a dataset. Can either post a SyncDataset type, a multipart form with a file for upload or an EmptyDataset specification to create one

PUT /datasets/:id
Update the data on a dataset. For example description, name etc

DELETE /datasets/:id
Remove a datasets

GET /datasets/:id/data
Returns rows of data from the dataset. Can specify format, Pagination object etc

GET /datasets/:id/data/:id
Get a particular row of a dataset by it's primary id

PUT /datasets/:id/data
Update data in a dataset. Push an array of updates, Takes a parameter for how to update the dataset, APPEND, OVERWRITE, UPSERT

DELETE /datasets/:id/data
Deletes all the data in the dataset but does not drop the table

GET /datasets/:id/columns
Get a list of columns on the dataset. This will include their name and type

GET /dataset/:id/columns/:id/stats
Get a list of stats for a column, max, min , quantiles etc. Can be configured by params

PUT /datasset/:id/columns/:id
Change the paramters for a column. Can change it's name and type. Changing it's type will triger a conversion of that column in the database which might fail

POST /datasets/:id/columns
Will create a new column on the dataset. Can be accomponied by a query to run to populate the column

DELETE /datasets/:id/columns/:id
Destory a column. It's data will be dropped

GET /queries
Returns a list of queries. These are stored queries that define a blob of SQL + some parameters

GET /queries/:id
Returns a specific query by id

GET /queries/:id/run
Runs a query. Pass the query params this query expectes to run it. Resulting data will be returned with the same data format options and pagination as can be done by the dataset/data endpoints

POST /queries/
Create a new stored query

PUT /queries/:id
Update a query

DELETE /queries/:id
Destroy a query
