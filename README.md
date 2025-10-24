"# system_pos_ueas" 


1- FOR BACKEND
    + install dependency: 
        - composer install
    + copy .env.example to .env in pos-api-usea directory and configure:
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=pos_system_usea
        DB_USERNAME=root
        DB_PASSWORD=
    + in pos-api-usea use this command:
        - php artisan key:generate
        - php artisan migrate:fresh --seed
        - php artisan storage:link
        - php artisan serve

2- FRO API DOCUMENTATION
    - http://locahost:8000/docs/api

3- FOR FRONTEND
    + create .env.local in pos-frontend-usea directory copy and pass this:
        - NEXT_PUBLIC_API_URL=http://localhost:8000/api
    + in pos-frontend-usea install dependency:
        - npm install
    + run the server:
        - npm run dev
    + in browser:
        - http://localhost:3000