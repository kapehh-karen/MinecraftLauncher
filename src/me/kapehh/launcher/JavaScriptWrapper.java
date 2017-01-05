package me.kapehh.launcher;

import javafx.scene.control.Alert;
import me.kapehh.launcher.utils.AlertUtil;
import me.kapehh.launcher.utils.FileSystemUtil;
import me.kapehh.launcher.utils.HashUtil;
import me.kapehh.launcher.utils.UrlUtil;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.*;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

/**
 * Created by karen on 03.01.2017.
 */
public class JavaScriptWrapper {

    public String getEnvironment(String envName) {
        return System.getenv(envName);
    }

    public String concatenatePaths(String firstPath, String secondPath) {
        return Paths.get(firstPath, secondPath).toString();
    }

    public String concatenateURL(String url, String extra) {
        try {
            return new URI(UrlUtil.prepareUrl(url)).resolve(UrlUtil.prepareUrl(extra)).toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public void downloadFile(String url, String file) {
        try {
            FileSystemUtil.downloadFile(url, file);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String calculateHash(String filename) {
        try {
            return HashUtil.calculateFileHash(filename, "md5");
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public boolean fileExists(String filename) {
        return new File(filename).exists();
    }

    public void mkdirs(String folderName) {
        FileSystemUtil.mkdirs(folderName);
    }

    public void runProcess(String command) {
        try {
            Process myProcess = Runtime.getRuntime().exec(command);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void exit() {
        Main.main_stage.close();
    }

    public void info(String title, String header, String content) {
        AlertUtil.info(title, header, content);
    }

    public void error(String title, String header, String content) {
        AlertUtil.error(title, header, content);
    }

    public void print(Object object) {
        System.out.println(object);
    }

    public void sleep(int millis) throws InterruptedException {
        Thread.sleep(millis);
    }
}
