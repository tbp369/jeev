package com.student;

import com.student.util.DBUtil;
import org.junit.jupiter.api.Test;

import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.*;

public class DBUtilTest {

    @Test
    public void testConnectionIsNotNull() {
        Connection conn = DBUtil.getConnection();
        assertNotNull(conn, "Database connection should not be null");
    }

    @Test
    public void testConnectionIsValid() throws Exception {
        Connection conn = DBUtil.getConnection();
        assertTrue(conn.isValid(2), "Database connection should be valid");
    }
}
