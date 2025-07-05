package com.student.util;

import java.io.FileWriter;
import java.io.IOException;
import java.sql.*;
import java.util.logging.Logger;

public class CSVExporter {

    private static final Logger logger = LoggerUtil.getLogger(CSVExporter.class);
    private static final String CSV_FILE = "students_export.csv";

    public static void exportToCSV() {
        String query = "SELECT * FROM students";

        try (Connection conn = DBUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query);
             FileWriter writer = new FileWriter(CSV_FILE)) {

            // Write header
            writer.append("ID,Name,Email,Course,Grade\n");

            // Write data rows
            while (rs.next()) {
                writer.append(rs.getInt("id") + ",");
                writer.append(rs.getString("name") + ",");
                writer.append(rs.getString("email") + ",");
                writer.append(rs.getString("course") + ",");
                writer.append(rs.getString("grade") + "\n");
            }

            logger.info("Student data exported successfully to " + CSV_FILE);

        } catch (SQLException | IOException e) {
            logger.severe("Error exporting student data to CSV: " + e.getMessage());
        }
    }
}
