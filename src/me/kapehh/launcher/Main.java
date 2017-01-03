package me.kapehh.launcher;

import javafx.application.Application;
import javafx.beans.value.ObservableValue;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;
import javafx.concurrent.Worker.State;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class Main extends Application {
    public static Image icon = null;

    static {
        try {
            icon = new Image(new FileInputStream("minecraft-icon.png"));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        WebView webView = new WebView();
        WebEngine webEngine = webView.getEngine();
        webView.setContextMenuEnabled(false);
        webEngine.getLoadWorker().stateProperty().addListener(
                (ObservableValue<? extends State> ov, State oldState, State newState) -> {
                    if (newState == State.SUCCEEDED) {
                        JSObject win = (JSObject) webEngine.executeScript("window");
                        win.setMember("java", new JavaScriptWrapper());
                    }
                });
        webEngine.load("http://localhost/kph/launcher-frontend");

        Scene scene = new Scene(webView);
        stage.getIcons().clear();
        stage.getIcons().add(Main.icon);
        stage.setTitle("[Ц]-Factory 2");
        stage.setScene(scene);
        stage.setWidth(800);
        stage.setHeight(700);
        stage.show();
    }
}
