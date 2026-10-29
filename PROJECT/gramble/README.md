Running the project 
docker compose up --build

Exporting the JSON files
docker run --rm -v ${PWD}:/backup mongodb/mongodb-community-server:latest mongoexport --uri="mongodb+srv://test-user:123Hello@mangdb.akghh0j.mongodb.net/gramble?retryWrites=true&w=majority" --collection=users --out=/backup/users.json --jsonArray

docker run --rm -v ${PWD}:/backup mongodb/mongodb-community-server:latest mongoexport --uri="mongodb+srv://test-user:123Hello@mangdb.akghh0j.mongodb.net/gramble?retryWrites=true&w=majority" --collection=users --out=/backup/albums.json --jsonArray

docker run --rm -v ${PWD}:/backup mongodb/mongodb-community-server:latest mongoexport --uri="mongodb+srv://test-user:123Hello@mangdb.akghh0j.mongodb.net/gramble?retryWrites=true&w=majority" --collection=users --out=/backup/posts.json --jsonArray

docker run --rm -v ${PWD}:/backup mongodb/mongodb-community-server:latest mongoexport --uri="mongodb+srv://test-user:123Hello@mangdb.akghh0j.mongodb.net/gramble?retryWrites=true&w=majority" --collection=users --out=/backup/sessions.json --jsonArray


docker run --rm -v ${PWD}:/backup mongodb/mongodb-community-server:latest mongoexport --uri="mongodb+srv://test-user:123Hello@mangdb.akghh0j.mongodb.net/gramble?retryWrites=true&w=majority" --collection=users --out=/backup/comments.json --jsonArray

