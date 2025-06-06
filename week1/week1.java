import java.util.Scanner;
public class Week1 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Enter the 2 numbers
        System.out.print("Enter the first integer: ");
        int firstInt = scanner.nextInt();
        System.out.print("Enter the second integer: ");
        int secondInt = scanner.nextInt();
        // Enter the decimal number
        System.out.print("Enter a floating-point number: ");
        double floatNum = scanner.nextDouble();
        // Enter a single letter
        System.out.print("Enter a single character: ");
        char charInput = scanner.next().charAt(0);
        // enter either true or false
        System.out.print("Enter a boolean value (true/false): ");
        boolean boolValue = scanner.nextBoolean();
        scanner.nextLine();
        // enter the user name
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        // Calculates and display the output according to conditions 
        int sum = firstInt + secondInt;
        int difference = firstInt - secondInt;
        int product = firstInt * secondInt;
        System.out.println("\nSum of " + firstInt + " and " + secondInt + " is: " + sum);
        System.out.println("Difference between " + firstInt + " and " + secondInt + " is: " + difference);
        System.out.println("Product of " + firstInt + " and " + secondInt + " is: " + product);
        double result = floatNum * 2;
        System.out.println(floatNum + " multiplied by 2 is: " + result);
        char nextChar = (char)(charInput + 1);
        System.out.println("The next character after '" + charInput + "' is: " + nextChar);
        boolean oppositeBool = !boolValue;
        System.out.println("The opposite of " + boolValue + " is: " + oppositeBool);
        System.out.println("Hello, " + name + "!");
        scanner.close();
    }
}
