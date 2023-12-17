import http from 'http';

const server = http.createServer((req, res) => {
    /* TODO: 각각의 URL들을 어떻게 처리하면 좋을까요? */
    
    console.log('\n ---- Request received! ---- \n');
    console.log(new Date());

    const { pathname, searchParams } = new URL(req.url, `http://localhost:8080`);
    console.log('pathname: ', pathname);

    const method = req.method.toLowerCase();
    console.log('method: ', method);

    if (method === 'get') {                   
        handleGET(pathname);
    } else if (method === 'post') {
        const contentType = req.headers['content-type'] || '';
        console.log('content type: ', contentType);

        handlePOST(pathname, contentType);
    } else {
        handleError(405, 'Method Not Allowed');
    }

    /* GET method handler */
    function handleGET(pathname) {
        if (pathname === '/') {
            handleGETDomain();
        } else if (pathname === '/foo') {
            handleGETFoo();
        } else if (pathname === '/pic/show') {
            handleGETPicShow();
        } else if (pathname === '/pic/download') {
            handleGETPicDownload();
        } else {
            handleError(405, 'Method Not Allowed');
        }
    }

    /* GET method handlers by pathname */
    // domain page
    function handleGETDomain() {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Hello World!</h1>');
    }

    // /foo
    function handleGETFoo() {
        const barVal = searchParams.get('bar');
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Hello, ${barVal}</h1>`);
    }

    // /pic/show
    async function handleGETPicShow() {
        const fileDirectoryPath = '/Users/ahjin/WebDevCurriculum/Quest08/skeleton/uploads';
        const fsModule = await import('fs/promises');

        fsModule.readdir(fileDirectoryPath)
        .then(async (files) => {
            const pathModule = await import('path');
            const imageName = files[0];
            const imagePath = pathModule.join(fileDirectoryPath, imageName);
            console.log('image name: ', imageName);

            fsModule.readFile(imagePath)
            .then((image) => {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(image, 'binary');
            })
            .catch((err) => {
                handleError(404, 'File not found, failed to show', err);
            });
        })
        .catch((err) => {
            handleError(404, 'No files found in the directory', err);
        });
    }

    // /pic/download
    async function handleGETPicDownload() {
        const fileDirectoryPath = '/Users/ahjin/WebDevCurriculum/Quest08/skeleton/uploads';
        const fsModule = await import('fs');

        fsModule.promises.readdir(fileDirectoryPath)
        .then(async (files) => {
            const pathModule = await import('path');
            const imageName = files[0];
            const imagePath = pathModule.join(fileDirectoryPath, imageName);
            console.log('image name: ', imageName);

            fsModule.promises.stat(imagePath)
            .then((stats) => {
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename=pic.jpg`,
                    'Content-Length': stats.size,
                });
                const fileStream = fsModule.createReadStream(imagePath);
                fileStream.pipe(res);
            })
            .catch((err) => {
                handleError(404, 'File not Found, failed to download', err);
            });
        })
        .catch((err) => {
            handleError(500, 'Internal Server Error', err);
        });
    }

    /* POST method handler */
    function handlePOST(pathname, contentType) {
        if (pathname === '/foo') {
            handlePOSTFoo(contentType);
        } else if (pathname === '/pic/upload') {
            handlePOSTUpload(contentType);
        } else {
            handleError(405, 'Method Not Allowed');
        }
    }

    /* POST method handlers by pathname */
    // /foo
    function handlePOSTFoo(contentType) {
        if (contentType !== 'application/json') {
            handleError(400, 'Invalid Content-Type');
        } else {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });

            // JSON 데이터가 완전히 수신된 후에 데이터를 구문 분석
            req.on('end', () => {  
                try {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    const jsonData = JSON.parse(data);
                    res.end(`<h1>Hello, ${jsonData.bar}</h1>`);
                } catch(err) {
                    handleError(400, 'Invalid JSON data!', err);
                }
            });
        } 
    }

    // /pic/upload
    function handlePOSTUpload(contentType) {
        if (contentType === 'image/jpeg') {
            handlePOSTUploadRaw();
        } else if (contentType.startsWith('multipart/form-data')) {
            handlePOSTUploadFormData(contentType);
        } else {
            handleError(405, 'Method Not Allowed');
        }
    }

    // raw of /pic/upload
    function handlePOSTUploadRaw() {
        let imageData = '';
        req.on('data', (chunk) => {
            imageData += chunk.toString('binary');  // 꼭 binary!!!
        });
        
        req.on('end', () => { 
            try {  
                handlePOSTUploadWrtFile(imageData);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Successfully uploaded!' }));
            } catch(err) {
                handleError(400, 'File upload failed for binary', err);
            }
        });
    }

    // "write file" part of /pic/upload
    async function handlePOSTUploadWrtFile(imageData) {
        console.log('content length: ', imageData.length);
        
        const timestamp = Date.now();
        const imageName = `upload_${timestamp}.jpg`;
        
        const uploadDir = 'uploads'; 
        const pathModule = await import('path');
        const imagePath = pathModule.join(uploadDir, imageName);

        const fsModule = await import('fs/promises');

        fsModule.mkdir(uploadDir, { recursive: true })
        .then()
        .catch((err) => {
            handleError(400, 'Failed to make directory for binary', err);
        });

        fsModule.writeFile(imagePath, imageData, 'binary')
        .then()
        .catch((err) => { 
            handleError(400, 'Failed to write the file for binary', err);
        });
    }

    // form-data of /pic/upload
    function handlePOSTUploadFormData(contentType) {
        const boundary = contentType.split('boundary=')[1];

        let data = '';
        req.on('data', (chunk) => {
            data += chunk.toString('binary');
        });

        req.on('end', () => {
            // \r\n--boundary\r\n
            const parts = data.split(`--${boundary}`);
            let imageCounter = 0;

            // '\r\nContent-Disposition: form-data; name="image"\r\n\r\n/image.jpg\r\n'
            parts.filter((part) => part.trim() !== '' && part.trim() !== '--') 
            .forEach((part) => { 
                const [headers, content] = part.split('\r\n\r\n');
                const headerLines = headers.split('\r\n');
                const contentDisposition = headerLines.find((line) => line.startsWith('Content-Disposition'));
                const fieldNameMatch = /name="([^"]+)"/.exec(contentDisposition);
                
                if (fieldNameMatch && contentDisposition.includes('filename')) {
                    imageCounter++;
                    handlePOSTUploadWrtFile(content);
                }
            });

            if (imageCounter > 0) {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Successfully uploaded!' }));
            } else {
                handleError(405, 'Method Not Allowed');
            }
        });
    }

    /* error handler */
    function handleError(statusCode, errorMessage, error) {
        if (error) {
            console.error(error);
        }

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: errorMessage }));
    }
});

server.listen(8080);