# ClearFlow Production Service

This Nuxt app should run as a Node server behind nginx so dynamic routes such as
`/cleaners/rainready-gutter-cleaning-pasadena` work.

## Install or Update

On the server:

```bash
cd /var/www/clear_flow_gutters
npm install
npm run build
sudo cp deploy/clearflow-gutters.service /etc/systemd/system/clearflow-gutters.service
sudo systemctl daemon-reload
sudo systemctl enable clearflow-gutters
sudo systemctl restart clearflow-gutters
sudo systemctl status clearflow-gutters
```

The service runs on `127.0.0.1:3003`.

## Nginx

Update the ClearFlow nginx site so `location /` proxies to:

```nginx
proxy_pass http://127.0.0.1:3003;
```

Then validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Logs

```bash
sudo journalctl -u clearflow-gutters -f
```
