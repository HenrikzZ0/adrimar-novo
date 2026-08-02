// Servidor estatico simples para preview do projeto (HTML/CSS/JS puro).
// Nao faz parte do site em si, serve apenas os arquivos estaticos.
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname, join, normalize } from "node:path"

const PORT = process.env.PORT || 3000
const ROOT = process.cwd()

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
}

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0])
    if (urlPath === "/") urlPath = "/index.html"

    const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, "")
    const filePath = join(ROOT, safePath)

    const data = await readFile(filePath)
    const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream"
    res.writeHead(200, { "Content-Type": type })
    res.end(data)
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
    res.end("<h1>404 - Pagina nao encontrada</h1>")
  }
})

server.listen(PORT, () => {
  console.log(`[v0] Servidor rodando em http://localhost:${PORT}`)
})
