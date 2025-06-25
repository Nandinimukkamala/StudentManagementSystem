# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim AS base

# Set the working directory inside the container
WORKDIR /app

# Copy Maven wrapper and POM files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Run Maven to download dependencies (optional but speeds up builds if the dependencies don't change)
RUN ./mvnw dependency:go-offline

# Copy the source code into the container
COPY src ./src

# Download wait-for-it script (optional, if not already in your project)
#RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
#RUN chmod +x wait-for-it.sh
# Copy the wait-for-it.sh script into the container (since it's already present in your project)
COPY wait-for-it.sh /app/wait-for-it.sh

# Make sure the script is executable
RUN chmod +x /app/wait-for-it.sh
# Build the application using Maven
RUN ./mvnw clean install -DskipTests

# Expose the port that Spring Boot will run on
EXPOSE 8080

# Command to wait for MySQL to be ready and then start Spring Boot
CMD ["bash", "/app/wait-for-it.sh", "mysql:3306", "--timeout=60", "--", "java", "-jar", "/app/target/student-crud-0.0.1-SNAPSHOT.jar"]
