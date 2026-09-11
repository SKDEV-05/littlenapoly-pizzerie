# 🚀 Little Napoli - InfinityFree Backend Deployment Anleitung

Diese Anleitung führt dich Schritt für Schritt durch das kostenlose Hosting des Laravel Backends auf **InfinityFree** (100% kostenlos, keine Kreditkarte erforderlich).

---

## 1. InfinityFree Account & Subdomain anlegen
1. Gehe auf [InfinityFree.com](https://www.infinityfree.com/) und registriere dich kostenlos.
2. Klicke im Dashboard auf **„Create Account“**.
3. Wähle eine kostenlose Subdomain aus (z.B. `littlenapoli-api.epizy.com` oder `*.infinityfreeapp.com`).
4. Sobald der Account erstellt ist, siehst du dein **vPanel** (Control Panel) und deine Account-Details.

---

## 2. MySQL-Datenbank im vPanel anlegen
1. Öffne das **Control Panel (vPanel)** deines Accounts.
2. Klicke auf **„MySQL Databases“**.
3. Gib unter *Create New Database* z.B. `littlenapoli` ein und klicke auf **Create Database**.
4. Notiere dir die folgenden Angaben aus der Tabelle:
   - **MySQL Hostname**: z.B. `sql100.epizy.com`
   - **MySQL Database Name**: z.B. `epiz_12345678_littlenapoli`
   - **MySQL Username**: z.B. `epiz_12345678`
   - **MySQL Password**: Dein Account-Passwort (zu finden in den Account Details unter *Password*).
   - **Port**: `3306`

---

## 3. Dateien in `htdocs` hochladen
Du kannst die Dateien entweder über **FileZilla (FTP)** oder über den **Online File Manager** im vPanel hochladen:
- **FTP-Host**: Siehe Account Details (z.B. `ftpupload.net`)
- **FTP-User**: Dein `epiz_...` Benutzername
- **FTP-Passwort**: Dein Account-Passwort
- **Zielverzeichnis**: `/htdocs`

Lade alle Dateien und Ordner aus `apps/backend-laravel/` in den Ordner `htdocs` hoch:
```
htdocs/
  ├── .htaccess              (bereits vorkonfiguriert, leitet auf public/ weiter)
  ├── .env                   (aus .env.infinityfree.example erstellt)
  ├── app/
  ├── bootstrap/
  ├── config/
  ├── database/
  ├── public/
  │    ├── .htaccess         (bereits vorkonfiguriert für Apache & CORS)
  │    └── index.php
  ├── routes/
  ├── storage/
  └── vendor/
```

> **Tipp:** Wenn du per FTP hochlädst, erstelle vorher ein ZIP-Archiv von `apps/backend-laravel` und entpacke es im Online File Manager, das geht in 1 Minute!

---

## 4. `.env` konfigurieren
1. Benenne die hochgeladene `.env.infinityfree.example` in `.env` um.
2. Trage deine MySQL-Daten ein:
```env
APP_NAME="Little Napoli API"
APP_ENV=production
APP_KEY=base64:3qgXk7wM4fF2T+Yh9B6jK1zR8lQ5sU2vP0xO4eA7dG8=
APP_DEBUG=false
APP_URL=https://deine-subdomain.epizy.com

DB_CONNECTION=mysql
DB_HOST=sqlXXX.epizy.com
DB_PORT=3306
DB_DATABASE=epiz_XXXXXXXX_littlenapoli
DB_USERNAME=epiz_XXXXXXXX
DB_PASSWORD=DEIN_PASSWORT

CORS_ALLOWED_ORIGINS="*"
```

---

## 5. Datenbank & Speisen im Browser initialisieren (Ohne SSH!)
Da InfinityFree kein SSH/Terminal hat, sind spezielle Web-Endpunkte integriert:

1. **Status prüfen:**
   Öffne in deinem Browser:
   ```
   https://deine-subdomain.epizy.com/deploy-status
   ```
   *Prüft sofort die MySQL-Verbindung, PHP-Version und Schreibrechte.*

2. **Tabellen migrieren & Gerichte anlegen:**
   Öffne in deinem Browser:
   ```
   https://deine-subdomain.epizy.com/deploy-migrate-seed
   ```
   *Führt automatisch alle Migrationen aus und befüllt die Speisekarte mit allen neapolitanischen Pizzen & Gerichten.*

3. **Storage-Verknüpfung für Bilder:**
   Öffne in deinem Browser:
   ```
   https://deine-subdomain.epizy.com/deploy-storage-link
   ```

4. **Cache leeren (falls du die .env später anpasst):**
   ```
   https://deine-subdomain.epizy.com/deploy-clear-cache
   ```

---

## 6. Frontend mit dem Backend verbinden
In deinem Frontend (Vercel, Netlify oder Cloudflare Pages):
Füge unter **Settings -> Environment Variables** hinzu:

```env
NEXT_PUBLIC_API_URL=https://deine-subdomain.epizy.com/api/v1
```

Fertig! Dein Backend läuft 100% kostenlos und dauerhaft online.
