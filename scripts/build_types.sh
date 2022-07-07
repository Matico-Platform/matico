#!/bin/sh

echo "Building Types For Spec"
mkdir -p matico_types
if [[ -d "matico_types/spec" ]]
then
  echo "Removing old spec directory"
  rm  -r matico_types/spec
fi 

(cd matico_spec && cargo test export_bindings)

(cd matico_common && cargo test export_bindings)

(cd matico_compute/matico_analysis && cargo test)

cp -r matico_spec/bindings matico_types/spec
cp  matico_common/bindings/* matico_types/spec/
cp  matico_compute/matico_analysis/bindings/* matico_types/spec/

FILES="matico_types/spec/*"

touch matico_types/spec/index.ts
for f in $FILES 
do
  filename=$(basename -- "$f")
  extension="${filename##*.}"
  filename="${filename%.*}"
  echo "export * from \"./$filename\";" >> matico_types/spec/index.ts
done

echo "Building Types For API"
if [[ -d "matico_types/api" ]]
then
  echo "Removing old spec directory"
  rm  -r matico_types/api
fi 

(cd matico_server && cargo test export_bindings )

cp -r matico_server/bindings matico_types/api
FILES="matico_types/api/*"

touch matico_types/api/index.ts
for f in $FILES 
do
  filename=$(basename -- "$f")
  extension="${filename##*.}"
  filename="${filename%.*}"
  echo "export * from \"./$filename\"" >> matico_types/api/index.ts
done

