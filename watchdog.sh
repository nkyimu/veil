#!/bin/bash
LOGFILE=~/.openclaw/workspace/veil/watchdog.log
VEIL_DIR=~/.openclaw/workspace/veil

restart_stack() {
  echo "[$(date)] Restarting VeilVault stack..." >> $LOGFILE
  pkill -f "next-server" 2>/dev/null
  pkill -f "cloudflared tunnel" 2>/dev/null
  pkill -f "caffeinate" 2>/dev/null
  sleep 3
  
  caffeinate -i &
  
  cd $VEIL_DIR
  PORT=3000 NODE_ENV=production node .next/standalone/.openclaw/workspace/veil/server.js >> $LOGFILE 2>&1 &
  sleep 8
  
  cloudflared tunnel --url http://localhost:3000 >> $LOGFILE 2>&1 &
  sleep 10
  
  NEW_URL=$(grep -o 'https://[^[:space:]]*trycloudflare.com' $LOGFILE | tail -1)
  
  if [ -n "$NEW_URL" ]; then
    cd $VEIL_DIR
    jq --arg url "$NEW_URL" '.demoUrl = $url | .deployedURL = $url' agent.json > agent.json.tmp && mv agent.json.tmp agent.json
    echo "[$(date)] Restarted. New URL: $NEW_URL" >> $LOGFILE
    echo "$NEW_URL" > $VEIL_DIR/current-tunnel-url.txt
  else
    echo "[$(date)] WARNING: Could not detect new tunnel URL" >> $LOGFILE
  fi
}

while true; do
  if ! curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "[$(date)] localhost:3000 DOWN — initiating restart" >> $LOGFILE
    restart_stack
  else
    echo "[$(date)] VeilVault healthy" >> $LOGFILE
  fi
  sleep 60
done
