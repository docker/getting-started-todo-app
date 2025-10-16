# 🐳 Docker Setup Guide - Advanced Features

## 🚀 Quick Start

### Development Mode

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Then start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# Nginx Proxy: http://localhost:80
```

### Production Mode

```bash
# Use production compose file
docker-compose -f compose.prod.yaml up -d

# Access via Nginx
# http://localhost:80
```

## 📋 Advanced Features Implemented

### 🔒 Security Enhancements

1. **Non-root Users**
   - All containers run as non-root users (UID 1001)
   - Prevents privilege escalation attacks

2. **Capability Dropping**
   - Minimal Linux capabilities (CAP_DROP: ALL)
   - Only necessary capabilities added back

3. **Read-only Filesystems**
   - Containers use read-only root filesystems
   - Temporary files in tmpfs mounts

4. **Security Options**
   - `no-new-privileges:true` prevents privilege escalation
   - Seccomp profiles for syscall filtering

5. **Network Isolation**
   - Custom bridge network (172.28.0.0/16)
   - Services communicate only through defined network

### ⚡ Performance Optimizations

1. **Multi-stage Builds**
   - Separate build and runtime stages
   - Smaller final images (~50-70% reduction)

2. **Resource Limits**
   - CPU and memory limits per service
   - Prevents resource exhaustion

3. **MySQL Optimizations**
   - Configured InnoDB buffer pool (256MB)
   - Slow query logging enabled
   - Connection pooling (max 200 connections)

4. **Nginx Reverse Proxy**
   - Load balancing with `least_conn`
   - Gzip compression enabled
   - Static asset caching (1 year)
   - Rate limiting on API endpoints

5. **Node.js Optimizations**
   - Max old space size: 400MB
   - Source maps enabled for debugging
   - Production mode optimizations

### 📊 Monitoring & Health Checks

1. **Health Checks**
   - All services have health checks
   - Automatic restart on failure
   - Grace periods for startup

2. **Logging**
   - JSON file logging (10MB max, 3-5 files)
   - Separate volumes for logs
   - Log rotation configured

3. **Persistent Volumes**
   - MySQL data persistence
   - Application logs persistence
   - Nginx cache persistence

### 🛡️ Rate Limiting

Configured in Nginx:

- API endpoints: 10 requests/second (burst: 20)
- Auth endpoints: 5 requests/minute (burst: 5)
- Returns 429 status on limit exceeded

## 📁 Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect todo-mysql-data

# Backup MySQL data
docker run --rm -v todo-mysql-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/mysql-backup.tar.gz /data

# Restore MySQL data
docker run --rm -v todo-mysql-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/mysql-backup.tar.gz -C /
```

## 🔧 Maintenance Commands

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Recreate containers
docker-compose up -d --force-recreate
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands

```bash
# MySQL shell
docker-compose exec mysql mysql -u root -p

# Backend shell
docker-compose exec backend sh

# Run npm commands
docker-compose exec backend npm run test
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ DELETES DATA!)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
docker system prune -a --volumes
```

## 📈 Resource Monitoring

### Check Resource Usage

```bash
# All containers
docker stats

# Specific container
docker stats todo-backend

# Memory usage
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"
```

### Inspect Containers

```bash
# Detailed information
docker inspect todo-backend

# Check health status
docker inspect --format='{{.State.Health.Status}}' todo-backend

# View environment variables
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' todo-backend
```

## 🔍 Troubleshooting

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. MySQL not ready - check mysql logs
# 2. Port 3000 in use - change BACKEND_PORT in .env
# 3. Missing environment variables - verify .env file
```

### Database Connection Issues

```bash
# Check MySQL health
docker-compose ps mysql

# Test connection
docker-compose exec backend nc -zv mysql 3306

# Check MySQL logs
docker-compose logs mysql
```

### Frontend Not Loading

```bash
# Check client logs
docker-compose logs client

# Verify backend is healthy
curl http://localhost:3000/api/health

# Check nginx proxy
docker-compose logs nginx
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Increase limits in compose.yaml
mem_limit: 1g  # Increase memory
cpus: 2.0      # Increase CPU

# Restart services
docker-compose restart
```

## 🔐 Security Best Practices

1. **Change Default Passwords**
   - Update `MYSQL_ROOT_PASSWORD` in .env
   - Change `JWT_SECRET` to a strong random string

2. **Use Environment Files**
   - Never commit `.env` to git
   - Use `.env.example` as template

3. **Enable HTTPS**
   - Add SSL certificates
   - Update nginx configuration
   - Redirect HTTP to HTTPS

4. **Regular Updates**

   ```bash
   # Update base images
   docker-compose pull

   # Rebuild containers
   docker-compose up -d --build
   ```

5. **Scan for Vulnerabilities**

   ```bash
   # Scan images
   docker scan todo-app-backend:latest
   docker scan todo-app-client:latest
   ```

## 📦 Environment Variables

See `.env.example` for all available variables.

### Required Variables

- `MYSQL_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing key (min 32 characters)

### Optional Variables

- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `BACKEND_PORT` - Backend API port (default: 3000)
- `CLIENT_PORT` - Frontend port (default: 5173)

## 🎯 Production Deployment

### Pre-deployment Checklist

- [ ] Update all passwords in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure strong `JWT_SECRET`
- [ ] Enable HTTPS with valid certificates
- [ ] Set up database backups
- [ ] Configure monitoring/alerting
- [ ] Review security settings
- [ ] Test health checks

### Deploy

```bash
# Build production images
docker-compose -f compose.prod.yaml build

# Start services
docker-compose -f compose.prod.yaml up -d

# Verify all services healthy
docker-compose -f compose.prod.yaml ps
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Nginx Security](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [MySQL Performance](https://dev.mysql.com/doc/refman/9.3/en/optimization.html)

## 🐛 Known Issues

1. **Windows Volume Mounting**
   - May have permission issues
   - Use WSL2 for better compatibility

2. **Hot Reload Not Working**
   - Ensure CHOKIDAR_USEPOLLING=true
   - Check volume mounts are correct

3. **High Memory Usage**
   - Adjust mem_limit in compose.yaml
   - Monitor with `docker stats`

---

For more information, see the main README.md file.
