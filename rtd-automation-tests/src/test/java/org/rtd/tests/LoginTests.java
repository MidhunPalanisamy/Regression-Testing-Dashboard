package org.rtd.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginTests extends BaseTest{

    @Test
    public void validLoginTest() {

        driver.findElement(By.id("username")).sendKeys("Midhun");
        driver.findElement(By.id("password")).sendKeys("midhun@123");
        driver.findElement(By.id("loginBtn")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        wait.until(ExpectedConditions.urlContains("dashboard"));

        Assertions.assertTrue(
                driver.getCurrentUrl().contains("dashboard"),
                "Login failed - dashboard not loaded"
        );

        driver.quit();
    }


}