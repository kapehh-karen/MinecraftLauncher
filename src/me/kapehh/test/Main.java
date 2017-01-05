package me.kapehh.test;

import me.kapehh.launcher.JavaScriptWrapper;

/**
 * Created by karen on 04.01.2017.
 */
public class Main {
    public static void main(String[] argv) {
        String filename = "C:\\Users\\karen\\AppData\\Roaming\\cfactory2\\libraries\\com\\mojang\\authlib\\1.5.22\\authlib-1.5.22.jar";
        JavaScriptWrapper java = new JavaScriptWrapper();
        System.out.println(java.calculateHash(filename));
    }
}
