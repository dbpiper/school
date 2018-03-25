#!/usr/bin/env python3

import cgi
import os

print('Access-Control-Allow-Origins: *')

print('''HTTP/1.0 200 OK
Cache-Control: no-cache, must-revalidate
Content-Type: text/html; charset=UTF-8
''')


form = cgi.FieldStorage()

for key in form:
    print('Uploaded ' + key + ' successfully.')
    if len(str(form[str(key)])) > 0 and len(str(form[str(key)].filename)) > 0:
        uploadsPath = os.path.join(os.path.dirname(__file__), '../uploads')
        uploadPath = os.path.join(uploadsPath, os.path.basename(form[key].filename))
        with open(uploadPath, 'wb') as writeFile:
            while True:
                chunk = form[key].file.read(2<<16)
                if not chunk:
                    break
                writeFile.write(chunk)
