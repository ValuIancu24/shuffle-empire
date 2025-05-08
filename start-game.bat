@echo off
cd %~dp0
SET NODE_OPTIONS=--openssl-legacy-provider
"C:\Program Files\nodejs\npm.cmd" start