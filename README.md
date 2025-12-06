"# Departmental_Website_backend"

**PROJECT API DOCUMENTATION**

Base URL:  http://localhost:5000/api


**AUTH APIs**

**Register User**

**POST** `/auth/register`
Request Body:

{
  "name": "Suvendu",
  "email": "test@gmail.com",
  "password": "123456",
  "role": "student"
}

Response:

{
  "success": true,
  "message": "Registration successful"
}

## **2️⃣ Login User**

**POST** `/auth/login`
Request Body:

{
  "email": "test@gmail.com",
  "password": "123456"
}

Response (sets HTTP-only cookie):

{
  "success": true,
  "message": "Login successful",
  "role": "admin"
}

### **3️⃣ Logout User**

**POST** `/auth/logout`
Response:
{
  "success": true,
  "message": "Logged out successfully"
}

### **4️⃣ Get Logged-in User (Token Required)**

**GET** `/auth/me`
Headers: (cookie auto sent by browser)

Response:
{
  "success": true,
  "user": {
    "id": "U00123",
    "name": "Suvendu",
    "email": "test@gmail.com",
    "role": "admin"
  }
}

## **ADMIN APIs**

## Authorization

Admin routes require:

verifyToken("admin", "superAdmin")

## **ADMIN – STUDENT MANAGEMENT**

## **1️⃣ Get All Students**

**GET** `/admin/student`
Query:

- `page` (optional)
- `limit` (optional)
- `search` (optional)



## **2️⃣ Get Student by ID**

**GET** `/admin/student/:id`



## **3️⃣ Create Student**

**POST** `/admin/student`
Body:


{
  "name": "Rahul",
  "regNo": "CSE23045",
  "department": "CSE"
}


## **4️⃣ Update Student**

**PUT** `/admin/student/:id`


## **5️⃣ Delete Student**

**DELETE** `/admin/student/:id`


## **ADMIN – FACULTY MANAGEMENT**

**Routes under:** `/admin/faculty`

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

All protected with:

verifyToken("admin", "superAdmin")


## **ADMIN – NOTICE MANAGEMENT**

**Routes under:** `/admin/notice`

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

## **ADMIN – EVENT MANAGEMENT**

**Routes under:** `/admin/event`

## **ADMIN – CONTACT MESSAGES**

**Routes under:** `/admin/contact`

- Get all messages
- Delete message


## **ADMIN – ALUMNI**

**Routes under:** `/alumni`

- CRUD

## **ADMIN – DASHBOARD**

**GET** `/admin/dashboard`
Returns:
{
  "totalStudents": 1200,
  "totalFaculty": 56,
  "totalNotices": 30,
  "totalEvents": 12
}

## **PUBLIC APIs (No auth required)**

##  Public Notice

**GET** `/notice/`
**GET** `/notice/:id`

##  Public Event

**GET** `/event/`
**GET** `/event/:id`

## Public Faculty

**GET** `/faculty`
**GET** `/faculty/:id`

## Public Alumni

**GET** `/alumni`
**GET** `/alumni/:id`



## Public Gallery

**GET** `/gallery/`


## Contact Form Submit

**POST** `/contact`
Body:

{
  "name": "Suvendu",
  "email": "test@gmail.com",
  "message": "Hello!"
}

## **USER PROFILE API**

**GET** `/profile/`
Requires logged-in user.
Response:

{
  "success": true,
  "profile": {
    "name": "Suvendu",
    "email": "test@gmail.com",
    "role": "student"
  }
}

## **TOKEN & AUTH RULES**

### **Protected Route Example**

Frontend should include:

axios.get("http://localhost:5000/api/admin/student", {
  withCredentials: true,
});


Backend requires:
verifyToken("admin", "superAdmin")
