package com.student;

import com.student.util.LoggerConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.*;

public class LoggerConfigTest {

    @BeforeAll
    public static void setupLogger() {
        LoggerConfig.setup();
    }

    @Test
    public void testLogFileCreated() {
        Logger logger = Logger.getLogger(LoggerConfigTest.class.getName());
        logger.info("This is a test log.");

        File logFile = new File("student_app.log");
        assertTrue(logFile.exists(), "Log file should exist");
    }
}
