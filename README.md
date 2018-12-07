# EventsManager
Event management application for The Hope Foundation

## Installation

Prerequisites  
* Node JS
* npm
* pm2
* Nginx

**1. Clone the repo**  
Download the project files onto your server.  
`$ git clone https://github.com/packard-j/EventsManager.git`

**2. Install node modules**  
Install the required modules for the server application.  
`EventsManager$ npm install`

**3. Install client node modules**  
Install the required modules for the client application.  
`EventsManager/client$ npm install`

**4. Build the client**  
Compile a production build for the client application.  
`EventsManager/client$ npm run build`

## Deployment

**1. Configure nginx**  
Use the following configuration file to connect EventsManager to Nginx.  
Be sure to change the root directory to where you installed it.  
```
server {
    listen 64689 default_server;
    listen [::]:64689 default_server;

    root /path/to/EventsManager/client/build;
    index index.html;

    server_name _;

    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**2. Change the session secret in `index.ts`**  
Set the session secret to a random string of characters for security purposes.
```
app.use(session({
    // CHANGE THE SECRET IN PRODUCTION
    secret: "changeme",
    genid: () => uuid.v4(),
    resave: false,
    saveUninitialized: true
}));
```

**3. Start EventsManager**  
Start the program with npm to compile the typescipt files into javascript.  
`EventsManager$ npm start`

**4. Create an admin user**  
Create a new admin user that will be used to log in later.  
Be sure to change the password to something secure.  
`EventsManager$ node src/manager.js create-user username password`

**5. Restart EventsManager with PM2**  
Starting EventsManager with pm2 allows it to run in the background (along with other benefits).  
`EventsManager$ pm2 start src/index.js`

**6. Start Nginx**  
`$ service nginx start`