import http from 'http';

http.get('http://localhost:3000/api/sessions', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const sessions = JSON.parse(body);
      if (sessions.length > 0) {
        const firstSession = sessions[0];
        http.get(`http://localhost:3000/api/sessions/${firstSession.id}`, (res2) => {
          let body2 = '';
          res2.on('data', chunk => body2 += chunk);
          res2.on('end', () => {
            try {
              console.log('LOCAL RAW DETAILS RESPONSE:', body2);
            } catch (e) {
              console.error('Error:', e);
            }
          });
        });
      }
    } catch (e) {
      console.error('Error parsing list:', e);
    }
  });
});
