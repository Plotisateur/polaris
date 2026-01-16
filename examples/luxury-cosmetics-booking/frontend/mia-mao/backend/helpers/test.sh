# Wait DB
echo "Waiting DB..."

while ! nc -z postgres 5432; do   
  sleep 1 
done

# Migrate
cp ./.env.ci.rc ./.env.rc
yarn migration:run:prod

# Test the app
yarn test
yarn test:coverage