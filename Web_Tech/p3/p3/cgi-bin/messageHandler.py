#!/usr/bin/env python3

import cgi
import os

print('''HTTP/1.0 200 OK
Cache-Control: no-cache, must-revalidate
Content-Type: text/html; charset=UTF-8
''')


form = cgi.FieldStorage()
if 'userName' in form and 'userMessage' in form:
    with open('msgs.txt', 'a') as msgsFile:
        msgsFile.write(form['userName'].value + ': ' + form['userMessage'].value + '<br/>\n')

url = os.environ['HTTP_REFERER']

print('<html>')
print('  <head>')
print('    <meta http-equiv="refresh" content="0;url='+str(url)+'" />')
print('  </head>')
print('</html>')
