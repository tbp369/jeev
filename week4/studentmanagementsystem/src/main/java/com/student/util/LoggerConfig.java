package com.student.util;

import java.io.IOException;
import java.util.logging.*;

public class LoggerConfig {

    private static final String LOG_FILE = "student_app.log";

    public static void setup() {
        Logger rootLogger = Logger.getLogger("");

        // Remove all default handlers (especially default console handler)
        for (Handler handler : rootLogger.getHandlers()) {
            rootLogger.removeHandler(handler);
        }

        try {
            // Create a FileHandler that writes to student_app.log (append mode)
            FileHandler fileHandler = new FileHandler(LOG_FILE, true);
            fileHandler.setFormatter(new SimpleFormatter());
            fileHandler.setLevel(Level.ALL);

            // Create a ConsoleHandler to show logs in console
            ConsoleHandler consoleHandler = new ConsoleHandler();
            consoleHandler.setFormatter(new SimpleFormatter());
            consoleHandler.setLevel(Level.INFO); // Only show INFO and above in console

            // Add both handlers to the root logger
            rootLogger.addHandler(fileHandler);
            rootLogger.addHandler(consoleHandler);

            rootLogger.setLevel(Level.ALL); // Allow all log levels

        } catch (IOException e) {
            System.err.println("Logger setup failed: " + e.getMessage());
        }
    }
}
