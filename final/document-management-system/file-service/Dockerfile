FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/file-service-1.0.0.jar app.jar

RUN mkdir -p uploads

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]

