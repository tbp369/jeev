import java.time.LocalDate;
import java.util.UUID;
import java.util.Queue;
import java.util.LinkedList;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;
class Book {
    private UUID bookID;
    private String title;
    private String author;
    private String genre;
    private boolean isIssued;
    private Member issuedTo;
    private LocalDate dueDate;
    private Queue<Member> reservationQueue;

    public Book(String title, String author, String genre) {
        this.bookID = UUID.randomUUID();
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isIssued = false;
        this.issuedTo = null;
        this.dueDate = null;
        this.reservationQueue = new LinkedList<>();
    }

    // Getters
    public UUID getBookID() {
        return bookID;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getGenre() {
        return genre;
    }

    public boolean isIssued() {
        return isIssued;
    }

    public Member getIssuedTo() {
        return issuedTo;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Queue<Member> getReservationQueue() {
        return reservationQueue;
    }

    // Setters
    public void setIssued(boolean issued) {
        isIssued = issued;
    }

    public void setIssuedTo(Member issuedTo) {
        this.issuedTo = issuedTo;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void addReservation(Member member) {
        this.reservationQueue.add(member);
    }

    public Member getNextReservation() {
        return this.reservationQueue.poll();
    }

    @Override
    public String toString() {
        return "Book [ID=" + bookID.toString() + ", Title=" + title + ", Author=" + author + ", Genre=" + genre + ", Issued=" + isIssued + "]";
    }
}

abstract class Member {
    private UUID memberID;
    private String name;
    private String email;
    private String phone;
    protected int maxBooksAllowed;
    private List<Book> currentlyIssuedBooks;

    public Member(String name, String email, String phone) {
        this.memberID = UUID.randomUUID();
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.currentlyIssuedBooks = new ArrayList<>();
    }

    // Getters
    public UUID getMemberID() {
        return memberID;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public int getMaxBooksAllowed() {
        return maxBooksAllowed;
    }

    public List<Book> getCurrentlyIssuedBooks() {
        return currentlyIssuedBooks;
    }

    // Abstract methods
    public abstract int getMaxAllowedDays();
    public abstract String getMemberType();

    // Methods to manage issued books
    public boolean canIssueBook() {
        return currentlyIssuedBooks.size() < maxBooksAllowed;
    }

    public void issueBook(Book book) {
        currentlyIssuedBooks.add(book);
    }

    public void returnBook(Book book) {
        currentlyIssuedBooks.remove(book);
    }

    @Override
    public String toString() {
        return "Member [ID=" + memberID.toString() + ", Name=" + name + ", Type=" + getMemberType() + ", Email=" + email + "]";
    }
}

class StudentMember extends Member {
    public StudentMember(String name, String email, String phone) {
        super(name, email, phone);
        this.maxBooksAllowed = 3;
    }

    @Override
    public int getMaxAllowedDays() {
        return 14;
    }

    @Override
    public String getMemberType() {
        return "Student";
    }
}

class TeacherMember extends Member {
    public TeacherMember(String name, String email, String phone) {
        super(name, email, phone);
        this.maxBooksAllowed = 5;
    }

    @Override
    public int getMaxAllowedDays() {
        return 30;
    }

    @Override
    public String getMemberType() {
        return "Teacher";
    }
}

class GuestMember extends Member {
    public GuestMember(String name, String email, String phone) {
        super(name, email, phone);
        this.maxBooksAllowed = 1;
    }

    @Override
    public int getMaxAllowedDays() {
        return 7;
    }

    @Override
    public String getMemberType() {
        return "Guest";
    }
}

class Librarian extends Member {
    public Librarian(String name, String email, String phone) {
        super(name, email, phone);
        this.maxBooksAllowed = Integer.MAX_VALUE; // Librarians can issue many books for internal purposes
    }

    @Override
    public int getMaxAllowedDays() {
        return 0; // Not applicable for librarians in this context
    }

    @Override
    public String getMemberType() {
        return "Librarian";
    }

    // Librarian specific responsibilities (methods will be implemented in Library class)
    // Add/remove books
    // View issued books
    // Override return deadlines
    // Manage member registrations
}

class Library {
    private Map<UUID, Book> books;
    private Map<UUID, Member> members;

    public Library() {
        this.books = new HashMap<>();
        this.members = new HashMap<>();
    }

    // Functionality and Responsibilities

    // Add a book to the library
    public void addBook(Book book) throws IllegalArgumentException {
        if (books.containsKey(book.getBookID())) {
            throw new IllegalArgumentException("Book with this ID already exists.");
        }
        books.put(book.getBookID(), book);
        System.out.println("Book added: " + book.getTitle());
    }

    // Remove a book from the library
    public void removeBook(Book book) throws IllegalArgumentException {
        if (book.isIssued()) {
            throw new IllegalArgumentException("Cannot remove an issued book.");
        }
        if (!books.containsKey(book.getBookID())) {
            throw new IllegalArgumentException("Book not found in library.");
        }
        books.remove(book.getBookID());
        System.out.println("Book removed: " + book.getTitle());
    }

    // Issue a book to a member
    public void issueBook(Book book, Member member) throws IllegalArgumentException {
        if (book.isIssued()) {
            throw new IllegalArgumentException("Book is already issued.");
        }
        if (!member.canIssueBook()) {
            throw new IllegalArgumentException("Member has reached their book limit.");
        }

        book.setIssued(true);
        book.setIssuedTo(member);
        book.setDueDate(LocalDate.now().plusDays(member.getMaxAllowedDays()));
        member.issueBook(book);
        System.out.println("Book \'" + book.getTitle() + "\' issued to " + member.getName() + ". Due date: " + book.getDueDate());
    }

    // Return a book from a member
    public void returnBook(Book book, Member member) throws IllegalArgumentException {
        if (!book.isIssued() || !book.getIssuedTo().equals(member)) {
            throw new IllegalArgumentException("Book was not issued to this member.");
        }

        member.returnBook(book);
        book.setIssued(false);
        book.setIssuedTo(null);
        book.setDueDate(null);

        if (!book.getReservationQueue().isEmpty()) {
            Member nextReserver = book.getNextReservation();
            System.out.println("Book \'" + book.getTitle() + "\' is now reserved for " + nextReserver.getName());
            // Optionally, automatically issue to the next reserver or notify them
        }
        System.out.println("Book \'" + book.getTitle() + "\' returned by " + member.getName());
    }

    // Search for books by keyword (title, author, or genre)
    public List<Book> searchBooks(String keyword) {
        String lowerCaseKeyword = keyword.toLowerCase();
        return books.values().stream()
                .filter(book -> book.getTitle().toLowerCase().contains(lowerCaseKeyword) ||
                                 book.getAuthor().toLowerCase().contains(lowerCaseKeyword) ||
                                 book.getGenre().toLowerCase().contains(lowerCaseKeyword))
                .collect(Collectors.toList());
    }

    // Reserve a book
    public void reserveBook(Book book, Member member) throws IllegalArgumentException {
        if (!book.isIssued()) {
            throw new IllegalArgumentException("Book is not currently issued and cannot be reserved.");
        }
        if (book.getIssuedTo().equals(member)) {
            throw new IllegalArgumentException("You already have this book issued.");
        }
        if (book.getReservationQueue().contains(member)) {
            throw new IllegalArgumentException("You have already reserved this book.");
        }
        book.addReservation(member);
        System.out.println("Book \'" + book.getTitle() + "\' reserved by " + member.getName());
    }

    // View all books currently issued to a member
    public List<Book> viewIssuedBooks(Member member) {
        return member.getCurrentlyIssuedBooks();
    }

    // Register a new member
    public void registerMember(Member member) throws IllegalArgumentException {
        boolean emailExists = members.values().stream().anyMatch(m -> m.getEmail().equalsIgnoreCase(member.getEmail()));
        boolean phoneExists = members.values().stream().anyMatch(m -> m.getPhone().equals(member.getPhone()));

        if (emailExists || phoneExists) {
            throw new IllegalArgumentException("Member with this email or phone number already exists.");
        }
        members.put(member.getMemberID(), member);
        System.out.println("Member registered: " + member.getName() + " (" + member.getMemberType() + ")");
    }

    // View overdue books (Librarian only)
    public List<Book> viewOverdueBooks() {
        return books.values().stream()
                .filter(book -> book.isIssued() && book.getDueDate() != null && book.getDueDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
    }

    // Helper methods to get books and members by ID
    public Book getBookByID(UUID bookID) {
        return books.get(bookID);
    }

    public Member getMemberByID(UUID memberID) {
        return members.get(memberID);
    }

    public List<Book> getAllBooks() {
        return new ArrayList<>(books.values());
    }

    public List<Member> getAllMembers() {
        return new ArrayList<>(members.values());
    }
}

public class LibraryManagementSystem {

    private static Library library = new Library();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Sample data for testing
        Book book1 = new Book("The Lord of the Rings", "J.R.R. Tolkien", "Fantasy");
        Book book2 = new Book("Pride and Prejudice", "Jane Austen", "Romance");
        Book book3 = new Book("1984", "George Orwell", "Dystopian");
        Book book4 = new Book("myworld", "bhavani", "Fiction");

        try {
            library.addBook(book1);
            library.addBook(book2);
            library.addBook(book3);
            library.addBook(book4);
        } catch (IllegalArgumentException e) {
            System.out.println("Error adding sample books: " + e.getMessage());
        }

        StudentMember student1 = new StudentMember("Ravi", "ravi343@example.com", "111-222-3333");
        TeacherMember teacher1 = new TeacherMember("rohan", "ron45@example.com", "444-555-6666");
        Librarian librarian1 = new Librarian("priya", "priya45@example.com", "777-888-9999");

        try {
            library.registerMember(student1);
            library.registerMember(teacher1);
            library.registerMember(librarian1);
        } catch (IllegalArgumentException e) {
            System.out.println("Error registering sample members: " + e.getMessage());
        }

        int choice;
        do {
            printMainMenu();
            choice = getUserChoice();

            switch (choice) {
                case 1:
                    addBookMenu();
                    break;
                case 2:
                    removeBookMenu();
                    break;
                case 3:
                    issueBookMenu();
                    break;
                case 4:
                    returnBookMenu();
                    break;
                case 5:
                    searchBooksMenu();
                    break;
                case 6:
                    reserveBookMenu();
                    break;
                case 7:
                    viewIssuedBooksMenu();
                    break;
                case 8:
                    registerMemberMenu();
                    break;
                case 9:
                    viewOverdueBooksMenu();
                    break;
                case 10:
                    viewAllMembersMenu();
                    break;
                case 0:
                    System.out.println("Exiting Library Management System. Goodbye!");
                    break;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
            System.out.println(); // New line for better readability
        } while (choice != 0);

        scanner.close();
    }

    private static void printMainMenu() {
        System.out.println("--- Library Management System ---");
        System.out.println("1. Add Book");
        System.out.println("2. Remove Book");
        System.out.println("3. Issue Book");
        System.out.println("4. Return Book");
        System.out.println("5. Search Books");
        System.out.println("6. Reserve Book");
        System.out.println("7. View Issued Books by Member");
        System.out.println("8. Register Member");
        System.out.println("9. View Overdue Books");
        System.out.println("10. View All Members");
        System.out.println("0. Exit");
        System.out.print("Enter your choice: ");
    }

    private static int getUserChoice() {
        while (!scanner.hasNextInt()) {
            System.out.println("Invalid input. Please enter a number.");
            scanner.next(); // consume the invalid input
            System.out.print("Enter your choice: ");
        }
        int choice = scanner.nextInt();
        scanner.nextLine(); // consume newline
        return choice;
    }

    private static void addBookMenu() {
        System.out.println("\n--- Add Book ---");
        System.out.print("Enter title: ");
        String title = scanner.nextLine();
        System.out.print("Enter author: ");
        String author = scanner.nextLine();
        System.out.print("Enter genre: ");
        String genre = scanner.nextLine();

        Book newBook = new Book(title, author, genre);
        try {
            library.addBook(newBook);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    private static void removeBookMenu() {
        System.out.println("\n--- Remove Book ---");
        System.out.print("Enter Book ID to remove: ");
        String bookIDStr = scanner.nextLine();
        try {
            UUID bookID = UUID.fromString(bookIDStr);
            Book bookToRemove = library.getBookByID(bookID);
            if (bookToRemove != null) {
                library.removeBook(bookToRemove);
            } else {
                System.out.println("Book not found.");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Error: Invalid Book ID format or " + e.getMessage());
        }
    }

    private static void issueBookMenu() {
        System.out.println("\n--- Issue Book ---");
        System.out.print("Enter Book ID to issue: ");
        String bookIDStr = scanner.nextLine();
        System.out.print("Enter Member ID to issue to: ");
        String memberIDStr = scanner.nextLine();

        try {
            UUID bookID = UUID.fromString(bookIDStr);
            UUID memberID = UUID.fromString(memberIDStr);

            Book book = library.getBookByID(bookID);
            Member member = library.getMemberByID(memberID);

            if (book != null && member != null) {
                library.issueBook(book, member);
            } else {
                System.out.println("Book or Member not found.");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Error: Invalid ID format or " + e.getMessage());
        }
    }

    private static void returnBookMenu() {
        System.out.println("\n--- Return Book ---");
        System.out.print("Enter Book ID to return: ");
        String bookIDStr = scanner.nextLine();
        System.out.print("Enter Member ID returning the book: ");
        String memberIDStr = scanner.nextLine();

        try {
            UUID bookID = UUID.fromString(bookIDStr);
            UUID memberID = UUID.fromString(memberIDStr);

            Book book = library.getBookByID(bookID);
            Member member = library.getMemberByID(memberID);

            if (book != null && member != null) {
                library.returnBook(book, member);
            } else {
                System.out.println("Book or Member not found.");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Error: Invalid ID format or " + e.getMessage());
        }
    }

    private static void searchBooksMenu() {
        System.out.println("\n--- Search Books ---");
        System.out.print("Enter keyword (title, author, or genre): ");
        String keyword = scanner.nextLine();

        List<Book> results = library.searchBooks(keyword);
        if (results.isEmpty()) {
            System.out.println("No books found matching your search.");
        } else {
            System.out.println("Search Results:");
            for (Book book : results) {
                System.out.println(book);
            }
        }
    }

    private static void reserveBookMenu() {
        System.out.println("\n--- Reserve Book ---");
        System.out.print("Enter Book ID to reserve: ");
        String bookIDStr = scanner.nextLine();
        System.out.print("Enter Member ID reserving the book: ");
        String memberIDStr = scanner.nextLine();

        try {
            UUID bookID = UUID.fromString(bookIDStr);
            UUID memberID = UUID.fromString(memberIDStr);

            Book book = library.getBookByID(bookID);
            Member member = library.getMemberByID(memberID);

            if (book != null && member != null) {
                library.reserveBook(book, member);
            } else {
                System.out.println("Book or Member not found.");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Error: Invalid ID format or " + e.getMessage());
        }
    }

    private static void viewIssuedBooksMenu() {
        System.out.println("\n--- View Issued Books by Member ---");
        System.out.print("Enter Member ID to view issued books: ");
        String memberIDStr = scanner.nextLine();

        try {
            UUID memberID = UUID.fromString(memberIDStr);
            Member member = library.getMemberByID(memberID);

            if (member != null) {
                List<Book> issuedBooks = library.viewIssuedBooks(member);
                if (issuedBooks.isEmpty()) {
                    System.out.println(member.getName() + " has no books currently issued.");
                } else {
                    System.out.println("Books issued to " + member.getName() + ":");
                    for (Book book : issuedBooks) {
                        System.out.println("- " + book.getTitle() + " (Due: " + book.getDueDate() + ")");
                    }
                }
            } else {
                System.out.println("Member not found.");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Error: Invalid Member ID format.");
        }
    }

    private static void registerMemberMenu() {
        System.out.println("\n--- Register Member ---");
        System.out.print("Enter member name: ");
        String name = scanner.nextLine();
        System.out.print("Enter member email: ");
        String email = scanner.nextLine();
        System.out.print("Enter member phone: ");
        String phone = scanner.nextLine();

        System.out.println("Select Member Type:");
        System.out.println("1. Student");
        System.out.println("2. Teacher");
        System.out.println("3. Guest");
        System.out.print("Enter choice: ");
        int typeChoice = getUserChoice();

        Member newMember = null;
        switch (typeChoice) {
            case 1:
                newMember = new StudentMember(name, email, phone);
                break;
            case 2:
                newMember = new TeacherMember(name, email, phone);
                break;
            case 3:
                newMember = new GuestMember(name, email, phone);
                break;
            default:
                System.out.println("Invalid member type choice.");
                return;
        }

        try {
            library.registerMember(newMember);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    private static void viewOverdueBooksMenu() {
        System.out.println("\n--- View Overdue Books ---");
        // In a real system, you\'d check if the current user is a librarian.
        // For this assignment, we\'ll assume access.
        List<Book> overdueBooks = library.viewOverdueBooks();
        if (overdueBooks.isEmpty()) {
            System.out.println("No books are currently overdue.");
        } else {
            System.out.println("Overdue Books:");
            for (Book book : overdueBooks) {
                System.out.println("- " + book.getTitle() + " (Issued to: " + book.getIssuedTo().getName() + ", Due: " + book.getDueDate() + ")");
            }
        }
    }

    private static void viewAllMembersMenu() {
        System.out.println("\n--- All Registered Members ---");
        List<Member> allMembers = library.getAllMembers();
        if (allMembers.isEmpty()) {
            System.out.println("No members registered yet.");
        } else {
            for (Member member : allMembers) {
                System.out.println(member);
            }
        }
    }
}


