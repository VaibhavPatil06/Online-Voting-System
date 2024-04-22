# Online Voting System

This is an Online Voting System web application developed using HTML, CSS, JavaScript, Node.js, Express.js, Bootstrap, and EJS (Embedded JavaScript).

## Features
**Authentication**:
  - Voter login
  - Admin login

**Voter Panel**:
  - Voter registration
  - Voter home page

**Admin Panel**:
  - Add voter
  - View voter
  - Remove voter
  - Add candidate
  - View candidate
  - Remove candidate
  - Admin dashboard

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- EJS (Embedded JavaScript)
- Bootstrap
- Bcrypt (for robust authentication)
- Mysql

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/online-voting-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd online-voting-system
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Import Database:

   ```bash
   Import Datasbe into Mysql 
   ```

5. Run the application:

   ```bash
   node app.js
   ```

   The application will be running at `http://localhost:3000`.

## Folder Structure

```
online-voting-system/
├── views/
│   ├── admin/
│   │   ├── addCandidate.ejs
│   │   ├── addVoter.ejs
│   │   ├── dashboard.ejs
│   │   ├── removeCandidate.ejs
│   │   ├── removeVoter.ejs
│   │   ├── viewCandidate.ejs
│   │   └── viewVoter.ejs
│   ├── voters/
│   │   ├── voterHome.ejs
│   │   ├── voterLogin.ejs
│   │   └── voterRegistration.ejs
│   └── home.ejs
├── app.js
└── package.json
```

