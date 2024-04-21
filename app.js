import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import multer from "multer";
import bcrypt from "bcrypt";
import session from "express-session";

const app = express();
const port = 3000;

// Initialize MySQL connection
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "voting system",
});

// Middleware setup
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view-engine", "ejs");
// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Initialize multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const voterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/voters/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const voterUpload = multer({ storage: voterStorage });

// Function to hash password using bcrypt
const saltRounds = 10;
const hashPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Middleware to check admin login
const checkAdminLogin = (req, res, next) => {
  if (req.session.adminGrantAccess) {
    next();
  } else {
    res.redirect("/admin_login");
  }
};

// Middleware to check user login
const checkUserLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/user_login");
  }
};

app.get("/admin_login", (req, res) => {
  res.render("admin/login.ejs");
});

app.get("/user_login", (req, res) => {
  res.render("user/login.ejs");
});
app.get("/add_candidate", checkAdminLogin, (req, res) => {
  res.render("admin/add_candidate.ejs");
});
app.get("/admin_login", (req, res) => {
  res.render("admin/login.ejs");
});

app.get("/user_registration", (req, res) => {
  res.render("user/registration.ejs");
});

app.get("/candidate_registration", (req, res) => {
  res.render("candidate/registration.ejs");
});
app.get("/logout", (req, res) => {
  req.session.adminGrantAccess = false;
  req.session.userLoggedIn = false;
  res.redirect("/");
});
app.post("/user_registration", (req, res) => {
  const { username, mobile_no, email, password } = req.body;
  const hashedPassword = hashPassword(password);
  const sql = `INSERT INTO users (username, mobile_no, email, password, password_hash) VALUES (?, ?, ?, ?, ?)`;
  const values = [username, mobile_no, email, password, hashedPassword];

  mysqlConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into users table: " + err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("User registered successfully");
    res.status(200).render("user/login.ejs");
  });
});

app.post("/candidate_registration", upload.single("logo"), (req, res) => {
  const logo = req.file ? req.file.filename : null;
  const { username, mobile_no, email, password } = req.body;
  const hashedPassword = hashPassword(password);
  const sql = `INSERT INTO candidates (username, mobile_no, email, logo, password_hash) VALUES (?, ?, ?, ?, ?)`;
  const values = [username, mobile_no, email, logo, hashedPassword];

  mysqlConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into candidates table: " + err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("Candidate registered successfully");
    res.status(200).render("user/login.ejs");
  });
});

// User login route
app.post("/user_submit", (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;

  mysqlConnection.query(sql, [username], (err, rows) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (rows.length === 0) {
      res.status(401).send("Incorrect username or password");
      return;
    }

    const user = rows[0];

    bcrypt.compare(password, user.password_hash, function (err, result) {
      if (result) {
        // Fetch candidate details
        const getCandidatesQuery = `SELECT * FROM candidates`;

        mysqlConnection.query(getCandidatesQuery, (err, candidateRows) => {
          if (err) {
            console.error("Error fetching candidates:", err);
            res.status(500).send("Internal Server Error");
            return;
          }

          // Render user_home.ejs template with candidate data
          console.log(candidateRows);
          res.render("user/home.ejs", {
            username: username,
            candidates: candidateRows,
          });
        });
      } else {
        res.status(401).send("Incorrect username or password");
      }
    });
  });
});

// Candidate login route
app.post("/admin_submit", (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM admin WHERE username = ? AND password = ?`;

  mysqlConnection.query(sql, [username, password], (err, rows) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (rows.length === 0) {
      res.status(401).send("Incorrect username or password");
      return;
    }

    req.session.adminGrantAccess = true;
    res.redirect("/admin_dashboard");
  });
});

app.get("/admin_dashboard", checkAdminLogin, (req, res) => {
  console.log("reached here");
  // Query to get total votes for each candidate
  const voteQuery =
    "SELECT candidate_name, party_name, COUNT(*) AS totalVotes FROM votes GROUP BY candidate_name, party_name";

  mysqlConnection.query(voteQuery, (err, voteResults) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error in database query");
    }
    console.log(voteResults);
    // Query to get candidate details
    const candidateQuery = "SELECT * FROM candidates";

    mysqlConnection.query(candidateQuery, (err, candidateResults) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error in database query");
      }

      // Merge voteResults with candidateResults
      const candidates = candidateResults.map((candidate) => {
        const vote = voteResults.find(
          (vote) =>
            vote.candidate_name === candidate.name &&
            vote.party_name === candidate.party
        );
        candidate.totalVotes = vote ? vote.totalVotes : 0;
        return candidate;
      });
      console.log(candidates);

      // Render admin dashboard
      res.render("admin/dashboard.ejs", { candidates: candidates });
    });
  });
});

// Route to add a new candidate
app.post("/add_candidate", upload.single("logo"), (req, res) => {
  const { name, party, position } = req.body;
  const logo = req.file ? req.file.filename : null;

  const sql = `INSERT INTO candidates (name, party, position, logo) VALUES (?, ?, ?, ?)`;
  const values = [name, party, position, logo];

  mysqlConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into candidates table: " + err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("Candidate added successfully");
    res.redirect("/add_candidate");
  });
});
// Route to display all candidates
app.get("/view_candidate", checkAdminLogin, (req, res) => {
  const sql = "SELECT * FROM candidates";

  mysqlConnection.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching candidates:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.render("admin/view_candidate.ejs", { candidates: rows });
  });
});
// Route to display the remove candidate page
app.get("/remove_candidate", checkAdminLogin, (req, res) => {
  const getCandidatesQuery = `SELECT * FROM candidates`;

  mysqlConnection.query(getCandidatesQuery, (err, candidateRows) => {
    if (err) {
      console.error("Error fetching candidates:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.render("admin/delete_candidate.ejs", { candidates: candidateRows });
  });
});

// Route to handle candidate removal
app.post("/remove_candidate", (req, res) => {
  const candidateId = req.body.candidateId;
  const deleteCandidateQuery = `DELETE FROM candidates WHERE id = ?`;

  mysqlConnection.query(deleteCandidateQuery, candidateId, (err, result) => {
    if (err) {
      console.error("Error removing candidate:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.redirect("/remove_candidate");
  });
});
// Fetch voters from the database
app.get("/view_voters", checkAdminLogin, (req, res) => {
  const sql = "SELECT * FROM users";
  mysqlConnection.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching voters:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("admin/view_voters.ejs", { voters: rows });
  });
});
// Add new voter to the database
app.get("/add_voters", checkAdminLogin, (req, res) => {
  res.render("admin/add_voters.ejs");
});

app.post("/add_voter", voterUpload.single("image"), async (req, res) => {
  const { username, mobile_no, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const image = req.file ? req.file.filename : null;
    const sql = `INSERT INTO users (username, mobile_no, email, password, password_hash, image) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      username,
      mobile_no,
      email,
      password,
      hashedPassword,
      image,
    ];

    mysqlConnection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting data into voters table:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Voter added successfully");
      res.redirect("/view_voters");
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Route to render the remove voter page
app.get("/remove_voters", checkAdminLogin, (req, res) => {
  const getVotersQuery = `SELECT * FROM users`;

  mysqlConnection.query(getVotersQuery, (err, voterRows) => {
    if (err) {
      console.error("Error fetching voters:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.render("admin/remove_voters.ejs", { voters: voterRows });
  });
});

// Route to handle voter removal
app.post("/remove_voter/:voterId", (req, res) => {
  const voterId = req.params.voterId;
  const deleteVoterQuery = `DELETE FROM users WHERE id = ?`;

  mysqlConnection.query(deleteVoterQuery, voterId, (err, result) => {
    if (err) {
      console.error("Error removing voter:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("Voter removed successfully");
    res.redirect("/remove_voters");
  });
});
app.post("/submit_vote", (req, res) => {
  const { voterName, candidateName, candidateParty, candidatePosition } =
    req.body;
  console.log(req.body);

  // Check if the voter has already voted
  mysqlConnection.query(
    "SELECT * FROM votes WHERE voter_name = ?",
    [voterName],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error in database query");
      }
      if (results.length > 0) {
        return res.status(400).send("You have already voted!");
      }

      // If the voter has not voted yet, insert the vote into the database
      mysqlConnection.query(
        "INSERT INTO votes (voter_name, candidate_name, party_name, position_name) VALUES (?, ?, ?, ?)",
        [voterName, candidateName, candidateParty, candidatePosition],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error in database query");
          }
          res.status(200).send("Vote submitted successfully!");
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log("port is running");
});
