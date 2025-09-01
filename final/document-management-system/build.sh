#!/bin/bash

echo "Building Document Management System..."

# Build parent project
echo "Building parent project..."
mvn clean install -DskipTests

# Build each service
echo "Building Discovery Service..."
cd discovery-service
mvn clean package -DskipTests
cd ..

echo "Building Auth Service..."
cd auth-service
mvn clean package -DskipTests
cd ..

echo "Building Gateway Service..."
cd gateway-service
mvn clean package -DskipTests
cd ..

echo "Building Metadata Service..."
cd metadata-service
mvn clean package -DskipTests
cd ..

echo "Building File Service..."
cd file-service
mvn clean package -DskipTests
cd ..

echo "Build completed successfully!"
echo "To start the system, run: cd docker && docker-compose up -d"

