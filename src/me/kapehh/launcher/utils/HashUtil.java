package me.kapehh.launcher.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

/**
 * Created by karen on 03.01.2017.
 */
public class HashUtil {
    private static String calculateHash(InputStream inputStream, String strAlgo)
            throws IOException, NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance(strAlgo);
        byte[] buffer = new byte[1024 * 4];
        int bytesRead;

        while ((bytesRead = inputStream.read(buffer)) != -1) {
            md.update(buffer, 0, bytesRead);
        }
        inputStream.close();

        byte[] hashBytes = md.digest();
        Formatter formatter = new Formatter();
        for (byte b : hashBytes) {
            formatter.format("%02x", b);
        }
        return formatter.toString();
    }

    public static String calculateRemoteHash(String strUrl, String strAlgo)
            throws IOException, NoSuchAlgorithmException {
        URL url = new URL(strUrl);
        HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
        int responseCode = httpConn.getResponseCode();

        if (responseCode == HttpURLConnection.HTTP_OK) {
            // return hash from input content
            return calculateHash(httpConn.getInputStream(), strAlgo);
        } else {
            return null;
        }
    }

    public static String calculateLocalHash(String strUrl, String strAlgo)
            throws URISyntaxException, NoSuchAlgorithmException, IOException {
        File localFile = new File(new URL(strUrl).toURI());

        if (localFile.exists()) {
            // return hash from local file
            return calculateHash(new FileInputStream(localFile), strAlgo);
        } else {
            return null;
        }
    }

    public static String calculateFileHash(String filename, String algo)
            throws IOException, NoSuchAlgorithmException {
        File localFile = new File(filename);

        if (localFile.exists()) {
            // return hash from local file
            return calculateHash(new FileInputStream(localFile), algo);
        } else {
            return null;
        }
    }

}
