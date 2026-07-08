# ============================
# Stage 1: Build the Application
# ============================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and dependency definitions
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build production jar (skipping tests for speed)
RUN mvn clean package -DskipTests -B

# ============================
# Stage 2: Runtime Environment
# ============================
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Install curl for actuator health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -S waypay && adduser -S waypay -G waypay
USER waypay

# Copy jar from builder
COPY --from=builder /app/target/waypay-backend-*.jar app.jar

# Expose server port
EXPOSE 8080

# Configure production environment
ENV JAVA_OPTS="-XX:+UseG1GC -XX:+UseStringDeduplication -Xms512m -Xmx1024m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
