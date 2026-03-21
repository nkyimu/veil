#!/usr/bin/env bash
# start-guardian.sh — Launches the VeilVault Guardian with Venice API key from macOS Keychain
#
# Usage:
#   ./scripts/start-guardian.sh
#   ./scripts/start-guardian.sh dev  # watch mode
#
# Requires:
#   GUARDIAN_PRIVATE_KEY or GUARDIAN_ADDRESS in .env
#   Venice API key stored in macOS Keychain as service "VENICE_API_KEY"
#
# Venice key setup (one-time):
#   security add-generic-password -s "VENICE_API_KEY" -a "$USER" -w "<your-key>"
#   Get key at: https://venice.ai/dashboard

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VEIL_DIR="$(dirname "$SCRIPT_DIR")"

# ─── Load .env ─────────────────────────────────────────────────────────────
if [[ -f "$VEIL_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$VEIL_DIR/.env"
  set +a
fi

# ─── Load Venice API key from Keychain ────────────────────────────────────
if [[ -z "${VENICE_API_KEY:-}" ]]; then
  KEYCHAIN_KEY=$(security find-generic-password -s "VENICE_API_KEY" -w 2>/dev/null || true)
  if [[ -n "$KEYCHAIN_KEY" ]]; then
    export VENICE_API_KEY="$KEYCHAIN_KEY"
    echo "[start-guardian] ✓ Venice API key loaded from macOS Keychain"
  else
    echo "[start-guardian] ⚠ VENICE_API_KEY not found in Keychain or .env — Venice inference will fall back to local mode"
    echo "[start-guardian]   To fix: security add-generic-password -s 'VENICE_API_KEY' -a \"\$USER\" -w '<your-key>'"
    echo "[start-guardian]   Get key at: https://venice.ai/dashboard"
  fi
else
  echo "[start-guardian] ✓ Venice API key loaded from environment"
fi

# ─── Load Locus API key from Keychain ─────────────────────────────────────
if [[ -z "${LOCUS_API_KEY:-}" ]]; then
  LOCUS_KEY=$(security find-generic-password -a "veil-guardian" -s "locus-api-key" -w 2>/dev/null || true)
  if [[ -n "$LOCUS_KEY" ]]; then
    export LOCUS_API_KEY="$LOCUS_KEY"
    echo "[start-guardian] ✓ Locus API key loaded from macOS Keychain"
  else
    echo "[start-guardian] ⚠ LOCUS_API_KEY not in Keychain or .env — payment verification in dev mode"
    echo "[start-guardian]   To fix: security add-generic-password -a 'veil-guardian' -s 'locus-api-key' -w '<your-key>'"
  fi
else
  echo "[start-guardian] ✓ Locus API key loaded from environment"
fi

# ─── Load Locus wallet from Keychain ──────────────────────────────────────
if [[ -z "${LOCUS_WALLET_ADDRESS:-}" ]]; then
  LOCUS_WALLET=$(security find-generic-password -a "veil-guardian" -s "locus-wallet-address" -w 2>/dev/null || true)
  if [[ -n "$LOCUS_WALLET" ]]; then
    export LOCUS_WALLET_ADDRESS="$LOCUS_WALLET"
    echo "[start-guardian] ✓ Locus wallet address loaded from macOS Keychain: $LOCUS_WALLET_ADDRESS"
  else
    # Fallback to known registered wallet
    export LOCUS_WALLET_ADDRESS="0x680ab339ea34d34a939080dfb3aef932b3892b4a"
    echo "[start-guardian] ✓ Locus wallet address set to registered guardian wallet"
  fi
fi

# ─── Validate Guardian address ────────────────────────────────────────────
if [[ -z "${GUARDIAN_ADDRESS:-}" ]] && [[ -z "${GUARDIAN_PRIVATE_KEY:-}" ]]; then
  echo "[start-guardian] ⚠ Neither GUARDIAN_ADDRESS nor GUARDIAN_PRIVATE_KEY is set"
  echo "[start-guardian]   Guardian will run in read-only mode (queries not answerable)"
fi

# ─── Launch ───────────────────────────────────────────────────────────────
cd "$VEIL_DIR"

MODE="${1:-}"
if [[ "$MODE" == "dev" ]]; then
  echo "[start-guardian] Starting in watch mode (--watch)..."
  exec npx tsx --watch agent/server.ts
else
  echo "[start-guardian] Starting guardian agent..."
  exec npx tsx agent/server.ts
fi
