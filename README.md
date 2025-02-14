# Contact Identification API

This is a **Node.js + Express + MySQL** API that tracks and consolidates customer identities across multiple purchases based on email and phone number.

## Features
- Identify and link contacts based on email and phone number.
- Maintain a primary contact with linked secondary contacts.
- Store data in a **MySQL** database.

---

## Setup & Installation

### 1️⃣ Prerequisites
- **Node.js** (v16+)
- **MySQL Database**
- **Ngrok** (for local public access) *(optional)*

### 2️⃣ Clone Repository
```sh
 git clone https://github.com/Anishig/Backend_Assign
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Configure Database
Create a **MySQL database** and update `.env` file:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=contacts_db
PORT=3000
```

Run the **MySQL Schema Setup**:
```sql
CREATE TABLE Contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(20),
    email VARCHAR(255),
    linkedId INT NULL,
    linkPrecedence ENUM('primary', 'secondary') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);
```

### 5️⃣ Start the Server
```sh
npm start
```
Server will run on `http://localhost:3000`.

---

## API Documentation

### 🔹 Identify Customer
**Endpoint:** `http://localhost:3000/api/identify`

#### **Request Body:**
```json
{
  "email": "test@example.com",
  "phoneNumber": "123456"
}
```

#### **Response Example:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

---

## Deploy API Publicly

###  Deploy to Vercel**
- **Vercel link:**  https://vercel.com/anishigs-projects/backend-assign

## License
MIT License
