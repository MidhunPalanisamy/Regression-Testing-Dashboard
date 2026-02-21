package org.rtd.tests;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LogoutTest extends BaseTest {

    @Test
    public void logoutTest() {

        driver.findElement(By.id("username")).sendKeys("Midhun");
        driver.findElement(By.id("password")).sendKeys("midhun@123");
        driver.findElement(By.id("loginBtn")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("dashboard"));

        driver.findElement(By.id("logoutBtn")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("loginBtn")));

        Assertions.assertTrue(
                driver.findElements(By.id("loginBtn")).size() > 0,
                "Logout failed - login page not visible"
        );
    }
}