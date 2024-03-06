

## Flos Game

**Project Description:**

Flos is a multiplayer playing card game built with a focus on smooth performance and accessibility across devices. It leverages modern web technologies to deliver an engaging and interactive experience.


**Key Technologies:**

-   **Frontend:**  Vanilla JavaScript, Three.js, GSAP
-   **Backend:**  Node.js, Socket.IO
-   **Testing:**  Mocha, Chai
-   **Deployment:**
    -   Frontend: GitHub Pages (Continuous Integration)
    -   Backend: Render

**Features:**

-   **Multiplayer Gameplay:**  Engage in real-time matches with friends.
-   **Responsive Design:**  Adapts to various screen sizes (though some adjustments might be needed for optimal mobile experience).
-   **Modern Graphics and Animations:**  Enjoy visually appealing gameplay powered by Three.js and GSAP.


**Dependencies:**

For information about specific dependencies and their versions, please refer to the `package.json` file within the project repository.


**Deployment:**

The frontend and backend are deployed separately:

-   **Frontend:**  The frontend is continuously deployed to GitHub Pages. You can access the live version at [https://ahmedhsin.github.io/flos-game/].
-   **Backend:**  The backend is deployed on Render. Due to a free quota limitation, the game might take around a minute to start initially.



## Development Environment Setup Guide

To run the game locally, follow these steps to configure the development environment.

## Backend Configuration

1. Open the `server.js` file in your backend project.

2. Update the Cross-Origin Resource Sharing (CORS) settings to allow requests from localhost. Locate the CORS configuration section and adjust it to permit all origins for localhost.

## Frontend Configuration

1. Open the `index.html` file in your frontend project.

2. Find the socket link configuration and modify it to match the localhost sockets. Update the socket link to point to `localhost:3000` or the port where your backend server is running.

## Switch to Development Branch

1. If you switch to the development branch, there is no need to perform the above settings. Development configurations are already in place.

2. To run locally, start the backend server using:

    ```bash
    cd flos-game-backend
    node ./server.js
    ```

3. Initiate the frontend application with:

    ```bash
    cd flos-game-frontend
    npm run dev
    ```

4. You are now set up for the local development environment!

## Running the Game Locally

1. Open your browser and navigate to `http://localhost:your_frontend_port` to play the game locally.


**Copyright:**

The copyright for images used in the game is specified in the `copyright.txt` file. Please respect the copyright terms.


**Developer:**

Ahmed Mubarak [LinkedIn](https://www.linkedin.com/in/ahmedhsin/)

**Known Issues:**

-   The initial game startup might be slow due to the free quota constraints on the backend deployment.

