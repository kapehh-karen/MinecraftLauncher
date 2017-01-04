package me.kapehh.launcher.utils;

/**
 * Created by karen on 04.01.2017.
 */
public class UrlUtil {

    public static String prepareUrl(String url) {
        return url.replace("\\", "/").replace(" ", "%20");
    }
}
