package com.student.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Logger;

public class DBUtil {
    private static final Logger logger = LoggerUtil.getLogger(DBUtil.class);

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            logger.info("JDBC Driver loaded successfully.");
        } catch (ClassNotFoundException e) {
            logger.severe("JDBC Driver not found: " + e.getMessage());
        }
    }

    public static Connection getConnection() {
        String url = "jdbc:mysql://localhost:3306/studentdb";
        String user = "root";
        String password = "bhavani13";

        try {
            Connection connection = DriverManager.getConnection(url, user, password);
            logger.info("Database connection created.");
            return connection;
        } catch (SQLException e) {
            logger.severe("Failed to create DB connection: " + e.getMessage());
            return null;
        }
    }
}
