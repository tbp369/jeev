# 📚 Library Management System (Console Edition)

A simple **Java-based console application** that helps manage a library using fundamental **Object-Oriented Programming (OOP)** principles. The application runs entirely in the terminal and features a clean, menu-driven interface for intuitive navigation.

---

## 🔧 Features

### 📖 Book Management
- **Add Books**  
  Librarians can add new books by entering the title, author, and genre. Each book automatically receives a unique system-generated ID.

- **Remove Books**  
  Books can be removed from the system, provided they are not currently borrowed by any member.

- **Search Books**  
  Users can search for books by:
  - Title  
  - Author  
  - Genre  
  The system displays the availability status and unique ID of each book.

---

### 👤 Member Management
- **Register Members**  
  Members can be added under one of the following categories:
  - Student  
  - Teacher  
  - Guest  
  Each category comes with its own borrowing limits and return policies.

- **View Members**  
  Displays a list of all registered members, including their unique IDs and membership types.

---

### 🔄 Book Circulation
- **Issue Books**  
  Books can be issued if:
  - The book is available  
  - The member hasn’t exceeded their borrowing limit  
  The return date is auto-calculated based on the membership type.

- **Return Books**  
  When returned, the system:
  - Updates the status  
  - Checks for any pending reservations  
  - Notifies the next member in the queue (if applicable)

- **Reserve Books**  
  If a book is checked out, members can:
  - Place a reservation  
  - Join the waitlist for that book

- **View Issued Books**  
  Members can view:
  - Books currently borrowed  
  - Their respective due dates

- **View Overdue Books**  
  Librarians can track:
  - Overdue books  
  - The members responsible for them

---

## 🖥️ User Interface

- **Menu System**  
  A clear, text-based menu guides users through all available options.

- **Keyboard Navigation**  
  All interaction is done using the keyboard, powered by Java's `Scanner` class.

- **Session-Based**  
  The application runs continuously until the user chooses to exit, enabling multiple actions in a single session.

---

## 🛠️ Technologies Used
- Java
- OOP Principles
- Console-based Input/Output


