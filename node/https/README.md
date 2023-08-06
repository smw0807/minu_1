# Express HTTPS server

## 테스트용 인증서 갱신

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```
