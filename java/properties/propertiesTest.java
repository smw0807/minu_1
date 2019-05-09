import java.io.*;
import java.util.*;

class propertiesTest {
    static String path = "C:/minu/minu_1/java/properties/";
    static File test = new File(path + "test.test.txt");

    // ! 파일 존재 유무 확인
    static boolean checkFile(File file) {
        if (file.exists()) {
            if (file.isFile() && file.canRead()) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {

        System.out.println("run!!");
        try {
            if (checkFile(test)) {
                FileInputStream in = new FileInputStream(test);
                Properties conf = new Properties();
                conf.load(in);
                in.close();
                String time = conf.getProperty("threat_ntm.req.time");
                String size = conf.getProperty("threat_ntm.rest.sizeMb");
                System.out.println(time);
                System.out.println(size);
                // Properties conf = new Properties();
                conf.setProperty("threat_ntm.req.time", "100");
                conf.setProperty("threat_ntm.rest.sizeMb", "500");
                OutputStream out = new FileOutputStream(test);
                conf.store(out, null);

            } else {
                System.out.println("파일 없음...");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}