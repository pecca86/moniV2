# Example of custom Java runtime using jlink in a multi-stage container build
FROM eclipse-temurin:17 AS jre-build
WORKDIR /app

# Copy the pre-built JAR file from GitHub Actions (copied to root in workflow)
COPY moni-backend.jar ./app.jar

# List jar modules
RUN jar xf app.jar
RUN jdeps \
    --ignore-missing-deps \
    --print-module-deps \
    --multi-release 17 \
    --recursive \
    --class-path 'BOOT-INF/lib/*' \
    app.jar > modules.txt

# Create a custom Java runtime
RUN $JAVA_HOME/bin/jlink \
         --add-modules $(cat modules.txt) \
         --strip-debug \
         --no-man-pages \
         --no-header-files \
         --compress=2 \
         --output /javaruntime

# Define your base image
FROM debian:buster-slim
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"
COPY --from=jre-build /javaruntime $JAVA_HOME

# Continue with your application deployment
RUN mkdir /opt/server
COPY --from=jre-build /app/app.jar /opt/server/app.jar
CMD ["java", "-jar", "/opt/server/app.jar"]