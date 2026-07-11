const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8080);

const contentTypes = {
	".html": "text/html; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".webmanifest": "application/manifest+json; charset=utf-8",
	".wasm": "application/wasm",
	".data": "application/octet-stream",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".svg": "image/svg+xml",
	".ico": "image/x-icon"
};

const server = http.createServer((request, response) => {
	const requestUrl = new URL(request.url, `http://localhost:${port}`);
	let filePath = path.normalize(path.join(root, decodeURIComponent(requestUrl.pathname)));

	if (!filePath.startsWith(root)) {
		response.writeHead(403);
		response.end("Forbidden");
		return;
	}

	if (requestUrl.pathname === "/") {
		filePath = path.join(root, "index.html");
	}

	fs.stat(filePath, (statError, stats) => {
		if (statError || !stats.isFile()) {
			response.writeHead(404);
			response.end("Not found");
			return;
		}

		const headers = getHeaders(filePath);
		response.writeHead(200, headers);

		if (request.method === "HEAD") {
			response.end();
			return;
		}

		fs.createReadStream(filePath).pipe(response);
	});
});

server.listen(port, () => {
	console.log(`StoryBook PWA: http://localhost:${port}`);
});

function getHeaders(filePath) {
	const headers = {};
	let extension = path.extname(filePath).toLowerCase();

	if (extension === ".br" || extension === ".gz") {
		headers["Content-Encoding"] = extension === ".br" ? "br" : "gzip";
		const withoutCompression = filePath.slice(0, -extension.length);
		extension = path.extname(withoutCompression).toLowerCase();
	}

	headers["Content-Type"] = contentTypes[extension] || "application/octet-stream";
	headers["Cross-Origin-Opener-Policy"] = "same-origin";
	headers["Cross-Origin-Embedder-Policy"] = "require-corp";

	if (extension === ".html" || extension === ".js" || extension === ".webmanifest") {
		headers["Cache-Control"] = "no-store";
	}

	return headers;
}
