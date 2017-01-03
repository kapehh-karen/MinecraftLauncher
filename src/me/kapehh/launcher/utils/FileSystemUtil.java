package me.kapehh.launcher.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;

/**
 * Created by karen on 03.01.2017.
 */
public class FileSystemUtil {

    public static void mkdirs(String folderName) {
        File file = new File(folderName);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    public static void downloadFile(String url, String file) throws IOException {
        // mkdirs
        File f = new File(file);
        if (!f.getParentFile().exists()) {
            f.getParentFile().mkdirs();
        }
        // downloading
        URL website = new URL(url);
        ReadableByteChannel rbc = Channels.newChannel(website.openStream());
        FileOutputStream fos = new FileOutputStream(file);
        fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
    }
}
