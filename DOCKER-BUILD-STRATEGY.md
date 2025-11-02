# 🐳 Docker Build Strategy

## 📋 Overview

We use two different Dockerfile approaches depending on the build context:

### **1. `Dockerfile` (CI/CD Optimized)**
- **Used by**: GitHub Actions CI/CD pipeline
- **Strategy**: Uses pre-built JAR from GitHub Actions
- **Benefits**: Faster Docker builds, leverages GitHub Actions Maven cache
- **Requires**: JAR file already built in `target/` directory

### **2. `Dockerfile.local` (Local Development)**  
- **Used by**: Local development and testing
- **Strategy**: Downloads dependencies and builds JAR inside Docker
- **Benefits**: Self-contained, works without pre-built artifacts
- **Requires**: Only source code and pom.xml

## 🔧 Usage

### **GitHub Actions (Automatic)**
```yaml
# GitHub Actions workflow automatically:
1. Builds JAR with Maven
2. Uses Dockerfile with pre-built JAR
3. Pushes to ECR
```

### **Local Development**
```bash
# Option 1: Use pre-built JAR (faster)
mvn clean package -DskipTests
docker build -t moni-be .

# Option 2: Build everything in Docker (self-contained)
docker build -f Dockerfile.local -t moni-be .
```

## ⚡ Performance Comparison

| Method | Build Time | Cache Efficiency | Use Case |
|--------|------------|------------------|----------|
| **Dockerfile** | ~30s | Excellent | CI/CD Pipeline |
| **Dockerfile.local** | ~2-3min | Good | Local Development |

## 🎯 Why This Approach?

### **Problem Solved:**
- ❌ **Before**: Dockerfile tried to use `./mvnw` (not in Git due to .gitignore)
- ✅ **After**: CI builds JAR first, Docker uses pre-built artifact

### **Benefits:**
- 🚀 **Faster CI builds** - Maven runs once, Docker reuses JAR
- 💾 **Better caching** - GitHub Actions caches Maven dependencies
- 🛡️ **Consistent builds** - Same JAR used in tests and final image
- 🧹 **Clean repository** - No Maven Wrapper files committed

## 🔄 Build Flow

### **GitHub Actions Workflow:**
```
1. 🔨 Maven builds JAR (with dependency caching)
2. 🧪 Optional: Run tests on JAR  
3. 🐳 Docker builds image using existing JAR
4. 🚀 Push optimized image to ECR
```

### **Local Development:**
```
Option A: mvn package → docker build (fast)
Option B: docker build -f Dockerfile.local (self-contained)
```

---

This strategy gives you the best of both worlds: fast CI/CD builds and flexible local development! 🎯