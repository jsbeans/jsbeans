/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.helpers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateHelper {
    public static Date round(Date date, Step step) {
        Calendar calendar = GregorianCalendar.getInstance();
        calendar.setTime(date);

        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        switch (step) {
            case Hour:
                return calendar.getTime();
            case Day:
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                return calendar.getTime();
            case Week:
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                int w = calendar.get(Calendar.WEEK_OF_YEAR);
                calendar.set(Calendar.DATE, 0);
                calendar.set(Calendar.WEEK_OF_YEAR, w);
                return calendar.getTime();
            case Month:
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.DAY_OF_MONTH, 0);
                return calendar.getTime();
            case Year:
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.DATE, 0);
                calendar.set(Calendar.MONTH, 0);
                return calendar.getTime();
            default:
                calendar.setTime(date);
                return calendar.getTime();
        }
    }

    public static String formatISO8601(final Date date) {
        String formatted = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
                .format(date);
        return formatted.substring(0, 22) + ":" + formatted.substring(22);
    }

    public static String formatISO8601(final Calendar calendar) {
        Date date = calendar.getTime();
        return formatISO8601(date);
    }

    /**
     * Get current date and time formatted as ISO 8601 string.
     */
    public static String nowISO8601() {
        return formatISO8601(GregorianCalendar.getInstance());
    }

    /**
     * Transform ISO 8601 string to Calendar.
     */
    public static Calendar parseCalendarISO8601(final String iso8601string) throws ParseException {
        Calendar calendar = GregorianCalendar.getInstance();
        calendar.setTime(parseISO8601(iso8601string));
        return calendar;
    }

    public static Date parseISO8601(final String iso8601string) throws ParseException {
        if (iso8601string == null || iso8601string.length() == 0) return null;
        String s = iso8601string.replace("Z", "+00:00");
        try {
            s = s.substring(0, 22) + s.substring(23);
        } catch (IndexOutOfBoundsException e) {
            throw new ParseException("Invalid length", 0);
        }
        try {
            Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").parse(s);
            return date;
        } catch (Exception e) {
            Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(s);
            return date;
        }
    }

    public static enum Step {
        Hour,
        Day,
        Week,
        Month,
        Year,
        None
    }
}