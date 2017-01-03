package me.kapehh.launcher.utils;

import javafx.scene.control.Alert;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import me.kapehh.launcher.Main;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

/**
 * Created by karen on 03.01.2017.
 */
public class AlertUtil {

    public static void info(String title, String header, String content) {
        alert(Alert.AlertType.INFORMATION, title, header, content);
    }

    public static void error(String title, String header, String content) {
        alert(Alert.AlertType.ERROR, title, header, content);
    }

    public static void warning(String title, String header, String content) {
        alert(Alert.AlertType.WARNING, title, header, content);
    }

    private static void alert(Alert.AlertType type, String title, String header, String content) {
        Alert alert = new Alert(type);
        Stage stage = (Stage) alert.getDialogPane().getScene().getWindow();
        stage.getIcons().add(Main.icon);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();
    }
}
