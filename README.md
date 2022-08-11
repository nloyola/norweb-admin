This project contains the source code for the Nordita Administration Dashboard.

It is a [React](https://reactjs.org/) application written in
[TypeScript](https://www.typescriptlang.org/). It uses [Vite](https://vitejs.dev/) as a build
environment.

# Install

Make sure you have the following packages / apps isntalled:

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node](https://nodejs.org/en/download/package-manager/)

1. Use the following command to clone the project:

    ```sh
    git clone git@github.com:nordita-stockholm/norweb-admin.git
    ```

    This command must be used inside the folder where you want to store the project files.

2. Install the project dependencies:

    ```sh
    cd norweb-admin
    npm install
    ```

# Configure the backend

The application needs to communicate with a backend server. The DNS name and port number must be
specified. To do this, create a file called `.env` at the project's root directory and enter the
following:

```
BACKEND_SERVER=nordita.org
```

In this example, the backend server runs at `nordita.org` port 80.

If you want to use a different backend server, replace `nordita.org` with the DNS name of your
server. To use a port other than 80, append a colon and then the port number. For example:

```
BACKEND_SERVER=my_nordita_backend.com:8000
```

# Running in development mode

To run the application in development mode, use the following command at the project's root directory:

```sh
npm run dev
```

After this command starts, it will display a URL. Open this URL in your web browser and you will see
the application's homepage.

Usually, the URL is [http://127.0.0.1:3000/](http://127.0.0.1:3000/).
