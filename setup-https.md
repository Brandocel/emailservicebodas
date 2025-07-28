# Configurar HTTPS con Let's Encrypt en tu servidor

## 🚀 SOLUCIÓN TEMPORAL RÁPIDA - NGROK (5 minutos)

**Para seguir desarrollando mientras configuras el HTTPS definitivo:**

### 1. Instalar ngrok en tu servidor
```bash
# Conectarse a tu servidor
ssh root@187.157.236.135

# Descargar ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin

# Crear cuenta gratuita en https://ngrok.com y obtener token
ngrok config add-authtoken TU_TOKEN_AQUI
```

### 2. Exponer tu API con HTTPS
```bash
# Ejecutar ngrok (esto te dará una URL HTTPS)
ngrok http 4000
```

### 3. Actualizar tu frontend
```javascript
// Cambiar en tu frontend de GoDaddy:
// DE: http://187.157.236.135:4000/api/email/rsvp  
// A:   https://abc123.ngrok-free.app/api/email/rsvp
```

**Ventajas:**
- ✅ Funciona inmediatamente
- ✅ HTTPS gratuito
- ✅ No necesitas dominio
- ✅ No necesitas certificados

**Desventajas:**
- ⚠️ La URL cambia cada vez que reinicias ngrok
- ⚠️ Solo para desarrollo/pruebas

---

## 🛡️ SOLUCIÓN DEFINITIVA - Let's Encrypt

### 1. Instalar Certbot
```bash
# En Ubuntu/Debian
sudo apt update
sudo apt install certbot

# Obtener certificado SSL
sudo certbot certonly --standalone -d tu-dominio.com

# O si tienes un dominio apuntando a 187.157.236.135
sudo certbot certonly --standalone -d api.rebecayenrique.com
```

### 2. Configurar Nginx como proxy reverso con SSL
```bash
# Instalar Nginx
sudo apt install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/api
```

#### Configuración de Nginx:
```nginx
server {
    listen 80;
    server_name 187.157.236.135 api.rebecayenrique.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.rebecayenrique.com;

    ssl_certificate /etc/letsencrypt/live/api.rebecayenrique.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.rebecayenrique.com/privkey.pem;

    # Configuraciones SSL modernas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🌟 CLOUDFLARE TUNNEL PARA WINDOWS SERVER (SÚPER FÁCIL)

### 1. Conectarse al servidor Windows
```
# Usar Escritorio Remoto para conectarte a:
# IP: 187.157.236.135
# Usuario: tu_usuario
# Contraseña: tu_contraseña
```

### 2. Descargar cloudflared para Windows
```powershell
# Abrir PowerShell como Administrador en el servidor
# Ir a: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# O descargar directamente:
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
```

### 3. Ejecutar tunnel (MODO SIMPLE - SIN CUENTA)
```powershell
# En PowerShell, ejecutar:
.\cloudflared.exe tunnel --url localhost:4000
```

### 4. Te mostrará una URL como:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at:                                         |
|  https://beautiful-morning-1234.trycloudflare.com                                        |
+--------------------------------------------------------------------------------------------+
```

### 5. Mantener corriendo en segundo plano
```powershell
# Para que no se cierre cuando cierres PowerShell:
Start-Process -FilePath ".\cloudflared.exe" -ArgumentList "tunnel --url localhost:4000" -WindowStyle Hidden
```

### 3. Te dará una URL como:
```
https://random-words-123.trycloudflare.com
```

### 4. Usar esa URL en tu frontend de GoDaddy
```javascript
// Cambiar a la URL que te dé Cloudflare
const API_URL = 'https://random-words-123.trycloudflare.com';
```

**Ventajas de Cloudflare Tunnel:**
- ✅ Completamente gratis
- ✅ HTTPS automático
- ✅ Muy confiable
- ✅ URL fija (no cambia)
- ✅ No necesitas dominio propio

---

## 🖥️ **PASOS DETALLADOS PARA WINDOWS SERVER:**

### Paso 1: Conectarte por Escritorio Remoto
1. Abrir **Conexión a Escritorio Remoto** en tu PC
2. Poner la IP: `187.157.236.135`
3. Conectarte con tu usuario y contraseña

### Paso 2: En el servidor Windows
1. **Abrir PowerShell como Administrador**
2. **Ir a la carpeta donde está tu API**:
   ```powershell
   cd C:\ruta\a\tu\api
   # O donde tengas tu proyecto Node.js
   ```

### Paso 3: Descargar cloudflared
```powershell
# Descargar el ejecutable
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
```

### Paso 4: Ejecutar tunnel
```powershell
# Ejecutar (asegúrate de que tu API esté corriendo en puerto 4000)
.\cloudflared.exe tunnel --url localhost:4000
```

### Paso 5: ¡Usar la URL HTTPS!
Copiar la URL que te muestre (ej: `https://algo-1234.trycloudflare.com`) y usarla en tu frontend de GoDaddy.

---

## 🔧 **COMANDOS ÚTILES PARA WINDOWS:**

```powershell
# Ver si tu API está corriendo
netstat -an | findstr :4000

# Ejecutar tunnel en segundo plano
Start-Process -FilePath ".\cloudflared.exe" -ArgumentList "tunnel --url localhost:4000" -WindowStyle Hidden

# Ver procesos de cloudflared
Get-Process | Where-Object {$_.ProcessName -eq "cloudflared"}

# Parar cloudflared
Stop-Process -Name "cloudflared" -Force
```

## 📱 **CREAR UN SCRIPT PARA AUTOMATIZAR:**

Crear archivo `start-tunnel.bat`:
```batch
@echo off
echo Iniciando tunnel HTTPS...
cloudflared.exe tunnel --url localhost:4000
pause
```

Crear archivo `start-tunnel-background.bat`:
```batch
@echo off
echo Iniciando tunnel HTTPS en segundo plano...
start /min cloudflared.exe tunnel --url localhost:4000
echo Tunnel iniciado. Revisar URL en la ventana que se abrió.
pause
```
