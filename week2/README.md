📚 Library Management System 
        (Console Edition)

This is a simple Java-based console app that helps manage a library using basic Object-Oriented Programming (OOP) concepts. It runs entirely in the terminal, with a menu-driven interface that makes it easy to use.

🔧 Features
📖 Book Management

Add Books
Librarians can add new books by entering the title, author, and genre. Each book automatically gets a unique ID assigned by the system.
Remove Books
Books can be removed, but only if they aren't currently borrowed by anyone.
Search Books
Users can search for books by title, author, or genre. The system shows whether each book is available and displays its unique ID.
👤 Member Management

Register Members
Members can be added as Students, Teachers, or Guests. Each category has its own borrowing limit and return policy.
View Members
You can view a list of all registered members along with their IDs and membership type.
🔄 Book Circulation

Issue Books
A book can be issued to a member if it's available and the member hasn't exceeded their borrowing limit. The return date is calculated based on the type of member.
Return Books
When books are returned, the system checks for any reservations. If someone has reserved the book, they’ll be notified.
Reserve Books
If a book is already checked out, members can place a reservation and join the waitlist.
View Issued Books
Members can see which books they’ve borrowed and when they’re due.
View Overdue Books
Librarians can track overdue books and see which member currently holds them.
🖥️ User Interface
Menu System
A simple menu guides users through all options.
Keyboard Navigation
Users interact using the keyboard via the Scanner class.
Session-Based
The system keeps running until the user decides to exit, so multiple operations can be performed in one session.
