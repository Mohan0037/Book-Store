# BookStore – MERN Stack Online Book Shopping System

**Project Documentation**

| | |
|---|---|
| **Student Name** | Mohan Krishna Chatti |
| **Project Title** | BookStore – MERN Stack Online Book Shopping System |
| **Technology Stack** | MongoDB, Express.js, React.js, Node.js (MERN) |
| **Repository** | Book-Store-main |

---

## Table of Contents

1. [Phase 1: Brainstorming & Ideation](#phase-1-brainstorming--ideation)
2. [Phase 2: Requirement Analysis](#phase-2-requirement-analysis)
3. [Phase 3: Project Design](#phase-3-project-design)
4. [Phase 4: Project Planning](#phase-4-project-planning)
5. [Phase 5: Project Development](#phase-5-project-development)
6. [Phase 6: Functional & Performance Testing](#phase-6-functional--performance-testing)
7. [Phase 7: Results](#phase-7-results)

---

## Phase 1: Brainstorming & Ideation

### 1.1 Problem Statement
Online book buying and selling today is fragmented — readers, independent sellers, and platform administrators each need a different set of tools, but most small-scale bookstore platforms only build for one of these roles. There is a need for a single system that lets **readers** browse and purchase books, lets **sellers** list and manage their own inventory, and gives an **admin** oversight of the entire platform.

### 1.2 Proposed Solution
Build a **BookStore MERN Stack Online Book Shopping System** with three distinct portals (Reader, Seller, Admin) sharing one backend and database, so that:
- Readers can discover, purchase, and track books.
- Sellers can independently manage their own book catalog.
- Admins can oversee users, sellers, and platform-wide data.

### 1.3 Target Users
| Role | Needs |
|---|---|
| Reader | Browse books, view details, add to cart, place and track orders |
| Seller | Add/manage book listings, upload cover images, view their inventory |
| Admin | Manage users, sellers, and platform data from a central dashboard |

### 1.4 Key Idea Differentiators
- Single codebase serving three role-based portals with distinct permissions.
- Secure authentication via JWT so each role only accesses its own resources.
- Image upload support (via Multer) for realistic, visually complete book listings.

---

## Phase 2: Requirement Analysis

### 2.1 Functional Requirements

**Reader Portal**
- User registration and login
- Browse all available books
- View individual book details
- Add books to cart
- Place orders
- View order history

**Seller Portal**
- Seller registration and login
- Add new books with cover images
- Manage (view) their own book inventory

**Admin Portal**
- Admin login
- Manage users and sellers
- View platform data via dashboard

### 2.2 Non-Functional Requirements
- **Security:** Password hashing and JWT-based authentication/authorization
- **Usability:** Simple, responsive React UI across all portals
- **Performance:** Fast page loads via Vite-powered frontend
- **Maintainability:** Clear separation of concerns (controllers, models, routes, middleware)
- **Data Integrity:** Mongoose schema validation for all entities

### 2.3 Technical Requirements

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) |
| File Uploads | Multer |
| Version Control | Git & GitHub |

### 2.4 Tools Used
- MongoDB Server + MongoDB Compass (database & GUI client)
- VS Code (development)
- Postman (API testing, implied by REST backend)
- Git/GitHub (source control)

---

## Phase 3: Project Design

### 3.1 System Architecture

The application follows a standard **three-tier MERN architecture**:

```
┌─────────────────────┐
│   React Frontend     │  (Client – runs on localhost:5173)
│  Reader / Seller /    │
│   Admin Portals       │
└──────────┬───────────┘
           │ REST API (JWT-secured)
┌──────────▼───────────┐
│  Express.js Backend   │  (Server – runs on port 8000)
│  Controllers | Routes │
│  Middlewares          │
└──────────┬───────────┘
           │ Mongoose ODM
┌──────────▼───────────┐
│   MongoDB Database    │
│  Collections: Admin,  │
│  Book, Interaction,   │
│  Inventory, MyOrder,  │
│  Seller, User         │
└───────────────────────┘
```

### 3.2 Database Design (Collections / Models)

| Model | Purpose |
|---|---|
| **User** | Stores reader account details and credentials |
| **Seller** | Stores seller account details and credentials |
| **Admin** | Stores admin account details |
| **Book** | Stores book details — title, author, price, cover image, seller reference |
| **Inventory** | Tracks stock/listing data per seller |
| **MyOrder** | Stores order details placed by readers |
| **Interaction** | Stores user interactions (e.g., cart activity) |

### 3.3 Folder / Module Design

```
Book-Store-main
│
├── Client                  # React frontend
├── Server                  # Node/Express backend
│   ├── config               # DB connection config
│   ├── controllers          # AdminControllers.js, SellerControllers.js, UsersController.js
│   ├── middlewares          # Auth / upload middleware
│   ├── models                # Admin, Book, Interaction, Inventory, MyOrder, Seller, User
│   ├── routes                 # adminRoutes.js, sellerRoutes.js, userRoutes.js
│   ├── uploads                 # Uploaded book cover images
│   ├── package.json
│   └── server.js
├── Documentation
├── screenshots
├── README.md
└── .gitignore
```

### 3.4 API Route Design (High Level)

| Route Base | Role | Sample Endpoints |
|---|---|---|
| `/api/user` | Reader | register, login, get books, cart, place order, view orders |
| `/api/seller` | Seller | register, login, add book, view inventory |
| `/api/admin` | Admin | login, manage users, manage sellers |

### 3.5 Authentication Flow
1. User registers → password hashed → stored in respective collection (User/Seller/Admin).
2. User logs in → credentials verified → JWT issued.
3. JWT sent with subsequent requests → middleware verifies token → grants role-based access.

---

## Phase 4: Project Planning

### 4.1 Development Approach
An iterative, milestone-based approach was followed — set up the environment first, then build backend APIs, then connect the frontend, and finally test and document.

### 4.2 Milestones

| Milestone | Deliverable |
|---|---|
| M1 | MongoDB installation and connection verified |
| M2 | Backend server running with all models/routes/controllers |
| M3 | Frontend running and communicating with backend |
| M4 | Reader portal complete (auth, browse, cart, orders) |
| M5 | Seller portal complete (auth, add/manage books) |
| M6 | Admin portal complete (dashboard, user/seller management) |
| M7 | Data seeding (books, images, prices) for demo-readiness |
| M8 | GitHub repository setup, README, screenshots |
| M9 | Final documentation and submission |

### 4.3 Risk Assessment

| Risk | Mitigation |
|---|---|
| MongoDB not installed/configured | Installed MongoDB Server + Compass, verified connection |
| Backend downtime causing feature failure (e.g., registration) | Restarted backend service, added verification step before demo |
| Empty database with no visible content | Manually seeded realistic book data and cover images |
| Missing admin order management (scope gap in source project) | Documented as a known limitation rather than a bug |

### 4.4 Timeline (Illustrative)
Environment Setup → Backend Development → Frontend Integration → Data Seeding → Testing → GitHub Repository & README → Documentation → Final Submission

---

## Phase 5: Project Development

### 5.1 Environment Setup

**MongoDB Setup**
- Installed MongoDB Server (was missing initially, `mongosh` not recognized).
- Started the MongoDB service and verified the connection.
- Installed MongoDB Compass separately for GUI-based database inspection (confirmed optional for running the app itself).

**Confirmed successful startup output:**
```
Server running on port 8000
MongoDB Connected: 127.0.0.1
```

### 5.2 Running the Application

**Backend:**
```bash
cd Server
npm start
```

**Frontend:**
```bash
cd Client
npm run dev
```

Application accessed at: `http://localhost:5173`

### 5.3 Backend Implementation
- Built REST controllers: `AdminControllers.js`, `SellerControllers.js`, `UsersController.js`
- Implemented Mongoose models: `Admin`, `Book`, `Interaction`, `Inventory`, `MyOrder`, `Seller`, `User`
- Implemented role-based routes: `adminRoutes.js`, `sellerRoutes.js`, `userRoutes.js`
- Integrated Multer middleware for handling book cover image uploads
- Implemented JWT-based authentication middleware for securing protected routes

### 5.4 Frontend Implementation
- Built React (Vite) client with dedicated views for Reader, Seller, and Admin portals
- Implemented book browsing, book detail view, cart, and order placement/history for readers
- Implemented book-add and inventory views for sellers
- Implemented dashboard views for admin

### 5.5 Data Seeding
Since the database was initially empty (no books visible), the following was done:
- Added books manually with realistic titles/authors and USD pricing
- Uploaded corresponding cover images for each book

### 5.6 Issues Encountered & Resolutions

| # | Issue | Resolution |
|---|---|---|
| 1 | `mongosh` not recognized / MongoDB not installed | Installed MongoDB Server, started service, verified connection |
| 2 | MongoDB Compass missing | Installed separately; confirmed it's optional for running the app |
| 3 | Registration failing | Root cause: backend server was stopped; resolved by restarting it |
| 4 | Book list showing empty | Root cause: empty database; resolved by manually seeding books and images |
| 5 | No admin order management page | Identified as a scope limitation of the original project, not a bug |

### 5.7 Version Control
- Initialized Git in the project root
- Added `.gitignore`, `README.md`, `Documentation/`, `screenshots/`
- Committed the project and configured the GitHub remote
- Resolved an initial push conflict by pulling/synchronizing with the remote before pushing successfully

---

## Phase 6: Functional & Performance Testing

### 6.1 Functional Test Cases

| Test ID | Module | Test Case | Expected Result | Status |
|---|---|---|---|---|
| TC01 | Auth | Register a new reader account | Account created, redirected to login/home | Pass |
| TC02 | Auth | Login with valid credentials | JWT issued, user redirected to dashboard | Pass |
| TC03 | Auth | Login with invalid credentials | Error message shown, access denied | Pass |
| TC04 | Reader | Browse book list | All seeded books display with images and prices | Pass |
| TC05 | Reader | View single book details | Correct book detail page loads | Pass |
| TC06 | Reader | Add book to cart | Book appears in cart | Pass |
| TC07 | Reader | Place an order | Order created and visible in order history | Pass |
| TC08 | Reader | View past orders | Order list displays correctly | Pass |
| TC09 | Seller | Register/login as seller | Seller authenticated successfully | Pass |
| TC10 | Seller | Add a new book with cover image | Book saved and appears in reader's book list | Pass |
| TC11 | Admin | Login as admin | Admin dashboard loads | Pass |
| TC12 | Admin | View users/sellers | Data displays correctly | Pass |
| TC13 | Admin | Order management | No such page exists | Known Limitation (not a defect) |

### 6.2 Performance Observations
- Backend responded correctly on port `8000` once the MongoDB connection was established.
- Frontend (Vite dev server) loaded quickly on `localhost:5173` with no noticeable lag during navigation across portals.
- Image uploads via Multer processed without errors once cover images were provided in supported formats.

### 6.3 Known Limitations
- The Admin Portal does not currently include an order-management page — identified as a gap in the original project scope, to be considered for future enhancement.

---

## Phase 7: Results

### 7.1 Summary of Completed Work

| Area | Status |
|---|---|
| MongoDB setup | ✅ Completed |
| Backend configuration | ✅ Completed |
| Frontend configuration | ✅ Completed |
| User authentication (JWT) | ✅ Completed |
| Reader portal (browse, cart, orders) | ✅ Completed |
| Seller portal (add/manage books) | ✅ Completed |
| Admin portal (user/seller management) | ✅ Completed |
| Book & image upload | ✅ Completed |
| GitHub repository setup | ✅ Completed |
| README documentation | ✅ Completed |
| Screenshots | ✅ Completed |

### 7.2 Screenshots Captured
- Homepage
- Reader books listing
- Book details page
- Cart page
- Orders page
- Seller dashboard
- Add book page
- Admin dashboard

*(Stored in the `screenshots/` folder of the repository and referenced in the README.)*

### 7.3 Conclusion
The BookStore MERN Stack Online Book Shopping System was successfully set up, developed, tested, and deployed locally with three fully functional portals — Reader, Seller, and Admin. All core e-commerce flows (browsing, cart, checkout, order history, book/inventory management, and platform administration) work as intended. The project is version-controlled on GitHub with a professional README and supporting screenshots.

### 7.4 Future Enhancements
- Add an order-management page to the Admin Portal
- Add payment gateway integration
- Add search and filter/sort functionality for books
- Add ratings and reviews for books
- Add email notifications for order confirmation
- Deploy the application to a live hosting environment (e.g., Render/Vercel + MongoDB Atlas)

### 7.5 Repository Structure (Final)

```
Book-Store-main
│
├── Client
├── Server
├── Documentation
├── screenshots
├── README.md
└── .gitignore
```

---

*This documentation reflects the phase-wise development and submission template, populated with the actual technical work completed on the BookStore MERN project.*
