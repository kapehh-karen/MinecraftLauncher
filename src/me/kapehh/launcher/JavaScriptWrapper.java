package me.kapehh.launcher;

import javafx.scene.control.Alert;
import me.kapehh.launcher.utils.AlertUtil;
import me.kapehh.launcher.utils.FileSystemUtil;
import me.kapehh.launcher.utils.HashUtil;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
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

    public void downloadFile(String url, String file) throws IOException {
        FileSystemUtil.downloadFile(url, file);
    }

    public String calculateHash(String filename) throws NoSuchAlgorithmException, IOException, URISyntaxException {
        return HashUtil.calculateFileHash(filename, "md5");
    }

    public boolean fileExists(String filename) {
        return new File(filename).exists();
    }

    public void mkdirs(String folderName) {
        FileSystemUtil.mkdirs(folderName);
    }

    public void runProcess(String arguments) {
        System.out.println("Run process: " + arguments);
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
}
