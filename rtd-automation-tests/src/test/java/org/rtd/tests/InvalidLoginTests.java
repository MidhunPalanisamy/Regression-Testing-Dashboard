package org.rtd.tests;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class InvalidLoginTests extends BaseTest {

    @Test
    public void invalidLoginTest() {

        driver.findElement(By.id("username")).sendKeys("wronguser");
        driver.findElement(By.id("password")).sendKeys("wrongpass");
        driver.findElement(By.id("loginBtn")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        boolean errorDisplayed;

        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//*[text()='Invalid credentials']")
            ));
            errorDisplayed = true;
        } catch (Exception e) {
            errorDisplayed = false;
        }

        Assertions.assertTrue(errorDisplayed, "Invalid credentials message not displayed");
    }

}