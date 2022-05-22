package br.com.product.mannager.utils;

import java.util.Calendar;
import java.util.Date;

public class DateService {

    private static Calendar calendar = Calendar.getInstance();

    public static Date getDate(){
        return calendar.getTime();
    }

}
