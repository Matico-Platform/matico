#!/bin/sh

echo "Building Types For Spec"
if [[ -d "matico_types/spec" ]]
then
  echo "Removing old spec directory"
  rm  -r matico_types/spec
fi 

(cd matico_spec && cargo test)

(cd matico_common && cargo test)

cp -r matico_spec/bindings matico_types/spec
cp  matico_common/bindings/* matico_types/spec/
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

cd matico_server
cargo test 
cd ../
cp -r matico_server/bindings matico_types/api
FILES="matico_types/api/*"

touch matico_types/api/index.ts
for f in $FILES 
do
  filename=$(basename -- "$f")
  extension="${filename##*.}"
  filename="${basename%.*}"
  echo "export * from \"./$filename\"" >> matico_types/api/index.ts
done

