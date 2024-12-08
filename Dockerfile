#FROM eclipse-temurin:17-jdk-alpine
FROM --platform=linux/arm64 eclipse-temurin:17-jdk
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]