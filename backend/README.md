# SkillTrade Backend – Setup & Run Instructions

## 1. Overview

SkillTrade's backend uses:

- **Node.js:** JavaScript runtime that runs the backend.
- **Express.js:** Framework used to build API endpoints.
- **npm:** Package manager used to install dependencies.

The backend provides API endpoints that the React frontend can communicate with.

## 2. Prerequisites

Before running the backend, install:

- Node.js
- npm (included with Node.js)


Verify that Node.js and npm are installed by running:

```bash
node -v
npm -v
```

## 3. Get the Project

Pull the latest changes from the team's repository and open the project in VS Code.

Navigate to the backend directory:

```bash
cd backend
```

## 4. Install Dependencies

Run the following command inside the `backend` directory:

```bash
npm install
```

This installs the dependencies listed in `package.json`, including Express and the other backend packages.

**Note:** You only need to run `npm install` when setting up the backend for the first time or when dependencies change.

## 5. Start the Backend Server

There are two ways to start the server.

**Development mode:**

```bash
npm run dev
```

**Normal mode:**

```bash
npm start
```


Keep the terminal running while using the backend.

## 6. Verify the Backend Is Running

Open your browser and visit:

```text
http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "success",
  "message": "SkillTrade backend is running!"
}
```

If you receive this response, the backend is running successfully.

## 7. Stop the Server

To stop the backend server, return to the terminal and press:

```text
Ctrl + C
```

## 8. Important Notes

- Do not commit or push the `node_modules` directory.
- Do not commit or share your `.env` file or database credentials.
