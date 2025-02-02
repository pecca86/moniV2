# Example of custom Java runtime using jlink in a multi-stage container build
FROM eclipse-temurin:17 AS jre-build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# List jar modules
RUN jar xf target/moni-0.0.1-SNAPSHOT.jar
RUN jdeps \
    --ignore-missing-deps \
    --print-module-deps \
    --multi-release 17 \
    --recursive \
    --class-path 'BOOT-INF/lib/*' \
    target/moni-0.0.1-SNAPSHOT.jar > modules.txt

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
COPY --from=jre-build /app/target/moni-0.0.1-SNAPSHOT.jar /opt/server/app.jar
CMD ["java", "-jar", "/opt/server/app.jar"]