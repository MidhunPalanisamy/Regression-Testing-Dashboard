package org.rtd.tests;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class DashboardAccessTest extends BaseTest {

    @Test
    public void testerShouldNotAccessUsersPage() {

        driver.findElement(By.id("username")).sendKeys("Midhun");
        driver.findElement(By.id("password")).sendKeys("midhun@123");
        driver.findElement(By.id("loginBtn")).click();

        driver.get("http://localhost:5173/users");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));

        String pageSource = driver.getPageSource();

        Assertions.assertTrue(
                pageSource.toLowerCase().contains("access denied"),
                "Tester should not access Users Records page"
        );
    }
}